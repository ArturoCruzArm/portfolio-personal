// Función para alternar tema con accesibilidad mejorada
function toggleTheme() {
    const body = document.body;
    const themeIcon = document.getElementById('theme-icon');
    const themeStatus = document.getElementById('theme-status');
    const currentTheme = body.getAttribute('data-theme');
    
    if (currentTheme === 'dark') {
        body.setAttribute('data-theme', 'light');
        themeIcon.className = 'fas fa-moon';
        themeStatus.textContent = 'Tema claro activado';
        localStorage.setItem('theme', 'light');
        showToast('Tema claro activado', 'success', 2000);
    } else {
        body.setAttribute('data-theme', 'dark');
        themeIcon.className = 'fas fa-sun';
        themeStatus.textContent = 'Tema oscuro activado';
        localStorage.setItem('theme', 'dark');
        showToast('Tema oscuro activado', 'success', 2000);
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

// Performance & Error Handling
const performanceOptimizations = {
    isLowEnd: navigator.hardwareConcurrency < 4 || navigator.deviceMemory < 4,
    prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    
    init() {
        if (this.isLowEnd) {
            document.body.classList.add('low-end-device');
            console.log('Low-end device detected, optimizations applied');
        }
        
        if (this.prefersReducedMotion) {
            document.body.classList.add('reduced-motion');
        }
    }
};

// Error Boundary para JavaScript
window.addEventListener('error', function(event) {
    console.error('JavaScript Error:', event.error);
    showToast('Error inesperado. Recargando...', 'error', 3000);
    
    // Auto-reload en errores críticos (opcional)
    if (event.error && event.error.name === 'ChunkLoadError') {
        setTimeout(() => window.location.reload(), 2000);
    }
});

// Navegación suave
document.addEventListener('DOMContentLoaded', function() {
    try {
        // Inicializar optimizaciones de performance
        performanceOptimizations.init();
        
        // Cargar tema guardado
        loadSavedTheme();
        
        // Performance optimization: usar passive listeners donde sea posible
        const addPassiveEventListener = (element, event, handler) => {
            element.addEventListener(event, handler, { passive: true });
        };
    } catch (error) {
        console.error('Error during initialization:', error);
        showToast('Error de inicialización', 'error', 2000);
    }
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
    
    // Scroll to top button functionality
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    function updateScrollToTopButton() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    }
    
    addPassiveEventListener(window, 'scroll', throttle(updateScrollToTopButton, 100));
    updateScrollToTopButton(); // Check on load
    
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
    
    // Lazy loading de imágenes
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Preload critical resources
    function preloadCriticalResources() {
        const criticalResources = [
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
        ];
        
        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = resource;
            document.head.appendChild(link);
        });
    }
    
    preloadCriticalResources();
    
    // Toast notification system
    function showToast(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        // Show toast
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Hide toast
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => document.body.removeChild(toast), 300);
        }, duration);
    }
    
    // PWA Install functionality
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        
        // Show install button
        const installBtn = document.createElement('button');
        installBtn.className = 'install-prompt';
        installBtn.innerHTML = '<i class="fas fa-download"></i> Instalar App';
        installBtn.onclick = () => {
            installBtn.style.display = 'none';
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    showToast('¡App instalada exitosamente!', 'success');
                } else {
                    showToast('Instalación cancelada', 'info');
                }
                deferredPrompt = null;
            });
        };
        
        document.body.appendChild(installBtn);
        setTimeout(() => installBtn.classList.add('show'), 1000);
    });
    
    // Service Worker registration
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('sw.js')
                .then(registration => {
                    console.log('✅ SW registrado:', registration);
                    showToast('Portfolio disponible offline', 'success');
                })
                .catch(error => {
                    console.log('❌ SW falló:', error);
                    showToast('Error cargando funciones offline', 'error');
                });
        });
    }
    
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

// Mobile menu functionality
function toggleMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navBackdrop = document.getElementById('nav-backdrop');
    const isOpen = navMenu.classList.contains('mobile-open');
    
    if (isOpen) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
}

function openMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navBackdrop = document.getElementById('nav-backdrop');
    
    mobileMenuToggle.classList.add('open');
    mobileMenuToggle.setAttribute('aria-expanded', 'true');
    navMenu.classList.add('mobile-open');
    navBackdrop.classList.add('active');
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = 'hidden';
    
    // Focus first menu item
    const firstMenuItem = navMenu.querySelector('a');
    if (firstMenuItem) {
        setTimeout(() => firstMenuItem.focus(), 300);
    }
}

function closeMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navBackdrop = document.getElementById('nav-backdrop');
    
    mobileMenuToggle.classList.remove('open');
    mobileMenuToggle.setAttribute('aria-expanded', 'false');
    navMenu.classList.remove('mobile-open');
    navBackdrop.classList.remove('active');
    
    // Restore body scroll
    document.body.style.overflow = '';
}

// Scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Close mobile menu when clicking on menu links
document.addEventListener('DOMContentLoaded', function() {
    const navMenuLinks = document.querySelectorAll('.nav-menu a');
    
    navMenuLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Close mobile menu if it's open
            const navMenu = document.getElementById('nav-menu');
            if (navMenu.classList.contains('mobile-open')) {
                closeMobileMenu();
            }
        });
    });
    
    // Close mobile menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const navMenu = document.getElementById('nav-menu');
            if (navMenu.classList.contains('mobile-open')) {
                closeMobileMenu();
            }
        }
    });
    
    // Close mobile menu on window resize if screen becomes larger
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            closeMobileMenu();
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