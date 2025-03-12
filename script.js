document.addEventListener("DOMContentLoaded", function () {
  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
  const mobileNav = document.querySelector(".mobile-nav");

  // Toggle mobile menu
  mobileMenuToggle.addEventListener("click", function (e) {
    e.stopPropagation();
    mobileNav.classList.toggle("active");
    mobileMenuToggle.classList.toggle("active");
  });

  // Close mobile menu when clicking outside
  document.addEventListener("click", function (event) {
    const isClickInsideMenu = mobileNav.contains(event.target);
    const isClickOnToggle = mobileMenuToggle.contains(event.target);

    if (
      mobileNav.classList.contains("active") &&
      !isClickInsideMenu &&
      !isClickOnToggle
    ) {
      mobileNav.classList.remove("active");
      mobileMenuToggle.classList.remove("active");
    }
  });

  // Close mobile menu when window is resized to desktop size
  window.addEventListener("resize", function () {
    if (window.innerWidth > 768 && mobileNav.classList.contains("active")) {
      mobileNav.classList.remove("active");
      mobileMenuToggle.classList.remove("active");
    }
  });

  // Reviews Carousel Functionality
  const reviewCards = document.querySelectorAll(".review-card");
  const indicators = document.querySelectorAll(".indicator");
  const prevArrow = document.querySelector(".prev-arrow");
  const nextArrow = document.querySelector(".next-arrow");
  let currentIndex = 0;
  let isAnimating = false;

  // Function to show a specific review
  function showReview(index, direction = "next") {
    if (isAnimating) return;
    isAnimating = true;

    // Get the current active card
    const currentCard = document.querySelector(".review-card.active");
    const targetCard = reviewCards[index];

    // Set initial positions based on direction
    if (direction === "next") {
      targetCard.style.transform = "translateX(100%)";
      currentCard.classList.add("prev");
    } else {
      targetCard.style.transform = "translateX(-100%)";
      currentCard.style.transform = "translateX(100%)";
    }

    // Force a reflow to ensure the initial transform is applied
    void targetCard.offsetWidth;

    // Make the target card visible but not yet active
    targetCard.style.opacity = "1";

    // Transition to the new positions
    setTimeout(() => {
      targetCard.style.transform = "translateX(0)";

      if (direction === "next") {
        currentCard.style.transform = "translateX(-100%)";
      } else {
        currentCard.style.transform = "translateX(100%)";
      }

      currentCard.style.opacity = "0";

      // After transition completes, update classes
      setTimeout(() => {
        // Remove active class from all reviews
        reviewCards.forEach((card) => {
          card.classList.remove("active", "prev");
          if (card !== targetCard) {
            card.style.opacity = "0";
            card.style.transform = "translateX(100%)";
          }
        });

        // Add active class to the target review
        targetCard.classList.add("active");

        // Update indicators
        indicators.forEach((indicator, i) => {
          indicator.classList.toggle("active", i === index);
        });

        // Update current index
        currentIndex = index;
        isAnimating = false;
      }, 500); // Match this to the CSS transition duration
    }, 50);
  }

  // Event listeners for indicators
  indicators.forEach((indicator, index) => {
    indicator.addEventListener("click", () => {
      if (index === currentIndex) return;

      const direction = index > currentIndex ? "next" : "prev";
      showReview(index, direction);

      // Add visual feedback for touch devices
      if ("ontouchstart" in window) {
        indicator.style.transform = "scale(0.9)";
        setTimeout(() => {
          indicator.style.transform = "";
        }, 150);
      }
    });
  });

  // Event listeners for arrows
  if (prevArrow) {
    prevArrow.addEventListener("click", () => {
      if (isAnimating) return;

      let newIndex = currentIndex - 1;
      if (newIndex < 0) {
        newIndex = reviewCards.length - 1;
      }
      showReview(newIndex, "prev");

      // Add visual feedback for touch devices
      if ("ontouchstart" in window) {
        prevArrow.style.transform = "translateY(-50%) scale(0.9)";
        setTimeout(() => {
          prevArrow.style.transform = "translateY(-50%)";
        }, 150);
      }
    });
  }

  if (nextArrow) {
    nextArrow.addEventListener("click", () => {
      if (isAnimating) return;

      let newIndex = currentIndex + 1;
      if (newIndex >= reviewCards.length) {
        newIndex = 0;
      }
      showReview(newIndex, "next");

      // Add visual feedback for touch devices
      if ("ontouchstart" in window) {
        nextArrow.style.transform = "translateY(-50%) scale(0.9)";
        setTimeout(() => {
          nextArrow.style.transform = "translateY(-50%)";
        }, 150);
      }
    });
  }

  // Add touch swipe functionality for mobile
  let touchStartX = 0;
  let touchEndX = 0;
  const reviewsContainer = document.querySelector(".reviews-container");

  if (reviewsContainer) {
    reviewsContainer.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
      },
      { passive: true }
    );

    reviewsContainer.addEventListener(
      "touchend",
      (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
      },
      { passive: true }
    );

    function handleSwipe() {
      if (isAnimating) return;

      const swipeThreshold = 50; // Minimum distance to register as a swipe
      const swipeDistance = touchEndX - touchStartX;

      if (swipeDistance > swipeThreshold) {
        // Swiped right - show previous
        let newIndex = currentIndex - 1;
        if (newIndex < 0) {
          newIndex = reviewCards.length - 1;
        }
        showReview(newIndex, "prev");
      } else if (swipeDistance < -swipeThreshold) {
        // Swiped left - show next
        let newIndex = currentIndex + 1;
        if (newIndex >= reviewCards.length) {
          newIndex = 0;
        }
        showReview(newIndex, "next");
      }
    }
  }

  // Add touch feedback for review button
  const reviewBtn = document.querySelector(".review-btn");
  if (reviewBtn) {
    reviewBtn.addEventListener("click", (e) => {
      if ("ontouchstart" in window) {
        reviewBtn.style.transform = "translateY(2px)";
        setTimeout(() => {
          reviewBtn.style.transform = "";
        }, 150);
      }
    });
  }

  // Initialize the first review
  if (reviewCards.length > 0) {
    // Set initial state without animation
    reviewCards[0].classList.add("active");
    reviewCards[0].style.transform = "translateX(0)";
    reviewCards[0].style.opacity = "1";

    if (indicators.length > 0) {
      indicators[0].classList.add("active");
    }
  }
});

