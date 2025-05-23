// Check if device is mobile
const isMobile =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

// Intersection Observer options - adjust threshold for mobile
const observerOptions = {
  root: null,
  threshold: isMobile ? 0.05 : 0.1, // Lower threshold for mobile devices
  rootMargin: isMobile ? "10px" : "0px", // Smaller rootMargin for mobile
};

// Debounce function for performance
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Create the observer
const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    // Add appear class to the target element
    requestAnimationFrame(() => {
      entry.target.classList.add("appear");

      // If the element has children with stagger class, animate them with delay
      if (entry.target.classList.contains("stagger-children")) {
        const children = entry.target.querySelectorAll(".stagger");
        children.forEach((child, index) => {
          // Reduce delay on mobile
          const delay = isMobile ? index * 0.05 : index * 0.1;
          child.style.transitionDelay = `${delay}s`;
          child.classList.add("appear");
        });
      }
    });

    // Unobserve after animation
    observer.unobserve(entry.target);
  });
}, observerOptions);

// Batch DOM operations for better performance
function batchObserve(elements) {
  requestAnimationFrame(() => {
    elements.forEach((element) => {
      observer.observe(element);
    });
  });
}

// Function to initialize animations
function initAnimations() {
  // Only animate if the user hasn't requested reduced motion
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  // Create arrays to batch observations
  const fadeElements = [];
  const scaleElements = [];
  const staggerElements = [];

  // Animate sections
  document.querySelectorAll("section").forEach((section) => {
    section.classList.add("fade-in");
    fadeElements.push(section);
  });

  // Animate service cards
  document.querySelectorAll(".service-box").forEach((card) => {
    card.classList.add("scale-up");
    scaleElements.push(card);
  });

  // Animate course cards with stagger effect
  const courseGrid = document.querySelector(".courses-grid");
  if (courseGrid) {
    courseGrid.classList.add("stagger-children");
    const courseCards = courseGrid.querySelectorAll(".course-card");
    courseCards.forEach((card) => {
      card.classList.add("stagger");
    });
    staggerElements.push(courseGrid);
  }

  // Animate bundle cards
  document.querySelectorAll(".bundle-card").forEach((card, index) => {
    card.classList.add(index % 2 === 0 ? "slide-left" : "slide-right");
    fadeElements.push(card);
  });

  // Animate package cards
  document.querySelectorAll(".package-card").forEach((card) => {
    card.classList.add("scale-up");
    scaleElements.push(card);
  });

  // Animate marine cards
  document.querySelectorAll(".marine-card").forEach((card) => {
    card.classList.add("fade-in");
    fadeElements.push(card);
  });

  // Animate review cards
  document.querySelectorAll(".review-card").forEach((card) => {
    card.classList.add("fade-in");
    fadeElements.push(card);
  });

  // Animate stats
  document.querySelectorAll(".stat-item").forEach((stat, index) => {
    stat.classList.add("fade-in", `delay-${index + 1}`);
    fadeElements.push(stat);
  });

  // Batch observe elements
  batchObserve(fadeElements);
  batchObserve(scaleElements);
  batchObserve(staggerElements);
}

// Initialize animations when DOM is loaded, with debounce for performance
document.addEventListener("DOMContentLoaded", debounce(initAnimations, 100));

// Reinitialize animations on orientation change for mobile devices
if (isMobile) {
  window.addEventListener(
    "orientationchange",
    debounce(() => {
      // Wait for orientation change to complete
      setTimeout(initAnimations, 300);
    }, 100)
  );
}
