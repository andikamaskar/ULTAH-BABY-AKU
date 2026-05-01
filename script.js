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

    // Global Audio Playback (overcomes browser autoplay restrictions)
    let audioPlayed = false;
    function tryPlayAudio() {
        if (!audioPlayed) {
            const bgMusic = document.getElementById('bgMusic');
            if (bgMusic) {
                bgMusic.volume = 0.5;
                const playPromise = bgMusic.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        audioPlayed = true;
                    }).catch(error => {
                        console.log("Audio playback failed:", error);
                    });
                }
            }
        }
    }

    // Attempt to play music on ANY user interaction anywhere on the screen
    document.body.addEventListener('click', tryPlayAudio);
    document.body.addEventListener('touchstart', tryPlayAudio);

    // Start Button Event
    if (btnStart) {
        btnStart.addEventListener('click', () => {
            document.body.classList.add('started'); // Show navigation controls
            goToSlide(1);
            
            // Play background music
            const bgMusic = document.getElementById('bgMusic');
            if (bgMusic) {
                bgMusic.volume = 0.5; // Set volume to 50% so it's not too loud
                bgMusic.play().catch(error => {
                    console.log("Autoplay prevented by browser:", error);
                });
            }
        });
    }

    // Close Letter Modal
    const closeLetterBtn = document.getElementById('closeLetter');
    const letterModal = document.getElementById('letterModal');
    if (closeLetterBtn && letterModal) {
        closeLetterBtn.addEventListener('click', () => {
            letterModal.classList.remove('show');
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
        // Prevent scrolling out of the first slide
        if (currentSlide === 0) return;

        const slide = slides[currentSlide];
        
        // If the slide content is taller than the screen, allow native scrolling first
        if (slide.scrollHeight > slide.clientHeight) {
            const atTop = slide.scrollTop <= 0;
            const atBottom = Math.abs(slide.scrollHeight - slide.clientHeight - slide.scrollTop) <= 2;
            
            // Allow scrolling down if not at bottom
            if (e.deltaY > 0 && !atBottom) return;
            // Allow scrolling up if not at top
            if (e.deltaY < 0 && !atTop) return;
        }

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
        // Prevent swiping out of the first slide
        if (currentSlide === 0) return;

        const slide = slides[currentSlide];
        
        // If the slide is scrollable, allow native touch scroll first
        if (slide.scrollHeight > slide.clientHeight) {
            const atTop = slide.scrollTop <= 0;
            const atBottom = Math.abs(slide.scrollHeight - slide.clientHeight - slide.scrollTop) <= 2;
            
            // Swiping Up (scrolling down)
            if (touchEndY < touchStartY - 50 && !atBottom) return;
            // Swiping Down (scrolling up)
            if (touchEndY > touchStartY + 50 && !atTop) return;
        }

        if (touchEndY < touchStartY - 50) {
            goToSlide(currentSlide + 1); // Swipe Up
        }
        if (touchEndY > touchStartY + 50) {
            goToSlide(currentSlide - 1); // Swipe Down
        }
    }

    // Handle specific slide logic (e.g., Confetti on last slide)
    function handleSlideAnimations(index) {
        const indicator = document.getElementById('scrollIndicator');
        
        if (index === slides.length - 1) {
            fireConfetti();
            // Replace scroll indicator with Letter Button
            if (indicator) {
                indicator.innerHTML = '<button id="btnLetter" class="btn-letter animate-text">Buka Pesan Rahasia 💌</button>';
                indicator.style.animation = 'none';
                
                // Add event listener to the new button
                setTimeout(() => {
                    const btnLetter = document.getElementById('btnLetter');
                    if (btnLetter) {
                        btnLetter.addEventListener('click', () => {
                            document.getElementById('letterModal').classList.add('show');
                        });
                    }
                }, 100);
            }
        } else {
            // Restore scroll indicator
            if (indicator) {
                indicator.innerHTML = '<div class="scroll-arrow"></div><span>Geser ke bawah</span>';
                indicator.style.animation = 'bounce 2s infinite';
            }
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
