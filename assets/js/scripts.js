/**
 * عيادة الريسان لطب الأسنان - Al-Raysan Dental Clinic
 * Master Client-Side Scripts
 * Pure Vanilla JavaScript • Zero External Dependencies • Defensive Guards
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. Mobile Menu Navigation & Drawer Toggle
  // --------------------------------------------------------------------------
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  let navBackdrop = document.querySelector('.nav-backdrop');

  // If backdrop doesn't exist in DOM, create it dynamically
  if (!navBackdrop) {
    navBackdrop = document.createElement('div');
    navBackdrop.className = 'nav-backdrop';
    document.body.appendChild(navBackdrop);
  }

  function toggleMobileMenu(isOpen) {
    if (!navMenu || !mobileToggle) return;
    const active = typeof isOpen === 'boolean' ? isOpen : !navMenu.classList.contains('active');
    
    if (active) {
      navMenu.classList.add('active');
      navBackdrop.classList.add('active');
      mobileToggle.setAttribute('aria-expanded', 'true');
      mobileToggle.innerHTML = '&times;'; // Close symbol
      document.body.style.overflow = 'hidden';
    } else {
      navMenu.classList.remove('active');
      navBackdrop.classList.remove('active');
      mobileToggle.setAttribute('aria-expanded', 'false');
      mobileToggle.innerHTML = '&#9776;'; // Hamburger symbol
      document.body.style.overflow = '';
    }
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', (e) => {
      e.preventDefault();
      toggleMobileMenu();
    });
  }

  if (navBackdrop) {
    navBackdrop.addEventListener('click', () => {
      toggleMobileMenu(false);
    });
  }

  // Close menu when clicking any nav link
  if (navMenu) {
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        toggleMobileMenu(false);
      });
    });
  }

  // Close with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      toggleMobileMenu(false);
      closeLightbox();
    }
  });

  // --------------------------------------------------------------------------
  // 2. Sticky Navbar Scroll State
  // --------------------------------------------------------------------------
  const navigation = document.getElementById('navigation');
  const scrollToTopBtn = document.querySelector('.scroll-to-top');

  function handleScroll() {
    const scrollY = window.scrollY || window.pageYOffset;

    if (navigation) {
      if (scrollY > 50) {
        navigation.classList.add('scrolled');
      } else {
        navigation.classList.remove('scrolled');
      }
    }

    if (scrollToTopBtn) {
      if (scrollY > 400) {
        scrollToTopBtn.classList.add('show');
      } else {
        scrollToTopBtn.classList.remove('show');
      }
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Trigger initial check

  if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --------------------------------------------------------------------------
  // 3. Navigation Active Link Spy (IntersectionObserver)
  // --------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  const menuLinks = document.querySelectorAll('.nav-menu li a[href^="#"]');

  if ('IntersectionObserver' in window && sections.length && menuLinks.length) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          menuLinks.forEach((link) => {
            const href = link.getAttribute('href');
            if (href === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach((sec) => sectionObserver.observe(sec));
  }

  // --------------------------------------------------------------------------
  // 4. Clinical Results Lightbox / Modal
  // --------------------------------------------------------------------------
  const lightboxModal = document.querySelector('.lightbox-modal');
  const lightboxImg = document.querySelector('.lightbox-img');
  const lightboxTitle = document.querySelector('.lightbox-title') || document.querySelector('.lightbox-caption h4') || document.querySelector('.lightbox-caption h3');
  const lightboxDesc = document.querySelector('.lightbox-caption p');
  const lightboxClose = document.querySelector('.lightbox-close');

  function openLightbox(src, title, desc) {
    if (!lightboxModal || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = title || 'حالة علاجية';
    if (lightboxTitle) lightboxTitle.textContent = title || '';
    if (lightboxDesc) lightboxDesc.textContent = desc || '';
    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
    if (!navMenu || !navMenu.classList.contains('active')) {
      document.body.style.overflow = '';
    }
  }

  const galleryCards = document.querySelectorAll('.gallery-card');
  galleryCards.forEach((card) => {
    card.addEventListener('click', () => {
      const img = card.querySelector('.gallery-img');
      const title = card.querySelector('.gallery-title')?.textContent || '';
      const desc = card.querySelector('.gallery-desc')?.textContent || '';
      if (img) {
        openLightbox(img.src, title, desc);
      }
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });
  }

  // --------------------------------------------------------------------------
  // 5. FAQ Accordion
  // --------------------------------------------------------------------------
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const trigger = item.querySelector('.faq-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items
      faqItems.forEach((other) => {
        if (other !== item) {
          other.classList.remove('active');
          const otherTrigger = other.querySelector('.faq-trigger');
          if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current item
      if (isActive) {
        item.classList.remove('active');
        trigger.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // --------------------------------------------------------------------------
  // 6. Interactive Appointment Booking Form (Direct WhatsApp Bridge)
  // --------------------------------------------------------------------------
  const bookingForm = document.getElementById('bookingForm');
  const toastNotice = document.getElementById('toastNotice');

  function showToast(message, isSuccess = true) {
    if (!toastNotice) return;
    toastNotice.textContent = message;
    toastNotice.className = `toast-notice show ${isSuccess ? 'success' : 'error'}`;
    setTimeout(() => {
      toastNotice.classList.remove('show');
    }, 4500);
  }

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('patientName');
      const phoneInput = document.getElementById('patientPhone');
      const serviceInput = document.getElementById('serviceSelect');
      const dateInput = document.getElementById('preferredDate');
      const timeInput = document.getElementById('preferredTime');
      const notesInput = document.getElementById('patientNotes');

      const name = nameInput ? nameInput.value.trim() : '';
      const phone = phoneInput ? phoneInput.value.trim() : '';
      const service = serviceInput ? serviceInput.value : '';
      const date = dateInput ? dateInput.value : '';
      const time = timeInput ? timeInput.value : '';
      const notes = notesInput ? notesInput.value.trim() : '';

      if (!name || !phone) {
        showToast('يرجى كتابة الاسم ورقم الهاتف للمتابعة', false);
        if (!name && nameInput) nameInput.focus();
        else if (phoneInput) phoneInput.focus();
        return;
      }

      // Build structured WhatsApp message in Arabic
      let message = `مرحباً دكتور عيادة الريسان لطب الأسنان 🦷\n`;
      message += `أود حجز موعد كشف واستشارة بالعيادة:\n\n`;
      message += `👤 الاسم: ${name}\n`;
      message += `📞 رقم الهاتف: ${phone}\n`;
      if (service) message += `🩺 الخدمة المطلوبة: ${service}\n`;
      if (date) message += `📅 اليوم المفضل: ${date}\n`;
      if (time) message += `⏰ الوقت المفضل: ${time}\n`;
      if (notes) message += `📝 ملاحظات إضافية: ${notes}\n`;
      message += `\nأرجو تأكيد أقرب موعد متاح في العيادة (كركوك - شارع النخيل). شكراً لكم!`;

      // WhatsApp direct URL (Iraq international code 964)
      const clinicWhatsAppNumber = '9647714661043';
      const encodedMsg = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${clinicWhatsAppNumber}?text=${encodedMsg}`;

      showToast('جاري توجيهك إلى واتساب لإتمام الحجز وتأكيد الموعد...', true);

      setTimeout(() => {
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      }, 700);
    });
  }

  // --------------------------------------------------------------------------
  // 7. Live Clinic Operating Status Indicator
  // --------------------------------------------------------------------------
  const statusBadge = document.querySelector('.topbar-status');
  if (statusBadge) {
    try {
      const now = new Date();
      // Iraqi local time is GMT+3
      const day = now.getDay(); // 0 is Sunday, 5 is Friday, 6 is Saturday
      const hour = now.getHours();

      // Working days: Saturday (6), Sunday (0), Monday (1), Tuesday (2), Wednesday (3), Thursday (4)
      // Friday (5) is Closed
      // Working hours: 15:00 to 22:00
      const isWorkingDay = day !== 5;
      const isOpenHour = hour >= 15 && hour < 22;

      const statusDot = statusBadge.querySelector('.status-dot');
      const statusText = statusBadge.querySelector('.status-text');

      if (isWorkingDay && isOpenHour) {
        if (statusText) statusText.textContent = 'مفتوح الآن لاستقبالكم';
        if (statusDot) statusDot.style.backgroundColor = '#34d399';
        statusBadge.style.color = '#34d399';
        statusBadge.style.borderColor = 'rgba(16, 185, 129, 0.4)';
      } else {
        if (day === 5) {
          if (statusText) statusText.textContent = 'عطلة اليوم (الجمعة) • نفتح السبت 3:00 م';
        } else if (hour < 15) {
          if (statusText) statusText.textContent = 'نستقبلكم اليوم من 3:00 عصراً';
        } else {
          if (statusText) statusText.textContent = 'مغلق الآن • نستقبلكم غداً من 3:00 م';
        }
        if (statusDot) statusDot.style.backgroundColor = '#38bdf8';
        statusBadge.style.color = '#7dd3fc';
        statusBadge.style.borderColor = 'rgba(56, 189, 248, 0.3)';
      }
    } catch (err) {
      // Graceful fallback without errors
    }
  }

  // --------------------------------------------------------------------------
  // 8. Defensive Vendor Library Checks (Gate 1 Compliance)
  // --------------------------------------------------------------------------
  if (typeof WOW !== 'undefined') {
    try {
      new WOW().init();
    } catch (e) {
      console.warn('WOW initialization skipped:', e);
    }
  }

  if (typeof Lenis !== 'undefined') {
    try {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
      });
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    } catch (e) {
      console.warn('Lenis initialization skipped:', e);
    }
  }

  if (typeof window.jQuery !== 'undefined') {
    const $ = window.jQuery;
    if (typeof $.fn.simpleMobileMenu === 'function' && $('.mobile_menu').length) {
      try {
        $('.mobile_menu').simpleMobileMenu({ menuStyle: 'slide' });
      } catch (e) {
        console.warn('simpleMobileMenu skipped:', e);
      }
    }
  }
});
