// Main JavaScript for Puttigampala Sai Ganesh Chowdary Portfolio

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Navigation Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIcon = document.getElementById('menu-icon');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isHidden = mobileMenu.classList.contains('hidden');
      if (isHidden) {
        mobileMenu.classList.remove('hidden');
        menuIcon.classList.replace('ph-list', 'ph-x');
      } else {
        mobileMenu.classList.add('hidden');
        menuIcon.classList.replace('ph-x', 'ph-list');
      }
    });

    // Close menu when clicking any link
    document.querySelectorAll('.mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        menuIcon.classList.replace('ph-x', 'ph-list');
      });
    });
  }

  // Certificate Lightbox Modal
  const certItems = document.querySelectorAll('.cert-item');
  const modal = document.getElementById('cert-modal');
  const modalImg = document.getElementById('modal-img');
  const modalTitle = document.getElementById('modal-title');
  const modalSubtitle = document.getElementById('modal-subtitle');
  const modalClose = document.getElementById('modal-close');

  certItems.forEach(item => {
    item.addEventListener('click', () => {
      const imgSrc = item.getAttribute('data-cert-img');
      const title = item.getAttribute('data-cert-title');
      const issuer = item.getAttribute('data-cert-issuer');
      const date = item.getAttribute('data-cert-date');

      if (modal && modalImg) {
        modalImg.src = imgSrc;
        modalImg.alt = title;
        modalTitle.textContent = title;
        modalSubtitle.textContent = `${issuer} · ${date}`;
        modal.classList.remove('hidden');
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeModal = () => {
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });

  // Copy Email Button
  const copyBtn = document.getElementById('copy-email-btn');
  const copyText = document.getElementById('copy-email-text');

  if (copyBtn && copyText) {
    copyBtn.addEventListener('click', () => {
      const email = 'saiganeshsaisai@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        copyText.textContent = 'Copied to clipboard!';
        setTimeout(() => {
          copyText.textContent = 'Copy Email';
        }, 2500);
      }).catch(() => {
        window.location.href = `mailto:${email}`;
      });
    });
  }

  // Navbar subtle scroll shadow & opacity
  const navContainer = document.querySelector('.nav-container');
  window.addEventListener('scroll', () => {
    if (navContainer) {
      if (window.scrollY > 40) {
        navContainer.style.backgroundColor = 'rgba(14, 14, 18, 0.92)';
        navContainer.style.borderColor = 'rgba(255, 255, 255, 0.16)';
      } else {
        navContainer.style.backgroundColor = 'rgba(18, 18, 22, 0.8)';
        navContainer.style.borderColor = 'rgba(255, 255, 255, 0.1)';
      }
    }
  });
});
