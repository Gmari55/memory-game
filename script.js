const matrix = document.getElementById('matrix')
let mode = 8;
let s = 0;
let m = 0;
let time;
let timerid;
let iswork = false;
let isend = false;
const divend = document.getElementById('end');


$("#seven-seg").sevenSeg({ digits: 4, value: `  ` });

function fillArrayWithRandomNumbers() {
  let array = [];

  for (var i = 1; i <= mode; i++) {
    array.push(i);
    array.push(i);
  }

  shuffleArray(array);

  return array;
}

function shuffleArray(array) {
  let currentIndex = array.length;
  let temporaryValue, randomIndex;


  while (0 !== currentIndex) {

    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}


let randomArray = fillArrayWithRandomNumbers();




function cretecard() {
  matrix.innerHTML = ""
  randomArray.forEach(element => {


    matrix.innerHTML += ` <div class="card" num="${element}" onclick="flipCard(this)">` +
      `<div class="front"><img src="assets/pictures/question.png"></div>` +
      `<div class="back"><img src="assets/pictures/pictures${element} (Custom).png"></div>` +
      `</div>`

  });

}
let lastcard;
let stop = false;
async function flipCard(card) {
  if (stop)
    return;
    if(MenuIsOpen)
    return;
  if (!card.classList.contains('flipped')) {

    card.classList.toggle('flipped');
    stop = true;
    if (lastcard != null)
      await new Promise(r => setTimeout(r, 500));
    if (lastcard != null) {


      if (lastcard.getAttribute('num') != card.getAttribute('num')) {
        card.classList.toggle('flipped');
        lastcard.classList.toggle('flipped');

      }
      lastcard = null;
      checkmatrix();
      stop = false;
      return;

    }

    lastcard = card;
  }
  stop = false;
}

async function checkmatrix() {
  let cards = matrix.children;
  let iswin = true
  for (let item of cards) {
    if (!item.classList.contains('flipped'))
      iswin = false
  }
  if (iswin)
    end()
}


function end() {

  ShowScore();
  isend = true;
  iswork = false;
  clearInterval(timerid);
  openmenu();
}




function ShowScore() {

  console.log(time)
  if (localStorage.getItem(mode) == null) {
    localStorage.setItem(mode, time)

  }
  else {
    if (time < localStorage.getItem(mode))
      localStorage.setItem(mode, time)


  }
  divend.innerHTML = `<div> Current Time:</div >` +
    `<div>${time}</div>` +
    `<div> Best Time:</div>` +
    `<div>${localStorage.getItem(mode)}</div>` +
    `<div> <button onclick="showaddmenu()">Top Score</button></div>`


  divend.style.display = "inline"
}



function saveusertime() {
  const userinput = document.getElementById('userinput').value;
  let user = {
    username: userinput,
    time: time
  };
  let userslist = [user];



  if (localStorage.getItem(`list` + mode) != null) {

    userslist = userslist.concat(JSON.parse(localStorage.getItem(`list${mode}`)));
  }


  userslist.sort((a, b) => {
    if (a.time > b.time) {
      return 1;
    }
    if (a.time < b.time) {
      return -1;
    }
    return 0;
  });
  localStorage.setItem(`list${mode}`, JSON.stringify(userslist));
  showrecord()
}
function showrecord() {

  let table=document.createElement('table');
  let head=table.createTHead()
  head.innerHTML=`<tr>
  <th>Username</th>
  <th>Time</th>
</tr>`
 let text =`<table>`
 let body=table.createTBody()
 
 let arr = JSON.parse(localStorage.getItem(`list${mode}`));
 
 for (let index = 0; index < arr.length; index++) {
   
   body.innerHTML+= `<tr>` +
   `<td>${arr[index].username}</td>` +
   `<td>${arr[index].time}</td>` +
   `</tr>`;
   
  } 

 divend.innerHTML='';
   divend.appendChild(table);
    console.log(table)

}

function showaddmenu() {
  divend.innerHTML = `<div> Current Time:</div >` +
    `<div>${time}</div>` +
    `<div>Username:</div>` +
    `<div><input type="text" id="userinput" ></input></div>` +
    `<div> <button onclick="saveusertime()">Save</button></div>`

}

let MenuIsOpen = true;


function openmenu() {
  const menu = document.getElementById('menu')
  if (MenuIsOpen) {
    MenuIsOpen = false
    menu.style.left = "-240px"
    if (!isend)
      iswork = true
  }
  else {
    MenuIsOpen = true
    menu.style.left = "0px"
    iswork = false
  }

}

async function modechange(num) {
  isend = false;

  clearInterval(timerid)
  mode = num / 2;
  matrix.style.width = `${num / 4 * 180}px`;
  randomArray = fillArrayWithRandomNumbers();
  iswork = true;
  openmenu();
  cretecard();
  cleardivend();
  s = -1;
  m = 0;
  timerid = setInterval('timer()', 1000);

}

function cleardivend() {
  divend.style.display = "none";


}


async function timer() {

  if (iswork)
    s++;

  if (s == 59) {
    m++;
    s = 0;
  }


  time = m + `.`
  if (s < 10)
    time += "0";
  time += s;


  $("#seven-seg").sevenSeg({ digits: 4, value: `${time}` });



}



