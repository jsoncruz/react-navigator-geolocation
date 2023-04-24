import { useState, useReducer, useCallback, useLayoutEffect, useMemo } from 'react';

import reducer from './reducer';

export interface GeolocationOptionsProps {
  suppressOnMount?: boolean;
  positionOptions?: PositionOptions;
  watchMode?: boolean;
}

const useGeolocation = (options: GeolocationOptionsProps = {}) => {
  const { suppressOnMount, positionOptions, watchMode } = useMemo(() => options, [options]);
  const [isSuppressed, suppressRequest] = useState(suppressOnMount!);
  const [geolocation, dispatch] = useReducer(reducer, {
    coords: null,
    isEnabled: false,
    isExpired: false,
    isAvailable: true,
    isSuppressed,
    watchId: null,
  });

  const handleSuccess = useCallback((position: GeolocationPosition) => {
    dispatch({ type: 'updateCoords', coords: position.coords });
  }, []);

  const handleError = useCallback((error: GeolocationPositionError) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        dispatch({ type: 'updateState', key: 'isEnabled', value: false });
        break;
      case error.POSITION_UNAVAILABLE:
        dispatch({ type: 'updateState', key: 'isAvailable', value: false });
        break;
      case error.TIMEOUT:
        dispatch({ type: 'updateState', key: 'isExpired', value: true });
        break;
      default:
        throw new Error('Position request encountered an error');
    }
  }, []);

  const requestGeolocation = useCallback(async () => {
    if (!isSuppressed) {
      const { state } = await navigator.permissions.query({ name: 'geolocation' });
  
      if (state === 'denied') {
        dispatch({ type: 'updateState', key: 'isEnabled', value: false });
      } else {
        if (watchMode) {
          if (!geolocation.watchId) {
            const watchId = navigator.geolocation.watchPosition(handleSuccess, handleError, positionOptions);
  
            dispatch({ type: 'updateWatchId', watchId });
          }
        } else {
          navigator.geolocation.getCurrentPosition(handleSuccess, handleError, positionOptions);
        }
      }
    }
  }, [geolocation.watchId, handleError, handleSuccess, isSuppressed, positionOptions, watchMode]);  

  useLayoutEffect(() => {
    if ('geolocation' in navigator) {
      requestGeolocation();
    } else {
      dispatch({ type: 'updateState', key: 'isAvailable', value: false });
    }
  }, [requestGeolocation]);

  return { ...geolocation, suppressRequest };
};

export default useGeolocation;
