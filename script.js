const matrix = document.getElementById('matrix')
let mode = 8;
let iswork = false;
let isend=false;
const divend=document.getElementById('end')
const currenttime=document.getElementById('current_time')
const besttime=document.getElementById('best_time')
$("#seven-seg").sevenSeg({ digits: 4, value: ` ` });

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
    if(iswin)
    end()
}
function end()
{
 
  let time=m+`.`
  if(s<10)
  time+="0";
  time+=s;
if(localStorage.getItem(mode)==null)
{
  localStorage.setItem(mode,time)
  currenttime.innerHTML=time;
}
else{
  if(time<localStorage.getItem(mode))
  localStorage.setItem(mode,time)

  currenttime.innerHTML=time;
  besttime.innerHTML=localStorage.getItem(mode);

}

  
  divend.style.display="inline"
  isend=true
  iswork=false;
  openmenu();
}
let MenuIsOpen = true;
function openmenu() {
  const menu = document.getElementById('menu')
  if (MenuIsOpen) {
    MenuIsOpen = false
    menu.style.left = "-240px"
    if(!isend)
    iswork = true
  }
  else {
    MenuIsOpen = true
    menu.style.left = "0px"
    iswork = false
  }
  
}

function modechange(num) {
  isend=false;
  console.log(num)
  mode = num / 2;
  matrix.style.width = `${num / 4 * 180}px`;
  randomArray = fillArrayWithRandomNumbers();
  iswork = true;
  openmenu();
  cretecard();
  cleartimer();
  timer();
  cleardivend();
  
}
function cleardivend(){
  divend.style.display="none";
  besttime.innerHTML="";

}
let s = 0;
let m = 0;
function cleartimer()
{
  s=0;
  m=0;
}

async function timer() {
  console.log(iswork)
  while (!isend) {
    if (s == 59) {
      m++;
      s = 0;
    }


    let time=m+`.`
    if(s<10)
    time+="0";
    time+=s;

    if (iswork) {
      
      $("#seven-seg").sevenSeg({ digits: 4, value: `${time}` });
      await new Promise(r => setTimeout(r, 1000));
      s++;
    }
    else
    await new Promise(r => setTimeout(r, 100));
  }
}



