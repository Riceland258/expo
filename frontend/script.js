document.addEventListener('DOMContentLoaded', function() {

    // Cambia esta URL por la de tu backend en Render, por ejemplo:
    // const BACKEND_URL = 'https://tu-backend.onrender.com';
    const BACKEND_URL = '';

    const cameraBtn = document.getElementById('cameraBtn');
    const fileInput = document.getElementById('fileInput');
    const gallery = document.getElementById('gallery');
    const sorteoBtn = document.getElementById('sorteoBtn');


    // Cargar galería al iniciar
    fetch(BACKEND_URL + '/fotos')
        .then(res => res.json())
        .then(fotos => {
            fotos.forEach(addImageToGallery);
        });


    cameraBtn.addEventListener('click', () => {
        fileInput.value = '';
        fileInput.click();
    });


    fileInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const formData = new FormData();
            formData.append('foto', this.files[0]);
            fetch(BACKEND_URL + '/subir', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(data => {
                if (data.ok && data.filename) {
                    addImageToGallery(data.filename);
                }
            });
        }
    });


    function addImageToGallery(filename) {
        const img = document.createElement('img');
        img.src = BACKEND_URL + '/uploads/' + filename;
        img.alt = 'Foto';
        gallery.appendChild(img);
    }

    if (sorteoBtn) {
        sorteoBtn.addEventListener('click', function() {
            const images = gallery.querySelectorAll('img');
            images.forEach(img => img.classList.remove('selected'));
            if (images.length > 0) {
                const idx = Math.floor(Math.random() * images.length);
                images[idx].classList.add('selected');
                images[idx].scrollIntoView({behavior: 'smooth', block: 'center'});
            }
        });
    }
});
