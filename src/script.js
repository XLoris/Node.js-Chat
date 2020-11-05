
const socket = io()

var connected = 0;
var dernierMessage = 2;
var colorLocal;
var eligible;
var timer = 0;
var lastName;
var placeMenu = true;

window.onload = function () {
  on();
};

window.onbeforeunload = function () {
  closingCode();
};

function verif(chars) {

  var regex = new RegExp("[A-Za-z0-9éèàêëâîïôöûüùç]", "i");
  var valid;
  for (x = 0; x < chars.value.length; x++) {
      valid = regex.test(chars.value.charAt(x));
      if (valid == false) {
          chars.value = chars.value.substr(0, x) + chars.value.substr(x + 1, chars.value.length - x + 1); x--;
      }
  }
}

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
    intermediaire();
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
  var node;
  var pseudoVous = document.getElementById("pseudo-input").value
  var para = document.createElement("span");
  if(pseudo == pseudoVous){node = document.createTextNode(pseudo+" (Vous)");}
  else{node = document.createTextNode(pseudo);}
  para.appendChild(node);

  var element = document.getElementById("list_pseudos");
  element.appendChild(para);
}

function intermediaire(){
  if(timer == 0){
    timer = 1
    var pseudoLocal = document.getElementById("pseudo-input").value;
    socket.emit('requestList', pseudoLocal)
    socket.on("listCheck", function(valeur){
      eligible = valeur;
      });
    setTimeout(off, 500);
  }
  setTimeout(function(){timer = 0}, 540)
}

function off() {
  var pseudoLocal = document.getElementById("pseudo-input").value;
  if (pseudoLocal != "" && colorLocal != "" && eligible != 0) {
    document.getElementById('overlay').style.display = "none";
    addPseudo();
    socket.on("list_pseudos", function (packet) {
      list_pseudos = packet[0];
      list_colors = packet[1];
      
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
    colorLocal = document.getElementById("color-input").value;
  }
  
  else if(pseudoLocal != "" && colorLocal != ""){alert('Pseudo déja pris')}
}

function addPseudo() {
  const pseudo = document.getElementById("pseudo-input").value;
  var color = document.getElementById("color-input").value;
  var pack = [pseudo, color]
  socket.emit("entree-pseudo", pack);
}

function scrollToBottom() {
  /*messages.scrollTop = messages.scrollHeight;*/
}


function champ() {
  /*shouldScroll = messages.scrollTop + messages.clientHeight === messages.scrollHeight;*/
  var temps = new Date();
  var heures = temps.getHours();if(heures<10){heures = "0"+heures;}
  var minutes = temps.getMinutes(); if(minutes<10){minutes = "0"+minutes;}
  var pseudoLocal = document.getElementById("pseudo-input").value;
  const messageInput = document.getElementById("message-input");
  const message = messageInput.value;
  if (message != "") {
    var content = [heures, minutes, message];
    socket.emit("send-chat-message", content);

    messageInput.value = "";

    var nom = document.createElement("span");
    var para = document.createElement("span");
    var hm = document.createElement("span");
    nom.style.color = colorLocal;
    nom.className="nomEnvoi"
    para.className = "spanEnvoi";
    hm.className = "hourEnvoi";
    var node = document.createTextNode(
      message
    );

    var under = document.createTextNode(
      heures + ":" + minutes
    );

    var above = document.createTextNode(
      pseudoLocal
    );
    para.appendChild(node);
    hm.appendChild(under);
    nom.appendChild(above)

    var container = document.getElementById("message-container");
    if(lastName != pseudoLocal){
      container.appendChild(nom);
      lastName = pseudoLocal
      }

    container.appendChild(para);
    container.appendChild(hm);
    container.scrollTop = container.scrollHeight;
  }
}

function showOverlay(){
  document.getElementById('overlay_b').style.display = "block";
  document.getElementById('menuGauche').style.display = "block";
  
}

function closeOverlay(){
  document.getElementById('overlay_b').style.display = "none";
  document.getElementById('menuGauche').style.display = "none";
}

document.getElementById("bouton").addEventListener('click', champ);
document.getElementById("burgerMenu").addEventListener('click', showOverlay);



socket.on("new-message", function (content_serv) {
  var msgServ = content_serv[0][2];
  var heures = content_serv[0][0];
  var minutes = content_serv[0][1];
  var pseudoIn = content_serv[1];
  var colorActualMsg = content_serv[2];
  var nom = document.createElement("span");
  var para = document.createElement("span");
  var hm = document.createElement("span");
  nom.style.color = colorActualMsg;
  nom.className="nomReception"
  para.className = "spanReception";
  hm.className = "hourReception";
  var node = document.createTextNode(
    msgServ
  );
  
  var under = document.createTextNode(
    heures + ":" + minutes
  );

  var above = document.createTextNode(
    pseudoIn
  );

  para.appendChild(node);
  hm.appendChild(under);
  nom.appendChild(above);

  var container = document.getElementById("message-container");
    if(lastName != pseudoIn){
    container.appendChild(nom);
    lastName = pseudoIn
    }
    container.appendChild(para);
    container.appendChild(hm);
    container.scrollTop = container.scrollHeight;
});






/* function ColorMsg(){

  var listSpan = document.getElementById("message-container").children;
  for (i = 0; i <= listSpan.length - 1; i++) {
    listSpan[i].setAttribute('style',"background-color:red;")

  }
} */

