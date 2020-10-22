const http = require("http");
const fs = require("fs");
const socketio = require("socket.io"); // On envoie client.html au client
const tab_pseudos = [];
const express = require('express')
const path = require('path')
const app = express()
const server = http.createServer(app)
const io = socketio(server)

/*fs.readFile("logs.txt", "utf-8", (err, data) => {
  if (err) throw err;
  console.log(data);
});*/

    app.use(express.static('src'))
    app.get('*', function(req, res) {
      res.sendFile(__dirname + '/src/client.html') 
    })
// On charge socket.io et on le branche au serveur http en cours

// Quand un client se connecte, on lui crée une socket dediee
io.on("connection", function (newSockClient) {
  newSockClient.on("send-chat-message", function (content) {
    var content_serv = [content, tab_pseudos[newSockClient.id]];
    newSockClient.broadcast.emit("new-message", content_serv);
  });
  newSockClient.on("entree-pseudo", function (pseudo) {
    tab_pseudos[newSockClient.id] = pseudo;
    var tab_pseudos_serv = [];
    for (var key in tab_pseudos) {
      tab_pseudos_serv.push(tab_pseudos[key]);
    }

    newSockClient.emit("list_pseudos", tab_pseudos_serv);
    newSockClient.broadcast.emit("fix_list", tab_pseudos_serv);
  });

  newSockClient.on("disconnect", function () {
    delete tab_pseudos[newSockClient.id];
    var tab_pseudos_new = [];
    for (var key in tab_pseudos) {
      tab_pseudos_new.push(tab_pseudos[key]);
    }
    newSockClient.broadcast.emit("fix_list", tab_pseudos_new);
  });
});

const PORT = 3000 || process.env.PORT

server.listen(PORT, () => console.log ('Server running on port '+PORT))