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

function buildTreasureTrail() {
  const mediaQueryDesktop = window.matchMedia('(min-width: 1024px)');
  const trailHost = document.querySelector('#como-funciona .container');
  const trailSvg = trailHost?.querySelector('.treasure-trail');
  const trailPath = trailSvg?.querySelector('.trail-path');
  const nodesGroup = trailSvg?.querySelector('.trail-nodes');
  const runnersGroup = trailSvg?.querySelector('.trail-runners');
  const journeyItems = [...(trailHost?.querySelectorAll('.resource-item') ?? [])];

  if (!trailHost || !trailSvg || !trailPath || !nodesGroup || !runnersGroup) return;
  if (!mediaQueryDesktop.matches || journeyItems.length < 2) {
    trailPath.setAttribute('d', '');
    nodesGroup.innerHTML = '';
    runnersGroup.innerHTML = '';
    return;
  }

  const hostRect = trailHost.getBoundingClientRect();
  const hostWidth = Math.max(1, trailHost.clientWidth);
  const hostHeight = Math.max(1, trailHost.scrollHeight);
  const hostCenterX = hostWidth / 2;
  const padX = 18;
  const padY = 12;

  const routeRows = journeyItems
    .map((item) => {
      const media = item.querySelector('.resource-media');
      if (!media) return null;

      const mediaRect = media.getBoundingClientRect();
      const left = mediaRect.left - hostRect.left;
      const right = mediaRect.right - hostRect.left;
      const top = mediaRect.top - hostRect.top;
      const bottom = mediaRect.bottom - hostRect.top;
      const centerX = left + mediaRect.width / 2;
      const mediaCenter = centerX;
      return {
        centerX: Math.max(24, Math.min(hostWidth - 24, centerX)),
        topY: Math.max(20, Math.min(hostHeight - 20, top - padY)),
        bottomY: Math.max(20, Math.min(hostHeight - 20, bottom + padY)),
        outerX: Math.max(
          22,
          Math.min(hostWidth - 22, mediaCenter < hostCenterX ? left - padX : right + padX)
        ),
        sideSign: mediaCenter < hostCenterX ? -1 : 1
      };
    })
    .filter(Boolean);

  if (routeRows.length < 2) {
    trailPath.setAttribute('d', '');
    nodesGroup.innerHTML = '';
    runnersGroup.innerHTML = '';
    return;
  }

  let d = `M ${routeRows[0].centerX.toFixed(1)} ${routeRows[0].topY.toFixed(1)}`;
  const majorNodes = [{ x: routeRows[0].centerX, y: routeRows[0].topY }];
  const minorNodes = [];

  for (let i = 0; i < routeRows.length; i += 1) {
    const row = routeRows[i];
    const next = routeRows[i + 1] ?? null;
    const exitsDown = next ? next.topY > row.bottomY : true;
    const entryY = exitsDown ? row.topY : row.bottomY;
    const exitY = exitsDown ? row.bottomY : row.topY;
    const sideMidY = (entryY + exitY) / 2;
    const sideReachX = row.outerX;
    const centerLead = 44 * row.sideSign;

    // Enter/exit in the horizontal center of card (top or bottom), then contour via outer side.
    d += ` C ${(row.centerX + centerLead).toFixed(1)} ${entryY.toFixed(1)}, ${sideReachX.toFixed(1)} ${(sideMidY - 14).toFixed(
      1
    )}, ${sideReachX.toFixed(1)} ${sideMidY.toFixed(1)}`;
    d += ` C ${sideReachX.toFixed(1)} ${(sideMidY + 14).toFixed(1)}, ${(row.centerX + centerLead).toFixed(1)} ${exitY.toFixed(
      1
    )}, ${row.centerX.toFixed(1)} ${exitY.toFixed(1)}`;

    majorNodes.push({ x: row.centerX, y: exitY });
    minorNodes.push({ x: sideReachX, y: sideMidY });

    if (!next) break;

    const nextEntryY = next.topY > exitY ? next.topY : next.bottomY;
    const dirY = nextEntryY > exitY ? 1 : -1;
    const midY = (exitY + nextEntryY) / 2;
    const bridgeX = Math.max(24, Math.min(hostWidth - 24, (row.outerX + next.outerX) / 2));
    const bridgeDepth = Math.max(28, Math.min(64, Math.abs(nextEntryY - exitY) * 0.3));

    d += ` C ${(row.centerX + row.sideSign * 34).toFixed(1)} ${(exitY + dirY * 6).toFixed(1)}, ${bridgeX.toFixed(1)} ${(
      midY - dirY * bridgeDepth
    ).toFixed(1)}, ${bridgeX.toFixed(1)} ${midY.toFixed(1)}`;
    d += ` C ${bridgeX.toFixed(1)} ${(midY + dirY * bridgeDepth).toFixed(1)}, ${(next.centerX - next.sideSign * 34).toFixed(
      1
    )} ${(nextEntryY - dirY * 6).toFixed(1)}, ${next.centerX.toFixed(1)} ${nextEntryY.toFixed(1)}`;

    majorNodes.push({ x: next.centerX, y: nextEntryY });
    minorNodes.push({ x: bridgeX, y: midY });
  }

  trailSvg.setAttribute('viewBox', `0 0 ${hostWidth} ${hostHeight}`);
  trailPath.setAttribute('d', d);

  const majorNodeMarkup = majorNodes
    .map((point, index) => {
      const delay = (index * 0.24).toFixed(2);
      return `<circle class="trail-node" cx="${point.x.toFixed(1)}" cy="${point.y.toFixed(
        1
      )}" r="8" style="animation-delay:${delay}s"></circle>`;
    })
    .join('');

  const minorNodeMarkup = minorNodes
    .map((point, index) => {
      const delay = (index * 0.18 + 0.12).toFixed(2);
      return `<circle class="trail-node trail-node-minor" cx="${point.x.toFixed(1)}" cy="${point.y.toFixed(
        1
      )}" r="4.5" style="animation-delay:${delay}s"></circle>`;
    })
    .join('');

  nodesGroup.innerHTML = majorNodeMarkup + minorNodeMarkup;
  runnersGroup.innerHTML = `
    <circle class="trail-runner" r="7">
      <animateMotion dur="9.5s" repeatCount="indefinite" keyTimes="0;0.5;1" keyPoints="0;1;0" calcMode="linear">
        <mpath href="#trail-route-path"></mpath>
      </animateMotion>
    </circle>
  `;
}

let trailFrameScheduled = false;
const refreshTreasureTrail = () => {
  if (trailFrameScheduled) return;
  trailFrameScheduled = true;
  window.requestAnimationFrame(() => {
    trailFrameScheduled = false;
    buildTreasureTrail();
  });
};

window.addEventListener('resize', refreshTreasureTrail);
window.addEventListener('load', refreshTreasureTrail);
setTimeout(refreshTreasureTrail, 350);

const trailHost = document.querySelector('#como-funciona .container');
if (trailHost && 'ResizeObserver' in window) {
  const trailObserver = new ResizeObserver(refreshTreasureTrail);
  trailObserver.observe(trailHost);
  trailHost.querySelectorAll('.resource-item .resource-media').forEach((mediaEl) => trailObserver.observe(mediaEl));
}

trailHost?.querySelectorAll('.resource-item .resource-media img').forEach((img) => {
  if (img.complete) return;
  img.addEventListener('load', refreshTreasureTrail, { once: true });
});

refreshTreasureTrail();
