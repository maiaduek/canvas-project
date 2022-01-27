window.onload = () => {
  document.getElementById("start-game").onclick = () => {
    
    setTimeout(startGame, 400)
  } 
}

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Global variables
let gameOn = false;
let player;
let ducksArr = [];
let degree = 0;

let sadTrombone = new Audio("sounds/sad-trombone.mp3");
let gunLoad = new Audio("sounds/gun-load.wav");

let bloodSplat = new Image();
bloodSplat.src = "images/blood-splat.png";

const hunter = new Image();
hunter.src = "images/hunter2.png";

const duckUp = new Image();
duckUp.src = "images/duck-wings-up.png";

const duckDown = new Image();
duckDown.src = "images/duck-wings-down.png";

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
    this.missedDucks = 0;
  }
}

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
    // If duck is high up on canvas, flyingUp property gets toggled to false and duck begins to fly down and vice versa. Speed of duck is determined by the level, adds 2 x-axis points to the level.
    this.x += 2;
    let verticalFlight = this.flyingUp ? -(player.level + 2) : (player.level + 2)
    this.y += verticalFlight;
  }

  drawDuck(pos) {
    ctx.drawImage(
      this[pos],
        this.x,
        this.y,
        this.w,
        this.h
    )
  }

  duckBleed() {
    ctx.drawImage(bloodSplat, this.x, this.y, this.w, this.h);
  }
}

function createDuck() {
  let pickRandomSize = Math.floor(Math.random() * 3);
  ducksArr.push(new Duck([70, 100, 130][pickRandomSize]))
}

function startGame() {
  if (!gameOn) {
    gameOn = true;
    player = new Player();
    gunLoad.play();
    document.getElementById("canvas").style.cursor = 'crosshair';

     // Event listener for clicks. Degree of hunter (to rotate) depends on the x axis of the cursor when it was clicked
    window.addEventListener('click', (e) => {
      player.clicked = true;
      player.mouseX = e.x;
      player.mouseY = e.y;

      if (e.x < 100) {
        degree = 300;
      } else if (e.x >= 100 && e.x < 200) {
        degree = 300;
      } else if (e.x >= 200 && e.x < 300) {
        degree = 320;
      } else if (e.x >= 300 && e.x < 400) {
        degree = 325;
      } else if (e.x >= 400 && e.x < 600) {
        degree = 335;
      } else if (e.x >= 600 && e.x < 700) {
        degree = 340;
      } else if (e.x >= 700 && e.x < 800) {
        degree = 345;
      } else if (e.x >= 800 && e.x < 900) {
        degree = 355;
      } else {
        degree = 10;
      }
    })

    // Toggle duck's flapWingsUp attribute to make the wings flap
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
    return true;
  } else {
    return false;
  }
}

// Choose how to draw hunter image according to degrees taken from click event listener.
function choosePlayerPos() {
  if (degree === 300) {
    ctx.drawImage(player.img, -133, 0, player.w, player.h);
  } else if (degree === 320) {
    ctx.drawImage(player.img, -60, -10, player.w, player.h);
  } else if (degree === 325) {
    ctx.drawImage(player.img, -50, -20, player.w, player.h);
  } else if (degree === 335) {
    ctx.drawImage(player.img, -50, -48, player.w, player.h);
  } else if (degree === 340) {
    ctx.drawImage(player.img, -50, -60, player.w, player.h);
  } else if (degree === 345) {
    ctx.drawImage(player.img, -50, -70, player.w, player.h);
  } else if (degree === 355) {
    ctx.drawImage(player.img, -50, -80, player.w, player.h);
  } else {
    ctx.drawImage(player.img, -50, -80, player.w, player.h);
  }
}

function animate() {
  game = window.requestAnimationFrame(animate);
  ctx.clearRect(0,0, canvas.width, canvas.height);
  ctx.save();
  // Change point of origin to decrease radius of where player rotates.
  ctx.translate(player.x + 50, player.y + 70);
  // Degree taken from click event listener
  ctx.rotate(degree * Math.PI / 180);

  // Constantly choosing random numbers and creating duck when the randomNum = 50
  let randomNum = Math.floor(Math.random() * 100)
  if (randomNum === 50) {
    createDuck();
  }  

  // Drawing player
  choosePlayerPos();

  ctx.restore();
  ctx.fillStyle = "white";
  ctx.font = '25px sans-serif';
  ctx.fillText(`EARNINGS: $${player.score}`, 100, 35)
  ctx.fillText(`LEVEL: ${player.level}`, 350, 35)

  for(let i = 0; i < ducksArr.length; i++) {
    
    let pos = ducksArr[i].flapWingsUp ? "duckUp" : "duckDown";
    // Drawing duck image with wings flapped up or down 
    
    ducksArr[i].drawDuck(pos);

    ducksArr[i].duckFly();

    if (player.clicked) {
      
      let gunshot = new Audio("sounds/gun-shot.mp3");
      gunshot.play();
      if (detectCollision(ducksArr[i], player)) {
        if (ducksArr[i].w === 70) {
          player.score += 5;
        } else if (ducksArr[i].w === 100) {
          player.score += 10;
        } else {
          player.score += 15;
        }
        ducksArr[i].duckBleed();
        ducksArr.splice(i, 1);
      }
    }

    if (ducksArr[i].x >= 1050) {
      ducksArr.splice(i, 1)
      player.missedDucks++;
    }
  }

  player.clicked = false;

  // Increse level based on first digit of score once score reaches 3 digits. 
  if (player.score.toString().length >= 3) {
    player.level = parseInt(player.score.toString()[0]) + 1
  }

  if (player.missedDucks === 10) {
    gameOver();
  }
}

function gameOver() {
  window.cancelAnimationFrame(game);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "red";
  ctx.font = '35px sans-serif';
  ctx.fillText(`GAME OVER`, 375, 100);
  ctx.font = '30px sans-serif';
  ctx.fillStyle = "white";
  ctx.fillText(`EARNINGS: $${player.score}`, 375, 150)
  ctx.font = '20px sans-serif';
  ctx.fillText(`Tough luck - you missed too many ducks!`, 310, 200);
  sadTrombone.play();
  gameOn = false;
  player.missedDucks = 0;
  ducksArr = [];
}