const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 1 + 0.5;
    this.speedX = 0;
    this.speedY = 0;
    this.accelerationX = (Math.random() - 0.5) / 1000;
    this.accelerationY = (Math.random() - 0.5) / 1000;
  }

  update(nearestNeighbor) {
    const dist = Math.sqrt(
      (this.x - nearestNeighbor.x) ** 2 + (this.y - nearestNeighbor.y) ** 2
    );
    const speedFactor = dist / canvas.width;
    this.speedX += this.accelerationX * speedFactor;
    this.speedY += this.accelerationY * speedFactor;
    this.x += this.speedX;
    this.y += this.speedY;

    // Check for particles going out of the canvas bounds and wrapping them around
    if (this.x < 0) this.x = canvas.width;
    if (this.x > canvas.width) this.x = 0;
    if (this.y < 0) this.y = canvas.height;
    if (this.y > canvas.height) this.y = 0;
  }

  draw() {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  findNearestNeighbor(particlesArray) {
    let minDist = Infinity;
    let nearestNeighbor = null;

    for (let i = 0; i < particlesArray.length; i++) {
      if (particlesArray[i] !== this) {
        const dist = Math.sqrt(
          (this.x - particlesArray[i].x) ** 2 + (this.y - particlesArray[i].y) ** 2
        );
        if (dist < minDist) {
          minDist = dist;
          nearestNeighbor = particlesArray[i];
        }
      }
    }

    return nearestNeighbor;
  }

  drawLineToNearestNeighbor(particlesArray) {
    const nearestNeighbor = this.findNearestNeighbor(particlesArray);
    if (nearestNeighbor !== null) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(nearestNeighbor.x, nearestNeighbor.y);
      ctx.stroke();
    }
  }
}

const particlesArray = [];
const particleCount = 150;

// Create initial particles
for (let i = 0; i < particleCount; i++) {
  particlesArray.push(
    new Particle(Math.random() * canvas.width, Math.random() * canvas.height)
  );
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particlesArray.forEach((particle) => {
    const nearestNeighbor = particle.findNearestNeighbor(particlesArray);
    particle.update(nearestNeighbor);
    particle.drawLineToNearestNeighbor(particlesArray);
    particle.draw();
  });

  requestAnimationFrame(animateParticles);
}

animateParticles();
