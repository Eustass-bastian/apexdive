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
