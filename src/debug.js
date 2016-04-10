let stampit = require('stampit');

let debugParent = document.getElementById('debugParent');

let Debug = function(what, value){
  let element = document.getElementById(what);
  if (!element){
    element = document.createElement("div");
    element.id = what;
    debugParent.appendChild(element);
  }
  element.innerHTML = value;
}

module.exports = Debug;
