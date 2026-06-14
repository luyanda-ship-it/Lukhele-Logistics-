/* ===== Lukhele Logistics - Main JavaScript ===== */

document.addEventListener('DOMContentLoaded', function() {
    
    // --- Mobile Navigation Toggle ---
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            const icon = this.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.className = 'fas fa-times';
            } else {
                icon.className = 'fas fa-bars';
            }
        });
    }
    
    // --- Close mobile nav when clicking a link ---
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            if (navToggle) {
                navToggle.querySelector('i').className = 'fas fa-bars';
            }
        });
    });
    
    // --- Active link highlighting ---
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        }
    });
    
    // --- Smooth scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
    
    // --- Header scroll effect ---
    const header = document.querySelector('.header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 100) {
            header.style.background = 'rgba(13, 13, 13, 0.98)';
        } else {
            header.style.background = 'rgba(13, 13, 13, 0.95)';
        }
        lastScroll = currentScroll;
    });
    
    // --- Contact Form Handler ---
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = {};
            formData.forEach((value, key) => { data[key] = value; });
            
            // Show sending state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Submit to Formspree
            fetch(this.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok.');
            })
            .then(data => {
                if (formStatus) {
                    formStatus.innerHTML = '<div class="alert alert-success"><i class="fas fa-check-circle"></i> Thank you! Your message has been sent successfully. We will get back to you shortly.</div>';
                    formStatus.style.display = 'block';
                }
                contactForm.reset();
            })
            .catch(error => {
                if (formStatus) {
                    formStatus.innerHTML = '<div class="alert alert-error"><i class="fas fa-exclamation-circle"></i> Oops! There was a problem sending your message. Please try again or contact us directly via phone.</div>';
                    formStatus.style.display = 'block';
                }
            })
            .finally(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Hide status after 8 seconds
                setTimeout(() => {
                    if (formStatus) {
                        formStatus.style.display = 'none';
                    }
                }, 8000);
            });
        });
    }
    
    // --- Gallery image viewer (lightbox) ---
    const galleryItems = document.querySelectorAll('.gallery-item, .gallery-page-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            // For now, just a simple placeholder interaction
            // In production, this would open a lightbox with the actual image
            const label = this.querySelector('span')?.textContent || 'Gallery Image';
            console.log(`Gallery item clicked: ${label}`);
        });
    });
    
    // --- Counter animation for hero stats ---
    function animateCounter(element, target, suffix = '') {
        let current = 0;
        const increment = Math.ceil(target / 60);
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = current.toLocaleString() + suffix;
        }, 25);
    }
    
    // Check if counter elements exist and animate them
    const statNumbers = document.querySelectorAll('.hero-stat h3');
    if (statNumbers.length > 0 && typeof IntersectionObserver !== 'undefined') {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const text = el.textContent;
                    const numMatch = text.match(/[\d,]+/);
                    if (numMatch) {
                        const num = parseInt(numMatch[0].replace(/,/g, ''));
                        const suffix = text.replace(/[\d,]+/, '');
                        el.textContent = '0' + suffix;
                        animateCounter(el, num, suffix);
                    }
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.5 });
        
        statNumbers.forEach(el => observer.observe(el));
    }
    
});
