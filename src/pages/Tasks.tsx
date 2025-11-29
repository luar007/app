import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/contexts/SessionContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2 } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { MadeWithDyad } from '@/components/made-with-dyad';

interface Task {
  id: string;
  user_id: string;
  title: string;
  is_complete: boolean;
}

const Tasks = () => {
  const { user } = useSession();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tasks:', error.message);
      showError('Erro ao carregar tarefas.');
    } else {
      setTasks(data || []);
    }
    setLoading(false);
  };

  const addTask = async () => {
    if (!newTaskTitle.trim()) {
      showError('O título da tarefa não pode estar vazio.');
      return;
    }
    if (!user) {
      showError('Você precisa estar logado para adicionar tarefas.');
      return;
    }

    const { data, error } = await supabase
      .from('tasks')
      .insert({ user_id: user.id, title: newTaskTitle })
      .select();

    if (error) {
      console.error('Error adding task:', error.message);
      showError('Erro ao adicionar tarefa.');
    } else if (data && data.length > 0) {
      setTasks([data[0] as Task, ...tasks]);
      setNewTaskTitle('');
      showSuccess('Tarefa adicionada com sucesso!');
    }
  };

  const toggleTaskCompletion = async (task: Task) => {
    const { error } = await supabase
      .from('tasks')
      .update({ is_complete: !task.is_complete })
      .eq('id', task.id);

    if (error) {
      console.error('Error updating task:', error.message);
      showError('Erro ao atualizar tarefa.');
    } else {
      setTasks(tasks.map((t) => (t.id === task.id ? { ...t, is_complete: !t.is_complete } : t)));
      showSuccess('Tarefa atualizada com sucesso!');
    }
  };

  const deleteTask = async (taskId: string) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);

    if (error) {
      console.error('Error deleting task:', error.message);
      showError('Erro ao deletar tarefa.');
    } else {
      setTasks(tasks.filter((t) => t.id !== taskId));
      showSuccess('Tarefa deletada com sucesso!');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-veloxGreen-background text-veloxGreen-text">Carregando tarefas...</div>;
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center bg-veloxGreen-background text-veloxGreen-text">Por favor, faça login para ver suas tarefas.</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-veloxGreen-background p-4">
      <h1 className="text-4xl font-bold mb-8 text-veloxGreen-text">Minhas Tarefas VeloX</h1>

      <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
        <div className="flex space-x-2 mb-4">
          <Input
            type="text"
            placeholder="Adicionar nova tarefa..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="flex-grow bg-gray-700 border-gray-600 text-veloxGreen-text placeholder-gray-400 rounded-md focus:ring-veloxGreen focus:border-veloxGreen"
          />
          <Button onClick={addTask} className="btn-velox">
            Adicionar
          </Button>
        </div>

        {tasks.length === 0 ? (
          <p className="text-veloxGreen-text text-center">Nenhuma tarefa ainda. Adicione uma!</p>
        ) : (
          <ul className="space-y-3">
            {tasks.map((task) => (
              <li key={task.id} className="flex items-center justify-between bg-gray-700 p-3 rounded-md shadow-sm">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={task.is_complete}
                    onCheckedChange={() => toggleTaskCompletion(task)}
                    className="border-veloxGreen data-[state=checked]:bg-veloxGreen data-[state=checked]:text-white"
                  />
                  <span className={`text-veloxGreen-text ${task.is_complete ? 'line-through text-gray-400' : ''}`}>
                    {task.title}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteTask(task.id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Tasks;