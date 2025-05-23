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

  // Add hover effects to service boxes
  const serviceBoxes = document.querySelectorAll(".service-box");
  if (serviceBoxes.length) {
    serviceBoxes.forEach((box) => {
      box.addEventListener("mouseenter", () => {
        box.style.transform = "translateY(-10px)";
      });

      box.addEventListener("mouseleave", () => {
        box.style.transform = "";
      });
    });
  }

  // Simple partners section enhancements
  document.addEventListener("DOMContentLoaded", function () {
    // Add a subtle entrance animation for the partners section
    const partnersSection = document.querySelector(".partners-section");
    const partnerItems = document.querySelectorAll(".partner-item");
    const partnersBadge = document.querySelector(".partners-badge");

    if (partnersSection && partnerItems.length) {
      // Animate partner items with a slight delay between each
      partnerItems.forEach((item, index) => {
        setTimeout(() => {
          item.style.opacity = "0";
          item.style.transform = "translateY(20px)";

          // Force a reflow
          void item.offsetWidth;

          // Add transition
          item.style.transition = "opacity 0.5s ease, transform 0.5s ease";

          // Animate to final state
          item.style.opacity = "1";
          item.style.transform = "translateY(0)";
        }, index * 150);
      });

      // Animate the badge with a delay
      if (partnersBadge) {
        partnersBadge.style.opacity = "0";
        partnersBadge.style.transform = "scale(0.9)";

        // Force a reflow
        void partnersBadge.offsetWidth;

        // Add transition
        partnersBadge.style.transition =
          "opacity 0.5s ease 0.3s, transform 0.5s ease 0.3s";

        // Animate to final state
        partnersBadge.style.opacity = "1";
        partnersBadge.style.transform = "scale(1)";
      }
    }
  });
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

// Packages Section Functionality
function initPackagesSection() {
  // Add animation to section headers when they come into view
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  // Observe section headers
  document.querySelectorAll(".section-header").forEach((header) => {
    observer.observe(header);
  });

  // Add hover effects to package cards
  const packageCards = document.querySelectorAll(".package-card");
  packageCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      packageCards.forEach((c) => {
        if (c !== card) c.style.transform = "scale(0.98)";
      });
    });

    card.addEventListener("mouseleave", () => {
      packageCards.forEach((c) => {
        if (c !== card) c.style.transform = "";
      });
    });
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: "smooth",
        });
      }
    });
  });

  // Initialize underwater effects for packages hero section
  initPackagesHeroEffects();
}

// Initialize underwater effects for the packages hero section
function initPackagesHeroEffects() {
  const heroSection = document.querySelector(".packages-hero");
  if (!heroSection) return;

  // Create dynamic bubbles
  createDynamicBubbles(heroSection, 10);

  // Add parallax effect to hero section
  window.addEventListener("scroll", () => {
    const scrollPosition = window.scrollY;
    if (scrollPosition < window.innerHeight) {
      const overlay = heroSection.querySelector(".packages-hero-overlay");
      if (overlay) {
        overlay.style.transform = `translateY(${scrollPosition * 0.2}px)`;
      }

      const content = heroSection.querySelector(".packages-hero-content");
      if (content) {
        content.style.transform = `translateY(${scrollPosition * 0.1}px)`;
      }
    }
  });

  // Add mouse movement effect
  heroSection.addEventListener("mousemove", (e) => {
    const { clientX, clientY } = e;
    const xPos = clientX / window.innerWidth - 0.5;
    const yPos = clientY / window.innerHeight - 0.5;

    const bubbles = heroSection.querySelectorAll(".elegant-bubble");
    bubbles.forEach((bubble) => {
      const speed = parseFloat(bubble.getAttribute("data-speed") || 1);
      bubble.style.transform = `translate(${xPos * 30 * speed}px, ${
        yPos * 30 * speed
      }px)`;
    });

    const rays = heroSection.querySelector(".light-rays");
    if (rays) {
      rays.style.backgroundPosition = `${50 + xPos * 10}% ${50 + yPos * 10}%`;
    }
  });
}

