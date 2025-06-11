// Menu toggle functionality
function toggleMenu() {
  const menu = document.getElementById('side-menu');
  const toggleBtn = document.getElementById('menu-toggle');
  const closeBtn = document.getElementById('close-btn');
  
  if (menu.style.width === '300px') {
    menu.style.width = '0';
    toggleBtn.style.display = 'block';
    closeBtn.style.display = 'none';
  } else {
    menu.style.width = '300px';
    toggleBtn.style.display = 'none';
    closeBtn.style.display = 'block';
  }
}

// Close menu when clicking outside
document.addEventListener('click', function(event) {
  const menu = document.getElementById('side-menu');
  const menuToggle = document.getElementById('menu-toggle');
  const closeBtn = document.getElementById('close-btn');
  
  if (!menu.contains(event.target) && !menuToggle.contains(event.target) && !closeBtn.contains(event.target)) {
    if (menu.style.width === '300px') {
      toggleMenu();
    }
  }
});

// Header scroll effect
window.addEventListener('scroll', function() {
  const header = document.querySelector('.fixed-header');
  if (window.scrollY > 50) {
    header.style.background = 'rgba(255, 255, 255, 1)';
    header.style.boxShadow = '0 1px 5px rgba(0,0,0,0.15)';
  } else {
    header.style.background = 'rgba(255, 255, 255, 0.98)';
    header.style.boxShadow = '0 1px 3px rgba(0,0,0,0.12)';
  }
});

// Back to Top functionality
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

// Optional: Show/hide back to top button based on scroll position
function toggleBackToTopButton() {
  const backToTopBtn = document.querySelector('.back-to-top');
  if (window.scrollY > 300) {
    backToTopBtn.style.opacity = '1';
    backToTopBtn.style.visibility = 'visible';
  } else {
    backToTopBtn.style.opacity = '0';
    backToTopBtn.style.visibility = 'hidden';
  }
}

// Add scroll event listener
window.addEventListener('scroll', toggleBackToTopButton);

// Initialize button state on page load
document.addEventListener('DOMContentLoaded', toggleBackToTopButton);