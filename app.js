/* ==========================================================================
   CREWCUTT MEDIA // THE CINEMATIC ART & INTERACTIVE ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Core Modules
    initOscilloscopeCanvas();
    initCustomCursor();
    initSoundLounge();
    initPortfolioFilter();
    initScrollytelling();
    initCapabilitiesAccordion();
    initStudioWidgets();
    initTheatreModal();
});

/* ==========================================================================
   1. MATHEMATICAL OSCILLOSCOPE CANVAS BACKGROUND
   ========================================================================== */
function initOscilloscopeCanvas() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    let mouse = { x: width / 2, y: height / 2, active: false };
    let globalWaveOffset = 0;
    
    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.active = true;
    });

    window.addEventListener('mouseleave', () => {
        mouse.active = false;
    });

    // Sine-wave mathematical configurations
    const waves = [
        { amplitude: 45, frequency: 0.003, speed: 0.02, color: 'rgba(0, 255, 102, 0.15)', yOffset: 0.5 },
        { amplitude: 25, frequency: 0.006, speed: 0.03, color: 'rgba(0, 255, 102, 0.08)', yOffset: 0.48 },
        { amplitude: 15, frequency: 0.012, speed: 0.01, color: 'rgba(0, 255, 102, 0.05)', yOffset: 0.52 },
        { amplitude: 8,  frequency: 0.02,  speed: 0.04, color: 'rgba(39, 255, 20, 0.04)',  yOffset: 0.5 }
    ];

    // Render loop
    function animate() {
        ctx.fillStyle = 'rgba(4, 4, 5, 0.08)'; // Keep trailing motion glow
        ctx.fillRect(0, 0, width, height);

        // Draw camera focus line markers
        ctx.strokeStyle = 'rgba(0, 255, 102, 0.015)';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(0, height * 0.5);
        ctx.lineTo(width, height * 0.5);
        ctx.stroke();

        globalWaveOffset += 0.002;

        waves.forEach((wave, idx) => {
            ctx.beginPath();
            ctx.strokeStyle = wave.color;
            ctx.lineWidth = idx === 0 ? 1.5 : 0.8;

            // Scale wave amplitude dynamically based on viewport height for mobile responsiveness
            const scale = Math.min(1, height / 900);
            const waveAmp = wave.amplitude * scale;

            for (let x = 0; x < width; x += 2) {
                // Base sine wave math
                let rawSine = Math.sin(x * wave.frequency + globalWaveOffset * wave.speed * 50);
                
                // Mouse proximity disturbance calculations (Interactive distortion)
                let mouseDistortion = 0;
                if (mouse.active) {
                    let dx = x - mouse.x;
                    let dy = (height * wave.yOffset) - mouse.y;
                    let distance = Math.hypot(dx, dy);
                    
                    if (distance < 200) {
                        let force = (200 - distance) / 200;
                        // Frequency shift distortion based on vertical distance
                        mouseDistortion = Math.sin(x * 0.08) * force * waveAmp * 0.8;
                    }
                }

                let y = (height * wave.yOffset) + (rawSine * waveAmp) + mouseDistortion;
                
                if (x === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.stroke();
        });

        // Slow cinematic scope sweep lines (glowing CRT bars)
        const sweepY = (Math.sin(globalWaveOffset * 0.5) * 0.5 + 0.5) * height;
        ctx.fillStyle = 'rgba(0, 255, 102, 0.008)';
        ctx.fillRect(0, sweepY - 2, width, 4);

        requestAnimationFrame(animate);
    }
    animate();
}

/* ==========================================================================
   2. CUSTOM PHYSICS CURSOR & MAGNETIC PULL
   ========================================================================== */
function initCustomCursor() {
    const cursor = document.querySelector('.custom-cursor');
    const dot = document.querySelector('.custom-cursor-dot');
    const label = document.querySelector('.cursor-label');
    
    if (!cursor || !dot) return;

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let dotX = 0, dotY = 0;
    
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Physics Loop
    function updateCoordinates() {
        const ringLerp = 0.12; // Extra smooth, slightly delayed ring
        const dotLerp = 0.35;

        cursorX += (mouseX - cursorX) * ringLerp;
        cursorY += (mouseY - cursorY) * ringLerp;

        dotX += (mouseX - dotX) * dotLerp;
        dotY += (mouseY - dotY) * dotLerp;

        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;

        dot.style.left = `${dotX}px`;
        dot.style.top = `${dotY}px`;

        requestAnimationFrame(updateCoordinates);
    }
    updateCoordinates();

    // Snapping Snag guides
    const magneticTargets = document.querySelectorAll('.magnetic-target');
    const cursorTriggers = document.querySelectorAll('[data-cursor]');

    magneticTargets.forEach(target => {
        target.addEventListener('mouseenter', () => {
            cursor.classList.add('hovering');
        });
        target.addEventListener('mouseleave', () => {
            cursor.classList.remove('hovering');
            target.style.transform = 'translate3d(0, 0, 0)';
        });

        target.addEventListener('mousemove', (e) => {
            const rect = target.getBoundingClientRect();
            const relX = e.clientX - rect.left - (rect.width / 2);
            const relY = e.clientY - rect.top - (rect.height / 2);
            
            const pullLimit = 6;
            const xVal = (relX / rect.width) * pullLimit;
            const yVal = (relY / rect.height) * pullLimit;
            
            target.style.transform = `translate3d(${xVal}px, ${yVal}px, 0)`;
        });
    });

    cursorTriggers.forEach(trigger => {
        trigger.addEventListener('mouseenter', () => {
            const type = trigger.getAttribute('data-cursor');
            label.textContent = type;
            cursor.classList.add(type.toLowerCase() === 'play' ? 'playing' : 'viewing');
        });

        trigger.addEventListener('mouseleave', () => {
            cursor.classList.remove('playing', 'viewing');
        });
    });
}

/* ==========================================================================
   3. SOUND LOUNGE (CYBER SONAR & ANALOGUE DRONE SYNTHESIZER LIBRARY)
   ========================================================================== */
function initSoundLounge() {
    const toggleBtn = document.querySelector('.sound-toggle');
    const toggleStatus = document.querySelector('.sound-status');
    if (!toggleBtn) return;

    let soundActive = false;
    let audioCtx = null;

    toggleBtn.addEventListener('click', () => {
        soundActive = !soundActive;
        toggleBtn.classList.toggle('active', soundActive);
        toggleStatus.textContent = soundActive ? 'ON' : 'OFF';

        if (soundActive && !audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        if (soundActive) playSynthSound('success');
    });

    // Artpiece Synthesizer Core Engine
    function playSynthSound(type) {
        if (!soundActive || !audioCtx) return;
        
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        const now = audioCtx.currentTime;

        if (type === 'sonar') {
            // High Q Submarine-style sonar ping with echo
            const osc = audioCtx.createOscillator();
            const filter = audioCtx.createBiquadFilter();
            const gain = audioCtx.createGain();
            
            osc.connect(filter);
            filter.connect(gain);
            gain.connect(audioCtx.destination);
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1400, now);
            osc.frequency.exponentialRampToValueAtTime(700, now + 0.3);
            
            filter.type = 'bandpass';
            filter.Q.value = 8;
            filter.frequency.setValueAtTime(1400, now);
            
            gain.gain.setValueAtTime(0.04, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
            
            osc.start(now);
            osc.stop(now + 0.4);

        } else if (type === 'drone') {
            // Low atmospheric analog synthesizer sweep drone (120Hz triangle oscillator)
            const osc = audioCtx.createOscillator();
            const filter = audioCtx.createBiquadFilter();
            const gain = audioCtx.createGain();
            
            osc.connect(filter);
            filter.connect(gain);
            gain.connect(audioCtx.destination);
            
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(110, now); // Low A note
            osc.frequency.linearRampToValueAtTime(120, now + 0.4);
            
            filter.type = 'lowpass';
            filter.Q.value = 3;
            filter.frequency.setValueAtTime(150, now);
            filter.frequency.exponentialRampToValueAtTime(800, now + 0.4);
            
            gain.gain.setValueAtTime(0.06, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
            
            osc.start(now);
            osc.stop(now + 0.5);

        } else if (type === 'success') {
            // Sophisticated cyber retro harmonic pentatonic major scale arpeggio
            const notes = [293.66, 329.63, 392.00, 440.00, 523.25]; // D4, E4, G4, A4, C5 arpeggio
            notes.forEach((freq, idx) => {
                const noteTime = now + (idx * 0.06);
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, noteTime);
                
                gain.gain.setValueAtTime(0.03, noteTime);
                gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.3);
                
                osc.start(noteTime);
                osc.stop(noteTime + 0.35);
            });

        } else if (type === 'cinema') {
            // Sub-drop combined with dynamic celluloid film scratch static noise
            const duration = 0.8;
            
            // Sub-drop
            const subOsc = audioCtx.createOscillator();
            const subGain = audioCtx.createGain();
            subOsc.connect(subGain);
            subGain.connect(audioCtx.destination);
            
            subOsc.type = 'sine';
            subOsc.frequency.setValueAtTime(120, now);
            subOsc.frequency.exponentialRampToValueAtTime(25, now + duration);
            
            subGain.gain.setValueAtTime(0.18, now);
            subGain.gain.exponentialRampToValueAtTime(0.001, now + duration);
            
            subOsc.start(now);
            subOsc.stop(now + duration);

            // Dynamic white noise buffer (film crackle static sweep)
            const bufferSize = audioCtx.sampleRate * duration;
            const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
            const data = buffer.getChannelData(0);
            
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            
            const noise = audioCtx.createBufferSource();
            noise.buffer = buffer;
            
            const filter = audioCtx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.Q.value = 6;
            filter.frequency.setValueAtTime(800, now);
            filter.frequency.exponentialRampToValueAtTime(4000, now + duration);
            
            const noiseGain = audioCtx.createGain();
            noiseGain.gain.setValueAtTime(0.02, now);
            noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
            
            noise.connect(filter);
            filter.connect(noiseGain);
            noiseGain.connect(audioCtx.destination);
            
            noise.start(now);
            noise.stop(now + duration);
        }
    }

    // Attach Synth events
    const buttons = document.querySelectorAll('button, a.btn-primary, a.btn-secondary, .nav-link, .logo, .filter-btn, .social-link, .meta-link');
    buttons.forEach(el => {
        el.addEventListener('mouseenter', () => playSynthSound('sonar'));
    });

    const panels = document.querySelectorAll('.portfolio-card, .showreel-widget, .accordion-header');
    panels.forEach(el => {
        el.addEventListener('mouseenter', () => playSynthSound('drone'));
    });

    const theatreTriggers = document.querySelectorAll('.showreel-widget, .modal-close');
    theatreTriggers.forEach(el => {
        el.addEventListener('click', () => playSynthSound('cinema'));
    });

    window.triggerFormSuccessAudio = () => {
        playSynthSound('success');
    };
}

/* ==========================================================================
   4. SHOWCASE PORTFOLIO FILTER
   ========================================================================== */
function initPortfolioFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.portfolio-card');
    
    if (filterButtons.length === 0 || cards.length === 0) return;

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            cards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    card.classList.remove('hidden');
                    card.style.animation = 'none';
                    card.offsetHeight;
                    card.style.animation = 'cardReveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards';
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
}

