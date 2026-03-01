/* ═══════════════════════════════════════════
   ESPRESSO & CO. — script.js
   Original script + Enhancements combined
   ═══════════════════════════════════════════ */

// ── 1. Navbar Scroll Effect (original) ──────────
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ── 2. Mobile Menu Toggle (original) ────────────
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('toggle');
});

// ── 3. Smooth Scrolling for Links (original) ────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        navLinks.classList.remove('active');
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// ── 4. Form Validation (original — kept but overridden below) ──
const resForm = document.getElementById('res-form');
resForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const date = document.getElementById('date').value;

    if(name.length < 3) {
        alert("Please enter a valid name.");
        return;
    }

    alert(`Thank you, ${name}! Your table for ${date} has been requested.`);
    resForm.reset();
});


/* ═══════════════════════════════════════════
   ENHANCEMENTS
   ═══════════════════════════════════════════ */

(function () {
  'use strict';

  // ── 5. Scroll Progress Bar ───────────────────
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress-bar';
  document.body.prepend(progressBar);

  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
  }

  // ── 6. Active Nav Link on Scroll ────────────
  const navLinksAll = document.querySelectorAll('.nav-links li a[href^="#"]');
  const sections    = document.querySelectorAll('section[id]');

  function highlightNav() {
    const mid = window.scrollY + window.innerHeight * 0.35;
    sections.forEach(section => {
      const top    = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id     = section.getAttribute('id');
      if (mid >= top && mid < bottom) {
        navLinksAll.forEach(a => {
          a.classList.toggle('active-link', a.getAttribute('href') === '#' + id);
        });
      }
    });
  }

  // ── 7. Scroll Reveal ────────────────────────
  const revealSections = document.querySelectorAll('.reveal-section');
  const revealCards    = document.querySelectorAll('.reveal-card');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealSections.forEach(el => observer.observe(el));
  revealCards.forEach(el => observer.observe(el));

  // ── 8. Combined Scroll Handler ───────────────
  window.addEventListener('scroll', () => {
    updateProgress();
    highlightNav();
  }, { passive: true });

  updateProgress();
  highlightNav();

  // ── 9. Enhanced Form Validation ─────────────
  // Overrides the original alert() with inline feedback
  if (resForm) {
    const nameInput   = document.getElementById('name');
    const emailInput  = document.getElementById('email');
    const dateInput   = document.getElementById('date');
    const formSuccess = document.getElementById('form-success');
    const nameMsg     = document.getElementById('name-msg');
    const emailMsg    = document.getElementById('email-msg');
    const dateMsg     = document.getElementById('date-msg');

    function setFieldState(input, msgEl, isValid, message) {
      if (!input || !msgEl) return;
      input.classList.toggle('input-error', !isValid);
      input.classList.toggle('input-valid', isValid);
      msgEl.textContent = message;
      msgEl.className = 'field-msg ' + (isValid ? (message ? 'success' : '') : 'error');
    }

    function clearFieldState(input, msgEl) {
      if (!input) return;
      input.classList.remove('input-error', 'input-valid');
      if (msgEl) { msgEl.textContent = ''; msgEl.className = 'field-msg'; }
    }

    // Live validation on blur
    if (nameInput) {
      nameInput.addEventListener('blur', () => {
        const v = nameInput.value.trim();
        if (!v) setFieldState(nameInput, nameMsg, false, 'Name is required.');
        else if (v.length < 2) setFieldState(nameInput, nameMsg, false, 'At least 2 characters needed.');
        else setFieldState(nameInput, nameMsg, true, '✓ Looks good!');
      });
      nameInput.addEventListener('input', () => clearFieldState(nameInput, nameMsg));
    }

    if (emailInput) {
      emailInput.addEventListener('blur', () => {
        const v = emailInput.value.trim();
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!v) setFieldState(emailInput, emailMsg, false, 'Email is required.');
        else if (!re.test(v)) setFieldState(emailInput, emailMsg, false, 'Please enter a valid email.');
        else setFieldState(emailInput, emailMsg, true, '✓ Valid email.');
      });
      emailInput.addEventListener('input', () => clearFieldState(emailInput, emailMsg));
    }

    if (dateInput) {
      dateInput.addEventListener('change', () => {
        const chosen = new Date(dateInput.value);
        const today  = new Date(); today.setHours(0, 0, 0, 0);
        if (!dateInput.value) setFieldState(dateInput, dateMsg, false, 'Please select a date.');
        else if (chosen < today) setFieldState(dateInput, dateMsg, false, 'Please choose a future date.');
        else setFieldState(dateInput, dateMsg, true, '');
      });
    }

    // Override submit — fires before original handler via capture
    resForm.addEventListener('submit', function (e) {
      e.preventDefault();
      e.stopImmediatePropagation();

      let valid = true;

      const nameVal = nameInput ? nameInput.value.trim() : '';
      if (!nameVal || nameVal.length < 2) {
        setFieldState(nameInput, nameMsg, false, !nameVal ? 'Name is required.' : 'At least 2 characters needed.');
        valid = false;
      } else {
        setFieldState(nameInput, nameMsg, true, '✓ Looks good!');
      }

      const emailVal = emailInput ? emailInput.value.trim() : '';
      const emailRe  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailVal || !emailRe.test(emailVal)) {
        setFieldState(emailInput, emailMsg, false, !emailVal ? 'Email is required.' : 'Please enter a valid email.');
        valid = false;
      } else {
        setFieldState(emailInput, emailMsg, true, '✓ Valid email.');
      }

      if (dateInput) {
        const chosen = new Date(dateInput.value);
        const today  = new Date(); today.setHours(0, 0, 0, 0);
        if (!dateInput.value) {
          setFieldState(dateInput, dateMsg, false, 'Please select a date.');
          valid = false;
        } else if (chosen < today) {
          setFieldState(dateInput, dateMsg, false, 'Please choose a future date.');
          valid = false;
        }
      }

      if (!valid) {
        resForm.style.animation = 'none';
        void resForm.offsetWidth;
        resForm.style.animation = 'formShake 0.4s ease';
        return;
      }

      // Success state
      const submitBtn = resForm.querySelector('.btn');
      if (submitBtn) {
        submitBtn.textContent = 'Sending…';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.textContent = 'Confirm Booking';
          submitBtn.disabled = false;
          submitBtn.style.opacity = '1';
        }
        if (formSuccess) {
          formSuccess.classList.add('show');
          setTimeout(() => formSuccess.classList.remove('show'), 6000);
        }
        resForm.reset();
        [nameInput, emailInput, dateInput].forEach(f => {
          if (f) f.classList.remove('input-valid', 'input-error');
        });
        [nameMsg, emailMsg, dateMsg].forEach(m => {
          if (m) { m.textContent = ''; m.className = 'field-msg'; }
        });
      }, 1200);

    }, true); // capture = true → fires before original
  }

  // ── 10. Menu Card Image Overflow Fix ─────────
  document.querySelectorAll('.menu-card').forEach(card => {
    const img = card.querySelector('.menu-img');
    if (img) {
      const wrapper = document.createElement('div');
      wrapper.style.cssText = 'overflow:hidden;border-radius:0;';
      img.parentNode.insertBefore(wrapper, img);
      wrapper.appendChild(img);
    }
  });

  // ── 11. Form Shake Keyframe ──────────────────
  const shakeStyle = document.createElement('style');
  shakeStyle.textContent = `
    @keyframes formShake {
      0%, 100% { transform: translateX(0); }
      20%       { transform: translateX(-6px); }
      40%       { transform: translateX(6px); }
      60%       { transform: translateX(-4px); }
      80%       { transform: translateX(4px); }
    }
  `;
  document.head.appendChild(shakeStyle);

  // ── 12. Back to Top Button ───────────────────
  const backTop = document.createElement('button');
  backTop.innerHTML = '↑';
  backTop.setAttribute('aria-label', 'Back to top');
  backTop.style.cssText = `
    position: fixed; bottom: 2rem; right: 2rem;
    width: 44px; height: 44px;
    background: #C8803E; color: white;
    border: none; border-radius: 50%;
    font-size: 1.1rem; font-weight: 600;
    cursor: pointer;
    box-shadow: 0 6px 20px rgba(200,128,62,0.4);
    transition: all 0.35s cubic-bezier(0.25,0.46,0.45,0.94);
    opacity: 0; transform: translateY(20px);
    pointer-events: none; z-index: 998;
  `;
  document.body.appendChild(backTop);

  window.addEventListener('scroll', () => {
    const show = window.scrollY > 400;
    backTop.style.opacity         = show ? '1' : '0';
    backTop.style.transform       = show ? 'translateY(0)' : 'translateY(20px)';
    backTop.style.pointerEvents   = show ? 'all' : 'none';
  }, { passive: true });

  backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  backTop.addEventListener('mouseenter', () => {
    backTop.style.transform = 'translateY(-3px)';
    backTop.style.boxShadow = '0 10px 28px rgba(200,128,62,0.5)';
  });
  backTop.addEventListener('mouseleave', () => {
    backTop.style.transform = 'translateY(0)';
    backTop.style.boxShadow = '0 6px 20px rgba(200,128,62,0.4)';
  });

  // ── 13. Auto-close Mobile Menu on Scroll ─────
  let lastScrollY = 0;
  window.addEventListener('scroll', () => {
    const navLinksEl  = document.querySelector('.nav-links');
    const hamburgerEl = document.querySelector('.hamburger');
    if (navLinksEl && navLinksEl.classList.contains('active') &&
        Math.abs(window.scrollY - lastScrollY) > 40) {
      navLinksEl.classList.remove('active');
      if (hamburgerEl) hamburgerEl.classList.remove('toggle');
    }
    lastScrollY = window.scrollY;
  }, { passive: true });

  console.info('✓ Espresso & Co. fully loaded.');

})();
