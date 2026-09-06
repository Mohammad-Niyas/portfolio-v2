/**
 * Mohammad Niyas — Portfolio Interactive Runtime
 * Zero-dependency, locked 60fps performance using native Web APIs.
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initScrollReveal();
  initNavDockScrollspy();
  initCardTilt();
  initTypewriter();
});

/**
 * 1. Scroll Progress Indicator Bar
 */
function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;

  function updateProgress() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = `${progress}%`;
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}

/**
 * 2. Staggered Scroll-Reveal Engine (IntersectionObserver)
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (!revealElements.length) return;

  // If user prefers reduced motion, reveal instantly
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealElements.forEach(el => el.classList.add('is-revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.12
  });

  revealElements.forEach(el => {
    if (el.dataset.delay) {
      el.style.transitionDelay = `${el.dataset.delay}ms`;
    }
    observer.observe(el);
  });
}

/**
 * 3. Floating Nav Dock Scrollspy
 */
function initNavDockScrollspy() {
  const sections = document.querySelectorAll('section[id], div#home');
  const navItems = document.querySelectorAll('.nav-dock-item');
  if (!sections.length || !navItems.length) return;

  const sectionMap = {};
  navItems.forEach(item => {
    const href = item.getAttribute('href');
    if (href && href.startsWith('#')) {
      const id = href.substring(1);
      sectionMap[id] = item;
    }
  });

  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navItems.forEach(item => item.classList.remove('active'));
        if (sectionMap[id]) {
          sectionMap[id].classList.add('active');
        }
      }
    });
  }, {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  });

  sections.forEach(section => spyObserver.observe(section));
}

/**
 * 4. Interactive 3D Tilt for Flagship Project Cards
 */
function initCardTilt() {
  // Only enable on desktop with mouse pointers
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const tiltCards = document.querySelectorAll('.tilt-card');
  tiltCards.forEach(card => {
    let ticking = false;

    function handleMouseMove(e) {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Subtle, smooth tilt (max 4.5 degrees)
        const rotateX = ((y - centerY) / centerY) * -4.5;
        const rotateY = ((x - centerX) / centerX) * 4.5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
        ticking = false;
      });
    }

    function handleMouseLeave() {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      card.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease, box-shadow 0.3s ease';
    }

    function handleMouseEnter() {
      card.style.transition = 'transform 0.1s ease-out, border-color 0.3s ease, box-shadow 0.3s ease';
    }

    card.addEventListener('mousemove', handleMouseMove, { passive: true });
    card.addEventListener('mouseleave', handleMouseLeave);
    card.addEventListener('mouseenter', handleMouseEnter);
  });
}

/**
 * 5. Typewriter State Machine for Hero
 */
function initTypewriter() {
  const phrases = ["Backend Engineer", "Golang Developer"];
  let phraseIndex = 0;
  let charIndex = phrases[0].length;
  let isDeleting = true;
  const typeSpeed = 90;
  const deleteSpeed = 45;
  const holdDuration = 2200;

  const textEl = document.getElementById("typewriter-text");
  if (!textEl) return;

  function typeLoop() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      textEl.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
    } else {
      textEl.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      isDeleting = true;
      setTimeout(typeLoop, holdDuration);
      return;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      setTimeout(typeLoop, 400);
      return;
    }

    const nextDelay = isDeleting ? deleteSpeed : typeSpeed;
    setTimeout(typeLoop, nextDelay);
  }

  setTimeout(typeLoop, holdDuration);
}