/* ==========================================================================
   5. INTERACTIVE TIMELINE SCROLLYTELLING
   ========================================================================== */
function initScrollytelling() {
    const steps = document.querySelectorAll('.timeline-step');
    const progress = document.querySelector('.timeline-progress');
    const timelineContainer = document.querySelector('.timeline-container');
    
    if (steps.length === 0 || !progress) return;

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -25% 0px',
        threshold: 0.2
    };

    const stepObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    steps.forEach(step => stepObserver.observe(step));

    // Dynamic timeline progression
    window.addEventListener('scroll', () => {
        const rect = timelineContainer.getBoundingClientRect();
        const winHeight = window.innerHeight;
        
        const totalHeight = rect.height;
        const scrolledOffset = winHeight / 2 - rect.top;
        
        let percent = (scrolledOffset / totalHeight) * 100;
        percent = Math.max(0, Math.min(100, percent));
        
        progress.style.height = `${percent}%`;
    });
}

/* ==========================================================================
   6. CAPABILITIES ACCORDION SWITCHER
   ========================================================================== */
function initCapabilitiesAccordion() {
    const items = document.querySelectorAll('.accordion-item');
    
    items.forEach(item => {
        const header = item.querySelector('.accordion-header');
        
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            items.forEach(i => {
                i.classList.remove('active');
                i.querySelector('.accordion-body').style.maxHeight = '0px';
            });
            
            if (!isActive) {
                item.classList.add('active');
                const body = item.querySelector('.accordion-body');
                body.style.maxHeight = `${body.scrollHeight}px`;
            }
        });
    });

    const defaultActive = document.querySelector('.accordion-item.active');
    if (defaultActive) {
        const body = defaultActive.querySelector('.accordion-body');
        body.style.maxHeight = `${body.scrollHeight}px`;
    }
}

