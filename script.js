// Spotlight and Zoom Effect
const spotlight = document.getElementById('spotlight');
const backgroundZoom = document.getElementById('background-zoom');

if (spotlight && backgroundZoom) {
    window.addEventListener('mousemove', (e) => {
        window.requestAnimationFrame(() => {
            const x = e.clientX;
            const y = e.clientY;
            
            // Spotlight movement
            spotlight.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
            
            // Background zoom effect
            const scale = 1.03;
            const offsetX = (window.innerWidth/2 - x) * 0.01;
            const offsetY = (window.innerHeight/2 - y) * 0.01;
            backgroundZoom.style.transform = `scale(${scale}) translate(${offsetX}px, ${offsetY}px)`;
        });
    });
}

// Button Glow Effect
const ctaButtons = document.querySelectorAll('.cta-button');
ctaButtons.forEach(button => {
    const glow = button.querySelector('.glow');
    if(!glow) return;
    button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        glow.style.left = `${e.clientX - rect.left}px`;
        glow.style.top = `${e.clientY - rect.top}px`;
        glow.style.transform = 'translate(-50%, -50%)';
    });
});

// Mobile Menu Logic
const menuButton = document.getElementById('mobile-menu-button');
const closeMenuButton = document.getElementById('mobile-menu-close-button');
const mobileMenu = document.getElementById('mobile-menu');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

const openMenu = () => {
    mobileMenu.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
};

const closeMenu = () => {
    mobileMenu.classList.add('hidden');
    document.body.style.overflow = '';
};

menuButton.addEventListener('click', openMenu);
closeMenuButton.addEventListener('click', closeMenu);

mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
});

// Header Scroll Effect
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    header.classList.toggle('bg-white/90', window.scrollY > 20);
    header.classList.toggle('backdrop-blur-lg', window.scrollY > 20);
    header.classList.toggle('border-b', window.scrollY > 20);
    header.classList.toggle('border-gray-200', window.scrollY > 20);
});

// Scroll Progress Bar
const progressBar = document.getElementById('progress-bar');
window.addEventListener('scroll', () => {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.scrollY / scrollableHeight) * 100;
    progressBar.style.width = `${scrolled}%`;
});

// Intersection Observer for Animations
const observerCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
        }
    });
};

const observer = new IntersectionObserver(observerCallback, { threshold: 0.2 });
document.querySelectorAll('.fade-in-section, #process, #services').forEach(section => observer.observe(section));

// Process Line Height Adjustment
const processLine = document.getElementById('process-line');
const lastStep = document.getElementById('last-step');
if (processLine && lastStep) {
    const circleCenter = lastStep.offsetTop + lastStep.querySelector('div').offsetHeight / 2;
    processLine.style.height = `${circleCenter}px`;
}

// Contact Form Modal Logic
const contactModal = document.getElementById('contact-modal');
const modalContent = document.getElementById('modal-content');
const openModalButtons = document.querySelectorAll('.open-modal-button');
const closeModalButton = document.getElementById('close-modal-button');
const contactForm = document.getElementById('contact-form');
const submitButton = document.getElementById('submit-button');
const formView = document.getElementById('form-view');
const formFeedback = document.getElementById('form-feedback');
const successMessage = document.getElementById('form-success-message');
const errorMessage = document.getElementById('form-error-message');

const openContactModal = () => {
    contactModal.classList.remove('hidden');
    contactModal.classList.add('flex');
    setTimeout(() => {
        contactModal.classList.add('opacity-100');
        modalContent.classList.remove('scale-95');
    }, 10);
    document.body.style.overflow = 'hidden';
};

const closeContactModal = () => {
    contactModal.classList.remove('opacity-100');
    modalContent.classList.add('scale-95');
    setTimeout(() => {
        contactModal.classList.add('hidden');
        contactModal.classList.remove('flex');
        if (mobileMenu.classList.contains('hidden')) {
            document.body.style.overflow = '';
        }
        formView.classList.remove('hidden');
        formFeedback.classList.add('hidden');
        successMessage.classList.add('hidden');
        errorMessage.classList.add('hidden');
        contactForm.reset();
    }, 300);
};

openModalButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        openContactModal();
    });
});

closeModalButton.addEventListener('click', closeContactModal);
contactModal.addEventListener('click', (e) => {
    if(e.target === contactModal) {
        closeContactModal();
    }
});

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitButton.disabled = true;
    submitButton.querySelector('span.relative').textContent = 'Sende...';

    const formData = {
        name: contactForm.name.value,
        email: contactForm.email.value,
        company: contactForm.company.value,
        message: contactForm.message.value,
    };

    try {
        const response = await fetch('https://flowsetagentur.app.n8n.cloud/webhook/formular', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            formView.classList.add('hidden');
            successMessage.classList.remove('hidden');
            formFeedback.classList.remove('hidden');
        } else {
            throw new Error('Network response was not ok.');
        }
    } catch (error) {
        console.error('Form submission error:', error);
        formView.classList.add('hidden');
        errorMessage.classList.remove('hidden');
        formFeedback.classList.remove('hidden');
    } finally {
        submitButton.disabled = false;
        submitButton.querySelector('span.relative').textContent = 'Anfrage senden';
    }
});