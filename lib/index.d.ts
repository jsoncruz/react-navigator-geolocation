export declare type GeolocationOptionsProps = {
    suppressOnMount?: boolean;
    positionOptions?: {
        enableHighAccuracy: boolean;
        timeout: number;
        maximumAge: number;
    };
    watchMode?: boolean;
};
export declare type CoordinatesProps = {
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
export declare type GeolocationProps = {
    coords: CoordinatesProps["coords"] | undefined;
    isEnabled?: boolean;
    isExpired?: boolean;
    isAvailable?: boolean;
    isSupressed?: boolean;
    suppressRequest: (bool: boolean) => void;
    watchId: number | undefined;
};
declare const _default: ({ suppressOnMount, positionOptions, watchMode, }?: GeolocationOptionsProps) => GeolocationProps;
export default _default;
//# sourceMappingURL=index.d.ts.map