/* ==========================================================================
   7. STUDIO OPERATIONAL WIDGETS
   ========================================================================== */
function initStudioWidgets() {
    const timeDisplay = document.getElementById('studio-time');
    const contactForm = document.getElementById('main-contact-form');
    const successToast = document.getElementById('success-toast');

    // 1. Digital ticking clock in studio time zone (EST/Ottawa)
    function updateClock() {
        if (!timeDisplay) return;
        const options = {
            timeZone: 'America/New_York',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        };
        const formatter = new Intl.DateTimeFormat('en-US', options);
        timeDisplay.textContent = formatter.format(new Date());
    }
    setInterval(updateClock, 1000);
    updateClock();

    // 2. Interactive Input Focus styling & dynamic form submission
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const inputs = contactForm.querySelectorAll('input, select, textarea');
            let isValid = true;

            inputs.forEach(input => {
                if (!input.checkValidity()) {
                    isValid = false;
                    input.style.borderBottomColor = 'var(--accent-flame)';
                }
            });

            if (isValid) {
                const submitBtn = contactForm.querySelector('.btn-submit');
                const submitTxt = submitBtn.querySelector('.submit-text');
                
                submitBtn.disabled = true;
                submitTxt.textContent = "TRANSMITTING BRIEF...";

                setTimeout(() => {
                    submitTxt.textContent = "BRIEF TRANSMITTED";
                    contactForm.reset();
                    submitBtn.disabled = false;
                    
                    if (window.triggerFormSuccessAudio) {
                        window.triggerFormSuccessAudio();
                    }

                    if (successToast) {
                        successToast.classList.add('active');
                        setTimeout(() => {
                            successToast.classList.remove('active');
                            submitTxt.textContent = "TRANSMIT BRIEF";
                        }, 5000);
                    }
                }, 2000);
            }
        });
    }
}

