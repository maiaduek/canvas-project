window.onload = () => {
  document.getElementById("start-game").onclick = () => {
    let gunLoad = new Audio("sounds/gun-load.wav");
    gunLoad.play();
    setTimeout(startGame, 400)
  } 
}
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let gameOn = false;

const hunter = new Image();
hunter.src = "images/hunter2.png";



class Player {
  constructor() {
    this.x = 10;
    this.y = canvas.height - 200;
    this.w = 500;
    this.h = 800;
    this.score = 0;
    this.img = hunter;
    this.clicked = false;
    this.mouseX = 0;
    this.mouseY = 0;
    this.level = 1;
  }
}

let player;

const duckUp = new Image();
duckUp.src = "images/duck-wings-up.png";

const duckDown = new Image();
duckDown.src = "images/duck-wings-down.png";

class Duck {
  constructor(size) {
    this.x = 0;
    this.y = Math.floor(Math.random() * (canvas.height - 200));
    this.w = size;
    this.h = size;
    this.duckUp = duckUp;
    this.duckDown = duckDown;
    this.flapWingsUp = true;
    this.flyingUp = true;
  }

  duckFly() {
    if (this.y <= 20) {
      this.flyingUp = false;
    } else if (this.y >= canvas.height - 200) {
      this.flyingUp = true;

    }
    this.x += 2;
    let verticalFlight = this.flyingUp ? -(player.level + 2) : (player.level + 2)
    this.y += verticalFlight;
  }
}

let ducksArr = [];

let size = [70, 100, 130]

function createDuck() {
  let randSize = Math.floor(Math.random() * size.length);
  ducksArr.push(new Duck(size[randSize]))
}

function startGame() {
  if (!gameOn) {
    gameOn = true;
    player = new Player();
    document.getElementById("canvas").style.cursor = 'crosshair';
    

    setInterval(createDuck,  2000)
    window.addEventListener('click', (e) => {
      player.clicked = true;
      player.mouseX = e.x;
      player.mouseY = e.y;
      if (e.x < 200) {
        degree = 300;
      } else if (e.x >= 200 && e.x < 400) {
        degree = 330;
      } else if (e.x >= 400 && e.x < 600) {
        degree = 345;
      } else if (e.x >= 600 && e.x < 800) {
        degree = 355;
      } else {
        degree = 5;
      }
    })

    setInterval(() => {
      for (let i = 0; i < ducksArr.length; i++) {
        ducksArr[i].flapWingsUp = !(ducksArr[i].flapWingsUp)
      }
    }, 400)

    animate();
  }
}

function detectCollision(duck, obj) {
  if (
    duck.x <= obj.mouseX &&
    duck.x + duck.w >= obj.mouseX &&
    duck.y <= obj.mouseY &&
    duck.y + duck.h >= obj.mouseY
  ) {
    console.log("DUCK HIT")
    return true;
  } else {
    return false;
  }
}

let degree = 0;

function animate() {
  game = window.requestAnimationFrame(animate);
  ctx.clearRect(0,0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(player.x+ 50, player.y + 70);
  ctx.rotate(degree * Math.PI / 180);
  ctx.drawImage(player.img, -50, -20, player.w, player.h);
  ctx.restore();

  ctx.fillStyle = "white";
  ctx.font = '25px sans-serif';
  ctx.fillText(`SCORE: ${player.score}`, 100, 35)
  ctx.fillText(`LEVEL: ${player.level}`, 250, 35)

  for(let i = 0; i < ducksArr.length; i++) {
    if (ducksArr[i].flapWingsUp) {
      ctx.drawImage(
        ducksArr[i].duckUp,
        ducksArr[i].x,
        ducksArr[i].y,
        ducksArr[i].w,
        ducksArr[i].h
      )
    } else {
      ctx.drawImage(
        ducksArr[i].duckDown,
          ducksArr[i].x,
          ducksArr[i].y,
          ducksArr[i].w,
          ducksArr[i].h
      )
    }

    ducksArr[i].duckFly();

    if (player.clicked) {
      
      let gunshot = new Audio("sounds/gun-shot.mp3");
      gunshot.play();
      let x = detectCollision(ducksArr[i], player)
      console.log(x, ducksArr[i], player)
      if (detectCollision(ducksArr[i], player)) {
        console.log("collided")
        if (ducksArr[i].w === 70) {
          player.score += 5;
        } else if (ducksArr[i].w === 100) {
          player.score += 10;
        } else {
          player.score += 15;
        }
        ducksArr.splice(i, 1);
      }
    }
  }
  player.clicked = false;

  if (player.score.toString().length >= 3) {
    player.level = parseInt(player.score.toString()[0]) + 1
  }

  if (ducksArr.length === 10) {
    gameOver();
  }
}

function gameOver() {
  window.cancelAnimationFrame(game);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "red";
  ctx.font = '35px sans-serif'
  ctx.fillText(`GAME OVER`, 370, 100, 300);
  ctx.fillStyle = "white";
  ctx.font = '20px serif';
  ctx.fillText(`Tough luck - you missed too many ducks!`, 310, 200);
  let sadTrombone = new Audio("sounds/sad-trombone.mp3");
  sadTrombone.play();
}