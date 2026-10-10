/**
 * HorizonTechX_ImageGallery - Script
 * Pure Vanilla JavaScript implementation:
 * - Data-driven image gallery rendering
 * - Interactive particle canvas background
 * - Animated category filtering
 * - Keyboard & touch-accessible lightbox with navigation
 */

document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================================================
     1. Gallery Dataset (12 Verified Picsum Photos)
     ========================================================================== */
  const galleryData = [
    {
      id: 1,
      picId: 1015,
      category: 'nature',
      categoryLabel: 'Nature',
      title: 'Fjord from the Cliffs',
      caption: 'Blue water winds between steep, snow-dusted mountain cliffs.',
      alt: 'A deep blue fjord winding between rugged mountain cliffs.'
    },
    {
      id: 2,
      picId: 1016,
      category: 'nature',
      categoryLabel: 'Nature',
      title: 'Red Rock Canyon',
      caption: 'A sunlit red-rock landscape of layered cliffs and stone.',
      alt: 'Sunlit red rock cliffs and rugged desert stone formations.'
    },
    {
      id: 3,
      picId: 1043,
      category: 'nature',
      categoryLabel: 'Nature',
      title: 'Yosemite Valley Falls',
      caption: 'A waterfall drops through a forested granite valley.',
      alt: 'Waterfall and evergreen trees beneath tall granite cliffs.'
    },
    {
      id: 4,
      picId: 1026,
      category: 'city',
      categoryLabel: 'City',
      title: 'City Rail Lines at Sunset',
      caption: 'Parallel railway tracks lead toward a glowing urban sunset.',
      alt: 'Multiple railway tracks running toward a city skyline at sunset.'
    },
    {
      id: 5,
      picId: 1029,
      category: 'city',
      categoryLabel: 'City',
      title: 'Skyline Above the Park',
      caption: 'Downtown towers rise over a broad green city park.',
      alt: 'High-rise city skyline overlooking a large green park.'
    },
    {
      id: 6,
      picId: 1047,
      category: 'city',
      categoryLabel: 'City',
      title: 'Old City Lane',
      caption: 'A narrow brick-lined lane opens onto a busy city street.',
      alt: 'Narrow urban alley between brick and stone buildings.'
    },
    {
      id: 7,
      picId: 1031,
      category: 'architecture',
      categoryLabel: 'Architecture',
      title: 'Glass Facade',
      caption: 'A clean upward view of a modern geometric building facade.',
      alt: 'Looking upward along a tall modern glass-and-metal facade.'
    },
    {
      id: 8,
      picId: 1048,
      category: 'architecture',
      categoryLabel: 'Architecture',
      title: 'Framed by Towers',
      caption: 'Tall office buildings form a geometric frame around the sky.',
      alt: 'Upward view of modern skyscrapers surrounding a bright patch of sky.'
    },
    {
      id: 9,
      picId: 1076,
      category: 'architecture',
      categoryLabel: 'Architecture',
      title: 'Angular High-Rise',
      caption: "A sharply angled view emphasizes a tower's repeating facade.",
      alt: 'Low-angle view of a tall angular building facade.'
    },
    {
      id: 10,
      picId: 1003,
      category: 'animals',
      categoryLabel: 'Animals',
      title: 'Young Deer in the Woods',
      caption: 'A young deer stands among softly lit woodland trees.',
      alt: 'Young deer standing in a softly lit forest.'
    },
    {
      id: 11,
      picId: 1024,
      category: 'animals',
      categoryLabel: 'Animals',
      title: 'Eagle in Flight',
      caption: 'An eagle glides with its wings spread against the sky.',
      alt: 'Eagle flying with wings fully outstretched.'
    },
    {
      id: 12,
      picId: 1062,
      category: 'animals',
      categoryLabel: 'Animals',
      title: 'Dog at Rest',
      caption: 'A small dog rests on a bed under a soft blanket.',
      alt: 'Small dog resting on a bed beneath a blanket.'
    }
  ];

  // Helper URLs for Picsum Photos
  const getThumbnailUrl = (picId) => `https://picsum.photos/id/${picId}/800/600`;
  const getLightboxUrl = (picId) => `https://picsum.photos/id/${picId}/1600/1000`;

  /* ==========================================================================
     2. DOM Element References
     ========================================================================== */
  const gridContainer = document.getElementById('gallery-grid');
  const filterButtons = document.querySelectorAll('.filter-btn');

  // Lightbox elements
  const lightbox = document.getElementById('lightbox');
  const lightboxBackdrop = document.getElementById('lightbox-backdrop');
  const lightboxCloseBtn = document.getElementById('lightbox-close');
  const lightboxPrevBtn = document.getElementById('lightbox-prev');
  const lightboxNextBtn = document.getElementById('lightbox-next');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxLoader = document.getElementById('lightbox-loader');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const lightboxCategory = document.getElementById('lightbox-category');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxCaption = document.getElementById('lightbox-caption');

  // State
  let currentFilter = 'all';
  let activeItems = [...galleryData]; // Current active items matching the filter
  let activeIndex = 0; // Index in activeItems
  let lastFocusedElement = null;

  /* ==========================================================================
     3. Render Gallery Grid
     ========================================================================== */
  function renderGallery() {
    gridContainer.innerHTML = '';

    galleryData.forEach((item, index) => {
      // Create card container
      const card = document.createElement('article');
      card.className = 'gallery-card';
      card.dataset.category = item.category;
      card.dataset.id = item.id;
      card.tabIndex = 0;
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `Open ${item.title} in expanded view`);

      card.innerHTML = `
        <div class="card-media">
          <img
            class="card-img"
            src="${getThumbnailUrl(item.picId)}"
            alt="${item.alt || item.title}"
            loading="lazy"
            width="800"
            height="600"
          />
          <div class="card-overlay" aria-hidden="true">
            <div class="overlay-top">
              <span class="card-category-tag">${item.categoryLabel}</span>
              <div class="card-zoom-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  <line x1="11" y1="8" x2="11" y2="14"></line>
                  <line x1="8" y1="11" x2="14" y2="11"></line>
                </svg>
              </div>
            </div>
            <div class="overlay-bottom">
              <h3 class="card-title">${item.title}</h3>
              <p class="card-caption-preview">${item.caption}</p>
            </div>
          </div>
        </div>
      `;

      // Click and Enter/Space keyboard events to trigger lightbox
      card.addEventListener('click', () => {
        openLightboxForItem(item.id);
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightboxForItem(item.id);
        }
      });

      gridContainer.appendChild(card);
    });
  }

  /* ==========================================================================
     4. Category Filter Logic
     ========================================================================== */
  function applyFilter(category) {
    currentFilter = category;

    // Update active button state and ARIA
    filterButtons.forEach(btn => {
      const match = btn.dataset.category === category;
      btn.classList.toggle('active', match);
      btn.setAttribute('aria-pressed', match ? 'true' : 'false');
    });

    const cards = gridContainer.querySelectorAll('.gallery-card');

    cards.forEach(card => {
      const cardCategory = card.dataset.category;
      const shouldShow = (category === 'all' || cardCategory === category);

      if (shouldShow) {
        card.classList.remove('is-filtered-out');
        card.removeAttribute('aria-hidden');
        card.tabIndex = 0;
      } else {
        card.classList.add('is-filtered-out');
        card.setAttribute('aria-hidden', 'true');
        card.tabIndex = -1;
      }
    });

    // Update active items list for lightbox navigation
    if (category === 'all') {
      activeItems = [...galleryData];
    } else {
      activeItems = galleryData.filter(item => item.category === category);
    }
  }

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const selected = btn.dataset.category;
      applyFilter(selected);
    });
  });

  /* ==========================================================================
     5. Lightbox Modal Controls
     ========================================================================== */
  function openLightboxForItem(itemId) {
    lastFocusedElement = document.activeElement;

    // Find the item within the currently active (filtered) items
    let index = activeItems.findIndex(i => i.id === itemId);
    
    // If user clicked an item not in current filter (fallback), reset to all
    if (index === -1) {
      applyFilter('all');
      index = galleryData.findIndex(i => i.id === itemId);
    }

    activeIndex = index !== -1 ? index : 0;
    updateLightboxContent();

    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling

    // Focus close button for accessibility
    setTimeout(() => {
      lightboxCloseBtn.focus();
    }, 100);
  }

  function closeLightbox() {
    if (!lightbox.classList.contains('is-open')) return;

    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // Restore scrolling

    // Restore focus back to the triggering element
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }
  }

  function showNextImage() {
    if (activeItems.length <= 1) return;
    activeIndex = (activeIndex + 1) % activeItems.length;
    updateLightboxContent();
  }

  function showPrevImage() {
    if (activeItems.length <= 1) return;
    activeIndex = (activeIndex - 1 + activeItems.length) % activeItems.length;
    updateLightboxContent();
  }

  function updateLightboxContent() {
    const currentItem = activeItems[activeIndex];
    if (!currentItem) return;

    // Display loader & transition state
    lightboxLoader.classList.remove('is-hidden');
    lightboxImg.classList.add('is-transitioning');

    // Update text details
    lightboxCounter.textContent = `${activeIndex + 1} / ${activeItems.length}`;
    lightboxCategory.textContent = currentItem.categoryLabel;
    lightboxTitle.textContent = currentItem.title;
    lightboxCaption.textContent = currentItem.caption;

    // Load full resolution photo
    const highResUrl = getLightboxUrl(currentItem.picId);

    // Preload image object to avoid flicker
    const imgLoader = new Image();
    imgLoader.src = highResUrl;

    imgLoader.onload = () => {
      lightboxImg.src = highResUrl;
      lightboxImg.alt = currentItem.alt || `${currentItem.title} - Full resolution view`;
      lightboxLoader.classList.add('is-hidden');
      lightboxImg.classList.remove('is-transitioning');
    };

    imgLoader.onerror = () => {
      // Fallback to thumbnail URL if high-res fails
      lightboxImg.src = getThumbnailUrl(currentItem.picId);
      lightboxImg.alt = currentItem.alt || `${currentItem.title} - Thumbnail view`;
      lightboxLoader.classList.add('is-hidden');
      lightboxImg.classList.remove('is-transitioning');
    };
  }

  // Lightbox Click Listeners
  lightboxCloseBtn.addEventListener('click', closeLightbox);
  lightboxBackdrop.addEventListener('click', closeLightbox);
  lightboxNextBtn.addEventListener('click', showNextImage);
  lightboxPrevBtn.addEventListener('click', showPrevImage);

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;

    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowRight') {
      showNextImage();
    } else if (e.key === 'ArrowLeft') {
      showPrevImage();
    } else if (e.key === 'Tab') {
      // Focus trap within lightbox
      const focusableEls = lightbox.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstEl = focusableEls[0];
      const lastEl = focusableEls[focusableEls.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        }
      } else {
        if (document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    }
  });

  /* Touch Swipe Navigation for Mobile Lightbox */
  let touchStartX = 0;
  let touchEndX = 0;
  const minSwipeDistance = 50;

  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipeGesture();
  }, { passive: true });

  function handleSwipeGesture() {
    const swipeDistance = touchEndX - touchStartX;
    if (Math.abs(swipeDistance) >= minSwipeDistance) {
      if (swipeDistance < 0) {
        // Swiped Left -> Next
        showNextImage();
      } else {
        // Swiped Right -> Previous
        showPrevImage();
      }
    }
  }

  /* ==========================================================================
     6. Animated Particle Background Canvas
     ========================================================================== */
  function initParticleCanvas() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Respect user's motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) {
      canvas.style.display = 'none';
      return;
    }

    let width = 0;
    let height = 0;
    let particles = [];
    let animationFrameId = null;
    let isRunning = true;

    // Mouse proximity tracking
    const mouse = {
      x: null,
      y: null,
      radius: 120
    };

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    // Particle constructor
    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 1.8 + 1.2;
        this.baseX = this.x;
        this.baseY = this.y;
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;
        this.density = Math.random() * 20 + 10;
        this.alpha = Math.random() * 0.45 + 0.25;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = `rgba(129, 140, 248, ${this.alpha})`;
        ctx.fill();
      }

      update() {
        // Subtle Mouse Interaction
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.hypot(dx, dy);

          if (distance < mouse.radius) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const maxDistance = mouse.radius;
            const force = (maxDistance - distance) / maxDistance;
            const directionX = forceDirectionX * force * 1.2;
            const directionY = forceDirectionY * force * 1.2;

            this.x -= directionX;
            this.y -= directionY;
          }
        }

        // Standard gentle drift
        this.x += this.vx;
        this.y += this.vy;

        // Wrap around screen borders
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
      }
    }

    function setupCanvasSize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;

      // Adjust particle count: fewer on mobile screens
      const isMobile = width < 768;
      const targetCount = isMobile ? 38 : 75;

      particles = [];
      for (let i = 0; i < targetCount; i++) {
        particles.push(new Particle());
      }
    }

    function connectParticles() {
      const maxDistance = 115;
      const len = particles.length;

      for (let a = 0; a < len; a++) {
        for (let b = a + 1; b < len; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distance = Math.hypot(dx, dy);

          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * 0.18;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
            ctx.lineWidth = 0.85;
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      if (!isRunning) return;

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }

      connectParticles();
      animationFrameId = requestAnimationFrame(animate);
    }

    // Debounced resize handler
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setupCanvasSize();
      }, 150);
    });

    // Pause animation when the browser tab is hidden to save battery & CPU
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        isRunning = false;
        cancelAnimationFrame(animationFrameId);
      } else {
        if (!isRunning) {
          isRunning = true;
          animate();
        }
      }
    });

    setupCanvasSize();
    animate();
  }

  /* ==========================================================================
     7. Initialization
     ========================================================================== */
  renderGallery();
  initParticleCanvas();
});
