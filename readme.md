# Websocket Demo

## Installing
Make sure you have node installed first. If you don't have it, get it from here: https://nodejs.org/en/

Demo uses WebSocket which is a TCP protocol.
You can find more information [here](https://tools.ietf.org/html/rfc6455) and  [here](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API). Note the mozilla one is not the one we are using, that one is for browsers. This can also work in the browser (Currently only way to maintain tcp connection in browser)

Once you have that, run this command in the directory
```
npm install
```
To start the server 
```
node server.js
```
To start the client.
```
node client.js <ip optional>
```
Starting the client with no ip will default to localhost.