// Year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Mobile nav toggle
const toggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
toggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close nav on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// Project filter
const filterBtns = document.querySelectorAll('.filter-btn');
const cards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    cards.forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// Smooth scroll offset for fixed nav
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 70;
    window.scrollTo({
      top: target.offsetTop - offset,
      behavior: 'smooth'
    });
  });
});

// Fade-in on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.project-card, .skill-group').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
  observer.observe(el);
});

// =========================================
// LIGHTBOX
// =========================================
const lightbox  = document.getElementById('lightbox');
const lbImg     = document.getElementById('lb-img');
const lbCounter = document.getElementById('lb-counter');
const lbClose   = document.getElementById('lb-close');
const lbPrev    = document.getElementById('lb-prev');
const lbNext    = document.getElementById('lb-next');

let gallery = [];   // current set of image paths
let current = 0;    // current index

function openLightbox(images, startIndex) {
  gallery = images;
  current = startIndex;
  showSlide(current);
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
  lbClose.focus();
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

function showSlide(index) {
  lbImg.src = gallery[index];
  lbImg.alt = 'Project screenshot ' + (index + 1);
  lbCounter.textContent = (index + 1) + ' / ' + gallery.length;

  // Hide nav arrows when there's only one image
  lbPrev.style.display = gallery.length > 1 ? 'flex' : 'none';
  lbNext.style.display = gallery.length > 1 ? 'flex' : 'none';
}

function prevSlide() {
  current = (current - 1 + gallery.length) % gallery.length;
  showSlide(current);
}

function nextSlide() {
  current = (current + 1) % gallery.length;
  showSlide(current);
}

// Wire up card thumbnails
document.querySelectorAll('.card-thumb[data-gallery]').forEach(thumb => {
  const openAt = (startIndex) => {
    const paths = thumb.dataset.gallery.split(',').map(p => p.trim());
    openLightbox(paths, startIndex);
  };

  // Click the thumbnail itself → open at first image
  thumb.addEventListener('click', () => openAt(0));

  // Keyboard: Enter or Space
  thumb.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openAt(0);
    }
  });
});

// Controls
lbClose.addEventListener('click', closeLightbox);
lbPrev.addEventListener('click', prevSlide);
lbNext.addEventListener('click', nextSlide);

// Click backdrop to close
lightbox.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});

// Keyboard navigation
document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape')      closeLightbox();
  if (e.key === 'ArrowLeft')   prevSlide();
  if (e.key === 'ArrowRight')  nextSlide();
});

// Touch / swipe support
let touchStartX = 0;
lightbox.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].clientX;
}, { passive: true });

lightbox.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) < 40) return;   // not a real swipe
  if (dx < 0) nextSlide();
  else         prevSlide();
}, { passive: true });
