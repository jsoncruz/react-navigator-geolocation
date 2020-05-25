import { useState, useReducer, useCallback, useMemo } from "react";
const geolocationDefault = {
    suppressOnMount: false,
    positionOptions: {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
    },
    watchMode: false,
};
export default ({ suppressOnMount = geolocationDefault.suppressOnMount, positionOptions = Object.assign({}, geolocationDefault.positionOptions), watchMode = geolocationDefault.watchMode, } = Object.assign({}, geolocationDefault)) => {
    const [suppress, setSuppress] = useState(suppressOnMount);
    const [patch, dispatch] = useReducer((state, { type, value, coords, watchId }) => {
        switch (type) {
            case "enable":
                return Object.assign(Object.assign({}, state), { isEnabled: value, coords });
            case "available":
                return Object.assign(Object.assign({}, state), { isAvailable: value });
            case "suppressed":
                return Object.assign(Object.assign({}, state), { isSupressed: value });
            case "timedout":
                return Object.assign(Object.assign({}, state), { isExpired: value });
            case "watch":
                return Object.assign(Object.assign({}, state), { watchId });
            default:
                return state;
        }
    }, {
        coords: undefined,
        isSupressed: suppress,
        isAvailable: true,
        isEnabled: undefined,
        isExpired: false,
        invokeRequest: setSuppress,
        watchId: undefined,
    });
    const GeolocationPosition = useCallback(({ coords }) => {
        if (!!coords) {
            dispatch({ type: "enable", value: true, coords });
        }
    }, []);
    const GeolocationPositionError = useCallback((error) => {
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
        navigator.permissions.query({ name: "geolocation" }).then(({ state }) => {
            if (state === "denied") {
                dispatch({ type: "enable", value: false });
            }
            else {
                if ("geolocation" in navigator) {
                    if (!suppress) {
                        if (watchMode) {
                            if (!patch.watchId) {
                                const watchId = navigator.geolocation.watchPosition(GeolocationPosition, GeolocationPositionError, Object.assign({}, positionOptions));
                                dispatch({ type: "watch", watchId });
                            }
                        }
                        else {
                            navigator.geolocation.getCurrentPosition(GeolocationPosition, GeolocationPositionError, Object.assign({}, positionOptions));
                        }
                    }
                    else {
                        dispatch({ type: "suppressed", value: true });
                    }
                }
                else {
                    dispatch({ type: "available", value: false });
                }
            }
        });
        // eslint-disable-next-line
    }, [suppress, watchMode, patch.watchId]);
    return patch;
};
//# sourceMappingURL=index.js.map