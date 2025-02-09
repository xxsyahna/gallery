const galleryItems = document.querySelectorAll('.gallery-item');
const modal = document.querySelector('.modal');
const modalImage = document.getElementById('modal-image');
const caption = document.querySelector('.caption');
const closeBtn = document.querySelector('.close');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const downloadBtn = document.getElementById('download-btn');
const fullscreenBtn = document.getElementById('fullscreen-btn');
const themeToggle = document.getElementById('theme-toggle');
const searchBar = document.getElementById('search-bar');
const filterCategory = document.getElementById('filter-category');
const music = document.getElementById('background-music');
const musicToggle = document.getElementById('music-toggle');
const clickSound = document.getElementById('click-sound');

let currentImageIndex = 0;
let images = Array.from(galleryItems);
let isMusicPlaying = false;
let isSlideshowRunning = false;
let slideshowInterval;

galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
    clickSound.play();
    openModal(index);
    });
});

// Fungsi untuk membuka modal
function openModal(index) {
    modal.classList.add('show');
    modal.style.display = 'flex';
    updateModalImage(index);
    startSlideshow();
}

// Fungsi untuk memperbarui gambar di modal
function updateModalImage(index) {
    currentImageIndex = index;
    modalImage.style.opacity = 0;
    setTimeout(() => {
    modalImage.src = images[index].src;
    caption.textContent = images[index].alt;
    modalImage.style.opacity = 1;
    }, 300);
}

// Navigasi dengan tombol prev/next
prevBtn.addEventListener('click', () => {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    updateModalImage(currentImageIndex);
});

nextBtn.addEventListener('click', () => {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    updateModalImage(currentImageIndex);
});

// Tutup modal saat klik tombol close atau di luar modal
closeBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

function closeModal() {
    modal.classList.remove('show');
    setTimeout(() => {
    modal.style.display = 'none';
    }, 300);
    stopSlideshow();
}

// Slideshow Otomatis
function startSlideshow() {
    if (!isSlideshowRunning) {
    isSlideshowRunning = true;
    slideshowInterval = setInterval(() => {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    updateModalImage(currentImageIndex);
    }, 3000);
    }
}

function stopSlideshow() {
    isSlideshowRunning = false;
    clearInterval(slideshowInterval);
}

// Download Gambar
downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.href = modalImage.src;
    link.download = `gallery-image-${currentImageIndex + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

// Fullscreen Mode
fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
    modal.requestFullscreen().catch(err => console.log(err));
    } else {
    document.exitFullscreen();
    }
});

// Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
    if (modal.style.display === 'flex') {
    if (e.key === 'ArrowLeft') prevBtn.click();
    if (e.key === 'ArrowRight') nextBtn.click();
    if (e.key === 'Escape') closeModal();
    }
});

// Lazy Loading untuk gambar
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
    if (entry.isIntersecting) {
    entry.target.classList.add('visible');
    }
});
}, { threshold: 0.3 });

galleryItems.forEach(item => observer.observe(item));

// Dark Mode
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');

    if (document.body.classList.contains('dark-mode')) {
        themeToggle.innerText = "☀ Light Mode";
        localStorage.setItem('theme', 'dark'); 
    } else {
        themeToggle.innerText = "🌙 Dark Mode";
        localStorage.setItem('theme', 'light'); 
    }
});

// Kontrol Musik
musicToggle.addEventListener('click', () => {
if (music.paused) {
    music.play();
    musicToggle.innerText = '🔇 Pause Music';
} else {
    music.pause();
    musicToggle.innerText = '🔊 Play Music';
}
});

// Play Musik Saat Halaman Dimuat
window.addEventListener('load', () => {
document.addEventListener('click', () => {
    if (music.paused) {
    music.play().catch(() => console.log("Autoplay dicegah oleh browser"));
    musicToggle.innerText = '🔇 Pause Music';
    }
}, { once: true });
});
