document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();
  AOS.init({ duration: 1000, once: true, offset: 100 });

  // ===== PRELOADER =====
  const preloader = document.querySelector('.preloader');
  if (preloader) {
    let hidden = false;
    const hide = () => {
      if (!hidden) {
        hidden = true;
        preloader.classList.add('hide');
        setTimeout(() => { preloader.style.display = 'none'; }, 800);
      }
    };
    setTimeout(hide, 1500);
    window.addEventListener('load', hide);
  }

  // ===== THEME =====
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon   = document.getElementById('themeIcon');
  const html        = document.documentElement;

  function updateThemeIcon(theme) {
    if (themeIcon) {
      themeIcon.setAttribute('data-lucide', theme === 'dark' ? 'sun' : 'moon');
      lucide.createIcons();
    }
  }

  const currentTheme = localStorage.getItem('theme') || 'dark';
  html.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const theme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
      updateThemeIcon(theme);
    });
  }

  // ===== SMOOTH SCROLL =====
  function smoothScrollTo(targetId) {
    if (!targetId || targetId === '#') return;
    const el = document.querySelector(targetId);
    if (!el) return;
    const nav  = document.querySelector('.nav-container');
    const navH = nav ? nav.offsetHeight : 80;
    const top  = el.getBoundingClientRect().top + window.pageYOffset - navH - 15;
    window.scrollTo({ top: top, behavior: 'smooth' });
    if (targetId === '#contact') {
      setTimeout(() => {
        const nameField = document.getElementById('name');
        if (nameField) nameField.focus();
      }, 700);
    }
  }

  // ===== UNIFIED CLICK HANDLER =====
  document.addEventListener('click', function (e) {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;
    if (anchor.id === 'downloadCV') return;
    const href = anchor.getAttribute('href');
    if (!href || href === '#') return;
    e.preventDefault();
    smoothScrollTo(href);
  });

  // ===== MOBILE MENU =====
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const mobileMenu       = document.getElementById('mobileMenu');
  const mobileMenuClose  = document.getElementById('mobileMenuClose');

  if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener('click', () => {
      mobileMenuToggle.classList.toggle('active');
      mobileMenu.classList.toggle('active');
    });
    if (mobileMenuClose) {
      mobileMenuClose.addEventListener('click', () => {
        mobileMenuToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
      });
    }
    mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        mobileMenuToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        const targetId = link.getAttribute('href');
        setTimeout(() => { smoothScrollTo(targetId); }, 400);
      });
    });
  }

  // ===== CURSOR =====
  const cursor        = document.querySelector('.cursor');
  const cursorOutline = document.querySelector('.cursor-outline');
  if (cursor && cursorOutline) {
    let mX = 0, mY = 0, cX = 0, cY = 0, oX = 0, oY = 0;
    document.addEventListener('mousemove', (e) => { mX = e.clientX; mY = e.clientY; });
    function animCursor() {
      cX += (mX - cX) * 0.25; cY += (mY - cY) * 0.25;
      cursor.style.left = cX + 'px'; cursor.style.top = cY + 'px';
      oX += (mX - oX) * 0.12; oY += (mY - oY) * 0.12;
      cursorOutline.style.left = oX + 'px'; cursorOutline.style.top = oY + 'px';
      requestAnimationFrame(animCursor);
    }
    animCursor();
  }

  // ===== GLOW EFFECT on cards =====
  document.querySelectorAll(
    '.service-card,.skill-card,.stat-item,.project-card,.contact-card,.team-card,.pricing-card'
  ).forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--x', `${((e.clientX - r.left) / r.width) * 100}%`);
      el.style.setProperty('--y', `${((e.clientY - r.top) / r.height) * 100}%`);
    });
  });

  // ===== TYPING EFFECT =====
  const typedEl = document.getElementById('typed-text');
  const texts   = ["GHL Expert", "Web Developer", "UI/UX Designer", "Automation Pro"];
  let ti = 0, ci = 0, del = false;
  function type() {
    if (!typedEl) return;
    const t = texts[ti];
    if (!del && ci < t.length) {
      typedEl.textContent = t.substring(0, ++ci);
      setTimeout(type, 100);
    } else if (del && ci > 0) {
      typedEl.textContent = t.substring(0, --ci);
      setTimeout(type, 50);
    } else {
      del = !del;
      if (!del) ti = (ti + 1) % texts.length;
      setTimeout(type, del ? 2000 : 500);
    }
  }
  type();

  // ===== STATS COUNTER =====
  let animated = false;
  function animStats() {
    if (animated) return;
    const s = document.querySelector('.about-stats');
    if (!s) return;
    const r = s.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) {
      animated = true;
      document.querySelectorAll('.stat-number').forEach(n => {
        const target = parseInt(n.dataset.target);
        const isPct  = target === 100;
        let cur      = 0;
        const inc    = target / (2000 / 16);
        function up() {
          cur += inc;
          if (cur < target) {
            n.textContent = Math.floor(cur) + (isPct ? '%' : '+');
            requestAnimationFrame(up);
          } else {
            n.textContent = target + (isPct ? '%' : '+');
          }
        }
        up();
      });
    }
  }
  window.addEventListener('scroll', animStats);
  animStats();

  // ===== PORTFOLIO SWIPER =====
  if (document.querySelector('.swiper-portfolio')) {
    var portfolioSwiper = new Swiper('.swiper-portfolio', {
      effect: 'coverflow',
      grabCursor: true,
      centeredSlides: true,
      slidesPerView: 'auto',
      loop: true,
      coverflowEffect: {
        rotate: 40,
        stretch: 0,
        depth: 280,
        modifier: 1,
        slideShadows: true
      },
      navigation: {
        nextEl: '#portNextBtn',
        prevEl: '#portPrevBtn'
      },
      pagination: {
        el: '.swiper-portfolio .swiper-pagination',
        clickable: true
      }
    });

    // Prevent link click on non-active slides
    document.querySelectorAll('.swiper-portfolio .swiper-slide').forEach(function (slide) {
      slide.addEventListener('click', function (e) {
        if (!this.classList.contains('swiper-slide-active')) {
          e.preventDefault();
        }
      });
    });
  }

  