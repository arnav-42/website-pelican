// Theme toggle script - light/dark only, defaulting to system preference

(function() {
  'use strict';
  
  // Get stored theme setting
  function getStoredTheme() {
    try {
      return localStorage.getItem('theme');
    } catch (e) {
      return null;
    }
  }
  
  // Get system preference
  function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  
  // Compute initial theme from storage or system
  function getPreferredTheme() {
    var stored = getStoredTheme();
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
    return getSystemTheme();
  }
  
  // Apply theme to document
  function applyTheme(theme, persist) {
    document.documentElement.setAttribute('data-theme', theme);
    
    // Store preference
    if (persist) {
      try {
        localStorage.setItem('theme', theme);
      } catch (e) {
        // localStorage not available
      }
    }
    
    // Update tables for Bootstrap dark mode compatibility
    var tables = document.querySelectorAll('table');
    tables.forEach(function(table) {
      if (theme === 'dark') {
        table.classList.add('table-dark');
      } else {
        table.classList.remove('table-dark');
      }
    });
  }
  
  // Toggle between light and dark
  function toggleTheme() {
    var current = document.documentElement.getAttribute('data-theme');
    var next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next, true);
  }
  
  // Listen for system theme changes
  var mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', function() {
    var stored = getStoredTheme();
    if (stored !== 'light' && stored !== 'dark') {
      applyTheme(getSystemTheme(), false);
    }
  });
  
  // Initialize when DOM is ready
  function init() {
    var lightToggle = document.getElementById('light-toggle');
    if (lightToggle) {
      lightToggle.addEventListener('click', function(e) {
        e.preventDefault();
        toggleTheme();
      });
    }
    
    // Apply initial theme (may already be set in head, but ensure consistency)
    applyTheme(getPreferredTheme(), false);
  }
  
  // Run init when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

// Profile Image Slideshow
var currentProfileImage = 0;

function showProfileImage(index) {
  var images = document.querySelectorAll('.profile-slideshow .profile-img');
  var dots = document.querySelectorAll('.slideshow-dots .dot');
  
  if (images.length === 0) return;
  
  // Wrap around
  if (index >= images.length) index = 0;
  if (index < 0) index = images.length - 1;
  
  currentProfileImage = index;
  
  // Hide all images and deactivate all dots
  images.forEach(function(img) {
    img.classList.remove('active');
  });
  dots.forEach(function(dot) {
    dot.classList.remove('active');
  });
  
  // Show selected image and activate dot
  images[index].classList.add('active');
  if (dots[index]) {
    dots[index].classList.add('active');
  }
}

function nextProfileImage() {
  showProfileImage(currentProfileImage + 1);
}
