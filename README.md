# react-navigator-geolocation

A react geolocationing hook  

## Installation  

**Yarn**  

```console
$ yarn add react-navigator-geolocation
```

**Npm**  

```console
$ npm install react-navigator-geolocation
```

## Examples

[![Edit distracted-hellman-8ychm](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/distracted-hellman-8ychm?fontsize=14&hidenavigation=1&theme=dark)  
*Simple syntax*  

```TSX
import React from "react";
import useGeolocation from "react-navigator-geolocation";

const App: React.FC = () => {
  const { isEnabled, coords } = useGeolocation();

  return isEnabled ? (
    <h3>{ coords?.latitude + ', ' + coords?.longitude }</h3>
  ) : (
    <h4>Location permission is not enabled</h4>
  )
};

export default App;


```

[![Edit cold-voice-ofn2p](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/cold-voice-ofn2p?fontsize=14&hidenavigation=1&theme=dark)  
*Suppressed on mountage*  

```TSX

import React from "react";
import useGeolocation from "react-navigator-geolocation";

const App: React.FC = () => {
  const { isAvailable, isEnabled, coords, suppressRequest } = useGeolocation({ suppressOnMount: true });

  return isAvailable ? (
    isEnabled ? (
      <div>
        <h1>Coordinates granted</h1>
        <h2>{coords?.latitude + ', ' + coords?.longitude}</h2>
      </div>
    ) : isEnabled === false ? (
      <h1>Location permission disabled</h1>
    ) : (
      <button type="button" onClick={() => suppressRequest(false)}>
        disable suppression
      </button>
    )
  ) : (
    <h1>Your browser doesn't support Geolocation API</h1>
  );
};

export default App;
```  

## Parameters  

|      Param      | Type    | Default | Definition |
| :-------------- | :-----: | :-----: | :--------- |
| suppressOnMount | boolean |  `false`  | Suppress request on mountage |
| positionOptions | object  | `{ enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }` | [Read more](https://developer.mozilla.org/pt-BR/docs/Web/API/PositionOptions) |
| watchMode       | boolean |  `false`  | When enable it returns periodically (by movement) coordinates |  

> useGeolocation({ suppressOnMount: false, positionOptions: { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }, watchMode: false })

## Response

| Variable | Type | Definition |
| :------: | :--: | :--------- |
|   isAvailable   | boolean | Browser does support Geolocation API |
|   isSupressed   | boolean | If request was suppressed |
|    isEnabled    | boolean | If location is granted or denied |
|    isExpired    | boolean | If request is timed out |
|     coords      | object  | [Read more](https://developer.mozilla.org/pt-BR/docs/Web/API/GeolocationCoordinates)  
| suppressRequest | method  | It receives a boolean as value |
|     watchId     | number  | If watchMode is enabled you'll get the id of watching

> const { isAvailable, isSupressed, isEnabled, isExpired, coords, suppressRequest, watchId } = useGeolocation(...)

## License
[MIT](https://github.com/dev-judsoncruz/react-navigator-geolocation/blob/master/LICENSE)
