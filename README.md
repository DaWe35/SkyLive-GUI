# SkyLive-GUI

Graphical user interface for https://github.com/DaWe35/SkyLive

## Run

`cd .../SkyLive-GUI`

`npm install`

Linux:

`npm start`

`npm run start-electron`

Windows:

`npm run start-win`

`npm run start-electron-win`

## Build

```
npm run build
npm run build-electron
npm run package-win
```

Windows:

```
I dont thing build-electron will work on windows
so after running npm run build
create a directory called 'src' inside the 'build' directory
then copy the contents of 'electron' into 'build/electron`
and finally /src/shared/ to build/src/shared
```