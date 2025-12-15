
// DOM Elements
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.nav-link');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const backToTop = document.getElementById('backToTop');
const currentYear = document.getElementById('current-year');
const contactForm = document.getElementById('contactForm');
const submitText = document.getElementById('submit-text');
const submitSpinner = document.getElementById('submit-spinner');
const formMessage = document.getElementById('form-message');
const telegramNotification = document.getElementById('telegram-notification');
const typedText = document.querySelector('.typed-text');
const cursor = document.querySelector('.cursor');
const skillBars = document.querySelectorAll('.skill-progress');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');
const carouselSlides = document.querySelectorAll('.testimonial-slide');
const carouselDots = document.querySelectorAll('.dot');
const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtn = document.querySelector('.carousel-btn.next');

// Telegram Bot Configuration - Your bot info
const TELEGRAM_BOT_TOKEN = '8502152183:AAEkcvqcR6vWYxvC4msAqF0R_iKRpHxZgv0';
const TELEGRAM_CHAT_ID = '5900380633'; // Your Telegram user ID

// Typing effect for hero section
const textArray = ['Frontend Developer', 'UI/UX Designer', 'JavaScript Expert'];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
let isPaused = false;

function typeEffect() {
    const currentText = textArray[textIndex];

    if (!isPaused) {
        if (!isDeleting && charIndex <= currentText.length) {
            typedText.textContent = currentText.substring(0, charIndex);
            charIndex++;
        }

        if (isDeleting && charIndex >= 0) {
            typedText.textContent = currentText.substring(0, charIndex);
            charIndex--;
        }

        if (!isDeleting && charIndex === currentText.length + 1) {
            isPaused = true;
            setTimeout(() => {
                isPaused = false;
                isDeleting = true;
            }, 1500);
            return;
        }

        if (isDeleting && charIndex === -1) {
            isDeleting = false;
            textIndex++;
            if (textIndex === textArray.length) {
                textIndex = 0;
            }
        }
    }

    const speed = isDeleting ? 50 : 100;
    setTimeout(typeEffect, speed);
}

// Function to send message to Telegram
async function sendToTelegram(formData) {
    try {
        // Format the message with HTML formatting for better readability
        const message = `
<b>📩 New Contact Form Submission</b>

<b>👤 Name:</b> ${formData.name}
<b>📧 Email:</b> ${formData.email}
<b>📋 Subject:</b> ${formData.subject || 'No subject provided'}

<b>📝 Message:</b>
${formData.message}

<b>⏰ Submitted at:</b> ${new Date().toLocaleString()}
<b>🌐 Submitted from:</b> ${window.location.href}
<b>📍 User IP:</b> ${await getUserIP()}
                `;

        // Encode the message for URL
        const encodedMessage = encodeURIComponent(message);

        // Create the Telegram API URL with HTML parse mode
        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=${encodedMessage}&parse_mode=HTML`;

        // Send the request
        const response = await fetch(url);
        const data = await response.json();

        return {
            success: data.ok,
            message: data.ok ? 'Message sent to Telegram successfully!' : 'Failed to send to Telegram',
            data: data
        };
    } catch (error) {
        console.error('Error sending to Telegram:', error);
        return {
            success: false,
            message: 'Error connecting to Telegram',
            error: error
        };
    }
}

// Function to get user IP address
async function getUserIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        return 'Unable to get IP';
    }
}

// Function to show Telegram notification
function showTelegramNotification(message, type = 'info') {
    // Create notification element if it doesn't exist
    let notificationArea = document.getElementById('telegram-notification-area');
    if (!notificationArea) {
        notificationArea = document.createElement('div');
        notificationArea.id = 'telegram-notification-area';
        notificationArea.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 9999;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    max-width: 400px;
                `;
        document.body.appendChild(notificationArea);
    }

    // Create notification
    const notification = document.createElement('div');
    notification.className = `telegram-notification ${type}`;
    notification.style.cssText = `
                background-color: ${type === 'success' ? 'rgba(34, 197, 94, 0.1)' :
            type === 'error' ? 'rgba(239, 68, 68, 0.1)' :
                'rgba(0, 136, 204, 0.1)'};
                border: 1px solid ${type === 'success' ? 'rgba(34, 197, 94, 0.3)' :
            type === 'error' ? 'rgba(239, 68, 68, 0.3)' :
                'rgba(0, 136, 204, 0.3)'};
                color: ${type === 'success' ? '#16a34a' :
            type === 'error' ? '#dc2626' :
                '#0088cc'};
                padding: 12px 16px;
                border-radius: 8px;
                font-size: 14px;
                display: flex;
                align-items: center;
                gap: 10px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                animation: slideIn 0.3s ease;
            `;

    notification.innerHTML = `
                <i class="fab fa-telegram" style="font-size: 18px;"></i>
                <span>${message}</span>
            `;

    notificationArea.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Set current year in footer
    currentYear.textContent = new Date().getFullYear();

    // Start typing effect
    setTimeout(typeEffect, 1000);

    // Initialize skill bars
    setTimeout(animateSkillBars, 500);

    // Initialize testimonial carousel
    let carouselIndex = 0;
    let carouselInterval;

    function updateCarousel() {
        // Remove active class from all slides and dots
        carouselSlides.forEach(slide => slide.classList.remove('active'));
        carouselDots.forEach(dot => dot.classList.remove('active'));

        // Add active class to current slide and dot
        carouselSlides[carouselIndex].classList.add('active');
        carouselDots[carouselIndex].classList.add('active');
    }

    function nextSlide() {
        carouselIndex = (carouselIndex + 1) % carouselSlides.length;
        updateCarousel();
    }

    function prevSlide() {
        carouselIndex = (carouselIndex - 1 + carouselSlides.length) % carouselSlides.length;
        updateCarousel();
    }

    function goToSlide(index) {
        carouselIndex = index;
        updateCarousel();
    }

    function startCarousel() {
        carouselInterval = setInterval(nextSlide, 5000);
    }

    function stopCarousel() {
        clearInterval(carouselInterval);
    }

    // Event listeners for carousel
    nextBtn.addEventListener('click', () => {
        nextSlide();
        stopCarousel();
        startCarousel();
    });

    prevBtn.addEventListener('click', () => {
        prevSlide();
        stopCarousel();
        startCarousel();
    });

    carouselDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
            stopCarousel();
            startCarousel();
        });
    });

    // Pause carousel on hover
    const carouselContainer = document.querySelector('.testimonial-carousel');
    carouselContainer.addEventListener('mouseenter', stopCarousel);
    carouselContainer.addEventListener('mouseleave', startCarousel);

    // Start carousel
    startCarousel();
});

