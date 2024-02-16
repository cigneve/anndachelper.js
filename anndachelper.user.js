// ==UserScript==
// @name        anndachelper
// @namespace   Violentmonkey Scripts
// @match       https://yillik.anndac.com/Ogrenci/OgrenciYazilarim*
// @grant       none
// @version     1.0
// @author      yusuf said aktan
// @description sorumlulu degilim
// ==/UserScript==
let yaziArray = Array.from(document.getElementsByClassName("comment-body"));
let yaziElements = yaziArray.map((yazi) => angular.element(yazi));
let yazis = yaziElements.map((yazi) => yazi.scope());

if (!yazis) {
  return;
}

yaziParent = yazis[0]["$parent"];
let moveUp = yaziParent["yukariTasi"];
yazis = yazis.map((yazi) => yazi.yazi);

let orders = [];
for (let i = 0; i < yazis.length; i++) {
  let yazi = yazis[i];
  orders.push({
    id: yazi["YazanId"],
    writer: yazi["YazarAdSoyad"],
    position: yazi["Sira"],
  });
}

let container = document.createElement("div");
container.classList.add("white-box");

let containerParent = document.querySelector(".col-md-3");
containerParent.appendChild(container);

let containerList = document.createElement("ul");

orders.forEach((litem) => {
  let li = document.createElement("li");
  li.setAttribute("id", litem.id);
  li.setAttribute("draggable", "true");
  li.innerHTML = litem.writer;
  li.classList.add("dropzone");
  li.style.padding = 0;
  li.style.margin = 0;
  li.style.lineHeight = "10px";
  li.style.minHeight = "50px";
  li.style.border = "0px";
  containerList.appendChild(li);
});

let orderButton = document.createElement("button");
orderButton.innerText = "Sirala babam";
orderButton.style.justifySelf = "center"

container.appendChild(containerList);
container.appendChild(orderButton);

//#region add dragging

let dragged;
let id;
let index;
let indexDrop;
let list;

document.addEventListener("dragstart", ({ target }) => {
  dragged = target;
  id = target.id;
  list = target.parentNode.children;
  dragged.style.background = "red";
  for (let i = 0; i < list.length; i += 1) {
    if (list[i] === dragged) {
      index = i;
    }
  }
});

debugger;
document.addEventListener("dragover", (event) => {
  event.preventDefault();
});

document.addEventListener("drop", ({ target }) => {
  dragged.style.background = "white";
  if (target.className == "dropzone" && target.id !== id) {
    dragged.remove();
    for (let i = 0; i < list.length; i += 1) {
      if (list[i] === target) {
        indexDrop = i;
      }
    }
    console.log(index, indexDrop);
    if (index > indexDrop) {
      target.before(dragged);
    } else {
      target.after(dragged);
    }
  }
});

function handleOrder() {
  let orderDict = {};

  let list = Array.from(containerList.children);
  for (let i = 0; i < list.length; i++) {
    orderDict[list[i].id] = {
      writer: list[i].innerHTML,
      target: i,
    };
  }
  for (let round = 0; round < list.length; round++) {
    let curyazis = Array.from(
      document.getElementsByClassName("comment-body")
    ).map((yazi) => angular.element(yazi).scope().yazi);

    for (let i = 1; i < list.length; i++) {
        let curyazi = curyazis[i];
        let prevyazi = curyazis[i-1];
        let curid = curyazi['YazanId'];
        let previd = prevyazi['YazanId'];

        if (orderDict[curid].target<orderDict[previd].target){
          moveUp(curyazi);
          curyazis[i]=prevyazi;
        }

    }
  }
}

orderButton.onclick = handleOrder;

//#endregion
