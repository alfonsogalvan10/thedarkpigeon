/* ═══════════════════════════════════════════════
   THE DARK PIGEON — JavaScript
   Animations, interactions, and form handling
   ═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
    // ── Navigation scroll effect ──
    const nav = document.getElementById('nav');
    const handleScroll = () => {
        nav.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // ── Mobile menu toggle ──
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');

    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // ── Intersection Observer for fade-in animations ──
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -60px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

    // ── Animated stat counters ──
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                statObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) statObserver.observe(statsSection);

    function animateCounters() {
        document.querySelectorAll('.stat-number').forEach(counter => {
            const target = parseInt(counter.dataset.target, 10);
            const duration = 2000;
            const start = performance.now();

            function update(now) {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                // Ease out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                counter.textContent = Math.round(eased * target);
                if (progress < 1) requestAnimationFrame(update);
            }

            requestAnimationFrame(update);
        });
    }

    // ── Smooth scroll for anchor links ──
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ── Code card typing animation ──
    const codeLines = document.querySelectorAll('.about-card-body .code-line');
    const codeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                codeLines.forEach((line, i) => {
                    line.style.opacity = '0';
                    line.style.transform = 'translateX(-10px)';
                    line.style.transition = `opacity 0.4s ease ${i * 0.08}s, transform 0.4s ease ${i * 0.08}s`;
                    requestAnimationFrame(() => {
                        line.style.opacity = '1';
                        line.style.transform = 'translateX(0)';
                    });
                });
                codeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    const codeCard = document.querySelector('.about-card');
    if (codeCard) codeObserver.observe(codeCard);

    // ── Role chips stagger animation ──
    const rolesObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const chips = entry.target.querySelectorAll('.role-chip');
                chips.forEach((chip, i) => {
                    chip.style.opacity = '0';
                    chip.style.transform = 'translateY(15px) scale(0.95)';
                    chip.style.transition = `opacity 0.5s ease ${i * 0.04}s, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 0.04}s`;
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            chip.style.opacity = '1';
                            chip.style.transform = 'translateY(0) scale(1)';
                        });
                    });
                });
                rolesObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    const rolesGrid = document.querySelector('.roles-grid');
    if (rolesGrid) rolesObserver.observe(rolesGrid);

    // ── Tech pills stagger ──
    const techObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const pills = entry.target.querySelectorAll('.tech-pills span');
                pills.forEach((pill, i) => {
                    pill.style.opacity = '0';
                    pill.style.transition = `opacity 0.4s ease ${i * 0.03}s`;
                    requestAnimationFrame(() => {
                        pill.style.opacity = '1';
                    });
                });
                techObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    const techStack = document.querySelector('.tech-stack');
    if (techStack) techObserver.observe(techStack);

    // ── Contact form handling ──
    const form = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            btn.textContent = 'Sending...';
            btn.disabled = true;

            try {
                const formData = new FormData(form);
                const response = await fetch('/contact', {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    form.reset();
                    formSuccess.classList.add('show');
                    btn.textContent = 'Sent!';
                    setTimeout(() => {
                        formSuccess.classList.remove('show');
                        btn.textContent = originalText;
                        btn.disabled = false;
                    }, 5000);
                } else {
                    btn.textContent = 'Failed — try again';
                    btn.disabled = false;
                    setTimeout(() => { btn.textContent = originalText; }, 3000);
                }
            } catch {
                btn.textContent = originalText;
                btn.disabled = false;
            }
        });
    }

    // ── Parallax glow movement on mouse ──
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.addEventListener('mousemove', (e) => {
            const rect = hero.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            const glow1 = hero.querySelector('.hero-glow-1');
            const glow2 = hero.querySelector('.hero-glow-2');

            if (glow1) glow1.style.transform = `translate(${x * 40}px, ${y * 40}px)`;
            if (glow2) glow2.style.transform = `translate(${-x * 30}px, ${-y * 30}px)`;
        });
    }

    // ── Active nav link highlight on scroll ──
    const sections = document.querySelectorAll('section[id]');
    const navAnchors = document.querySelectorAll('.nav-links a:not(.nav-cta)');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navAnchors.forEach(a => {
                    a.style.color = a.getAttribute('href') === `#${id}`
                        ? 'var(--accent)'
                        : '';
                });
            }
        });
    }, { threshold: 0.3, rootMargin: '-80px 0px -50% 0px' });

    sections.forEach(s => sectionObserver.observe(s));
});
