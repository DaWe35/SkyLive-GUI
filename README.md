![Build/release](https://github.com/DaWe35/SkyLive-GUI/workflows/Build/release/badge.svg)

# SkyLive-GUI

Graphical user interface for https://github.com/DaWe35/SkyLive

## Run

First clone the repository. Then run:

```
cd SkyLive-GUI
npm install
```

To start the dev-server:

```
npm start
```

To start the app:

```
npm run start-electron #starts electron
```

Please note that app runs in development mode.

For production usage, download the [latest release](https://github.com/DaWe35/SkyLive-GUI/releases) or [build it yourself](https://github.com/DaWe35/SkyLive-GUI#build).

## Build

Building for your OS:
```
npm run build 
npm run package
```

Building for all OS:
```
npm run build 
npm run package-all
```

https://github.com/samuelmeuli/action-electron-builder#readme