import { useState, useReducer, useCallback, useMemo } from "react";

export type GeolocationOptionsProps = {
  suppressOnMount?: boolean;
  positionOptions?: {
    enableHighAccuracy: boolean;
    timeout: number;
    maximumAge: number;
  };
  watchMode?: boolean;
};

export type CoordinatesProps = {
  coords: {
    latitude: number | null;
    longitude: number | null;
    altitude: number | null;
    accuracy: number | null;
    altitudeAccuracy: number | null;
    heading: number | null;
    speed: number | null;
  };
};

export type GeolocationProps = {
  coords: CoordinatesProps["coords"] | undefined;
  isEnabled?: boolean;
  isExpired?: boolean;
  isAvailable?: boolean;
  isSupressed?: boolean;
  suppressRequest: (bool: boolean) => void;
  watchId: number | undefined;
};

const geolocationDefault = {
  suppressOnMount: false,
  positionOptions: {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  },
  watchMode: false,
};

export default (
  {
    suppressOnMount = geolocationDefault.suppressOnMount,
    positionOptions = { ...geolocationDefault.positionOptions },
    watchMode = geolocationDefault.watchMode,
  }: GeolocationOptionsProps = { ...geolocationDefault }
): GeolocationProps => {
  const [suppress, setSuppress] = useState<boolean>(suppressOnMount as boolean);

  type ReducerActionProps = {
    type: string;
    value?: boolean;
    coords?: CoordinatesProps["coords"] | undefined;
    watchId?: number;
  };

  const [patch, dispatch] = useReducer(
    (
      state: GeolocationProps,
      { type, value, coords, watchId }: ReducerActionProps
    ): GeolocationProps => {
      switch (type) {
        case "enable":
          return { ...state, isEnabled: value, coords };
        case "available":
          return { ...state, isAvailable: value };
        case "suppressed":
          return { ...state, isSupressed: value };
        case "timedout":
          return { ...state, isExpired: value };
        case "watch":
          return { ...state, watchId };
        default:
          return state;
      }
    },
    {
      coords: undefined,
      isSupressed: suppress,
      isAvailable: true,
      isEnabled: undefined,
      isExpired: false,
      suppressRequest: setSuppress,
      watchId: undefined,
    }
  );

  const GeolocationPosition = useCallback(({ coords }: CoordinatesProps) => {
    if (!!coords) {
      dispatch({ type: "enable", value: true, coords });
    }
  }, []);

  const GeolocationPositionError = useCallback((error: PositionError) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        dispatch({ type: "enable", value: false });
        break;
      case error.POSITION_UNAVAILABLE:
        dispatch({ type: "available", value: false });
        break;
      case error.TIMEOUT:
        dispatch({ type: "timedout", value: true });
        break;
      default:
        throw new Error("Position request got an error");
    }
  }, []);

  useMemo(() => {
    if ("geolocation" in navigator) {
      navigator.permissions.query({ name: "geolocation" }).then(({ state }) => {
        if (state === "denied") {
          dispatch({ type: "enable", value: false });
        } else {
          if (!suppress) {
            if (watchMode) {
              if (!patch.watchId) {
                const watchId = navigator.geolocation.watchPosition(
                  GeolocationPosition,
                  GeolocationPositionError,
                  { ...positionOptions }
                );
                dispatch({ type: "watch", watchId });
              }
            } else {
              navigator.geolocation.getCurrentPosition(
                GeolocationPosition,
                GeolocationPositionError,
                { ...positionOptions }
              );
            }
          } else {
            dispatch({ type: "suppressed", value: true });
          }
        }
      }).catch((error) => {
        throw new Error(error);
      });
    } else {
      dispatch({ type: "available", value: false });
    }
    // eslint-disable-next-line
  }, [suppress, watchMode, patch.watchId]);

  return patch;
};
