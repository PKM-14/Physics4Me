const strengthSlider = document.getElementById("strength");
const velocitySlider = document.getElementById("velocity");

let aligned = false;
let particle;

// --------------------
// RESET PARTICLE
// --------------------
function resetParticle() {
  particle = { x: 100, y: 150, vx: 2, vy: 0 };
}

// --------------------
// TOGGLE DOMAINS
// --------------------
function toggleDomains() {
  aligned = !aligned;
}

resetParticle();

// --------------------
// 1. WIRE (VECTOR FIELD)
// --------------------
(function wire() {
  const canvas = document.getElementById("wireCanvas");
  const ctx = canvas.getContext("2d");

  function draw() {
    ctx.fillStyle = "#0f1117";
    ctx.fillRect(0, 0, 600, 300);

    ctx.fillStyle = "#fff";
    ctx.fillRect(295, 0, 10, 300);

    const B = strengthSlider.value;

    for (let x = 50; x < 550; x += 40) {
      for (let y = 50; y < 250; y += 40) {

        const dx = x - 300;
        const dy = y - 150;

        const angle = Math.atan2(dy, dx) + Math.PI / 2;
        const mag = B / Math.sqrt(dx*dx + dy*dy);

        const len = 15 * mag;

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(
          x + len * Math.cos(angle),
          y + len * Math.sin(angle)
        );
        ctx.strokeStyle = "#58a6ff";
        ctx.stroke();
      }
    }

    requestAnimationFrame(draw);
  }

  draw();
})();

// --------------------
// 2. SOLENOID (FIELD BUILDUP)
// --------------------
(function solenoid() {
  const canvas = document.getElementById("solenoidCanvas");
  const ctx = canvas.getContext("2d");

  function draw() {
    ctx.fillStyle = "#0f1117";
    ctx.fillRect(0, 0, 600, 300);

    const B = strengthSlider.value;

    for (let i = 0; i < 10; i++) {
      let x = 80 + i * 45;

      ctx.beginPath();
      ctx.arc(x, 150, 20, 0, 2 * Math.PI);
      ctx.strokeStyle = "#58a6ff";
      ctx.stroke();
    }

    // strong internal field arrows
    for (let x = 100; x < 500; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 150);
      ctx.lineTo(x + 20 * B / 5, 150);
      ctx.strokeStyle = "#e6edf3";
      ctx.stroke();
    }

    requestAnimationFrame(draw);
  }

  draw();
})();

// --------------------
// 3. MAGNET DOMAINS
// --------------------
(function magnet() {
  const canvas = document.getElementById("magnetCanvas");
  const ctx = canvas.getContext("2d");

  function draw() {
    ctx.fillStyle = "#0f1117";
    ctx.fillRect(0, 0, 600, 300);

    for (let x = 60; x < 540; x += 40) {
      for (let y = 60; y < 240; y += 40) {

        let angle = aligned ? 0 : Math.random() * Math.PI * 2;

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(
          x + 20 * Math.cos(angle),
          y + 20 * Math.sin(angle)
        );
        ctx.strokeStyle = "#58a6ff";
        ctx.stroke();
      }
    }

    ctx.fillStyle = "#fff";
    ctx.fillText(
      aligned ? "Aligned → Magnet" : "Random → No Magnet",
      180, 280
    );

    requestAnimationFrame(draw);
  }

  draw();
})();

// --------------------
// 4. LORENTZ FORCE
// --------------------
(function lorentz() {
  const canvas = document.getElementById("lorentzCanvas");
  const ctx = canvas.getContext("2d");

  function draw() {
    ctx.fillStyle = "#0f1117";
    ctx.fillRect(0, 0, 600, 300);

    const B = strengthSlider.value;
    const vScale = velocitySlider.value;

    // field markers
    ctx.fillStyle = "#58a6ff";
    for (let x = 0; x < 600; x += 40) {
      for (let y = 0; y < 300; y += 40) {
        ctx.fillText("×", x, y);
      }
    }

    // Lorentz force
    let ax = -particle.vy * 0.02 * B;
    let ay = particle.vx * 0.02 * B;

    particle.vx += ax;
    particle.vy += ay;

    particle.x += particle.vx * vScale * 0.2;
    particle.y += particle.vy * vScale * 0.2;

    if (particle.x > 600 || particle.y > 300 || particle.y < 0) {
      resetParticle();
    }

    ctx.beginPath();
    ctx.arc(particle.x, particle.y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = "#fff";
    ctx.fill();

    requestAnimationFrame(draw);
  }

  draw();
})();
