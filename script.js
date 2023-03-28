const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

ctx.canvas.height = window.innerHeight;
ctx.canvas.width = window.innerWidth;

let particlesArray;

// get mouse position

const mouse = {
  x: null,
  y: null,
  radius: (canvas.height / 80) * (canvas.width / 80),
};

window.addEventListener('mousemove', (e) => {
  mouse.x = e.x;
  mouse.y = e.y;
});

// create particle

class Particle {
  constructor(x, y, directionX, directionY, size, color) {
    this.x = x;
    this.y = y;
    this.directionX = directionX;
    this.directionY = directionY;
    this.size = size;
    this.color = color;
  }
  //method to draw individual particle

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  //check particle position, check mouse position, move the particle, draw the particle

  update() {
    //check if particle is still visible within canvas

    if (this.x > canvas.width || this.x < 0) {
      this.directionX = -this.directionX;
    }

    if (this.y > canvas.height || this.y < 0) {
      this.directionY = -this.directionY;
    }

    // check collision detection - mouse position / particle position

    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;

    let distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < mouse.radius + this.size) {
      if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
        this.x += 10;
      }
      if (mouse.x > this.x && this.x > this.size * 10) {
        this.x -= 10;
      }

      if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
        this.y += 10;
      }
      if (mouse.y > this.y && this.y > this.size * 10) {
        this.y -= 10;
      }
    }

    this.x += this.directionX;
    this.y += this.directionY;

    this.draw();
  }
}

// create particle array

function init() {
  particlesArray = [];
  let numberOfParticles = (canvas.width * canvas.height) / 9000;

  for (let i = 0; i < numberOfParticles; i++) {
    let size = Math.random() * 5 + 1;
    let x = Math.random() * (innerWidth - size * 2) + size;
    let y = Math.random() * (innerHeight - size * 2) + size;
    let directionX = Math.random() * 5 - 2.5;
    let directionY = Math.random() * 5 - 2.5;
    let color = 'white';

    particlesArray.push(
      new Particle(x, y, directionX, directionY, size, color)
    );
  }
}

// check if the particles are close enough to draw a line between them

function connect() {
  let opacityValue = 1;
  for (let a = 0; a < particlesArray.length; a++) {
    for (let b = a; b < particlesArray.length; b++) {
      let distance =
        (particlesArray[a].x - particlesArray[b].x) *
          (particlesArray[a].x - particlesArray[b].x) +
        (particlesArray[a].y - particlesArray[b].y) *
          (particlesArray[a].y - particlesArray[b].y);

      if (distance < (canvas.width / 7) * (canvas.height / 7)) {
        let opacityValue = 1 - distance / 30000;
        ctx.strokeStyle = `rgba(154,231,2, ${opacityValue})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
        ctx.stroke();
      }
    }
  }
}

// animate loop

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, innerWidth, innerHeight);

  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update();
  }
  connect();
}

init();
animate();

window.onresize = () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  mouse.radius = (canvas.height / 80) * (canvas.width / 80);
  init();
};

const noMouseInteraction = () => {
  mouse.x = undefined;
  mouse.y = undefined;
};

// mouseout event

window.onmouseout = noMouseInteraction;

// remove mouse presence so it's not still there when not moving

setInterval(noMouseInteraction, 100);
