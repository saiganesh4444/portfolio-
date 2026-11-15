// Main JavaScript - Sienna Aesthetic & Interactive Controls

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Drawer Toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-menu-drawer');
  const toggleIcon = document.getElementById('toggle-icon');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isHidden = mobileDrawer.classList.contains('hidden');
      if (isHidden) {
        mobileDrawer.classList.remove('hidden');
        if (toggleIcon) toggleIcon.classList.replace('ph-list', 'ph-x');
      } else {
        mobileDrawer.classList.add('hidden');
        if (toggleIcon) toggleIcon.classList.replace('ph-x', 'ph-list');
      }
    });

    document.querySelectorAll('.m-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.add('hidden');
        if (toggleIcon) toggleIcon.classList.replace('ph-x', 'ph-list');
      });
    });
  }

  // Active navigation link highlighting on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.s-nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 140;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // Keyboard shortcut (Escape) to close modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCertModal();
    }
  });
});

// Interactive About Photo Switcher
function switchAboutPhoto(src, thumbElement) {
  const mainPhoto = document.getElementById('main-about-photo');
  if (mainPhoto) {
    mainPhoto.style.opacity = '0.35';
    mainPhoto.style.transform = 'scale(0.98)';
    setTimeout(() => {
      mainPhoto.src = src;
      mainPhoto.style.opacity = '1';
      mainPhoto.style.transform = 'scale(1)';
    }, 150);
  }

  document.querySelectorAll('.thumb-pill').forEach(card => {
    card.classList.remove('active');
  });

  if (thumbElement) {
    thumbElement.classList.add('active');
  }
}

// Modal Lightbox Functions (Supports both object and parameter calls)
function openCertModal(titleOrElement, issuer, img, desc) {
  const modal = document.getElementById('certModal');
  const modalImg = document.getElementById('modalImg');
  const modalTitle = document.getElementById('modalTitle');
  const modalIssuer = document.getElementById('modalIssuer');
  const modalDesc = document.getElementById('modalDesc');
  const modalOpenExternal = document.getElementById('modalOpenExternal');

  if (!modal) return;

  let t = titleOrElement;
  let iss = issuer;
  let im = img;
  let d = desc;

  if (typeof titleOrElement === 'object' && titleOrElement !== null) {
    t = titleOrElement.getAttribute('data-title') || 'Certificate';
    iss = titleOrElement.getAttribute('data-issuer') || '';
    im = titleOrElement.getAttribute('data-img') || '';
    d = titleOrElement.getAttribute('data-desc') || '';
  }

  if (modalTitle) modalTitle.textContent = t;
  if (modalIssuer) modalIssuer.textContent = iss;
  if (modalDesc) modalDesc.textContent = d;
  if (modalImg) modalImg.src = im;
  if (modalOpenExternal) modalOpenExternal.href = im;

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeCertModal() {
  const modal = document.getElementById('certModal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

function handleModalBackdrop(event) {
  if (event.target.id === 'certModal') {
    closeCertModal();
  }
}
