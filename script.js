document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.getElementById('navToggle');
  const primaryNav = document.getElementById('primaryNav');
  const navLinks = document.querySelectorAll('.nav-link');
  const currentYearEl = document.getElementById('currentYear');
  const briefForm = document.getElementById('briefForm');

  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }

  // Mobile navigation toggle
  if (navToggle && primaryNav) {
    const closeNav = () => {
      navToggle.setAttribute('aria-expanded', 'false');
      primaryNav.classList.remove('is-open');
    };

    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!isExpanded));
      primaryNav.classList.toggle('is-open', !isExpanded);
    });

    navLinks.forEach((link) => link.addEventListener('click', closeNav));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeNav();
    });
  }

  // Highlight the nav link for the section currently in view
  if ('IntersectionObserver' in window) {
    const linkFor = new Map();
    navLinks.forEach((link) => {
      const section = document.querySelector(link.getAttribute('href'));
      if (section) linkFor.set(section, link);
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => link.removeAttribute('aria-current'));
        linkFor.get(entry.target).setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    linkFor.forEach((_, section) => observer.observe(section));
  }

  // Project brief form: compose an email in the visitor's mail app
  if (briefForm) {
    briefForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(briefForm);
      const subject = `Design Project Inquiry — ${data.get('service')}`;
      const body = [
        `Name: ${data.get('name')}`,
        `Business / Project: ${data.get('business')}`,
        `Service: ${data.get('service')}`,
        '',
        data.get('details'),
      ].join('\n');

      window.location.href = `mailto:${briefForm.dataset.email}` +
        `?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  }
});
