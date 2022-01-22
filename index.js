window.onload = () => {
  document.getElementById("start-game").onclick = () => {
    startGame();
  } 
}

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let gameOn = false;

// const hunter = new Image();
// hunter.src = "./images/"

class Player {
  constructor() {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.score = 0;
  }
}

const duckUp = new Image();
duckUp.src = "./images/duck-wings-up.jpg";

const duckDown = new Image();
duckDown.src = "./images/duck-wings-down.jpg";

class Duck {
  constructor(x) {
    this.x = 0;
    this.y = Math.floor(Math.random * canvas.height - 200);;
    this.w = "30px";
    this.h = "30px";
    this.duckUp = duckUp;
    this.duckDown = duckDown;
  }

  duckFly() {
    if(this.y % 2 ===1) {
      this.y += 5;
    } else {
      this.y -= 5;
    }
  }
}

let ducksArr = [];

let newDuck = new Duck();

function createDuck() {
  ducksArr.push(new Duck())
}

function startGame() {
  if (!gameOn) {
    gameOn = true;
    setInterval(createDuck, 1500)

  }
  animate();
}

function detectCollision(duck, obj) {
  if (
    duck.x < obj.x + obj.w &&
    duck.x + duck.w > obj.x &&
    duck.y < obj.y + obj.h &&
    duck.y + duck.h > obj.y
  ) {
    return true;
  } else {
    return false;
  }
}

function animate() {
  game = window.requestAnimationFrame(animate);
  ctx.clearRect(0,0, canvas.width, canvas.height);

  ctx.drawImage(newDuck.duckUp, newDuck.x, newDuck.y, newDuck.w, newDuck.h);
  ctx.drawImage(newDuck.duckDown, newDuck.x, newDuck.y, newDuck.w, newDuck.h);
  for(let i = 0; i < ducksArr.length; i++) {
    ducksArr[i].fly();
  }
  // draw duck 
}