document.addEventListener('DOMContentLoaded', () => {
    // 1. Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            
            // Prevent default if it's not a generic "#"
            if (targetId !== '#') {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Calculate offset for fixed navbar
                    const headerOffset = 80;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // 3. Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const menuIcon = mobileBtn.querySelector('i');

    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            // Toggle icon bars to times (X)
            if (navLinks.classList.contains('active')) {
                menuIcon.className = 'fas fa-times';
            } else {
                menuIcon.className = 'fas fa-bars';
            }
        });

        // Close menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuIcon.className = 'fas fa-bars';
            });
        });
    }

    // 4. Subtle Reveal Animation for Elements (Optional but adds premium feel)
    const revealElements = document.querySelectorAll('.service-card, .section-header, .hero-content > *');
    
    // Initial state: hide elements
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
    });
    
    // Create an intersection observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // Add a slight delay based on the element's index if it's a grid item
                const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 150;
                
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, entry.target.classList.contains('service-card') ? delay : 0);
                
                // Unobserve once revealed
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });
    
    // Observe all elements
    revealElements.forEach(el => {
        observer.observe(el);
    });

    // 5. Background Music Logic (Pure JS Implementation)
    const music = new Audio('wedding-music.mp3');
    music.loop = true;
    music.volume = 0.5;

    const musicBtn = document.getElementById('music-toggle');
    const musicIcon = musicBtn.querySelector('i');
    let isPlaying = false;

    const playMusic = () => {
        music.play().then(() => {
            isPlaying = true;
            musicBtn.classList.remove('paused');
            musicIcon.className = 'fas fa-music';
        }).catch(err => {
            console.log("Audio play blocked/failed:", err);
        });
    };

    const toggleMusic = () => {
        if (isPlaying) {
            music.pause();
            isPlaying = false;
            musicBtn.classList.add('paused');
            musicIcon.className = 'fas fa-volume-mute';
        } else {
            playMusic();
        }
    };

    if (musicBtn) {
        musicBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMusic();
        });
    }

    // Capture the very first user interaction to start audio
    const initAudio = () => {
        if (!isPlaying) {
            playMusic();
            // Clean up listeners
            window.removeEventListener('click', initAudio);
            window.removeEventListener('touchstart', initAudio);
        }
    };

    window.addEventListener('click', initAudio, { once: true });
    window.addEventListener('touchstart', initAudio, { once: true });
});

// Function to copy text to clipboard
window.copyToClipboard = function(text, btnElement) {
    navigator.clipboard.writeText(text).then(() => {
        const originalText = btnElement.innerHTML;
        btnElement.innerHTML = '<i class="fas fa-check"></i> Tersalin!';
        setTimeout(() => {
            btnElement.innerHTML = originalText;
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
};

// Function to send form data to WhatsApp
window.sendToWhatsapp = function() {
    const nama = document.getElementById('wa-nama').value;
    const kontak = document.getElementById('wa-kontak').value;
    const tanggal = document.getElementById('wa-tanggal').value || '-';
    const paket = document.getElementById('wa-paket').value || '-';
    const pesan = document.getElementById('wa-pesan').value || '-';

    const whatsappNumber = "6282352842990";
    
    const textMessage = `Halo Dwi Putri Organizer, saya berminat untuk konsultasi:
    
*Nama:* ${nama}
*Kontak:* ${kontak}
*Tanggal & Lokasi:* ${tanggal}
*Pilihan Paket:* ${paket}
*Pesan Tambahan:* ${pesan}

Mohon informasi lebih lanjut. Terima kasih!`;

    const encodedText = encodeURIComponent(textMessage);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedText}`;

    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');
};
