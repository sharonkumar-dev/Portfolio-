// DOM Elements
const binaryBackground = document.getElementById('binary-background');
const spiderWebCanvas = document.getElementById('spider-web-canvas');
const heroName = document.getElementById('typed-name');

// Initialize all animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initBinaryAnimation();
    initSpiderWeb();
    initTypewriter();
    initScrollAnimations();
    initSmoothScroll();
});

// Binary Code Background Animation
function initBinaryAnimation() {
    const binaryChars = ['0', '1'];
    const numDigits = 50;
    
    function createBinaryDigit() {
        const digit = document.createElement('div');
        digit.className = 'binary-digit';
        digit.textContent = binaryChars[Math.floor(Math.random() * binaryChars.length)];
        
        // Random positioning and animation duration
        digit.style.left = Math.random() * 100 + '%';
        digit.style.animationDuration = (Math.random() * 10 + 8) + 's';
        digit.style.animationDelay = Math.random() * 5 + 's';
        digit.style.fontSize = (Math.random() * 10 + 12) + 'px';
        digit.style.opacity = Math.random() * 0.7 + 0.3;
        
        binaryBackground.appendChild(digit);
        
        // Remove digit after animation completes
        setTimeout(() => {
            if (digit.parentNode) {
                digit.parentNode.removeChild(digit);
            }
        }, 15000);
    }
    
    // Create initial digits
    for (let i = 0; i < numDigits; i++) {
        setTimeout(() => createBinaryDigit(), i * 200);
    }
    
    // Continue creating digits
    setInterval(createBinaryDigit, 300);
}

// Spider Web Canvas Animation
function initSpiderWeb() {
    const canvas = spiderWebCanvas;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Web points
    const points = [];
    const numPoints = 80;
    const maxDistance = 150;
    
    // Create web points
    for (let i = 0; i < numPoints; i++) {
        points.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            pulse: Math.random() * Math.PI * 2
        });
    }
    
    function animateWeb() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update points
        points.forEach(point => {
            point.x += point.vx;
            point.y += point.vy;
            point.pulse += 0.02;
            
            // Bounce off edges
            if (point.x <= 0 || point.x >= canvas.width) point.vx *= -1;
            if (point.y <= 0 || point.y >= canvas.height) point.vy *= -1;
            
            // Keep points within bounds
            point.x = Math.max(0, Math.min(canvas.width, point.x));
            point.y = Math.max(0, Math.min(canvas.height, point.y));
        });
        
        // Draw connections
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 1;
        
        for (let i = 0; i < points.length; i++) {
            for (let j = i + 1; j < points.length; j++) {
                const dx = points[i].x - points[j].x;
                const dy = points[i].y - points[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < maxDistance) {
                    const opacity = (1 - distance / maxDistance) * 0.5;
                    const pulse = (Math.sin(points[i].pulse) + 1) * 0.5;
                    
                    ctx.globalAlpha = opacity * pulse * 0.8;
                    ctx.beginPath();
                    ctx.moveTo(points[i].x, points[i].y);
                    ctx.lineTo(points[j].x, points[j].y);
                    ctx.stroke();
                }
            }
        }
        
        // Draw points
        ctx.fillStyle = '#00ffff';
        points.forEach(point => {
            const pulse = (Math.sin(point.pulse) + 1) * 0.5;
            ctx.globalAlpha = 0.8 * pulse;
            ctx.beginPath();
            ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
            ctx.fill();
        });
        
        requestAnimationFrame(animateWeb);
    }
    
    animateWeb();
}

// Typewriter Effect
function initTypewriter() {
    const text = heroName.textContent;
    heroName.textContent = '';
    heroName.style.borderRight = '2px solid #00ffff';
    
    let i = 0;
    function typeWriter() {
        if (i < text.length) {
            heroName.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        } else {
            // Blinking cursor effect
            setInterval(() => {
                heroName.style.borderRight = heroName.style.borderRight === '2px solid #00ffff' 
                    ? '2px solid transparent' 
                    : '2px solid #00ffff';
            }, 750);
        }
    }
    
    // Start typewriter after a delay
    setTimeout(typeWriter, 1000);
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Add fade-in class to all sections and cards
    const elementsToAnimate = document.querySelectorAll('.glass-card, .section-title');
    elementsToAnimate.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
    
    // Stagger animation for skill tags and project cards
    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach((tag, index) => {
        tag.style.animationDelay = `${index * 0.1}s`;
        tag.classList.add('fade-in');
        observer.observe(tag);
    });
    
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
        observer.observe(card);
    });
}

// Smooth Scroll for Navigation - FIXED VERSION
function initSmoothScroll() {
    // Handle all navigation links
    const navLinks = document.querySelectorAll('.nav-link, .btn[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = 80; // Account for fixed navigation
                const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                // Smooth scroll to target
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Add active state to navigation
                navLinks.forEach(navLink => navLink.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
    
    // Update active navigation on scroll
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.pageYOffset + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = '#' + section.getAttribute('id');
            const correspondingNavLink = document.querySelector(`.nav-link[href="${sectionId}"]`);
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                // Remove active class from all nav links
                document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
                // Add active class to current section's nav link
                if (correspondingNavLink) {
                    correspondingNavLink.classList.add('active');
                }
            }
        });
    });
}

