const SECRET_CODE = '2802';

const lockScreen = document.getElementById('screen-lock');
const letterScreen = document.getElementById('screen-letter');
const unlockBtn = document.getElementById('unlockBtn');
const errorMsg = document.getElementById('errorMsg');
const pinBoxes = Array.from(document.querySelectorAll('.pin-box'));
const bgMusic = document.getElementById('bgMusic');

function getEnteredCode() {
  return pinBoxes.map(input => input.value).join('');
}

function showLetter() {
  lockScreen.classList.remove('active');
  letterScreen.classList.add('active');
  try {
    bgMusic.play().catch(() => {});
  } catch (e) {}
  initScratch();
}

function validateCode() {
  const entered = getEnteredCode();
  if (entered === SECRET_CODE) {
    errorMsg.classList.add('hidden');
    showLetter();
  } else {
    errorMsg.classList.remove('hidden');
    pinBoxes.forEach((box) => box.value = '');
    pinBoxes[0].focus();
  }
}

pinBoxes.forEach((input, index) => {
  input.addEventListener('input', () => {
    input.value = input.value.replace(/\D/g, '').slice(0, 1);
    if (input.value && index < pinBoxes.length - 1) {
      pinBoxes[index + 1].focus();
    }
    if (getEnteredCode().length === pinBoxes.length) {
      validateCode();
    }
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace' && !input.value && index > 0) {
      pinBoxes[index - 1].focus();
    }
    if (e.key === 'Enter') {
      validateCode();
    }
  });
});

unlockBtn.addEventListener('click', validateCode);

let scratchInitialized = false;
function initScratch() {
  if (scratchInitialized) return;
  scratchInitialized = true;

  const canvas = document.getElementById('scratchCanvas');
  const ctx = canvas.getContext('2d');
  const card = canvas.parentElement;

  function resizeCanvas() {
    const rect = card.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    gradient.addColorStop(0, '#4b4d57');
    gradient.addColorStop(1, '#2b2d35');
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, rect.width, rect.height);

    ctx.fillStyle = 'rgba(243, 169, 193, 0.95)';
    ctx.font = '700 24px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('Rasca aquí 💗', rect.width / 2, rect.height / 2);
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  let isDrawing = false;

  function scratch(x, y) {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 26, 0, Math.PI * 2);
    ctx.fill();
  }

  function getPosition(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  }

  function checkReveal() {
    const rect = canvas.getBoundingClientRect();
    const imageData = ctx.getImageData(0, 0, rect.width, rect.height).data;
    let transparent = 0;
    for (let i = 3; i < imageData.length; i += 4) {
      if (imageData[i] === 0) transparent++;
    }
    const percent = transparent / (imageData.length / 4);
    if (percent > 0.45) {
      canvas.style.transition = 'opacity 0.6s ease';
      canvas.style.opacity = '0';
      setTimeout(() => {
        canvas.style.display = 'none';
      }, 650);
    }
  }

  canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    const pos = getPosition(e);
    scratch(pos.x, pos.y);
  });

  canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;
    const pos = getPosition(e);
    scratch(pos.x, pos.y);
  });

  window.addEventListener('mouseup', () => {
    if (isDrawing) checkReveal();
    isDrawing = false;
  });

  canvas.addEventListener('touchstart', (e) => {
    isDrawing = true;
    const pos = getPosition(e);
    scratch(pos.x, pos.y);
  }, { passive: true });

  canvas.addEventListener('touchmove', (e) => {
    if (!isDrawing) return;
    const pos = getPosition(e);
    scratch(pos.x, pos.y);
  }, { passive: true });

  window.addEventListener('touchend', () => {
    if (isDrawing) checkReveal();
    isDrawing = false;
  });
}
