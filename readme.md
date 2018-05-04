# Websocket Demo

## Installing
Make sure you have node installed first. If you don't have it, get it from here: https://nodejs.org/en/


Demo uses WebSocket which is a TCP protocol.
You can find more information [here](https://tools.ietf.org/html/rfc6455) and  [here](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API). Note the mozilla one is not the one we are using, that one is for browsers. This can also work in the browser (Currently only way to maintain tcp connection in browser)

Once you have that, run this command in the directory
Run the submodule command to get the linked git repos
```
npm install
git submodule update --init --recursive
```

To start the server
```
node minerjs
```
To start the miner.
```
node miner.js<ip optional>
```
Starting the miner with no ip will default to localhost.

## Native Bindings
```
npm install -g node-gyp
```
If you are on windows you might need [this](https://www.npmjs.com/package/windows-build-tools)


To configure
```
node-gyp configure
```

And to build
```
node-gyp build
```