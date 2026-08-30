(function () {
  'use strict';

  const header = document.querySelector('.site-header');
  const navToggle = document.querySelector('.nav-toggle');
  const siteNav = document.querySelector('.site-nav');
  const form = document.getElementById('booking-form');
  const formStatus = document.getElementById('form-status');
  const yearEl = document.getElementById('year');

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* Sticky header shadow */
  window.addEventListener('scroll', function () {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  /* Mobile navigation */
  if (navToggle && siteNav) {
    navToggle.addEventListener('click', function () {
      const isOpen = siteNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
      navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });

    siteNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        siteNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Open menu');
      });
    });
  }

  /* Contact form validation & submission */
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      formStatus.textContent = '';
      formStatus.className = 'form-status';

      const name = form.querySelector('#name');
      const message = form.querySelector('#message');
      let valid = true;

      [name, message].forEach(function (field) {
        field.classList.remove('error');
        if (!field.value.trim()) {
          field.classList.add('error');
          valid = false;
        }
      });

      if (!valid) {
        formStatus.textContent = 'Please fill in all required fields.';
        formStatus.classList.add('error');
        return;
      }

      const submitBtn = form.querySelector('[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending…';
      submitBtn.disabled = true;

      const formAction = form.getAttribute('action');

      if (!formAction || formAction.includes('YOUR_FORM_ID')) {
        formStatus.textContent = 'Thank you! Xenia will be in touch via phone or Instagram.';
        formStatus.classList.add('success');
        form.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        return;
      }

      fetch(formAction, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      })
        .then(function (response) {
          if (response.ok) {
            formStatus.textContent = 'Thank you! Your enquiry has been sent. Xenia will be in touch shortly.';
            formStatus.classList.add('success');
            form.reset();
          } else {
            throw new Error('Submission failed');
          }
        })
        .catch(function () {
          formStatus.textContent = 'Something went wrong. Please contact Xenia via phone or Instagram.';
          formStatus.classList.add('error');
        })
        .finally(function () {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        });
    });
  }
})();
