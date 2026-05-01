document.addEventListener("DOMContentLoaded", () => {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.nav-dot, .dot'); // supports both class names
    const btnStart = document.getElementById('btnStart');
    let currentSlide = 0;
    let isAnimating = false;

    // Initialize dots if using .dot class from earlier HTML
    if (dots.length > 0) {
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                goToSlide(index);
            });
        });
    }

    // Start Button Event
    if (btnStart) {
        btnStart.addEventListener('click', () => {
            goToSlide(1);
        });
    }

    // Function to change slide
    function goToSlide(index) {
        if (isAnimating || currentSlide === index) return;
        if (index < 0 || index >= slides.length) return;

        isAnimating = true;

        // Remove active class from current
        slides[currentSlide].classList.remove('active');
        if (dots[currentSlide]) dots[currentSlide].classList.remove('active');

        // Update current index
        currentSlide = index;

        // Add active class to new
        slides[currentSlide].classList.add('active');
        if (dots[currentSlide]) dots[currentSlide].classList.add('active');

        // Play specific animations based on slide index
        handleSlideAnimations(currentSlide);

        setTimeout(() => {
            isAnimating = false;
        }, 1000); // match CSS transition duration
    }

    // Handle Scroll/Wheel events
    window.addEventListener('wheel', (e) => {
        if (e.deltaY > 50) {
            goToSlide(currentSlide + 1); // Scroll Down
        } else if (e.deltaY < -50) {
            goToSlide(currentSlide - 1); // Scroll Up
        }
    });

    // Handle Touch Swipe events for Mobile
    let touchStartY = 0;
    let touchEndY = 0;

    window.addEventListener('touchstart', e => {
        touchStartY = e.changedTouches[0].screenY;
    });

    window.addEventListener('touchend', e => {
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    });

    function handleSwipe() {
        if (touchEndY < touchStartY - 50) {
            goToSlide(currentSlide + 1); // Swipe Up
        }
        if (touchEndY > touchStartY + 50) {
            goToSlide(currentSlide - 1); // Swipe Down
        }
    }

    // Handle specific slide logic (e.g., Confetti on last slide)
    function handleSlideAnimations(index) {
        if (index === slides.length - 1) {
            fireConfetti();
        }
    }

    // Simple Confetti function
    function fireConfetti() {
        const confettiContainer = document.getElementById('confettiContainer');
        if (!confettiContainer) return;
        
        confettiContainer.innerHTML = ''; // Clear existing
        const colors = ['#ff758f', '#ff91a4', '#ffd1dc', '#fff'];
        
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'absolute';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = -10 + 'px';
            confetti.style.opacity = Math.random() + 0.5;
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            
            // Animation
            const duration = Math.random() * 3 + 2;
            const delay = Math.random() * 2;
            
            confetti.style.animation = `fall ${duration}s ${delay}s linear forwards`;
            
            confettiContainer.appendChild(confetti);
        }
        
        // Add animation keyframes dynamically if not present
        if (!document.getElementById('confettiStyle')) {
            const style = document.createElement('style');
            style.id = 'confettiStyle';
            style.innerHTML = `
                @keyframes fall {
                    to {
                        transform: translateY(100vh) rotate(720deg);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
});
