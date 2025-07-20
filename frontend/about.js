// About page animations - same background effects as main page

document.addEventListener('DOMContentLoaded', function() {
    initializeAboutPage();
});

function initializeAboutPage() {
    // Create floating particles
    createParticles();
    
    // Animate heartbeat
    animateHeartbeat();
    
    // Add scroll animations
    addScrollAnimations();
}

function createParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    for (let i = 0; i < 60; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.width = particle.style.height = Math.random() * 8 + 4 + 'px';
        particle.style.animationDelay = Math.random() * 8 + 's';
        particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
        particlesContainer.appendChild(particle);
    }
}

function animateHeartbeat() {
    const path = document.getElementById('pulse');
    const dot = document.getElementById('heart-dot');
    
    if (!path || !dot) return;

    function animate() {
        const pathLen = path.getTotalLength();
        let dir = 1;
        let progress = 0;

        function step() {
            progress += dir * 3;
            if (progress >= pathLen || progress <= 0) dir *= -1;

            const pos = path.getPointAtLength(progress);
            dot.setAttribute('cx', pos.x);
            dot.setAttribute('cy', pos.y);

            const time = performance.now();
            const p1 = 0.5 + Math.abs(Math.sin(time/180 + progress/12)) * 0.6;
            const r = 8 + 5 * p1;
            
            dot.setAttribute('r', r);
            dot.setAttribute('opacity', 0.8 + p1 * 0.2);
            
            // Rainbow colors
            const hue = (time/40 + progress/8) % 360;
            dot.setAttribute('fill', `hsl(${hue}, 75%, 65%)`);
            dot.setAttribute('stroke', `hsl(${hue + 60}, 85%, 85%)`);

            // Animated path
            const pathHue = (time/80 + progress/15) % 360;
            path.setAttribute('stroke', `hsl(${pathHue}, 65%, 55%)`);
            path.setAttribute('stroke-width', 6 + 2 * Math.abs(Math.sin(time/350)));

            requestAnimationFrame(step);
        }
        step();
    }
    animate();
}

function addScrollAnimations() {
    const cards = document.querySelectorAll('.content-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'cardSlideIn 0.6s ease-out forwards';
            }
        });
    }, { threshold: 0.1 });
    
    cards.forEach(card => {
        observer.observe(card);
    });
}

// Add slide-in animation
const style = document.createElement('style');
style.textContent = `
    @keyframes cardSlideIn {
        from {
            opacity: 0;
            transform: translateY(50px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);