/* ==========================================================================
   8. CINEMATIC VIDEO THEATRE (MODAL & CUSTOM SKIN LAYER)
   ========================================================================== */
function initTheatreModal() {
    const trigger = document.querySelector('.showreel-widget');
    const modal = document.getElementById('showreel-modal');
    const closeBtn = document.querySelector('.modal-close');
    const video = document.getElementById('theatre-video');
    
    if (!trigger || !modal || !closeBtn || !video) return;

    // Player controls nodes
    const playBtn = modal.querySelector('.play-pause-btn');
    const playIcon = playBtn.querySelector('.play-icon');
    const pauseIcon = playBtn.querySelector('.pause-icon');
    const timeDisplay = modal.querySelector('.video-time');
    const progressContainer = modal.querySelector('.progress-container');
    const progressFilled = modal.querySelector('.progress-filled');
    const progressHandle = modal.querySelector('.progress-handle');
    const volumeBtn = modal.querySelector('.volume-btn');
    const volIconHigh = volumeBtn.querySelector('.vol-icon-high');
    const volIconMute = volumeBtn.querySelector('.vol-icon-mute');
    const volumeSlider = modal.querySelector('.volume-slider');
    const speedBtn = modal.querySelector('.speed-btn');
    const fullscreenBtn = modal.querySelector('.fullscreen-btn');
    const playerWrapper = modal.querySelector('.custom-video-player');

    // 1. Modal Toggle
    trigger.addEventListener('click', () => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        video.play().catch(err => console.log('Autoplay blocked'));
        updatePlayIcons();
    });

    function closeTheatre() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        video.pause();
        video.currentTime = 0;
    }

    closeBtn.addEventListener('click', closeTheatre);
    modal.querySelector('.modal-bg').addEventListener('click', closeTheatre);
    
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeTheatre();
        }
    });

    // 2. Play/Pause
    function togglePlay() {
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
        updatePlayIcons();
    }

    function updatePlayIcons() {
        if (video.paused) {
            playIcon.classList.remove('hidden');
            pauseIcon.classList.add('hidden');
        } else {
            playIcon.classList.add('hidden');
            pauseIcon.classList.remove('hidden');
        }
    }

    playBtn.addEventListener('click', togglePlay);
    video.addEventListener('click', togglePlay);
    video.addEventListener('play', updatePlayIcons);
    video.addEventListener('pause', updatePlayIcons);

    // 3. Time calculations
    function formatVideoTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    video.addEventListener('timeupdate', () => {
        const percent = (video.currentTime / video.duration) * 100;
        progressFilled.style.width = `${percent}%`;
        progressHandle.style.left = `${percent}%`;

        const current = formatVideoTime(video.currentTime);
        const duration = isNaN(video.duration) ? '00:00' : formatVideoTime(video.duration);
        timeDisplay.textContent = `${current} / ${duration}`;
    });

    function scrub(e) {
        const rect = progressContainer.getBoundingClientRect();
        const scrubTime = ((e.clientX - rect.left) / rect.width) * video.duration;
        video.currentTime = scrubTime;
    }

    let mousedown = false;
    progressContainer.addEventListener('click', scrub);
    progressContainer.addEventListener('mousemove', (e) => mousedown && scrub(e));
    progressContainer.addEventListener('mousedown', () => mousedown = true);
    window.addEventListener('mouseup', () => mousedown = false);

    // 4. Volume controls
    function handleVolumeChange() {
        video.volume = volumeSlider.value;
        video.muted = video.volume === 0;
        updateVolumeIcons();
    }

    function updateVolumeIcons() {
        if (video.muted || video.volume === 0) {
            volIconHigh.classList.add('hidden');
            volIconMute.classList.remove('hidden');
        } else {
            volIconHigh.classList.remove('hidden');
            volIconMute.classList.add('hidden');
        }
    }

    volumeSlider.addEventListener('input', handleVolumeChange);
    volumeBtn.addEventListener('click', () => {
        video.muted = !video.muted;
        if (!video.muted && video.volume === 0) {
            video.volume = 0.8;
            volumeSlider.value = 0.8;
        }
        updateVolumeIcons();
    });

    // 5. Playback Speed
    const speeds = [1.0, 1.25, 1.5, 2.0, 0.75];
    let speedIndex = 0;
    
    speedBtn.addEventListener('click', () => {
        speedIndex = (speedIndex + 1) % speeds.length;
        const newSpeed = speeds[speedIndex];
        video.playbackRate = newSpeed;
        speedBtn.textContent = `${newSpeed}x`;
    });

    // 6. Fullscreen
    fullscreenBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            playerWrapper.requestFullscreen().catch(err => {
                console.log(`Error enabling fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    });

    document.addEventListener('fullscreenchange', () => {
        if (document.fullscreenElement) {
            playerWrapper.style.borderRadius = '0';
        } else {
            playerWrapper.style.borderRadius = '4px';
        }
    });
}
