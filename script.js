document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS Animations
    AOS.init({
        once: true,
        offset: 80,
        duration: 800,
        disable: false
    });

    // Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
        
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    // Theme Toggle Logic
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        if(themeToggle) themeToggle.textContent = '☀️';
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            let theme = document.documentElement.getAttribute('data-theme');
            if (theme === 'dark') {
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
                themeToggle.textContent = '🌙';
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                themeToggle.textContent = '☀️';
            }
        });
    }

    // 1. Language Switcher Logic
    const btnFr = document.getElementById('btn-fr');
    const btnAr = document.getElementById('btn-ar');
    const frElements = document.querySelectorAll('.fr');
    const arElements = document.querySelectorAll('.ar');
    const htmlTag = document.documentElement;
    const bodyTag = document.body;
    const i18nTexts = document.querySelectorAll('.i18n-text');

    function setLanguage(lang) {
        if (lang === 'fr') {
            htmlTag.setAttribute('lang', 'fr');
            htmlTag.setAttribute('dir', 'ltr');
            btnFr.classList.add('active');
            btnAr.classList.remove('active');
            
            frElements.forEach(el => el.style.display = '');
            arElements.forEach(el => el.style.display = 'none');
            
            i18nTexts.forEach(el => {
                if(el.dataset.fr) el.textContent = el.dataset.fr;
            });
            bodyTag.style.textAlign = 'left';
        } else {
            htmlTag.setAttribute('lang', 'ar');
            htmlTag.setAttribute('dir', 'rtl');
            btnAr.classList.add('active');
            btnFr.classList.remove('active');
            
            arElements.forEach(el => el.style.display = '');
            frElements.forEach(el => el.style.display = 'none');
            
            i18nTexts.forEach(el => {
                if(el.dataset.ar) el.textContent = el.dataset.ar;
            });
            bodyTag.style.textAlign = 'right';
        }
    }

    if (btnFr && btnAr) {
        btnFr.addEventListener('click', () => setLanguage('fr'));
        btnAr.addEventListener('click', () => setLanguage('ar'));
    }

    // 2. Animated Number Counters
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // The lower the slower

    const animateCounters = () => {
        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;
                const inc = target / speed;

                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 20);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        });
    }

    // Intersection Observer to trigger counting when in view
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            if(entries[0].isIntersecting) {
                animateCounters();
                observer.disconnect();
            }
        });
        observer.observe(statsSection);
    }

    // 3. Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if(this.getAttribute('href') === '#') return;
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 4. Contact Form Backend Integration
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const feedbackMsg = document.createElement('div');
        feedbackMsg.style.display = 'none';
        feedbackMsg.style.padding = '15px';
        feedbackMsg.style.marginTop = '20px';
        feedbackMsg.style.borderRadius = '10px';
        feedbackMsg.style.fontWeight = '600';
        feedbackMsg.style.backdropFilter = 'blur(10px)';
        contactForm.appendChild(feedbackMsg);

        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnHtml = submitBtn.innerHTML;
            const currentLang = htmlTag.getAttribute('lang');
            
            // Loading State UI
            submitBtn.disabled = true;
            submitBtn.innerHTML = currentLang === 'fr' 
                ? '<span class="fr">Traitement en cours... ⏳</span>' 
                : '<span class="ar">جاري المعالجة... ⏳</span>';
            
            const data = {
                name: document.getElementById('nom').value,
                phone: document.getElementById('telephone').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            };
            
            feedbackMsg.style.display = 'none';

            try {
                // Pointing to your Node backend
                const response = await fetch('http://localhost:3000/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    feedbackMsg.textContent = currentLang === 'fr' 
                        ? 'Message propulsé avec succès ! 🏎️ Nous revenons vers vous.'
                        : 'تم إرسال الرسالة بنجاح! 🏎️ سنتواصل معك.';
                    feedbackMsg.style.background = 'rgba(34, 197, 94, 0.2)';
                    feedbackMsg.style.color = '#4ade80';
                    feedbackMsg.style.border = '1px solid rgba(34, 197, 94, 0.3)';
                    feedbackMsg.style.display = 'block';
                    contactForm.reset();
                } else {
                    throw new Error('Server Error');
                }
            } catch (error) {
                feedbackMsg.textContent = currentLang === 'fr' 
                    ? 'Défaillance de connexion au serveur local. (Avez-vous lancé le node server ?)'
                    : 'فشل الاتصال بالخادم المحلي.';
                feedbackMsg.style.background = 'rgba(239, 68, 68, 0.2)';
                feedbackMsg.style.color = '#f87171';
                feedbackMsg.style.border = '1px solid rgba(239, 68, 68, 0.3)';
                feedbackMsg.style.display = 'block';
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHtml;
            }
        });
    }
});
