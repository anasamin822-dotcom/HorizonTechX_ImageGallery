/**
 * HorizonTechX_ImageGallery - Script
 * Pure Vanilla JavaScript implementation:
 * - Data-driven image gallery rendering
 * - Interactive particle canvas background
 * - Animated sliding category filter bar with staggered transitions
 * - Keyboard & touch-accessible lightbox with progress dots and external link
 * - Header shrink on scroll
 * - Blur-up image loading skeletons
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

  // Picsum helper URLs
  const getThumbnailUrl = (picId) => `https://picsum.photos/id/${picId}/800/600`;
  const getLightboxUrl = (picId) => `https://picsum.photos/id/${picId}/1600/1000`;

  /* ==========================================================================
     2. DOM Element References
     ========================================================================== */
  const header = document.getElementById('site-header');
  const gridContainer = document.getElementById('gallery-grid');
  const filterBar = document.getElementById('filter-bar');
  const filterIndicator = document.getElementById('filter-indicator');
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
  const lightboxDots = document.getElementById('lightbox-dots');
  const lightboxExternalLink = document.getElementById('lightbox-external-link');
  const lightboxCategory = document.getElementById('lightbox-category');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxCaption = document.getElementById('lightbox-caption');

  // State
  let currentFilter = 'all';
  let activeItems = [...galleryData];
  let activeIndex = 0;
  let lastFocusedElement = null;
  let isFiltering = false;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ==========================================================================
     3. Header Scroll Shrink
     ========================================================================== */
  function initHeaderScroll() {
    if (!header) return;
    const handleScroll = () => {
      if (window.scrollY > 20) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  /* ==========================================================================
     4. Render Gallery Grid
     ========================================================================== */
  function renderGallery() {
    gridContainer.innerHTML = '';

    galleryData.forEach((item, index) => {
      const card = document.createElement('article');
      card.className = 'gallery-card';
      card.dataset.category = item.category;
      card.dataset.id = item.id;
      card.tabIndex = 0;
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `Open ${item.title} in expanded view`);

      card.innerHTML = `
        <div class="card-media is-loading">
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
              <span class="card-touch-badge">${item.categoryLabel}</span>
              <h3 class="card-title">${item.title}</h3>
              <p class="card-caption-preview">${item.caption}</p>
            </div>
          </div>
        </div>
      `;

      // Image Load state handling for skeleton blur-up
      const img = card.querySelector('.card-img');
      const media = card.querySelector('.card-media');

      const onImageLoaded = () => {
        img.classList.add('is-loaded');
        media.classList.remove('is-loading');
      };

      if (img.complete) {
        onImageLoaded();
      } else {
        img.addEventListener('load', onImageLoaded);
        img.addEventListener('error', onImageLoaded);
      }

      // 3D Card Hover Tilt (Desktop Only)
      if (!prefersReducedMotion && window.matchMedia('(hover: hover)').matches) {
        setupCardTilt(card);
      }

      // Card Click and Keyboard Open
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

  /* 3D Tilt Helper */
  function setupCardTilt(card) {
    let bounds;
    function updateBounds() {
      bounds = card.getBoundingClientRect();
    }

    card.addEventListener('mouseenter', updateBounds);

    card.addEventListener('mousemove', (e) => {
      if (!bounds) updateBounds();
      const mouseX = e.clientX - bounds.left;
      const mouseY = e.clientY - bounds.top;
      const xPct = mouseX / bounds.width;
      const yPct = mouseY / bounds.height;

      const tiltX = (yPct - 0.5) * -10;
      const tiltY = (xPct - 0.5) * 10;

      card.style.setProperty('--tilt-x', `${tiltX.toFixed(2)}deg`);
      card.style.setProperty('--tilt-y', `${tiltY.toFixed(2)}deg`);
      card.style.setProperty('--tilt-glow-x', `${(xPct * 100).toFixed(1)}%`);
      card.style.setProperty('--tilt-glow-y', `${(yPct * 100).toFixed(1)}%`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--tilt-x', '0deg');
      card.style.setProperty('--tilt-y', '0deg');
    });
  }

  /* ==========================================================================
     5. Category Filter & Sliding Indicator
     ========================================================================== */
  function updateSlidingIndicator(activeBtn) {
    if (!filterIndicator || !activeBtn) return;
    filterIndicator.style.transform = `translateX(${activeBtn.offsetLeft}px)`;
    filterIndicator.style.width = `${activeBtn.offsetWidth}px`;
    filterIndicator.classList.add('is-ready');
    if (filterBar) filterBar.classList.add('has-indicator');
  }

  function applyFilter(category, clickedBtn) {
    if (isFiltering) return;
    currentFilter = category;

    // Update buttons
    filterButtons.forEach(btn => {
      const match = btn.dataset.category === category;
      btn.classList.toggle('active', match);
      btn.setAttribute('aria-pressed', match ? 'true' : 'false');
    });

    const activeBtn = clickedBtn || document.querySelector(`.filter-btn[data-category="${category}"]`);
    updateSlidingIndicator(activeBtn);

    // Pulse active badge count
    if (activeBtn) {
      const countEl = activeBtn.querySelector('.filter-count');
      if (countEl) {
        countEl.classList.remove('pulse');
        void countEl.offsetWidth; // trigger reflow
        countEl.classList.add('pulse');
      }
    }

    // Update active items for lightbox
    if (category === 'all') {
      activeItems = [...galleryData];
    } else {
      activeItems = galleryData.filter(item => item.category === category);
    }

    const cards = Array.from(gridContainer.querySelectorAll('.gallery-card'));

    if (prefersReducedMotion) {
      cards.forEach(card => {
        const matches = (category === 'all' || card.dataset.category === category);
        if (matches) {
          card.classList.remove('is-filtered-out');
          card.removeAttribute('aria-hidden');
          card.tabIndex = 0;
        } else {
          card.classList.add('is-filtered-out');
          card.setAttribute('aria-hidden', 'true');
          card.tabIndex = -1;
        }
      });
      return;
    }

    // Smooth staggered fade-out and fade-in
    isFiltering = true;
    cards.forEach(card => {
      card.classList.add('is-animating-out');
      card.classList.remove('is-animating-in');
    });

    setTimeout(() => {
      let matchIndex = 0;
      cards.forEach(card => {
        const matches = (category === 'all' || card.dataset.category === category);
        if (matches) {
          card.classList.remove('is-filtered-out');
          card.removeAttribute('aria-hidden');
          card.tabIndex = 0;

          // Staggered reveal
          setTimeout(() => {
            card.classList.remove('is-animating-out');
            card.classList.add('is-animating-in');
          }, matchIndex * 40);
          matchIndex++;
        } else {
          card.classList.add('is-filtered-out');
          card.setAttribute('aria-hidden', 'true');
          card.tabIndex = -1;
        }
      });

      setTimeout(() => {
        isFiltering = false;
      }, matchIndex * 40 + 200);
    }, 220);
  }

  // Filter button listeners
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const selected = btn.dataset.category;
      applyFilter(selected, btn);
    });
  });

  // Re-position filter pill on resize & font load
  window.addEventListener('resize', () => {
    const activeBtn = document.querySelector('.filter-btn.active');
    updateSlidingIndicator(activeBtn);
  });

  if (document.fonts) {
    document.fonts.ready.then(() => {
      const activeBtn = document.querySelector('.filter-btn.active');
      updateSlidingIndicator(activeBtn);
    });
  }

  /* ==========================================================================
     6. Lightbox Modal Controls & Navigation
     ========================================================================== */
  function renderLightboxDots() {
    if (!lightboxDots) return;
    lightboxDots.innerHTML = '';

    activeItems.forEach((item, idx) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = `lightbox-dot-btn ${idx === activeIndex ? 'active' : ''}`;
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Go to photo ${idx + 1}: ${item.title}`);
      dot.setAttribute('aria-selected', idx === activeIndex ? 'true' : 'false');

      dot.addEventListener('click', () => {
        if (activeIndex !== idx) {
          activeIndex = idx;
          updateLightboxContent();
        }
      });

      lightboxDots.appendChild(dot);
    });
  }

  function syncLightboxDots() {
    if (!lightboxDots) return;
    const dots = lightboxDots.querySelectorAll('.lightbox-dot-btn');
    dots.forEach((dot, idx) => {
      const isSelected = idx === activeIndex;
      dot.classList.toggle('active', isSelected);
      dot.setAttribute('aria-selected', isSelected ? 'true' : 'false');
    });

    const activeDot = dots[activeIndex];
    if (activeDot && typeof activeDot.scrollIntoView === 'function') {
      activeDot.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }

  function openLightboxForItem(itemId) {
    lastFocusedElement = document.activeElement;

    let index = activeItems.findIndex(i => i.id === itemId);
    if (index === -1) {
      applyFilter('all');
      index = galleryData.findIndex(i => i.id === itemId);
    }

    activeIndex = index !== -1 ? index : 0;
    renderLightboxDots();
    updateLightboxContent();

    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
      lightboxCloseBtn.focus();
    }, 100);
  }

  function closeLightbox() {
    if (!lightbox.classList.contains('is-open')) return;

    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

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

    // Cross-fade state
    lightboxLoader.classList.remove('is-hidden');
    lightboxImg.classList.add('is-transitioning');

    // Update texts and counter
    lightboxCounter.textContent = `${activeIndex + 1} / ${activeItems.length}`;
    lightboxCategory.textContent = currentItem.categoryLabel;
    lightboxTitle.textContent = currentItem.title;
    lightboxCaption.textContent = currentItem.caption;

    // Update View Full Image link
    const highResUrl = getLightboxUrl(currentItem.picId);
    if (lightboxExternalLink) {
      lightboxExternalLink.href = highResUrl;
    }

    // Sync dots progress bar
    syncLightboxDots();

    // Preload image
    const imgLoader = new Image();
    imgLoader.src = highResUrl;

    imgLoader.onload = () => {
      lightboxImg.src = highResUrl;
      lightboxImg.alt = currentItem.alt || `${currentItem.title} - Full resolution view`;
      lightboxLoader.classList.add('is-hidden');
      lightboxImg.classList.remove('is-transitioning');
    };

    imgLoader.onerror = () => {
      lightboxImg.src = getThumbnailUrl(currentItem.picId);
      lightboxImg.alt = currentItem.alt || `${currentItem.title} - Thumbnail view`;
      lightboxLoader.classList.add('is-hidden');
      lightboxImg.classList.remove('is-transitioning');
    };
  }

  // Lightbox click listeners
  lightboxCloseBtn.addEventListener('click', closeLightbox);
  lightboxBackdrop.addEventListener('click', closeLightbox);
  lightboxNextBtn.addEventListener('click', showNextImage);
  lightboxPrevBtn.addEventListener('click', showPrevImage);

  // Keyboard navigation & Focus trap
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;

    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowRight') {
      showNextImage();
    } else if (e.key === 'ArrowLeft') {
      showPrevImage();
    } else if (e.key === 'Tab') {
      const focusableEls = lightbox.querySelectorAll(
        'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableEls.length === 0) return;
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
  const minSwipeDistance = 45;

  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const swipeDistance = touchEndX - touchStartX;
    if (Math.abs(swipeDistance) >= minSwipeDistance) {
      if (swipeDistance < 0) {
        showNextImage();
      } else {
        showPrevImage();
      }
    }
  }, { passive: true });

  /* ==========================================================================
     7. Animated Particle Canvas Background
     ========================================================================== */
  function initParticleCanvas() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (prefersReducedMotion) {
      canvas.style.display = 'none';
      return;
    }

    let width = 0;
    let height = 0;
    let particles = [];
    let animationFrameId = null;
    let isRunning = true;

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

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 1.8 + 1.2;
        this.baseX = this.x;
        this.baseY = this.y;
        this.vx = (Math.random() - 0.5) * 0.42;
        this.vy = (Math.random() - 0.5) * 0.42;
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
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.hypot(dx, dy);

          if (distance < mouse.radius) {
            const force = (mouse.radius - distance) / mouse.radius;
            const directionX = (dx / distance) * force * 1.2;
            const directionY = (dy / distance) * force * 1.2;

            this.x -= directionX;
            this.y -= directionY;
          }
        }

        this.x += this.vx;
        this.y += this.vy;

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

      const isMobile = width < 768;
      const targetCount = isMobile ? 36 : 70;

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

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setupCanvasSize();
      }, 150);
    });

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
     8. App Initialization
     ========================================================================== */
  renderGallery();
  initHeaderScroll();
  initParticleCanvas();

  // Position initial sliding pill
  const initialActiveBtn = document.querySelector('.filter-btn.active');
  if (initialActiveBtn) {
    updateSlidingIndicator(initialActiveBtn);
  }
});
