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

``
