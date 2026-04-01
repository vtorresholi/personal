const SECRET_CODE = '2802'; // <-- CAMBIA AQUÍ TU CÓDIGO

const lockScreen = document.getElementById('screen-lock');
const letterScreen = document.getElementById('screen-letter');
const unlockBtn = document.getElementById('unlockBtn');
const errorMsg = document.getElementById('errorMsg');
const pinInputs = Array.from(document.querySelectorAll('.pin-box'));

pinInputs[0].focus();

pinInputs.forEach((input, index) => {
  input.addEventListener('input', (e) => {
    input.value = input.value.replace(/\D/g, '');
    if (input.value && index < pinInputs.length - 1) {
      pinInputs[index + 1].focus();
    }
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace' && !input.value && index > 0) {
      pinInputs[index - 1].focus();
    }
    if (e.key === 'Enter') validateCode();
  });
});

unlockBtn.addEventListener('click', validateCode);

function validateCode() {
  const entered = pinInputs.map(i => i.value).join('');
  if (entered === SECRET_CODE) {
    lockScreen.classList.remove('active');
    letterScreen.classList.add('active');
    initScratchCard();
  } else {
    errorMsg.classList.remove('hidden');
    pinInputs.forEach(i => i.value = '');
    pinInputs[0].focus();
  }
}

let scratchInitialized = false;
function initScratchCard() {
  if (scratchInitialized) return;
  scratchInitialized = true;

  const canvas = document.getElementById('scratchCanvas');
  const card = canvas.parentElement;
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    const rect = card.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    drawOverlay(rect.width, rect.height);
  }

  function drawOverlay(w, h) {
    ctx.globalCompositeOperation = 'source-over';
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#ffcadb');
    grad.addColorStop(1, '#f08daf');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    for (let i = 0; i < 14; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * w, Math.random() * h);
      ctx.lineTo(Math.random() * w, Math.random() * h);
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(255,255,255,0.18)';
      ctx.stroke();
    }

    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.textAlign = 'center';
    ctx.font = '700 28px Playfair Display';
    ctx.fillText('Scratch aquí ✨', w / 2, h / 2 - 8);
    ctx.font = '500 16px Inter';
    ctx.fillText('usa tu dedo o mouse', w / 2, h / 2 + 24);
  }

  let isDrawing = false;

  function scratch(x, y) {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 24, 0, Math.PI * 2);
    ctx.fill();
  }

  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const point = e.touches ? e.touches[0] : e;
    return {
      x: point.clientX - rect.left,
      y: point.clientY - rect.top,
    };
  }

  function start(e) {
    isDrawing = true;
    const { x, y } = getPos(e);
    scratch(x, y);
  }

  function move(e) {
    if (!isDrawing) return;
    e.preventDefault();
    const { x, y } = getPos(e);
    scratch(x, y);
    checkReveal();
  }

  function end() {
    isDrawing = false;
  }

  canvas.addEventListener('mousedown', start);
  canvas.addEventListener('mousemove', move);
  window.addEventListener('mouseup', end);

  canvas.addEventListener('touchstart', start, { passive: true });
  canvas.addEventListener('touchmove', move, { passive: false });
  window.addEventListener('touchend', end);

  function checkReveal() {
    const { width, height } = canvas;
    const imageData = ctx.getImageData(0, 0, width, height).data;
    let transparent = 0;
    for (let i = 3; i < imageData.length; i += 4) {
      if (imageData[i] === 0) transparent++;
    }
    const percent = transparent / (imageData.length / 4);
    if (percent > 0.55) {
      canvas.style.transition = 'opacity 400ms ease';
      canvas.style.opacity = '0';
      canvas.style.pointerEvents = 'none';
    }
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
    }
  }

const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');

if (musicToggle && bgMusic) {
  musicToggle.addEventListener('click', async () => {
    try {
      if (bgMusic.paused) {
        await bgMusic.play();
        musicToggle.textContent = '⏸️ Pausar música';
      } else {
        bgMusic.pause();
        musicToggle.textContent = '🎵 Reproducir música';
      }
    } catch (error) {
      console.error('No se pudo reproducir la música:', error);
    }
  });
}
