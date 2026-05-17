document.addEventListener('DOMContentLoaded', () => {
    // 1. AUDIO PLAYER LOGIC
    const audio = document.getElementById('story-audio-element');
    const playPauseBtn = document.getElementById('play-pause');
    const playIcon = playPauseBtn.querySelector('.icon-play');
    const pauseIcon = playPauseBtn.querySelector('.icon-pause');
    const progressBar = document.getElementById('progress-bar');
    const progressFill = document.getElementById('progress-fill');
    const currentTimeDisplay = document.getElementById('current-time');
    const durationDisplay = document.getElementById('duration');
    const audioCard = document.querySelector('.audio-card');

    const togglePlay = () => {
        if (audio.paused) {
            audio.play();
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
            audioCard.classList.add('playing');
        } else {
            audio.pause();
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
            audioCard.classList.remove('playing');
        }
    };

    playPauseBtn.addEventListener('click', togglePlay);

    // Update progress and sync text
    const paragraphs = document.querySelectorAll('#story-content p');
    
    audio.addEventListener('timeupdate', () => {
        const percent = (audio.currentTime / audio.duration) * 100;
        progressFill.style.width = `${percent}%`;
        currentTimeDisplay.textContent = formatTime(audio.currentTime);

        // Sync text
        let currentIdx = -1;
        paragraphs.forEach((p, index) => {
            const startTime = parseFloat(p.getAttribute('data-start'));
            if (audio.currentTime >= startTime) {
                currentIdx = index;
            }
        });

        if (currentIdx !== -1) {
            paragraphs.forEach((p, index) => {
                if (index === currentIdx) {
                    if (!p.classList.contains('active')) {
                        p.classList.add('active');
                        // Scroll the active paragraph into view within its container
                        const container = document.getElementById('story-content');
                        const topPos = p.offsetTop - container.offsetTop - (container.clientHeight / 2) + (p.clientHeight / 2);
                        container.scrollTo({ top: topPos, behavior: 'smooth' });
                    }
                } else {
                    p.classList.remove('active');
                }
            });
        }
    });

    // Seek on progress bar click
    progressBar.addEventListener('click', (e) => {
        const width = progressBar.clientWidth;
        const clickX = e.offsetX;
        const duration = audio.duration;
        audio.currentTime = (clickX / width) * duration;
    });

    // Set duration on load
    audio.addEventListener('loadedmetadata', () => {
        durationDisplay.textContent = formatTime(audio.duration);
    });

    // Reset on end
    audio.addEventListener('ended', () => {
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
        audioCard.classList.remove('playing');
        progressFill.style.width = '0%';
        audio.currentTime = 0;
    });

    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // Hero buttons logic
    document.getElementById('btn-play-hero').addEventListener('click', () => {
        document.getElementById('story-audio').scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
            if (audio.paused) togglePlay();
        }, 800);
    });

    document.getElementById('btn-read-hero').addEventListener('click', () => {
        document.getElementById('story-audio').scrollIntoView({ behavior: 'smooth' });
    });


    // 2. SCROLL REVEAL ANIMATIONS
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-zoom').forEach(el => {
        observer.observe(el);
    });


    // 3. 3D TILT EFFECT (REPLICATING MARS REJECTS)
    const hero = document.getElementById('hero');
    const heroBg = document.querySelector('.hero-bg');
    const focusPoster = document.getElementById('focus-poster');

    hero.addEventListener('mousemove', (e) => {
        const { width, height } = hero.getBoundingClientRect();
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        // Calculate rotation based on mouse position relative to center
        const xRotation = ((mouseY - height / 2) / height) * 20; // Max 10 degrees
        const yRotation = ((mouseX - width / 2) / width) * -20; // Max 10 degrees

        heroBg.style.transform = `rotateX(${xRotation}deg) rotateY(${yRotation}deg) scale(1.05)`;
    });

    hero.addEventListener('mouseleave', () => {
        heroBg.style.transform = `rotateX(0deg) rotateY(0deg) scale(1)`;
    });

    // 4. PARALLAX & SCROLL LOGIC
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        // Focus Poster Parallax
        const posterSection = document.getElementById('poster-focus');
        if (posterSection) {
            const posterOffset = posterSection.offsetTop;
            const posterHeight = posterSection.offsetHeight;
            
            if (scrolled > posterOffset - window.innerHeight && scrolled < posterOffset + posterHeight) {
                const relativeScroll = scrolled - posterOffset;
                focusPoster.style.transform = `translateY(${relativeScroll * 0.05}px)`;
            }
        }

        // Scroll to Top visibility
        const scrollTopBtn = document.getElementById('scroll-to-top');
        if (scrolled > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });


    // 5. SCROLL TO TOP
    document.getElementById('scroll-to-top').addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});
