const topbar = document.querySelector('.topbar');
const mobileMenu = document.querySelector('.mobile-menu');
const hamburger = document.querySelector('.hamburger');
const billingInput = document.querySelector('.billing-toggle input');
const annualBadge = document.querySelector('.annual-badge');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let autoPlayId = null;

function setMobileMenuState(open) {
  mobileMenu?.classList.toggle('open', open);
  document.body.classList.toggle('no-scroll', open);
  hamburger?.setAttribute('aria-expanded', open ? 'true' : 'false');
}

window.addEventListener('scroll', () => {
  topbar?.classList.toggle('scrolled', window.scrollY > 60);
});

hamburger?.addEventListener('click', () => {
  const open = !mobileMenu?.classList.contains('open');
  setMobileMenuState(open);
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (event) => {
    const href = anchor.getAttribute('href');
    if (anchor.classList.contains('skip-link')) return;
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMobileMenuState(false);
  });
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    setMobileMenuState(false);
  }
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
        const isActive = item.getAttribute('href') === `#${entry.target.id}`;
        item.classList.toggle('active', isActive);
        if (isActive) {
          item.setAttribute('aria-current', 'page');
        } else {
          item.removeAttribute('aria-current');
        }
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
    currentSlide = 0;
    track.style.transform = 'translateX(0)';
  }
}

function setCarouselAutoplay() {
  if (autoPlayId) {
    clearInterval(autoPlayId);
    autoPlayId = null;
  }
  if (!prefersReducedMotion && !isDesktop()) {
    autoPlayId = setInterval(() => updateCarousel(currentSlide + 1), 5000);
  }
}

document.querySelector('.carousel-prev')?.addEventListener('click', () => updateCarousel(currentSlide - 1));
document.querySelector('.carousel-next')?.addEventListener('click', () => updateCarousel(currentSlide + 1));
dots.forEach((dot, index) => dot.addEventListener('click', () => updateCarousel(index)));

window.addEventListener('resize', () => {
  updateCarousel(currentSlide);
  setCarouselAutoplay();
});
updateCarousel(0);
setCarouselAutoplay();

document.getElementById('waitlist-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.target;
  form.style.display = 'none';
  const success = document.querySelector('.success-message');
  if (success) success.style.display = 'block';
});

const axionStates = [
  {
    progress: 78,
    status: 'Estavel',
    statusClass: 'status-ok',
    recommendation: 'recuperacao de 3 minutos + missao de poupanca.',
  },
  {
    progress: 84,
    status: 'Em alta',
    statusClass: 'status-ok',
    recommendation: 'missao avancada de foco com bonus de consistencia.',
  },
  {
    progress: 71,
    status: 'Oscilando',
    statusClass: 'status-alert',
    recommendation: 'micro desafio de retomada com reforco visual.',
  },
];

let axionStateIndex = 0;
const axionProgressLabel = document.getElementById('axion-progress-label');
const axionProgressBar = document.getElementById('axion-progress-bar');
const axionFocusStatus = document.getElementById('axion-focus-status');
const axionRecommendation = document.getElementById('axion-recommendation');
const axionSimulate = document.getElementById('axion-simulate');

axionSimulate?.addEventListener('click', () => {
  axionStateIndex = (axionStateIndex + 1) % axionStates.length;
  const state = axionStates[axionStateIndex];
  if (axionProgressLabel) axionProgressLabel.textContent = `${state.progress}%`;
  if (axionProgressBar) axionProgressBar.style.width = `${state.progress}%`;
  if (axionFocusStatus) {
    axionFocusStatus.textContent = state.status;
    axionFocusStatus.classList.remove('status-ok', 'status-alert');
    axionFocusStatus.classList.add(state.statusClass);
  }
  if (axionRecommendation) {
    axionRecommendation.innerHTML = `<strong>Proxima missao:</strong> ${state.recommendation}`;
  }
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
