// Miniks Solution - Main JavaScript

// ===========================
// Starfall Background Animation
// ===========================
class StarfallCanvas {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.stars = [];
        this.maxStars = 150;
        this.init();
    }
    
    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.createStars();
        this.animate();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createStars() {
        for (let i = 0; i < this.maxStars; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2,
                speedY: Math.random() * 0.5 + 0.2,
                speedX: (Math.random() - 0.5) * 0.2,
                opacity: Math.random() * 0.5 + 0.2,
                twinkle: Math.random() * 0.02
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw stars
        this.stars.forEach(star => {
            // Update position
            star.y += star.speedY;
            star.x += star.speedX;
            
            // Twinkle effect
            star.opacity += star.twinkle;
            if (star.opacity > 0.8 || star.opacity < 0.2) {
                star.twinkle *= -1;
            }
            
            // Reset star when it goes off screen
            if (star.y > this.canvas.height) {
                star.y = 0;
                star.x = Math.random() * this.canvas.width;
            }
            if (star.x < 0 || star.x > this.canvas.width) {
                star.x = Math.random() * this.canvas.width;
            }
            
            // Draw star
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(56, 189, 248, ${star.opacity})`;
            this.ctx.fill();
            
            // Draw glow
            const gradient = this.ctx.createRadialGradient(
                star.x, star.y, 0,
                star.x, star.y, star.size * 3
            );
            gradient.addColorStop(0, `rgba(56, 189, 248, ${star.opacity * 0.5})`);
            gradient.addColorStop(1, 'rgba(56, 189, 248, 0)');
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(
                star.x - star.size * 3,
                star.y - star.size * 3,
                star.size * 6,
                star.size * 6
            );
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// ===========================
// Scroll Reveal Animation
// ===========================
class ScrollReveal {
    constructor() {
        this.elements = document.querySelectorAll('.reveal-element');
        this.init();
    }
    
    init() {
        // Create observer
        this.observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                        this.observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );
        
        // Observe all elements
        this.elements.forEach(el => this.observer.observe(el));
    }
}

// ===========================
// Project Estimator Logic
// ===========================
class ProjectEstimator {
    constructor(formId) {
        this.form = document.getElementById(formId);
        if (!this.form) return;
        
        this.currentStep = 1;
        this.totalSteps = 4;
        this.formData = {
            businessType: '',
            pages: '',
            features: []
        };
        
        this.init();
    }
    
    init() {
        // Navigation buttons
        this.nextBtn = document.getElementById('next-btn');
        this.prevBtn = document.getElementById('prev-btn');
        
        // Add event listeners
        this.nextBtn.addEventListener('click', () => this.nextStep());
        this.prevBtn.addEventListener('click', () => this.prevStep());
        
        // Business type selection
        document.querySelectorAll('input[name="business-type"]').forEach(input => {
            input.addEventListener('change', (e) => {
                this.formData.businessType = e.target.value;
            });
        });
        
        // Pages selection
        document.querySelectorAll('input[name="pages"]').forEach(input => {
            input.addEventListener('change', (e) => {
                this.formData.pages = e.target.value;
            });
        });
        
        // Features selection
        document.querySelectorAll('input[name="features"]').forEach(input => {
            input.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.formData.features.push(e.target.value);
                } else {
                    const index = this.formData.features.indexOf(e.target.value);
                    if (index > -1) {
                        this.formData.features.splice(index, 1);
                    }
                }
            });
        });
    }
    
    nextStep() {
        // Validate current step
        if (!this.validateStep()) {
            return;
        }
        
        if (this.currentStep < this.totalSteps) {
            this.currentStep++;
            this.updateUI();
            
            // Calculate estimate on final step
            if (this.currentStep === this.totalSteps) {
                this.calculateEstimate();
            }
        }
    }
    
    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateUI();
        }
    }
    
    validateStep() {
        switch (this.currentStep) {
            case 1:
                if (!this.formData.businessType) {
                    alert('Please select your business type');
                    return false;
                }
                break;
            case 2:
                if (!this.formData.pages) {
                    alert('Please select the number of pages');
                    return false;
                }
                break;
            case 3:
                // Features are optional, so always return true
                break;
        }
        return true;
    }
    
    updateUI() {
        // Update step visibility
        document.querySelectorAll('.estimator-step').forEach(step => {
            step.classList.remove('active');
        });
        document.querySelector(`.estimator-step[data-step="${this.currentStep}"]`).classList.add('active');
        
        // Update progress dots
        document.querySelectorAll('.progress-dot').forEach(dot => {
            dot.classList.remove('active');
        });
        document.querySelectorAll(`.progress-dot[data-step="${this.currentStep}"]`).forEach(dot => {
            dot.classList.add('active');
        });
        
        // Update button visibility
        if (this.currentStep === 1) {
            this.prevBtn.style.display = 'none';
        } else {
            this.prevBtn.style.display = 'inline-flex';
        }
        
        if (this.currentStep === this.totalSteps) {
            this.nextBtn.style.display = 'none';
        } else {
            this.nextBtn.style.display = 'inline-flex';
        }
        
        // Scroll to top of form
        this.form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    calculateEstimate() {
        let basePrice = 1500;
        let maxPrice = 2500;
        
        // Adjust based on business type
        const businessMultipliers = {
            'dentist': 1.2,
            'plumber': 1.0,
            'restaurant': 1.3,
            'retail': 1.2,
            'professional': 1.1,
            'other': 1.0
        };
        
        const multiplier = businessMultipliers[this.formData.businessType] || 1.0;
        basePrice *= multiplier;
        maxPrice *= multiplier;
        
        // Adjust based on pages
        const pagesMultipliers = {
            '1-3': 1.0,
            '4-7': 1.5,
            '8-15': 2.0,
            '15+': 2.5
        };
        
        const pagesMultiplier = pagesMultipliers[this.formData.pages] || 1.0;
        basePrice *= pagesMultiplier;
        maxPrice *= pagesMultiplier;
        
        // Adjust based on features
        const featurePrices = {
            'ecommerce': 1500,
            'booking': 800,
            'blog': 400,
            'seo': 600,
            'custom': 1000
        };
        
        let featuresTotal = 0;
        this.formData.features.forEach(feature => {
            featuresTotal += featurePrices[feature] || 0;
        });
        
        basePrice += featuresTotal;
        maxPrice += featuresTotal + 500;
        
        // Round to nearest 100
        basePrice = Math.round(basePrice / 100) * 100;
        maxPrice = Math.round(maxPrice / 100) * 100;
        
        // Update UI
        this.displayEstimate(basePrice, maxPrice);
    }
    
    displayEstimate(basePrice, maxPrice) {
        const estimateElement = document.getElementById('estimate-range');
        estimateElement.textContent = `$${basePrice.toLocaleString()} - $${maxPrice.toLocaleString()}`;
        
        // Display project summary
        const summaryElement = document.getElementById('project-summary');
        let summaryHTML = '';
        
        // Business type
        const businessTypes = {
            'dentist': 'Medical/Dental',
            'plumber': 'Trades/Services',
            'restaurant': 'Restaurant/Food',
            'retail': 'Retail/Shop',
            'professional': 'Professional Services',
            'other': 'Other'
        };
        summaryHTML += `<li class="flex items-start gap-2"><i data-lucide="check-circle" class="w-4 h-4 text-accent-sky flex-shrink-0 mt-1"></i><span>Business Type: ${businessTypes[this.formData.businessType]}</span></li>`;
        
        // Pages
        summaryHTML += `<li class="flex items-start gap-2"><i data-lucide="file" class="w-4 h-4 text-accent-sky flex-shrink-0 mt-1"></i><span>Pages: ${this.formData.pages}</span></li>`;
        
        // Features
        if (this.formData.features.length > 0) {
            const featureNames = {
                'ecommerce': 'E-Commerce',
                'booking': 'Booking System',
                'blog': 'Blog/News',
                'seo': 'SEO Optimization',
                'custom': 'Custom Features'
            };
            
            this.formData.features.forEach(feature => {
                summaryHTML += `<li class="flex items-start gap-2"><i data-lucide="plus-circle" class="w-4 h-4 text-accent-sky flex-shrink-0 mt-1"></i><span>${featureNames[feature]}</span></li>`;
            });
        }
        
        summaryElement.innerHTML = summaryHTML;
        
        // Re-initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
}

// ===========================
// Mobile Menu Toggle
// ===========================
class MobileMenu {
    constructor() {
        this.menuBtn = document.getElementById('mobile-menu-btn');
        this.menu = document.getElementById('mobile-menu');
        
        if (!this.menuBtn || !this.menu) return;
        
        this.init();
    }
    
    init() {
        this.menuBtn.addEventListener('click', () => this.toggle());
        
        // Close menu when clicking a link
        this.menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => this.close());
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.menu.contains(e.target) && !this.menuBtn.contains(e.target)) {
                this.close();
            }
        });
    }
    
    toggle() {
        this.menu.classList.toggle('active');
    }
    
    close() {
        this.menu.classList.remove('active');
    }
}

// ===========================
// Header Scroll Effect
// ===========================
class HeaderScroll {
    constructor() {
        this.header = document.getElementById('header');
        if (!this.header) return;
        
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                this.header.classList.add('scrolled');
            } else {
                this.header.classList.remove('scrolled');
            }
        });
    }
}

// ===========================
// Smooth Scroll
// ===========================
class SmoothScroll {
    constructor() {
        this.init();
    }
    
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href === '#' || href === '') return;
                
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// ===========================
// Cursor Glow Effect (Optional)
// ===========================
class CursorGlow {
    constructor() {
        // Check if user prefers reduced motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }
        
        this.createCursor();
    }
    
    createCursor() {
        const cursor = document.createElement('div');
        cursor.className = 'cursor-glow';
        cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(56, 189, 248, 0.3) 0%, transparent 70%);
            pointer-events: none;
            z-index: 9999;
            mix-blend-mode: screen;
            transition: transform 0.2s ease-out;
            display: none;
        `;
        document.body.appendChild(cursor);
        
        let mouseX = 0;
        let mouseY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.display = 'block';
            cursor.style.left = `${mouseX - 10}px`;
            cursor.style.top = `${mouseY - 10}px`;
        });
        
        // Hide on mobile
        if ('ontouchstart' in window) {
            cursor.style.display = 'none';
        }
    }
}

// ===========================
// Initialize Everything
// ===========================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize components
    new StarfallCanvas('starfall-canvas');
    new ScrollReveal();
    new ProjectEstimator('estimator-form');
    new MobileMenu();
    new HeaderScroll();
    new SmoothScroll();
    new CursorGlow();
    
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    console.log('Miniks Solution Portfolio Loaded 🚀');
});

// ===========================
// Performance Optimization
// ===========================
// Lazy load images
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src;
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// ===========================
// Analytics & Error Tracking
// ===========================
window.addEventListener('error', (e) => {
    console.error('Error caught:', e.error);
    // Send to analytics service if needed
});

// Track estimator completion
window.estimatorCompleted = (data) => {
    console.log('Estimator completed:', data);
    // Send to analytics service
};

// ===========================
// PWA Support (Optional)
// ===========================
if ('serviceWorker' in navigator) {
    // Service worker registration code would go here
    // Uncomment when ready to implement PWA features
    /*
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered:', registration))
            .catch(error => console.log('SW registration failed:', error));
    });
    */
}