// Animate skill bars on scroll
function animateSkillBars() {
    skillBars.forEach(bar => {
        const width = bar.getAttribute('data-width');
        bar.style.width = width + '%';
    });
}

// Smooth scrolling for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        window.scrollTo({
            top: targetSection.offsetTop - 80,
            behavior: 'smooth'
        });

        // Close mobile menu if open
        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
});

// Active navigation link based on scroll position
function setActiveNavLink() {
    let currentSection = '';
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;

        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = '#' + section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentSection) {
            link.classList.add('active');
        }
    });
}

// Toggle mobile menu
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

// Toggle theme (light/dark mode)
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');

    if (document.body.classList.contains('dark-mode')) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        localStorage.setItem('theme', 'dark');
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        localStorage.setItem('theme', 'light');
    }
});

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
}

// Back to top button
backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Show/hide back to top button based on scroll position
window.addEventListener('scroll', () => {
    setActiveNavLink();

    if (window.scrollY > 500) {
        backToTop.style.display = 'flex';
    } else {
        backToTop.style.display = 'none';
    }

    // Add shadow to navbar on scroll
    if (window.scrollY > 50) {
        navbar.style.boxShadow = 'var(--shadow)';
    } else {
        navbar.style.boxShadow = 'none';
    }
});

// Tab switching for resume section
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons and panes
        tabBtns.forEach(b => b.classList.remove('active'));
        tabPanes.forEach(pane => pane.classList.remove('active'));

        // Add active class to clicked button
        btn.classList.add('active');

        // Show corresponding tab pane
        const tabId = btn.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
    });
});

// Form validation and submission
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get form data
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    // Reset previous error messages
    document.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
    });

    // Validate form
    let isValid = true;

    if (!name) {
        document.getElementById('name-error').textContent = 'Name is required';
        isValid = false;
    }

    if (!email) {
        document.getElementById('email-error').textContent = 'Email is required';
        isValid = false;
    } else if (!isValidEmail(email)) {
        document.getElementById('email-error').textContent = 'Please enter a valid email address';
        isValid = false;
    }

    if (!message) {
        document.getElementById('message-error').textContent = 'Message is required';
        isValid = false;
    }

    if (!isValid) {
        return;
    }

    // Show loading state
    submitText.textContent = 'Sending...';
    submitSpinner.classList.remove('hidden');

    // Prepare form data
    const formData = {
        name: name,
        email: email,
        subject: subject || 'No subject',
        message: message,
        timestamp: new Date().toISOString()
    };

    try {
        // Send to Telegram
        const telegramResult = await sendToTelegram(formData);

        if (telegramResult.success) {
            // Show success messages
            formMessage.textContent = 'Thank you for your message! I will get back to you soon.';
            formMessage.className = 'form-message success';

            // Show Telegram success notification
            showTelegramNotification('✓ Message sent to Telegram successfully!', 'success');

            // Reset form
            contactForm.reset();
        } else {
            formMessage.textContent = 'Message sent! (Telegram notification failed)';
            formMessage.className = 'form-message success';
            showTelegramNotification('⚠️ Message saved but Telegram notification failed', 'error');
        }

    } catch (error) {
        console.error('Error:', error);
        formMessage.textContent = 'Error sending message. Please try again or contact me directly.';
        formMessage.className = 'form-message error';
        showTelegramNotification('❌ Error sending message to Telegram', 'error');
    } finally {
        // Reset button state
        submitText.textContent = 'Send Message';
        submitSpinner.classList.add('hidden');

        // Hide message after 5 seconds
        setTimeout(() => {
            formMessage.textContent = '';
            formMessage.className = 'form-message';
        }, 5000);
    }
});

// Email validation helper function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Intersection Observer for scroll animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');

            // Animate skill bars when about section is in view
            if (entry.target.id === 'about') {
                animateSkillBars();
            }
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Download resume button
document.querySelector('.resume-download a').addEventListener('click', (e) => {
    e.preventDefault();

    // In a real application, this would download a PDF file
    // For this example, we'll show an alert
    alert('In a real application, this would download a PDF resume. For this demo, the download is simulated.');

    // You would typically have something like:
    // window.open('path/to/resume.pdf', '_blank');
});
