// Función para alternar tema
function toggleTheme() {
    const body = document.body;
    const themeIcon = document.getElementById('theme-icon');
    const currentTheme = body.getAttribute('data-theme');
    
    if (currentTheme === 'dark') {
        body.setAttribute('data-theme', 'light');
        themeIcon.className = 'fas fa-moon';
        localStorage.setItem('theme', 'light');
    } else {
        body.setAttribute('data-theme', 'dark');
        themeIcon.className = 'fas fa-sun';
        localStorage.setItem('theme', 'dark');
    }
}

// Aplicar tema guardado al cargar
function loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const themeIcon = document.getElementById('theme-icon');
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.body.setAttribute('data-theme', 'dark');
        if (themeIcon) themeIcon.className = 'fas fa-sun';
    }
}

// Navegación suave
document.addEventListener('DOMContentLoaded', function() {
    // Cargar tema guardado
    loadSavedTheme();
    // Performance optimization: usar passive listeners donde sea posible
    const addPassiveEventListener = (element, event, handler) => {
        element.addEventListener(event, handler, { passive: true });
    };
    // Smooth scrolling para los enlaces de navegación
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Highlight active navigation item con optimización de rendimiento
    const sections = document.querySelectorAll('section[id]');
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '-70px 0px -70px 0px'
    };
    
    // Throttle function para mejorar rendimiento
    const throttle = (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    };
    
    const observer = new IntersectionObserver(throttle(function(entries) {
        entries.forEach(entry => {
            const navLink = document.querySelector(`.nav-menu a[href="#${entry.target.id}"]`);
            
            if (entry.isIntersecting) {
                // Remove active class from all nav links
                navLinks.forEach(link => link.classList.remove('active'));
                // Add active class to current section's nav link
                if (navLink) {
                    navLink.classList.add('active');
                }
            }
        });
    }, 100), observerOptions);
    
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // Mobile menu toggle (si decides agregarlo después)
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
    
    // Animación de entrada para las tarjetas
    const cards = document.querySelectorAll('.skill-category, .experience-item, .education-item, .contact-info, .portfolio-links');
    
    const cardObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });
    
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        cardObserver.observe(card);
    });
    
    // Parallax scrolling effect
    function handleParallax() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
    }
    
    // Throttled scroll handler
    let ticking = false;
    function scrollHandler() {
        if (!ticking) {
            requestAnimationFrame(() => {
                handleParallax();
                ticking = false;
            });
            ticking = true;
        }
    }
    
    addPassiveEventListener(window, 'scroll', scrollHandler);
    
    // Reveal animations on scroll
    function revealOnScroll() {
        const reveals = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right');
        
        reveals.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('revealed');
            }
        });
    }
    
    addPassiveEventListener(window, 'scroll', revealOnScroll);
    revealOnScroll(); // Check on load
    
    // Performance monitoring
    function logPerformance() {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                const perfData = performance.timing;
                const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                console.log(`⚡ Página cargada en ${pageLoadTime}ms`);
            });
        }
    }
    
    logPerformance();
    
    // Typing effect para el título principal (opcional)
    const heroTitle = document.querySelector('.hero-content h1');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        
        let i = 0;
        function typeWriter() {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        }
        
        // Delay para que se vea el efecto después de que carga la página
        setTimeout(typeWriter, 500);
    }
    
    // Copy email to clipboard functionality
    const emailLinks = document.querySelectorAll('li');
    emailLinks.forEach(li => {
        let text = li.textContent;
        
        // Corregir email específicamente si contiene hoytmail
        if (text.includes('hoytmail.com')) {
            text = text.replace('hoytmail.com', 'hotmail.com');
            li.innerHTML = li.innerHTML.replace('hoytmail.com', 'hotmail.com');
        }
        
        if (text.includes('@') && text.includes('.com')) {
            li.style.cursor = 'pointer';
            li.title = 'Click para copiar email';
            
            li.addEventListener('click', function() {
                const email = text.match(/[\w\.-]+@[\w\.-]+\.\w+/)[0];
                navigator.clipboard.writeText(email).then(function() {
                    // Crear notificación temporal
                    const notification = document.createElement('div');
                    notification.textContent = '📧 Email copiado!';
                    notification.style.cssText = `
                        position: fixed;
                        top: 20px;
                        right: 20px;
                        background: var(--primary-color);
                        color: white;
                        padding: 1rem;
                        border-radius: 0.5rem;
                        z-index: 9999;
                        animation: slideIn 0.3s ease;
                    `;
                    
                    document.body.appendChild(notification);
                    
                    setTimeout(() => {
                        notification.remove();
                    }, 2000);
                });
            });
        }
    });
});

// CSS para la animación de notificación
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .nav-menu a.active {
        color: var(--primary-color);
        background-color: var(--bg-alt);
    }
`;
document.head.appendChild(style);