// Theme toggle script - Matching al-folio behavior exactly
// Cycles through: system -> light -> dark -> system

(function() {
  'use strict';
  
  // Get stored theme setting
  function getThemeSetting() {
    try {
      return localStorage.getItem('theme') || 'system';
    } catch (e) {
      return 'system';
    }
  }
  
  // Get system preference
  function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  
  // Compute actual theme from setting
  function getComputedTheme(setting) {
    return setting === 'system' ? getSystemTheme() : setting;
  }
  
  // Apply theme to document
  function applyTheme(setting) {
    var theme = getComputedTheme(setting);
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-theme-setting', setting);
    
    // Store preference
    try {
      localStorage.setItem('theme', setting);
    } catch (e) {
      // localStorage not available
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
  
  // Toggle through theme settings: system -> light -> dark -> system
  function toggleTheme() {
    var current = getThemeSetting();
    var next;
    
    if (current === 'system') {
      next = 'light';
    } else if (current === 'light') {
      next = 'dark';
    } else {
      next = 'system';
    }
    
    applyTheme(next);
  }
  
  // Listen for system theme changes
  var mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', function() {
    var setting = getThemeSetting();
    if (setting === 'system') {
      applyTheme('system');
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
    var setting = getThemeSetting();
    applyTheme(setting);
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
