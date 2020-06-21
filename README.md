# momentum

This is an experimental Electron-based window manager.

## Run a momentum session in a window in your current X session

Install [Xephyr](https://www.freedesktop.org/wiki/Software/Xephyr/) and launch
a new Xephyr window as display 1:

    Xephyr :1 -no-host-grab -screen 1920x1080 &

Clone the repo, `npm install`, and `npm start` to launch momentum as the root
window of the Xephyr display:

    git clone https://github.com/shmookey/momentum
    cd momentum
    npm install
    export DISPLAY=:1
    npm start

## Run a momentum session in a window in your current Wayland session

Just `npm start`, and momentum will be launched as a window using the default
Xwayland `$DISPLAY`. Not too sure how this interacts with other Xwayland
windows.
