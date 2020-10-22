const socket = io()

var connected = 0;

var container = document.getElementById("message-container");

window.onload = function () {
  on();
};

window.onbeforeunload = function () {
  closingCode();
};

function on() {
  document.getElementById("overlay").style.display = "block";
}

function enterKey(e) {
  if (e.keyCode == 13) {
    champ();
  }
}

function enterKeyPseudo(e) {
  if (e.keyCode == 13) {
    off();
  }
}


socket.on("fix_list", function (tab_pseudos_new) {
  if (connected == 1) {
    var getDiv = document.getElementById("list_pseudos");
    getDiv.innerHTML = "";
    for (var i = 0; i < tab_pseudos_new.length; i++) {
      display_pseudos(tab_pseudos_new[i]);
    }
  }
});

function closingCode() {
  socket.emit("disconnect");
}

function display_pseudos(element) {
  var para = document.createElement("span");
  var node = document.createTextNode(element);
  para.appendChild(node);

  var element = document.getElementById("list_pseudos");
  element.appendChild(para);
}

function off() {
  var pseudoLocal = document.getElementById("pseudo-input").value;
  if (pseudoLocal != "") {
    document.getElementById("pseudoLocal").innerHTML = pseudoLocal;
    document.getElementById("overlay").style.display = "none";
    addPseudo();
    socket.on("list_pseudos", function (list_pseudos) {
      console.log(list_pseudos);
      for (var i = 0; i < list_pseudos.length; i++) {
        display_pseudos(list_pseudos[i]);
      }
    });
    document.getElementById("message-input").focus();
    connected = 1;
  }
}

function addPseudo() {
  const pseudoInput = document.getElementById("pseudo-input");
  const pseudo = pseudoInput.value;
  socket.emit("entree-pseudo", pseudo);
  console.log("pseudo");
}

function champ() {
  var temps = new Date();
  var heures = temps.getHours();
  var minutes = temps.getMinutes();
  var pseudoLocal = document.getElementById("pseudoLocal").innerHTML;
  const messageInput = document.getElementById("message-input");
  const message = messageInput.value;
  if (message != "") {
    var content = [heures, minutes, message];
    socket.emit("send-chat-message", content);

    messageInput.value = "";

    var para = document.createElement("span");
    var node = document.createTextNode(
      "[" + heures + ":" + minutes + "]" + "   " + pseudoLocal + " : " + message
    );
    para.appendChild(node);

    var element = document.getElementById("message-container");
    element.appendChild(para);
    container.scrollTop = container.height;
  }
}

socket.on("new-message", function (content_serv) {
  var msgServ = content_serv[0][2];
  var heures = content_serv[0][0];
  var minutes = content_serv[0][1];
  var pseudoIn = content_serv[1];
  var para = document.createElement("span");
  var node = document.createTextNode(
    "[" + heures + ":" + minutes + "]" + "   " + pseudoIn + " : " + msgServ
  );
  para.appendChild(node);

  var element = document.getElementById("message-container");
  element.appendChild(para);
});