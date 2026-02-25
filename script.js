const topbar = document.querySelector('.topbar');
const mobileMenu = document.querySelector('.mobile-menu');
const hamburger = document.querySelector('.hamburger');
const billingInput = document.querySelector('.billing-toggle input');
const annualBadge = document.querySelector('.annual-badge');

window.addEventListener('scroll', () => {
  topbar?.classList.toggle('scrolled', window.scrollY > 60);
});

hamburger?.addEventListener('click', () => {
  mobileMenu?.classList.toggle('open');
  document.body.classList.toggle('no-scroll');
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (event) => {
    const href = anchor.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    mobileMenu?.classList.remove('open');
    document.body.classList.remove('no-scroll');
  });
});

const sectionIds = ['como-funciona', 'beneficios', 'planos', 'para-escolas'];
const navItems = [...document.querySelectorAll('.nav-links a')];
const sections = sectionIds
  .map((id) => document.getElementById(id))
  .filter(Boolean);

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navItems.forEach((item) => {
        item.classList.toggle('active', item.getAttribute('href') === `#${entry.target.id}`);
      });
    });
  },
  { threshold: 0.55 }
);
sections.forEach((section) => navObserver.observe(section));

billingInput?.addEventListener('change', (event) => {
  const checked = event.target.checked;
  document.querySelectorAll('[data-monthly]').forEach((node) => {
    node.textContent = checked ? node.dataset.annual : node.dataset.monthly;
  });
  if (annualBadge) annualBadge.style.display = checked ? 'inline-flex' : 'none';
});

document.querySelectorAll('.faq-question').forEach((button) => {
  button.addEventListener('click', () => {
    const item = button.closest('.faq-item');
    const alreadyOpen = item?.classList.contains('open');

    document.querySelectorAll('.faq-item').forEach((faqItem) => {
      faqItem.classList.remove('open');
      faqItem.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
    });

    if (item && !alreadyOpen) {
      item.classList.add('open');
      button.setAttribute('aria-expanded', 'true');
    }
  });
});

let currentSlide = 0;
const slides = [...document.querySelectorAll('.testimonial-card')];
const dots = [...document.querySelectorAll('.carousel-dot')];
const track = document.querySelector('.carousel-track');

const isDesktop = () => window.matchMedia('(min-width: 1200px)').matches;

function updateCarousel(index) {
  if (!slides.length || !track) return;
  currentSlide = (index + slides.length) % slides.length;

  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === currentSlide);
  });
  dots.forEach((dot, i) => dot.classList.toggle('active', i === currentSlide));

  if (!isDesktop()) {
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
  } else {
    track.style.transform = 'translateX(0)';
  }
}

document.querySelector('.carousel-prev')?.addEventListener('click', () => updateCarousel(currentSlide - 1));
document.querySelector('.carousel-next')?.addEventListener('click', () => updateCarousel(currentSlide + 1));
dots.forEach((dot, index) => dot.addEventListener('click', () => updateCarousel(index)));

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  setInterval(() => updateCarousel(currentSlide + 1), 5000);
}

window.addEventListener('resize', () => updateCarousel(currentSlide));
updateCarousel(0);

document.getElementById('waitlist-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.target;
  form.style.display = 'none';
  const success = document.querySelector('.success-message');
  if (success) success.style.display = 'block';
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.16 }
);

document.querySelectorAll('.animate-on-scroll').forEach((el) => revealObserver.observe(el));

if (window.lucide) {
  window.lucide.createIcons();
}
