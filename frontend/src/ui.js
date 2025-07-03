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

// Cambia esta URL por la de tu backend en Render
const API_URL = 'https://expo-epdz.onrender.com';

async function handleFileUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  const formData = new FormData();
  formData.append('file', file);
  try {
    const res = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) throw new Error('Error al subir la foto');
    loadGallery();
  } catch (err) {
    alert('No se pudo subir la foto. Intenta de nuevo.');
  }
}

async function loadGallery() {
  try {
    const res = await fetch(`${API_URL}/gallery`);
    const data = await res.json();
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '';
    if (!data.images || data.images.length === 0) {
      gallery.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#888">No hay fotos aún.</p>';
      return;
    }
    data.images.forEach(img => {
      const el = document.createElement('img');
      el.src = `${API_URL}/uploads/${img}`;
      gallery.appendChild(el);
    });
  } catch (err) {
    document.getElementById('gallery').innerHTML = '<p style="color:red">No se pudo cargar la galería.</p>';
  }
}

async function handleDraw() {
  const password = document.getElementById('password').value;
  try {
    const res = await fetch(`${API_URL}/draw`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    const data = await res.json();
    const winnerDiv = document.getElementById('winner');
    if (data.winner) {
      winnerDiv.innerHTML = `<b>Ganador:</b><br><img src="${API_URL}/uploads/${data.winner}" style="max-width:200px; margin-top:1rem; border-radius:10px;" />`;
    } else {
      winnerDiv.textContent = data.error || 'Error en el sorteo';
    }
  } catch (err) {
    document.getElementById('winner').textContent = 'No se pudo realizar el sorteo.';
  }
}
