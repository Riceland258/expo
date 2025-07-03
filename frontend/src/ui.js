export function renderApp() {
  document.getElementById('app').innerHTML = `
    <h1>Sorteo de Fotos</h1>
    <div style="text-align:center">
      <button class="button" id="cameraBtn">📷 Subir Foto</button>
      <input type="file" id="fileInput" accept="image/*" capture="environment" style="display:none" />
    </div>
    <div class="gallery" id="gallery"></div>
    <div class="sorteo">
      <input type="password" id="password" placeholder="Contraseña para sorteo" />
      <button class="button" id="drawBtn">🎲 Sorteo</button>
      <div id="winner" style="margin-top:1rem;"></div>
    </div>
  `;
  attachHandlers();
}

function attachHandlers() {
  const cameraBtn = document.getElementById('cameraBtn');
  const fileInput = document.getElementById('fileInput');
  const drawBtn = document.getElementById('drawBtn');

  cameraBtn.onclick = () => fileInput.click();
  fileInput.onchange = handleFileUpload;
  drawBtn.onclick = handleDraw;

  loadGallery();
}

async function handleFileUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  const formData = new FormData();
  formData.append('file', file);
  await fetch('http://localhost:5000/upload', {
    method: 'POST',
    body: formData
  });
  loadGallery();
}

async function loadGallery() {
  const res = await fetch('http://localhost:5000/gallery');
  const data = await res.json();
  const gallery = document.getElementById('gallery');
  gallery.innerHTML = '';
  data.images.forEach(img => {
    const el = document.createElement('img');
    el.src = `http://localhost:5000/uploads/${img}`;
    gallery.appendChild(el);
  });
}

async function handleDraw() {
  const password = document.getElementById('password').value;
  const res = await fetch('http://localhost:5000/draw', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password })
  });
  const data = await res.json();
  const winnerDiv = document.getElementById('winner');
  if (data.winner) {
    winnerDiv.innerHTML = `<b>Ganador:</b><br><img src="http://localhost:5000/uploads/${data.winner}" style="max-width:200px; margin-top:1rem; border-radius:10px;" />`;
  } else {
    winnerDiv.textContent = data.error || 'Error en el sorteo';
  }
}