// Parallax Effect for Hero Section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero');
    
    parallaxElements.forEach(element => {
        const speed = 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
    
    // Update nav background opacity
    const nav = document.querySelector('.nav');
    const opacity = Math.min(scrolled / 100, 0.95);
    nav.style.background = `rgba(10, 10, 10, ${opacity})`;
});

// Interactive Skill Cards
document.addEventListener('DOMContentLoaded', () => {
    const skillCards = document.querySelectorAll('.skill-card');
    
    skillCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const tags = card.querySelectorAll('.skill-tag');
            tags.forEach((tag, index) => {
                setTimeout(() => {
                    tag.style.transform = 'scale(1.1) rotate(5deg)';
                    tag.style.background = 'rgba(0, 255, 255, 0.4)';
                }, index * 50);
            });
        });
        
        card.addEventListener('mouseleave', () => {
            const tags = card.querySelectorAll('.skill-tag');
            tags.forEach(tag => {
                tag.style.transform = 'scale(1) rotate(0deg)';
                tag.style.background = 'rgba(0, 128, 255, 0.2)';
            });
        });
    });
});

// Experience Cards Expansion
document.addEventListener('DOMContentLoaded', () => {
    const experienceCards = document.querySelectorAll('.experience-card');
    
    experienceCards.forEach(card => {
        const header = card.querySelector('.experience-header');
        const details = card.querySelector('.experience-details');
        
        // Initially hide details on mobile
        if (window.innerWidth <= 768) {
            details.style.maxHeight = '0';
            details.style.overflow = 'hidden';
            details.style.transition = 'max-height 0.3s ease';
            header.style.cursor = 'pointer';
            
            header.addEventListener('click', () => {
                if (details.style.maxHeight === '0px') {
                    details.style.maxHeight = details.scrollHeight + 'px';
                    card.style.borderColor = 'rgba(0, 255, 255, 0.6)';
                } else {
                    details.style.maxHeight = '0';
                    card.style.borderColor = 'rgba(0, 255, 255, 0.2)';
                }
            });
        }
    });
});

// Data Flow Animation
function createDataFlow() {
    const hero = document.querySelector('.hero');
    const dataFlow = hero.querySelector('.data-flow-animation');
    
    function createFlowLine() {
        const line = document.createElement('div');
        line.style.position = 'absolute';
        line.style.width = '2px';
        line.style.height = '100px';
        line.style.background = 'linear-gradient(180deg, transparent, #00ffff, transparent)';
        line.style.left = Math.random() * 100 + '%';
        line.style.top = '-100px';
        line.style.opacity = '0.7';
        line.style.animation = 'flow-down 4s linear infinite';
        
        dataFlow.appendChild(line);
        
        setTimeout(() => {
            if (line.parentNode) {
                line.parentNode.removeChild(line);
            }
        }, 4000);
    }
    
    // Add CSS animation for flow lines
    const style = document.createElement('style');
    style.textContent = `
        @keyframes flow-down {
            0% {
                transform: translateY(0) scaleY(0);
                opacity: 0;
            }
            10% {
                opacity: 0.7;
                transform: scaleY(1);
            }
            90% {
                opacity: 0.7;
                transform: scaleY(1);
            }
            100% {
                transform: translateY(100vh) scaleY(0);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Create flow lines periodically
    setInterval(createFlowLine, 800);
}

// Initialize data flow
document.addEventListener('DOMContentLoaded', createDataFlow);

// Mouse Follow Effect for Glass Cards
document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.glass-card');
    
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Only apply effect if mouse is over the card
        if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const deltaX = (x - centerX) / centerX;
            const deltaY = (y - centerY) / centerY;
            
            card.style.transform = `perspective(1000px) rotateY(${deltaX * 5}deg) rotateX(${-deltaY * 5}deg) translateZ(10px)`;
            card.style.boxShadow = `${-deltaX * 10}px ${-deltaY * 10}px 30px rgba(0, 255, 255, 0.2)`;
        } else {
            card.style.transform = '';
            card.style.boxShadow = '';
        }
    });
});

// Reset card transforms on mouse leave
document.querySelectorAll('.glass-card').forEach(card => {
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.boxShadow = '';
    });
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Trigger initial animations
    setTimeout(() => {
        const heroContent = document.querySelector('.hero-content');
        heroContent.style.animation = 'fadeInUp 1s ease-out';
    }, 500);
});

// Mobile menu toggle (for future enhancement)
const navToggle = document.createElement('button');
navToggle.innerHTML = '☰';
navToggle.className = 'nav-toggle';
navToggle.style.display = 'none';

// Add responsive behavior
function handleResize() {
    if (window.innerWidth <= 768) {
        navToggle.style.display = 'block';
    } else {
        navToggle.style.display = 'none';
    }
}

window.addEventListener('resize', handleResize);
handleResize();

// Performance optimization for animations
let ticking = false;

function updateAnimations() {
    // Batch DOM updates here if needed
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(updateAnimations);
        ticking = true;
    }
});

// Contact link interactions
document.querySelectorAll('.contact-link').forEach(link => {
    link.addEventListener('mouseenter', () => {
        link.style.transform = 'scale(1.05) translateY(-2px)';
        link.style.textShadow = '0 0 15px #00ffff';
    });
    
    link.addEventListener('mouseleave', () => {
        link.style.transform = '';
        link.style.textShadow = '';
    });
});

console.log('🚀 Portfolio initialized with futuristic data theme!');