// script.js

document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS library
    AOS.init({
        // Global settings for AOS
        duration: 800, // values from 0 to 3000, with step 50ms
        once: true, // whether animation should happen only once - while scrolling down
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Active link highlighting
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - sectionHeight / 3) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // Recommendations Carousel Logic
    const carouselContainer = document.querySelector('.carousel-container');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dots = document.querySelectorAll('.dot');
    const slides = document.querySelectorAll('.testimonial-card');
    
    let currentIndex = 0;
    
    function updateCarousel() {
        // We're showing 3 slides at a time on desktop, 1 on mobile
        const slidesPerView = window.innerWidth > 768 ? 3 : 1;
        const totalSlides = slides.length;
        let translateValue = -currentIndex * (100 / slidesPerView);
        
        // Adjust for mobile view, where we show one slide at a time
        if (window.innerWidth <= 768) {
            translateValue = -currentIndex * 100;
        }

        carouselContainer.style.transform = `translateX(${translateValue}%)`;
        
        // Update active dot
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    function nextSlide() {
        if (window.innerWidth > 768) {
            const slidesPerView = 3;
            currentIndex = (currentIndex + 1) % (slides.length - slidesPerView + 1);
        } else {
            currentIndex = (currentIndex + 1) % slides.length;
        }
        updateCarousel();
    }

    function prevSlide() {
        if (window.innerWidth > 768) {
             const slidesPerView = 3;
            currentIndex = (currentIndex - 1 + (slides.length - slidesPerView + 1)) % (slides.length - slidesPerView + 1);
        } else {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        }
        updateCarousel();
    }

    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel();
        });
    });
    
    // Re-calculate slide width on window resize
    window.addEventListener('resize', () => {
        updateCarousel();
    });

    // Initial carousel setup
    updateCarousel();

    // Project Filter Logic
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to the clicked button
            button.classList.add('active');

            const filter = button.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                // Add a small delay to allow the CSS transition to play out
                // before hiding the element entirely
                if (filter === 'all' || category === filter) {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                    card.classList.remove('hidden');
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                         card.classList.add('hidden');
                    }, 300); // Match this duration to the CSS transition duration
                }
            });
        });
    });

    // Form Submission Logic using EmailJS
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        // Replace with your EmailJS service and template IDs
        const serviceID = 'YOUR_EMAILJS_SERVICE_ID'; // <--- IMPORTANT: Replace with your Service ID
        const templateID = 'YOUR_EMAILJS_TEMPLATE_ID'; // <--- IMPORTANT: Replace with your Template ID

        // Initialize EmailJS with your Public Key
        emailjs.init({
            publicKey: "YOUR_EMAILJS_PUBLIC_KEY", // <--- IMPORTANT: Replace with your Public Key
        });

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Send the form data using EmailJS
            emailjs.sendForm(serviceID, templateID, this)
                .then(() => {
                    // Replaced alert with a simple success message display
                    const messageBox = document.createElement('div');
                    messageBox.className = 'message-box success';
                    messageBox.textContent = 'Message sent successfully!';
                    document.body.appendChild(messageBox);
                    setTimeout(() => messageBox.remove(), 3000);
                    contactForm.reset();
                }, (error) => {
                    console.error('Failed to send message:', error);
                    // Replaced alert with a simple error message display
                    const messageBox = document.createElement('div');
                    messageBox.className = 'message-box error';
                    messageBox.textContent = 'Oops! Something went wrong. Please try again.';
                    document.body.appendChild(messageBox);
                    setTimeout(() => messageBox.remove(), 5000);
                });
        });
    }
});