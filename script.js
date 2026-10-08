/**
 * ==========================================================================
 * SINCHANA M S — EDITORIAL PORTFOLIO JAVASCRIPT
 * Interactions: Dark/Light Mode, Mobile Drawer, ScrollSpy, Form Validation
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initMobileNav();
    initVideoPlayer();
    initResumeModal();
    initScrollSpy();
    initScrollReveal();
    initBackToTop();
    initContactForm();
});

/* --------------------------------------------------------------------------
   1. Theme Management (Dark / Light Mode)
   -------------------------------------------------------------------------- */
function initTheme() {
    const toggleBtn = document.getElementById('theme-toggle');
    const html = document.documentElement;

    // 1. Check stored preference or system preference
    const storedTheme = localStorage.getItem('sinchana-theme');
    if (storedTheme) {
        setTheme(storedTheme);
    } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark ? 'dark' : 'light');
    }

    // 2. Toggle on button click
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme') || 'dark';
            const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
            setTheme(nextTheme);
        });
    }

    // 3. Listen for OS theme changes if user hasn't set custom choice
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('sinchana-theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });

    function setTheme(theme) {
        html.setAttribute('data-theme', theme);
        localStorage.setItem('sinchana-theme', theme);
    }
}

/* --------------------------------------------------------------------------
   2. Mobile Navigation Drawer
   -------------------------------------------------------------------------- */
function initMobileNav() {
    const menuToggle = document.getElementById('menu-toggle');
    const drawer = document.getElementById('mobile-nav-drawer');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    if (!menuToggle || !drawer) return;

    menuToggle.addEventListener('click', () => {
        const isOpen = drawer.classList.toggle('is-open');
        menuToggle.setAttribute('aria-expanded', isOpen.toString());
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            drawer.classList.remove('is-open');
            menuToggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
        if (!drawer.contains(e.target) && !menuToggle.contains(e.target) && drawer.classList.contains('is-open')) {
            drawer.classList.remove('is-open');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
            drawer.classList.remove('is-open');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

/* --------------------------------------------------------------------------
   3. Self-Introduction Video Player Controls
   -------------------------------------------------------------------------- */
function initVideoPlayer() {
    const video = document.getElementById('self-intro-video');
    const playOverlayBtn = document.getElementById('video-play-btn');
    const watchActionBtn = document.getElementById('watch-intro-action-btn');
    const wrapper = document.getElementById('video-wrapper');

    if (!video || !wrapper) return;

    function playVideo() {
        video.play().then(() => {
            wrapper.classList.add('is-playing');
        }).catch(err => {
            console.warn('Video playback interaction:', err);
        });
    }

    if (playOverlayBtn) {
        playOverlayBtn.addEventListener('click', () => {
            playVideo();
        });
    }

    if (watchActionBtn) {
        watchActionBtn.addEventListener('click', () => {
            const introSection = document.getElementById('intro');
            if (introSection) {
                introSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            setTimeout(() => {
                playVideo();
            }, 500);
        });
    }

    video.addEventListener('play', () => {
        wrapper.classList.add('is-playing');
    });

    video.addEventListener('pause', () => {
        wrapper.classList.remove('is-playing');
    });

    video.addEventListener('ended', () => {
        wrapper.classList.remove('is-playing');
    });
}

/* --------------------------------------------------------------------------
   4. Active Navigation ScrollSpy
   -------------------------------------------------------------------------- */
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.desktop-nav .nav-link');

    if (!sections.length || !navLinks.length) return;

    function onScroll() {
        const scrollPos = window.scrollY + 140;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

/* --------------------------------------------------------------------------
   4. Scroll Reveal Animations (IntersectionObserver)
   -------------------------------------------------------------------------- */
function initScrollReveal() {
    const elements = document.querySelectorAll('[data-reveal]');
    if (!elements.length) return;

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-revealed');
                    obs.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });

        elements.forEach(el => observer.observe(el));
    } else {
        elements.forEach(el => el.classList.add('is-revealed'));
    }
}

/* --------------------------------------------------------------------------
   5. Back to Top Button
   -------------------------------------------------------------------------- */
function initBackToTop() {
    const backBtn = document.getElementById('back-to-top');
    if (!backBtn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            backBtn.classList.add('visible');
        } else {
            backBtn.classList.remove('visible');
        }
    }, { passive: true });

    backBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* --------------------------------------------------------------------------
   6. Contact Form Validation
   -------------------------------------------------------------------------- */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const nameInput = document.getElementById('form-name');
    const emailInput = document.getElementById('form-email');
    const messageInput = document.getElementById('form-message');
    const feedbackBox = document.getElementById('form-feedback');

    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const messageError = document.getElementById('message-error');

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function clearErrors() {
        [nameInput, emailInput, messageInput].forEach(inp => inp.classList.remove('is-invalid'));
        [nameError, emailError, messageError].forEach(err => err.textContent = '');
        feedbackBox.className = 'form-feedback-box';
        feedbackBox.textContent = '';
        feedbackBox.style.display = 'none';
    }

    nameInput.addEventListener('input', () => {
        if (nameInput.value.trim().length >= 2) {
            nameInput.classList.remove('is-invalid');
            nameError.textContent = '';
        }
    });

    emailInput.addEventListener('input', () => {
        if (isValidEmail(emailInput.value.trim())) {
            emailInput.classList.remove('is-invalid');
            emailError.textContent = '';
        }
    });

    messageInput.addEventListener('input', () => {
        if (messageInput.value.trim().length >= 10) {
            messageInput.classList.remove('is-invalid');
            messageError.textContent = '';
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        clearErrors();

        let isValid = true;
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const message = messageInput.value.trim();

        if (name.length < 2) {
            nameInput.classList.add('is-invalid');
            nameError.textContent = 'Please provide your name (minimum 2 characters).';
            isValid = false;
        }

        if (!isValidEmail(email)) {
            emailInput.classList.add('is-invalid');
            emailError.textContent = 'Please enter a valid email address.';
            isValid = false;
        }

        if (message.length < 10) {
            messageInput.classList.add('is-invalid');
            messageError.textContent = 'Please enter a message of at least 10 characters.';
            isValid = false;
        }

        if (!isValid) return;

        feedbackBox.classList.add('success');
        feedbackBox.innerHTML = `
            <strong>Thank you, ${escapeHtml(name)}!</strong><br>
            Your message has been captured. You can also connect directly via email at <a href="mailto:sinchanagowda462@gmail.com" style="text-decoration: underline; font-weight: 600;">sinchanagowda462@gmail.com</a>.
        `;
        feedbackBox.style.display = 'block';

        form.reset();
    });

    function escapeHtml(str) {
        const d = document.createElement('div');
        d.textContent = str;
        return d.innerHTML;
    }
}

/* --------------------------------------------------------------------------
   8. Resume Fullscreen Modal Preview
   -------------------------------------------------------------------------- */
function initResumeModal() {
    const modal = document.getElementById('resume-modal');
    const openBtn = document.getElementById('open-resume-modal');
    const triggerFrame = document.getElementById('resume-preview-trigger');
    const closeBtn = document.getElementById('close-resume-modal');
    const backdrop = document.getElementById('resume-modal-backdrop');

    if (!modal) return;

    function openModal() {
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    if (openBtn) openBtn.addEventListener('click', openModal);
    if (triggerFrame) triggerFrame.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('is-open')) {
            closeModal();
        }
    });
}