// Create dynamic bubbles for underwater effect
function createDynamicBubbles(container, count) {
  const bubblesContainer = document.createElement("div");
  bubblesContainer.className = "dynamic-bubbles";

  for (let i = 0; i < count; i++) {
    const bubble = document.createElement("div");
    bubble.className = "dynamic-bubble";

    // Random properties
    const size = Math.random() * 30 + 10;
    const speed = Math.random() * 2 + 1;
    const delay = Math.random() * 5;
    const xPos = Math.random() * 100;

    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `${xPos}%`;
    bubble.style.animationDuration = `${speed * 10}s`;
    bubble.style.animationDelay = `${delay}s`;
    bubble.setAttribute("data-speed", speed * 0.5);

    bubblesContainer.appendChild(bubble);
  }

  container.appendChild(bubblesContainer);

  // Add CSS for dynamic bubbles
  if (!document.querySelector("#dynamic-bubbles-style")) {
    const style = document.createElement("style");
    style.id = "dynamic-bubbles-style";
    style.textContent = `
      .dynamic-bubbles {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
      }
      
      .dynamic-bubble {
        position: absolute;
        bottom: -50px;
        border-radius: 50%;
        background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1));
        box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
        animation: bubbleRise linear infinite;
        opacity: 0;
      }
      
      @keyframes bubbleRise {
        0% {
          transform: translateY(0) rotate(0);
          opacity: 0;
        }
        10% {
          opacity: 0.8;
        }
        90% {
          opacity: 0.6;
        }
        100% {
          transform: translateY(-100vh) rotate(360deg);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

// Initialize packages functionality when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Check if we're on the packages page
  if (
    document.querySelector(".packages-section") ||
    document.querySelector(".packages-hero")
  ) {
    initPackagesSection();
  }
});

document.addEventListener("DOMContentLoaded", function () {
  // Create animated bubbles in hero section
  const heroOverlay = document.querySelector(".courses-hero-overlay");
  if (heroOverlay) {
    // Create and append animated bubble elements
    for (let i = 0; i < 30; i++) {
      const bubble = document.createElement("div");
      bubble.className = "hero-bubble";

      // Randomize bubble sizes - wider range for more variety
      const size = Math.random() * 60 + 10;
      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;

      // Distribute bubbles across the entire hero section width
      bubble.style.left = `${Math.random() * 98 + 1}%`;

      // Add some bubbles at different starting heights
      bubble.style.bottom = `${Math.random() * 30 - 10}%`;

      // Vary opacity based on size for depth effect
      bubble.style.opacity =
        size < 20
          ? Math.random() * 0.3 + 0.1
          : size < 40
          ? Math.random() * 0.5 + 0.2
          : Math.random() * 0.7 + 0.1;

      // Vary animation duration and delay
      bubble.style.animationDuration = `${Math.random() * 15 + 8}s`;
      bubble.style.animationDelay = `${Math.random() * 8}s`;

      heroOverlay.appendChild(bubble);
    }

    // Create fish for the ocean visual
    const fishGroup = document.querySelector(".fish-group");
    if (fishGroup) {
      // Create multiple fish with different sizes and positions
      for (let i = 0; i < 12; i++) {
        const fish = document.createElement("div");
        fish.className = "fish";

        // Randomize fish sizes for depth effect
        const size = Math.random() * 1.5 + 0.5; // Scale factor between 0.5 and 2
        fish.style.transform = `scale(${size})`;

        // Randomize fish positions
        fish.style.top = `${Math.random() * 80 + 10}%`;
        fish.style.left = `${Math.random() * 40 + 30}%`; // Start from middle area

        // Vary animation duration and delay
        fish.style.animationDuration = `${Math.random() * 15 + 15}s`;
        fish.style.animationDelay = `${Math.random() * 10}s`;

        // Vary opacity based on size for depth effect
        fish.style.opacity = size < 1 ? 0.5 : size < 1.5 ? 0.7 : 0.9;

        fishGroup.appendChild(fish);
      }
    }

    // Create bubbles for the bubble columns
    const bubbleColumns = document.querySelectorAll(".bubbles-column");
    if (bubbleColumns.length > 0) {
      bubbleColumns.forEach((column) => {
        // Create multiple bubbles for each column
        for (let i = 0; i < 8; i++) {
          const bubble = document.createElement("div");
          bubble.className = "bubble-column-bubble";

          // Randomize bubble sizes
          const size = Math.random() * 15 + 5;
          bubble.style.width = `${size}px`;
          bubble.style.height = `${size}px`;

          // Position bubbles within the column
          bubble.style.left = `${Math.random() * 100}%`;
          bubble.style.bottom = `${Math.random() * 20}%`;

          // Vary animation duration and delay
          bubble.style.animationDuration = `${Math.random() * 8 + 4}s`;
          bubble.style.animationDelay = `${Math.random() * 5}s`;

          column.appendChild(bubble);
        }
      });
    }

    // Add parallax effect to hero section
    const hero = document.querySelector(".courses-hero");
    const heroContent = document.querySelector(".courses-hero-content");
    const heroVisual = document.querySelector(".courses-hero-visual");
    // Replace hero circle and ring with new underwater elements
    const underwaterScene = document.querySelector(".underwater-scene");
    const seaweed = document.querySelector(".seaweed");
    const jellyfishElements = document.querySelectorAll(".jellyfish");
    const coralReef = document.querySelector(".coral-reef");
    const fishElements = document.querySelectorAll(".fish");

    hero.addEventListener("mousemove", (e) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;

      // Subtle movement for the overlay
      heroOverlay.style.transform = `translate(${x * -20}px, ${y * -20}px)`;

      // Even more subtle movement for the content
      heroContent.style.transform = `translate(${x * -10}px, ${y * -10}px)`;

      // Move visual elements for parallax effect
      if (underwaterScene) {
        underwaterScene.style.transform = `translate(${x * 30}px, ${
          y * 30 - 50
        }%) scale(${1 + y * 0.05})`;
      }

      if (seaweed) {
        seaweed.style.transform = `skewX(${x * 5 - 2.5}deg)`;
      }

      // Move jellyfish elements with different intensities
      jellyfishElements.forEach((jellyfish, index) => {
        const factor = 1 - index * 0.2;
        jellyfish.style.transform = `translate(${x * -30 * factor}px, ${
          y * -20 * factor
        }px) scale(${0.8 + index * 0.2})`;
      });

      if (coralReef) {
        coralReef.style.transform = `translate(${x * 15}px, ${
          y * 10
        }px) rotate(${x * 2}deg)`;
      }

      // Move fish slightly based on mouse position
      fishElements.forEach((fish) => {
        const scale = fish.style.transform
          ? parseFloat(
              fish.style.transform.replace("scale(", "").replace(")", "")
            )
          : 1;
        const moveFactor = scale * 2; // Larger fish move less
        fish.style.marginLeft = `${(x * -30) / moveFactor}px`;
        fish.style.marginTop = `${(y * -20) / moveFactor}px`;
      });

      // Move bubbles slightly
      const bubbles = document.querySelectorAll(".hero-bubble");
      bubbles.forEach((bubble) => {
        const factor = parseFloat(bubble.style.width) / 60; // Larger bubbles move more
        bubble.style.transform = `translate(${x * -30 * factor}px, ${
          y * -30 * factor
        }px)`;
      });
    });

    // Reset transforms when mouse leaves
    hero.addEventListener("mouseleave", () => {
      heroOverlay.style.transform = "translate(0, 0)";
      heroContent.style.transform = "translate(0, 0)";

      if (underwaterScene) {
        underwaterScene.style.transform = "translateY(-50%)";
      }

      if (seaweed) {
        seaweed.style.transform = "skewX(0deg)";
      }

      // Reset jellyfish positions
      jellyfishElements.forEach((jellyfish, index) => {
        jellyfish.style.transform = `scale(${0.8 + index * 0.2})`;
      });

      if (coralReef) {
        coralReef.style.transform = "translate(0, 0) rotate(0deg)";
      }

      // Reset fish positions
      fishElements.forEach((fish) => {
        fish.style.marginLeft = "0";
        fish.style.marginTop = "0";
      });

      const bubbles = document.querySelectorAll(".hero-bubble");
      bubbles.forEach((bubble) => {
        bubble.style.transform = "translate(0, 0)";
      });
    });

    // Add scroll effect
    window.addEventListener("scroll", () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition < window.innerHeight) {
        const opacity = 1 - scrollPosition / (window.innerHeight / 1.5);
        heroContent.style.opacity = opacity > 0 ? opacity : 0;
        heroContent.style.transform = `translateY(${scrollPosition * 0.3}px)`;

        if (heroVisual) {
          heroVisual.style.transform = `translateY(${scrollPosition * 0.2}px)`;
        }
      }
    });
  }

  // Course Category Filtering
  const categoryTabs = document.querySelectorAll(".category-tab");
  const courseItems = document.querySelectorAll(".course-item");
  const categoryDescriptions = document.querySelectorAll(
    ".category-description"
  );

  categoryTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // Remove active class from all tabs
      categoryTabs.forEach((t) => t.classList.remove("active"));

      // Add active class to clicked tab
      tab.classList.add("active");

      // Get category value
      const category = tab.getAttribute("data-category");

      // Toggle category descriptions
      categoryDescriptions.forEach((desc) => {
        if (desc.getAttribute("data-category") === category) {
          desc.classList.add("active");
        } else {
          desc.classList.remove("active");
        }
      });

      // Filter courses
      courseItems.forEach((item) => {
        if (
          category === "all" ||
          item.getAttribute("data-category") === category
        ) {
          item.style.display = "block";
          // Add animation
          setTimeout(() => {
            item.style.opacity = "1";
            item.style.transform = "translateY(0)";
          }, 50);
        } else {
          item.style.opacity = "0";
          item.style.transform = "translateY(20px)";
          setTimeout(() => {
            item.style.display = "none";
          }, 300);
        }
      });
    });
  });

  // Initialize courses with animation
  courseItems.forEach((item, index) => {
    item.style.opacity = "0";
    item.style.transform = "translateY(20px)";
    item.style.transition = "opacity 0.5s ease, transform 0.5s ease";

    setTimeout(() => {
      item.style.opacity = "1";
      item.style.transform = "translateY(0)";
    }, 100 + index * 100); // Staggered animation
  });

  // FAQ Accordion
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");

    question.addEventListener("click", () => {
      // Check if current item is active
      const isActive = item.classList.contains("active");

      // Close all FAQ items
      faqItems.forEach((faqItem) => {
        faqItem.classList.remove("active");
      });

      // If clicked item wasn't active, make it active
      if (!isActive) {
        item.classList.add("active");
      }
    });
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 100, // Offset for header
          behavior: "smooth",
        });
      }
    });
  });

  // Add hover effects for course cards
  const courseCards = document.querySelectorAll(".course-card");
  courseCards.forEach((card) => {
    // Add subtle animation on hover
    card.addEventListener("mouseenter", function () {
      const highlights = this.querySelectorAll(".course-highlights li");
      highlights.forEach((item, index) => {
        item.style.transform = "translateX(5px)";
        item.style.transition = `transform 0.3s ease ${index * 0.05}s`;
      });
    });

    card.addEventListener("mouseleave", function () {
      const highlights = this.querySelectorAll(".course-highlights li");
      highlights.forEach((item) => {
        item.style.transform = "translateX(0)";
      });
    });
  });

  // Add animation to benefit cards
  const benefitCards = document.querySelectorAll(".benefit-card");

  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  };

  const benefitObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }, index * 150);

        // Unobserve after animation
        benefitObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  benefitCards.forEach((card) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(30px)";
    card.style.transition = "opacity 0.5s ease, transform 0.5s ease";

    benefitObserver.observe(card);
  });

  // Add animation to CTA section
  const ctaSection = document.querySelector(".cta-section");

  if (ctaSection) {
    // Add decorative bubbles to CTA section
    for (let i = 0; i < 4; i++) {
      const bubble = document.createElement("div");
      bubble.className = "cta-bubble";
      bubble.style.width = `${Math.random() * 50 + 20}px`;
      bubble.style.height = bubble.style.width;
      bubble.style.left = `${Math.random() * 90 + 5}%`;
      bubble.style.top = `${Math.random() * 80 + 10}%`;
      bubble.style.opacity = `${Math.random() * 0.1 + 0.05}`;
      bubble.style.animationDuration = `${Math.random() * 10 + 20}s`;
      bubble.style.animationDelay = `${Math.random() * 5}s`;
      ctaSection.appendChild(bubble);
    }

    const ctaObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-cta");
            ctaObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    ctaObserver.observe(ctaSection);
  }
});

// Customize Package Form Functionality
document.addEventListener("DOMContentLoaded", function () {
  const customForm = document.getElementById("customPackageForm");
  if (!customForm) return;

  // Slider elements
  const numDivesSlider = document.getElementById("numDives");
  const numDivesValue = document.getElementById("numDivesValue");
  const numNightsSlider = document.getElementById("numNights");
  const numNightsValue = document.getElementById("numNightsValue");
  const numPeopleSlider = document.getElementById("numPeople");
  const numPeopleValue = document.getElementById("numPeopleValue");
  const divingYearsSlider = document.getElementById("divingYears");
  const divingYearsValue = document.getElementById("divingYearsValue");

  // Update slider values
  function updateSliderValues() {
    if (numDivesSlider && numDivesValue) {
      numDivesValue.textContent = numDivesSlider.value;
      numDivesSlider.addEventListener("input", () => {
        numDivesValue.textContent = numDivesSlider.value;
      });
    }

    if (numNightsSlider && numNightsValue) {
      numNightsValue.textContent = numNightsSlider.value;
      numNightsSlider.addEventListener("input", () => {
        numNightsValue.textContent = numNightsSlider.value;
      });
    }

    if (numPeopleSlider && numPeopleValue) {
      numPeopleValue.textContent = numPeopleSlider.value;
      numPeopleSlider.addEventListener("input", () => {
        numPeopleValue.textContent = numPeopleSlider.value;
      });
    }

    if (divingYearsSlider && divingYearsValue) {
      divingYearsValue.textContent = divingYearsSlider.value;
      divingYearsSlider.addEventListener("input", () => {
        divingYearsValue.textContent = divingYearsSlider.value;
      });
    }
  }

  // Multi-step form navigation
  const formSteps = document.querySelectorAll(".form-step");
  const progressTrack = document.querySelector(".progress-track");
  const nextButtons = document.querySelectorAll(".next-step-btn");
  const prevButtons = document.querySelectorAll(".prev-step-btn");
  const stepItems = document.querySelectorAll(".step-item");

  // Go to next step
  nextButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const currentStep = this.closest(".form-step");
      const currentStepNum = parseInt(currentStep.dataset.step);
      const nextStepNum = currentStepNum + 1;

      // Validate current step (simplified for now)
      const isValid = validateStep(currentStepNum);
      if (!isValid) return;

      // Update progress bar
      updateProgressBar(nextStepNum);

      // Hide current step and show next step
      currentStep.classList.remove("active");
      const nextStep = document.querySelector(
        `.form-step[data-step="${nextStepNum}"]`
      );
      if (nextStep) {
        nextStep.classList.add("active");
      }
    });
  });

  // Go to previous step
  prevButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const currentStep = this.closest(".form-step");
      const currentStepNum = parseInt(currentStep.dataset.step);
      const prevStepNum = currentStepNum - 1;

      // Update progress bar
      updateProgressBar(prevStepNum);

      // Hide current step and show previous step
      currentStep.classList.remove("active");
      const prevStep = document.querySelector(
        `.form-step[data-step="${prevStepNum}"]`
      );
      if (prevStep) {
        prevStep.classList.add("active");
      }
    });
  });

  // Update progress bar
  function updateProgressBar(stepNum) {
    // Update progress track width
    if (progressTrack) {
      progressTrack.style.width = `${(stepNum - 1) * 50}%`;
    }

    // Update step circles
    stepItems.forEach((item) => {
      const itemStepNum = parseInt(item.dataset.step);
      item.classList.remove("active", "completed");

      if (itemStepNum === stepNum) {
        item.classList.add("active");
      } else if (itemStepNum < stepNum) {
        item.classList.add("completed");
      }
    });
  }

  // Simple validation for demonstration
  function validateStep(stepNum) {
    return true; // Skip validation for now
  }

  // Toggle certified diver options
  const certifiedDiverToggle = document.getElementById("certifiedDiver");
  const diverInfoContainers = document.querySelectorAll(".diverInfo-container");

  if (certifiedDiverToggle && diverInfoContainers.length > 0) {
    // Initially hide diver info if toggle is not checked
    if (!certifiedDiverToggle.checked) {
      diverInfoContainers.forEach((container) => {
        container.style.display = "none";
      });
    }

    certifiedDiverToggle.addEventListener("change", function () {
      diverInfoContainers.forEach((container) => {
        container.style.display = this.checked ? "block" : "none";
      });
    });
  }

  // Form submission
  customForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Collect form data
    const formData = new FormData(customForm);
    const formDataObj = {};

    formData.forEach((value, key) => {
      formDataObj[key] = value;
    });

    // For demo purposes, just show success message
    alert(
      "Thank you! Your custom package request has been submitted. We will contact you soon with a quote."
    );

    // Optional: Reset form
    customForm.reset();

    // Return to first step
    formSteps.forEach((step) => step.classList.remove("active"));
    formSteps[0].classList.add("active");
    updateProgressBar(1);
  });

  // Initialize
  updateSliderValues();
});

/* Add styles for success message */
const styleElement = document.createElement("style");
styleElement.textContent = `
  .success-message {
    text-align: center;
    padding: 2rem;
    animation: fadeIn 0.5s ease-out;
  }
  
  .success-icon {
    font-size: 4rem;
    color: #10b981;
    margin-bottom: 1.5rem;
    animation: scaleIn 0.5s ease-out;
  }
  
  .success-message h3 {
    font-size: 1.8rem;
    color: #004953;
    margin-bottom: 1rem;
  }
  
  .success-message p {
    color: #64748b;
    margin-bottom: 0.5rem;
  }
  
  .success-details {
    font-weight: 500;
    color: #334155;
  }
  
  .package-details {
    background: #eef2ff;
    border-radius: 12px;
    padding: 1.5rem;
    margin-top: 2rem;
    animation: slideUp 0.5s ease-out;
  }
  
  .package-details h4 {
    font-size: 1.2rem;
    color: #1e40af;
    margin-bottom: 1rem;
    text-align: center;
  }
  
  .details-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 1rem;
  }
  
  .detail-item {
    background: rgba(255, 255, 255, 0.7);
    padding: 0.75rem;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
    text-align: center;
  }
  
  .detail-label {
    color: #64748b;
    font-size: 0.85rem;
    display: block;
    margin-bottom: 0.3rem;
  }
  
  .detail-value {
    color: #004953;
    font-weight: 700;
    font-size: 1.1rem;
  }
  
  @keyframes scaleIn {
    from {
      transform: scale(0);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
  
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @media (max-width: 576px) {
    .details-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
`;
document.head.appendChild(styleElement);

// Add smooth scrolling for anchor links
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    if (anchor.getAttribute("href") !== "#") {
      // Skip empty hash links
      anchor.addEventListener("click", function (e) {
        e.preventDefault();

        const targetId = this.getAttribute("href");
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80, // 80px offset for header
            behavior: "smooth",
          });
        }
      });
    }
  });
});

// Gallery Navigation
document.addEventListener("DOMContentLoaded", function () {
  const gallery = document.querySelector(".gallery-grid");
  const items = document.querySelectorAll(".gallery-item");

  if (gallery && items.length) {
    let isDragging = false;
    let startX;
    let scrollLeft;
    let currentX;
    let velocity = 0;
    let lastTimestamp;
    let animationFrame;
    let autoScrolling = false;

    function lerp(start, end, factor) {
      return start + (end - start) * factor;
    }

    function getSnapPosition(scrollPosition) {
      const itemWidth = items[0].offsetWidth;
      const gap = parseInt(window.getComputedStyle(gallery).gap) || 0;
      const scrollAmount = itemWidth + gap;
      return Math.round(scrollPosition / scrollAmount) * scrollAmount;
    }

    function smoothScroll(targetPosition, duration = 500) {
      const startPosition = gallery.scrollLeft;
      const distance = targetPosition - startPosition;
      const startTime = performance.now();
      autoScrolling = true;

      function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const easing = 1 - Math.pow(1 - progress, 3);
        gallery.scrollLeft = startPosition + distance * easing;

        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate);
        } else {
          autoScrolling = false;
          gallery.scrollLeft = targetPosition; // Ensure we land exactly on target
        }
      }

      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      animationFrame = requestAnimationFrame(animate);
    }

    function startDragging(e) {
      isDragging = true;
      startX = e.type.includes("mouse") ? e.pageX : e.touches[0].pageX;
      currentX = startX;
      scrollLeft = gallery.scrollLeft;
      lastTimestamp = performance.now();
      velocity = 0;

      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }

      gallery.style.scrollBehavior = "auto";
      gallery.style.cursor = "grabbing";
    }

    function duringDragging(e) {
      if (!isDragging) return;

      const x = e.type.includes("mouse") ? e.pageX : e.touches[0].pageX;
      const deltaX = x - currentX;
      currentX = x;

      // Update velocity
      const now = performance.now();
      const dt = now - lastTimestamp;
      velocity = deltaX / dt;
      lastTimestamp = now;

      // Update scroll position
      gallery.scrollLeft = gallery.scrollLeft - deltaX;

      // Prevent default behavior
      e.preventDefault();
    }

    function stopDragging() {
      if (!isDragging) return;
      isDragging = false;
      gallery.style.cursor = "grab";

      // Apply momentum with decay
      const momentumDistance = velocity * 100; // Adjust this multiplier to control momentum
      const targetScroll = gallery.scrollLeft - momentumDistance;
      const snapTarget = getSnapPosition(targetScroll);

      smoothScroll(snapTarget);
    }

    // Mouse Events
    gallery.addEventListener("mousedown", startDragging);
    gallery.addEventListener("mousemove", duringDragging);
    document.addEventListener("mouseup", stopDragging);
    gallery.addEventListener("mouseleave", stopDragging);

    // Touch Events
    gallery.addEventListener("touchstart", startDragging, { passive: false });
    gallery.addEventListener("touchmove", duringDragging, { passive: false });
    gallery.addEventListener("touchend", stopDragging);
    gallery.addEventListener("touchcancel", stopDragging);

    // Prevent click events during drag
    gallery.addEventListener(
      "click",
      (e) => {
        if (Math.abs(velocity) > 0.1) {
          e.preventDefault();
          e.stopPropagation();
        }
      },
      true
    );

    // Smooth wheel scrolling
    gallery.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault();

        if (autoScrolling) return;

        const delta = e.deltaY || e.deltaX;
        const targetScroll = gallery.scrollLeft + delta;

        if (Math.abs(delta) > 50) {
          // For larger scroll inputs, snap to next/previous item
          const direction = delta > 0 ? 1 : -1;
          const itemWidth = items[0].offsetWidth;
          const gap = parseInt(window.getComputedStyle(gallery).gap) || 0;
          const currentIndex = Math.round(
            gallery.scrollLeft / (itemWidth + gap)
          );
          const targetIndex = currentIndex + direction;
          const snapTarget = targetIndex * (itemWidth + gap);

          smoothScroll(snapTarget);
        } else {
          // For smaller scroll inputs, smooth scroll to position
          smoothScroll(targetScroll, 300);
        }
      },
      { passive: false }
    );

    // Cleanup
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }
});

// Image Gallery Functionality
document.addEventListener("DOMContentLoaded", function () {
  const slides = document.querySelectorAll(".gallery-slide");
  const dots = document.querySelectorAll(".pagination-dot");
  let currentSlide = 0;
  let isAnimating = false;
  let autoplayInterval;
  let touchStartX = 0;
  let touchEndX = 0;

  // Initialize first slide
  slides[0].classList.add("active");

  function goToSlide(index) {
    if (isAnimating || index === currentSlide) return;
    isAnimating = true;

    // Remove active class from current slide and dot
    slides[currentSlide].classList.remove("active");
    slides[currentSlide].classList.add("previous");
    dots[currentSlide].classList.remove("active");

    // Add active class to new slide and dot
    slides[index].classList.add("active");
    dots[index].classList.add("active");

    // After animation completes
    setTimeout(() => {
      slides[currentSlide].classList.remove("previous");
      currentSlide = index;
      isAnimating = false;
    }, 1200); // Match this to the CSS transition duration
  }

  function nextSlide() {
    const next = (currentSlide + 1) % slides.length;
    goToSlide(next);
  }

  function previousSlide() {
    const prev = (currentSlide - 1 + slides.length) % slides.length;
    goToSlide(prev);
  }

  // Add click handlers to pagination dots
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      goToSlide(index);
      resetAutoplay();
    });
  });

  // Touch events for swipe
  const gallery = document.querySelector(".gallery-track");
  if (gallery) {
    gallery.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.touches[0].clientX;
      },
      { passive: true }
    );

    gallery.addEventListener(
      "touchend",
      (e) => {
        touchEndX = e.changedTouches[0].clientX;
        handleSwipe();
      },
      { passive: true }
    );
  }

  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchEndX - touchStartX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        previousSlide();
      } else {
        nextSlide();
      }
      resetAutoplay();
    }
  }

  // Autoplay functionality
  function startAutoplay() {
    autoplayInterval = setInterval(nextSlide, 8000); // Change slide every 8 seconds
  }

  function resetAutoplay() {
    clearInterval(autoplayInterval);
    startAutoplay();
  }

  // Start autoplay
  startAutoplay();

  // Pause autoplay when user interacts with the gallery
  gallery.addEventListener("mouseenter", () => clearInterval(autoplayInterval));
  gallery.addEventListener("mouseleave", startAutoplay);
  gallery.addEventListener("touchstart", () => clearInterval(autoplayInterval));
  gallery.addEventListener("touchend", startAutoplay);

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      previousSlide();
      resetAutoplay();
    } else if (e.key === "ArrowRight") {
      nextSlide();
      resetAutoplay();
    }
  });
});

// Star rating functionality
document
  .querySelector(".rating-input")
  ?.addEventListener("click", function (e) {
    if (e.target.matches(".fas.fa-star")) {
      const rating = e.target.dataset.rating;
      const stars = document.querySelectorAll(".rating-input .fas.fa-star");

      // Update hidden input
      const ratingInput = document.getElementById("ratingInput");
      if (ratingInput) ratingInput.value = rating;

      stars.forEach((star) => {
        star.classList.remove("active");
        if (star.dataset.rating <= rating) {
          star.classList.add("active");
        }
      });
    }
  });

// Avatar selection
document
  .querySelector(".avatar-selection")
  ?.addEventListener("click", function (e) {
    if (e.target.matches(".avatar-option")) {
      document
        .querySelectorAll(".avatar-option")
        .forEach((avatar) => avatar.classList.remove("selected"));
      e.target.classList.add("selected");

      // Update hidden input
      const avatarInput = document.getElementById("avatarInput");
      if (avatarInput) avatarInput.value = e.target.dataset.avatar;
    }
  });

// Review Submission Functionality
document.addEventListener("DOMContentLoaded", function () {
  const shareReviewBtn = document.getElementById("shareReviewBtn");
  const reviewPopup = document.getElementById("reviewPopup");
  const closePopupBtn = document.getElementById("closePopup");
  const reviewForm = document.getElementById("reviewForm");
  const ratingStars = document.querySelectorAll(".rating-input i");
  const avatarOptions = document.querySelectorAll(".avatar-option");
  const formSubmitNote = document.getElementById("formSubmitNote");

  // Show FormSubmit note on first visit
  if (formSubmitNote && !localStorage.getItem("formSubmitNoteShown")) {
    formSubmitNote.style.display = "block";
    localStorage.setItem("formSubmitNoteShown", "true");
  }

  // Open popup
  if (shareReviewBtn) {
    shareReviewBtn.addEventListener("click", () => {
      reviewPopup.classList.add("active");
      document.body.style.overflow = "hidden";
    });
  }

  // Close popup
  if (closePopupBtn) {
    closePopupBtn.addEventListener("click", () => {
      reviewPopup.classList.remove("active");
      document.body.style.overflow = "";
    });
  }

  // Close popup when clicking outside
  if (reviewPopup) {
    reviewPopup.addEventListener("click", (e) => {
      if (e.target === reviewPopup) {
        reviewPopup.classList.remove("active");
        document.body.style.overflow = "";
      }
    });
  }

  // Initialize the form with defaults
  if (document.getElementById("ratingInput")) {
    document.getElementById("ratingInput").value = "5";
    const stars = document.querySelectorAll(".rating-input .fas.fa-star");
    stars.forEach((star) => {
      if (star.dataset.rating <= 5) {
        star.classList.add("active");
      }
    });
  }

  if (document.getElementById("avatarInput") && avatarOptions.length > 0) {
    document.getElementById("avatarInput").value =
      avatarOptions[0].getAttribute("data-avatar");
    avatarOptions[0].classList.add("selected");
  }

  // Store review data before form submission (no preventDefault)
  if (reviewForm) {
    reviewForm.addEventListener("submit", function () {
      try {
        // Get form values for local storage
        const name = document.getElementById("reviewerName").value;
        const title = document.getElementById("reviewTitle").value;
        const review = document.getElementById("reviewText").value;
        const rating = document.getElementById("ratingInput").value;
        const avatar = document.getElementById("avatarInput").value;

        // Store form data to add review locally when returning from thank-you page
        localStorage.setItem(
          "pendingReview",
          JSON.stringify({
            name: name,
            title: title,
            text: review,
            rating: parseInt(rating),
            avatar: avatar,
          })
        );

        console.log("Form submitted to FormSubmit.co");
      } catch (error) {
        console.error("Error storing review data:", error);
      }
      // Let the form submit naturally - no need to return false or prevent default
    });
  }
});

// Check for pending review on page load
document.addEventListener("DOMContentLoaded", function () {
  const pendingReview = localStorage.getItem("pendingReview");

  if (pendingReview) {
    try {
      // Parse the stored review data
      const reviewData = JSON.parse(pendingReview);

      // Create a new review card
      const reviewCard = createReviewCard(reviewData);

      // Add to carousel
      const reviewsContainer = document.querySelector(".reviews-container");
      if (reviewsContainer) {
        reviewsContainer.appendChild(reviewCard);

        // Create new indicator dot
        const indicators = document.querySelector(".reviews-indicators");
        if (indicators) {
          const newDot = document.createElement("span");
          newDot.className = "indicator";
          newDot.setAttribute(
            "data-index",
            document.querySelectorAll(".review-card").length - 1
          );
          indicators.appendChild(newDot);
        }
      }

      // Clear the pending review
      localStorage.removeItem("pendingReview");
    } catch (error) {
      console.error("Error processing pending review:", error);
      localStorage.removeItem("pendingReview");
    }
  }
});

function createReviewCard(review) {
  const card = document.createElement("div");
  card.className = "review-card";

  card.innerHTML = `
    <div class="review-bubbles">
      <div class="review-bubble bubble-1"></div>
      <div class="review-bubble bubble-2"></div>
      <div class="review-bubble bubble-3"></div>
    </div>
    <div class="review-profile">
      <div class="review-avatar">
        <img src="images/${review.avatar}" alt="${review.name}">
      </div>
      <div class="review-info">
        <h3>${review.title}</h3>
        <p>${review.text}</p>
        <div class="reviewer-name">${review.name}</div>
        <div class="review-rating">
          ${Array(review.rating).fill('<i class="fas fa-star"></i>').join("")}
          ${Array(5 - review.rating)
            .fill('<i class="far fa-star"></i>')
            .join("")}
        </div>
      </div>
    </div>
  `;

  return card;
}
