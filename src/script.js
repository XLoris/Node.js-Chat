const socket = io()

var connected = 0;


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


socket.on("fix_list", function (packet) {
  tab_pseudos_new = packet[0];
  list_colors = packet[1];
  if (connected == 1) {
    var getDiv = document.getElementById("list_pseudos");
    getDiv.innerHTML = "";
    for (var i = 0; i < tab_pseudos_new.length; i++) {
      display_pseudos(tab_pseudos_new[i]);
    }
    var listSpan = document.getElementById("list_pseudos").children;
    for (i = 0; i <= listSpan.length - 1; i++) {
      listSpan[i].setAttribute('style',"color:"+list_colors[i]+";")
    }
  }
});

function closingCode() {
  socket.emit("disconnect");
}

function display_pseudos(pseudo) {
  var para = document.createElement("span");
  var node = document.createTextNode(pseudo);
  para.appendChild(node);

  var element = document.getElementById("list_pseudos");
  element.appendChild(para);
}



function off() {
  var pseudoLocal = document.getElementById("pseudo-input").value;
  var colorLocal = document.getElementById("color-input").value;
  if (pseudoLocal != "" && colorLocal != "") {
    var pseudo = document.getElementById("pseudoLocal")
    pseudo.innerHTML = pseudoLocal;
    pseudo.style.color = colorLocal;
    document.getElementById("overlay").style.display = "none";
    addPseudo();
    socket.on("list_pseudos", function (packet) {
      list_pseudos = packet[0];
      list_colors = packet[1];
      
      console.log(list_pseudos);
      for (var i = 0; i < list_pseudos.length; i++) {
        display_pseudos(list_pseudos[i]);
      }

      var listSpan = document.getElementById("list_pseudos").children;
      for (i = 0; i <= listSpan.length - 1; i++) {
        listSpan[i].setAttribute('style',"color:"+list_colors[i]+";")
      }
    });
    document.getElementById("message-input").focus();
    connected = 1;
  }
}

function addPseudo() {
  const pseudo = document.getElementById("pseudo-input").value;
  var color = document.getElementById("color-input").value;
  var pack = [pseudo, color]
  socket.emit("entree-pseudo", pack);
  console.log("pseudo");
}

function scrollToBottom() {
  /*messages.scrollTop = messages.scrollHeight;*/
}

function champ() {
  /*shouldScroll = messages.scrollTop + messages.clientHeight === messages.scrollHeight;*/
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

    var container = document.getElementById("message-container");
    container.appendChild(para);
    container.scrollTop = container.scrollHeight;
    ColorMsg();
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

function ColorMsg(){

  var listSpan = document.getElementById("message-container").children;
  for (i = 0; i <= listSpan.length - 1; i++) {
    listSpan[i].setAttribute('style',"background-color:red;")

  }
}
