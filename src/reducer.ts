export interface CoordinatesProps {
  latitude: number | null;
  longitude: number | null;
  altitude: number | null;
  accuracy: number | null;
  altitudeAccuracy: number | null;
  heading: number | null;
  speed: number | null;
}

export interface GeolocationStateProps {
  coords: CoordinatesProps | null;
  isEnabled: boolean;
  isExpired: boolean;
  isAvailable: boolean;
  isSuppressed: boolean;
  watchId: number | null;
}

type ReducerAction =
  | { type: 'updateCoords'; coords: CoordinatesProps }
  | { type: 'updateState'; key: keyof Omit<GeolocationStateProps, 'coords' | 'watchId'>; value: boolean }
  | { type: 'updateWatchId'; watchId: number };

const reducer = (state: GeolocationStateProps, action: ReducerAction): GeolocationStateProps => {
  switch (action.type) {
    case 'updateCoords':
      return { ...state, isEnabled: true, coords: action.coords };
    case 'updateState':
      return { ...state, [action.key]: action.value };
    case 'updateWatchId':
      return { ...state, watchId: action.watchId };
    default:
      return state;
  }
};

export default reducer;
