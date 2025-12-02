declare namespace google {
  namespace maps {
    class Map {
      constructor(mapDiv: HTMLElement, opts?: MapOptions);
      setCenter(latLng: LatLng | LatLngLiteral): void;
      setZoom(zoom: number): void;
      getCenter(): LatLng;
      getZoom(): number;
      // Add other methods/properties you use from google.maps.Map
    }

    interface MapOptions {
      center?: LatLngLiteral | LatLng;
      zoom?: number;
      disableDefaultUI?: boolean;
      // Add other options as needed
    }

    class Marker {
      constructor(opts?: MarkerOptions);
      setMap(map: Map | null): void;
      setPosition(latLng: LatLng | LatLngLiteral): void;
      // Add other methods/properties you use from google.maps.Marker
    }

    interface MarkerOptions {
      position?: LatLngLiteral | LatLng;
      map?: Map;
      title?: string;
      icon?: string | Symbol | SymbolPath | MarkerLabel;
      // Add other options as needed
    }

    enum SymbolPath {
      CIRCLE = 0,
      FORWARD_CLOSED_ARROW = 1,
      FORWARD_OPEN_ARROW = 2,
      BACKWARD_CLOSED_ARROW = 3,
      BACKWARD_OPEN_ARROW = 4,
    }

    interface MarkerLabel {
      color?: string;
      fontFamily?: string;
      fontSize?: string;
      fontWeight?: string;
      text?: string;
    }

    interface LatLngLiteral {
      lat: number;
      lng: number;
    }

    class LatLng {
      constructor(lat: number, lng: number, noWrap?: boolean);
      lat(): number;
      lng(): number;
      equals(other: LatLng): boolean;
      toString(): string;
      toUrlValue(precision?: number): string;
      toJSON(): LatLngLiteral;
    }

    namespace places {
      class AutocompleteService {
        constructor();
        getPlacePredictions(
          request: AutocompletePredictionRequest,
          callback: (
            predictions: AutocompletePrediction[],
            status: PlacesServiceStatus
          ) => void
        ): void;
      }

      class Autocomplete {
        constructor(inputField: HTMLInputElement, opts?: AutocompleteOptions);
        addListener(eventName: string, handler: Function): MapsEventListener;
        getPlace(): PlaceResult;
      }

      interface AutocompleteOptions {
        bounds?: LatLngBounds | LatLngBoundsLiteral;
        componentRestrictions?: ComponentRestrictions;
        fields?: string[];
        strictBounds?: boolean;
        types?: string[];
      }

      interface PlaceResult {
        address_components?: GeocoderAddressComponent[];
        adr_address?: string;
        alt_id?: string;
        formatted_address?: string;
        geometry?: PlaceGeometry;
        icon?: string;
        id?: string;
        name?: string;
        photos?: PlacePhoto[];
        place_id?: string;
        plus_code?: PlusCode;
        scope?: string;
        types?: string[];
        url?: string;
        utc_offset_minutes?: number;
        vicinity?: string;
        website?: string;
        html_attributions?: string[];
        // Add other properties as needed
      }

      enum PlacesServiceStatus {
        OK = 'OK',
        ZERO_RESULTS = 'ZERO_RESULTS',
        NOT_FOUND = 'NOT_FOUND',
        OVER_QUERY_LIMIT = 'OVER_QUERY_LIMIT',
        REQUEST_DENIED = 'REQUEST_DENIED',
        INVALID_REQUEST = 'INVALID_REQUEST',
        UNKNOWN_ERROR = 'UNKNOWN_ERROR',
      }

      class PlacesService {
        constructor(map: Map);
        // Add methods/properties you use from google.maps.places.PlacesService
      }
    }

    namespace Geocoder {
      class Geocoder {
        constructor();
        geocode(
          request: GeocoderRequest,
          callback: (
            results: GeocoderResult[],
            status: GeocoderStatus
          ) => void
        ): void;
      }

      interface GeocoderRequest {
        address?: string;
        location?: LatLng | LatLngLiteral;
        placeId?: string;
        bounds?: LatLngBounds | LatLngBoundsLiteral;
        componentRestrictions?: ComponentRestrictions;
        region?: string;
      }

      interface GeocoderResult {
        address_components: GeocoderAddressComponent[];
        formatted_address: string;
        geometry: GeocoderGeometry;
        place_id: string;
        postcode_localities: string[];
        types: string[];
      }

      interface GeocoderAddressComponent {
        long_name: string;
        short_name: string;
        types: string[];
      }

      interface GeocoderGeometry {
        location: LatLng;
        location_type: GeocoderLocationType;
        viewport: LatLngBounds;
        bounds?: LatLngBounds;
      }

      enum GeocoderLocationType {
        ROOFTOP = 'ROOFTOP',
        RANGE_INTERPOLATED = 'RANGE_INTERPOLATED',
        GEOMETRIC_CENTER = 'GEOMETRIC_CENTER',
        APPROXIMATE = 'APPROXIMATE',
      }

      enum GeocoderStatus {
        OK = 'OK',
        ZERO_RESULTS = 'ZERO_RESULTS',
        OVER_QUERY_LIMIT = 'OVER_QUERY_LIMIT',
        REQUEST_DENIED = 'REQUEST_DENIED',
        INVALID_REQUEST = 'INVALID_REQUEST',
        UNKNOWN_ERROR = 'UNKNOWN_ERROR',
      }
    }

    namespace DirectionsService {
      class DirectionsService {
        constructor();
        route(
          request: DirectionsRequest,
          callback: (
            result: DirectionsResult | null,
            status: DirectionsStatus
          ) => void
        ): void;
      }

      interface DirectionsRequest {
        origin: string | LatLng | Place;
        destination: string | LatLng | Place;
        travelMode: TravelMode;
        unitSystem?: UnitSystem;
        waypoints?: DirectionsWaypoint[];
        optimizeWaypoints?: boolean;
        provideRouteAlternatives?: boolean;
        avoidHighways?: boolean;
        avoidTolls?: boolean;
        region?: string;
        transitOptions?: TransitOptions;
        drivingOptions?: DrivingOptions;
        // Add other properties as needed
      }

      interface DirectionsResult {
        geocoded_waypoints: GeocodedWaypoint[];
        routes: DirectionsRoute[];
      }

      interface DirectionsRoute {
        legs: DirectionsLeg[];
        // Add other properties as needed
      }

      interface DirectionsLeg {
        distance: Distance;
        duration: Duration;
        // Add other properties as needed
      }

      interface Distance {
        text: string;
        value: number; // in meters
      }

      interface Duration {
        text: string;
        value: number; // in seconds
      }

      enum DirectionsStatus {
        OK = 'OK',
        NOT_FOUND = 'NOT_FOUND',
        ZERO_RESULTS = 'ZERO_RESULTS',
        MAX_WAYPOINTS_EXCEEDED = 'MAX_WAYPOINTS_EXCEEDED',
        MAX_ROUTE_LENGTH_EXCEEDED = 'MAX_ROUTE_LENGTH_EXCEEDED',
        INVALID_REQUEST = 'INVALID_REQUEST',
        OVER_QUERY_LIMIT = 'OVER_QUERY_LIMIT',
        REQUEST_DENIED = 'REQUEST_DENIED',
        UNKNOWN_ERROR = 'UNKNOWN_ERROR',
      }

      enum TravelMode {
        BICYCLING = 'BICYCLING',
        DRIVING = 'DRIVING',
        TRANSIT = 'TRANSIT',
        WALKING = 'WALKING',
      }
    }

    namespace DirectionsRenderer {
      class DirectionsRenderer {
        constructor(opts?: DirectionsRendererOptions);
        setMap(map: Map | null): void;
        setDirections(directions: DirectionsResult): void;
        // Add other methods/properties you use from google.maps.DirectionsRenderer
      }

      interface DirectionsRendererOptions {
        map?: Map;
        // Add other options as needed
      }
    }

    // Add other Google Maps types as needed
  }
}