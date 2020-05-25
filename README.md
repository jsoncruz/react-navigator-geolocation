# react-navigator-geoposition
A ReactJS geopositioning hook

### Try this now

[![Edit distracted-hellman-8ychm](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/distracted-hellman-8ychm?fontsize=14&hidenavigation=1&theme=dark)

## Installation
**yarn**  
```console
$ yarn add react-navigator-geoposition
```

**npm**  
```console
$ npm install react-navigator-geoposition
```
## Usage

```JSX
import React from "react";
import useGeoposition from "react-navigator-geoposition";

const App: React.FC = () => {
  const { isEnabled, coords } = useGeoposition();

  return isEnabled ? (
    <h1>You're at {`${coords!.latitude}, ${coords!.longitude}`}</h1>
  ) : (
    <h2>Location is disabled</h2>
  );
};

export default App;
```  

## Configuration  

| param | type | default | definition |
| :-----: | :-----: | :-----: | :-----: |
| suppressOnMount | boolean | `false` | Suppress permission request on mountage of component (after that you can call the method `invokeRequest(boolean)` available in the response variable ) |
| positionOptions | object  | `{ enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }` | [Read more here](https://developer.mozilla.org/pt-BR/docs/Web/API/PositionOptions) |
| watchMode | boolean | `false` | This is going to enable `watchPosition()` method and after dislocation you'll receive the coordinates   

> useGeoposition({ suppressOnMount: false, positionOptions: { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 } });  

## Response

| prop | type | definition |
| :-----------: | :-----------: | :-----------: |
| coords | CoordinatesProps["coords"] or undefined | [Read more here](https://developer.mozilla.org/pt-BR/docs/Web/API/GeolocationCoordinates) |
| isEnabled | boolean | If user granted or denied the request |
| isAvailable | boolean | If navigator supports Geolocation API |
| isSupressed | boolean | If it was mounted suppressing the request |
| invokeRequest | (bool: boolean) => void | Invoke request if it was suppressed |
| watchId | number or undefined | If watchMode was enabled, so, you'll receive an id |
> const { coords, isEnabled, isExpired, isAvailable, isSupressed, invokeRequest, watchId } = useGeoposition...

## License  

