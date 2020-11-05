const http = require("http");
const socketio = require("socket.io"); // On envoie client.html au client
const tab_pseudos = [];
const tab_colors = [];
const express = require('express');
const { emit } = require("cluster");
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
    var pseudo = tab_pseudos[newSockClient.id];
    var content_serv = [content, pseudo, tab_colors[pseudo]];
    newSockClient.broadcast.emit("new-message", content_serv);
  });

  newSockClient.on("requestList", function(pseudoLocal){
    var list_pseudos = [];
    var testPseudo = 1;
    for (var key in tab_pseudos) {
      list_pseudos.push(tab_pseudos[key]);
    }
    for(i = 0; i < list_pseudos.length ; i++){
      if(list_pseudos[i] == pseudoLocal){
        testPseudo = 0;
        console.log('Ok bro')
      }
    } 
      
    newSockClient.emit("listCheck", testPseudo)
  })

  newSockClient.on("entree-pseudo", function (pack) {
    tab_pseudos[newSockClient.id] = pack[0];
    tab_colors[pack[0]] = pack[1];
    var tab_pseudos_serv = [];
    var tab_colors_serv = [];
    for (var key in tab_pseudos) {
      tab_pseudos_serv.push(tab_pseudos[key]);
    }
    for (var key in tab_colors) {
      tab_colors_serv.push(tab_colors[key]);
    }

    var packet = [tab_pseudos_serv,tab_colors_serv]

    newSockClient.emit("list_pseudos", packet);
    newSockClient.broadcast.emit("fix_list", packet);
  });

  newSockClient.on("disconnect", function () {
    delete tab_colors[tab_pseudos[newSockClient.id]];
    delete tab_pseudos[newSockClient.id];
    var tab_pseudos_new = [];
    var tab_colors_new = [];
    for (var key in tab_pseudos) {
      tab_pseudos_new.push(tab_pseudos[key]);
    }
    for (var key in tab_colors) {
      tab_colors_new.push(tab_colors[key]);
    }

    var packet = [tab_pseudos_new,tab_colors_new]

    newSockClient.broadcast.emit("fix_list", packet);
  });
});

const PORT = process.env.PORT

server.listen(PORT, () => console.log ('Server running on port '+PORT))