// Course filtering functionality
document.addEventListener("DOMContentLoaded", function () {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const courseCards = document.querySelectorAll(".course-card");

  // Add click event to filter buttons
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Remove active class from all buttons
      filterButtons.forEach((btn) => btn.classList.remove("active"));

      // Add active class to clicked button
      button.classList.add("active");

      // Get filter value
      const filterValue = button.getAttribute("data-filter");

      // Filter courses
      courseCards.forEach((card) => {
        if (
          filterValue === "all" ||
          card.getAttribute("data-category") === filterValue
        ) {
          card.classList.remove("hidden");
        } else {
          card.classList.add("hidden");
        }
      });
    });
  });

  // Add hover effect to course cards
  courseCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      // Pause the floating animation when hovering
      card.style.animationPlayState = "paused";
    });

    card.addEventListener("mouseleave", () => {
      // Resume the floating animation when not hovering
      card.style.animationPlayState = "running";
    });
  });
});

// Dive Packages functionality
document.addEventListener("DOMContentLoaded", function () {
  const packageCards = document.querySelectorAll(".package-card");

  // Add hover effect to package cards
  packageCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      // Pause the pulse animation when hovering
      card.style.animationPlayState = "paused";

      // Add a subtle rotation effect
      card.style.transform = card.classList.contains("featured")
        ? "translateY(-15px) scale(1.05) rotateY(3deg)"
        : "translateY(-15px) rotateY(3deg)";
    });

    card.addEventListener("mouseleave", () => {
      // Resume the pulse animation when not hovering
      card.style.animationPlayState = "running";

      // Remove the rotation effect
      card.style.transform = card.classList.contains("featured")
        ? "scale(1.05)"
        : "";
    });
  });

  // Add click effect to price bubbles
  const priceBubbles = document.querySelectorAll(".package-price-bubble");
  priceBubbles.forEach((bubble) => {
    bubble.addEventListener("click", () => {
      // Add a bounce effect
      bubble.style.transform = "scale(1.2) rotate(20deg)";

      // Reset after animation
      setTimeout(() => {
        bubble.style.transform = "";
      }, 300);

      // Highlight the associated package
      const packageCard = bubble.closest(".package-card");
      packageCard.style.boxShadow = "0 30px 70px rgba(74, 125, 189, 0.4)";

      // Reset after animation
      setTimeout(() => {
        packageCard.style.boxShadow = "";
      }, 1000);
    });
  });

  // Add smooth scroll to booking buttons
  const packageBtns = document.querySelectorAll(".package-btn");
  packageBtns.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();

      // Add a click effect
      this.style.transform = "translateY(2px)";
      setTimeout(() => {
        this.style.transform = "";
      }, 200);

      // Scroll to top of page (where booking form would be)
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  });
});
