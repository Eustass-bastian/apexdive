// Special Offers Popup Functionality
document.addEventListener("DOMContentLoaded", function () {
  const popup = document.getElementById("specialOfferPopup");
  const closeBtn = document.getElementById("closeSpecialOffer");
  const remindLaterBtn = document.getElementById("remindLater");
  const openOffersBtn = document.getElementById("openSpecialOffers");
  const openOffersHeroBtn = document.getElementById("openSpecialOffersHero");

  // Check if popup should be shown (first visit or remind later expired)
  function shouldShowPopup() {
    // Always show popup on every visit to home page
    return true;
  }

  // Show popup with animation
  function showPopup() {
    if (popup) {
      popup.classList.add("show");
      document.body.style.overflow = "hidden";
    }
  }

  // Hide popup with animation
  function hidePopup() {
    if (popup) {
      popup.classList.remove("show");
      document.body.style.overflow = "";
    }
  }

  // Show popup on page load every time
  setTimeout(showPopup, 2000);

  // Close popup when clicking close button
  if (closeBtn) {
    closeBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      console.log("Close button clicked");
      hidePopup();
    });
  } else {
    console.log("Close button not found!");
  }

  // Close popup when clicking backdrop
  if (popup) {
    popup.addEventListener("click", function (e) {
      if (e.target === popup || e.target.classList.contains("popup-backdrop")) {
        hidePopup();
      }
    });
  }

  // Handle "Remind Later" button - just close popup
  if (remindLaterBtn) {
    remindLaterBtn.addEventListener("click", function () {
      hidePopup();
    });
  }

  // Open popup when clicking special offers button (old one)
  if (openOffersBtn) {
    openOffersBtn.addEventListener("click", showPopup);
  }

  // Open popup when clicking hero special offers button
  if (openOffersHeroBtn) {
    openOffersHeroBtn.addEventListener("click", showPopup);
  }

  // Close popup with Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && popup && popup.classList.contains("show")) {
      hidePopup();
    }
  });

  // Add smooth scrolling to CTA buttons if they lead to sections
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Add click tracking for analytics (optional)
  function trackOfferClick(offerType) {
    // You can integrate with Google Analytics or other tracking systems here
    console.log("Offer clicked:", offerType);

    // Example: Google Analytics 4 event tracking
    if (typeof gtag !== "undefined") {
      gtag("event", "special_offer_click", {
        offer_type: offerType,
        source: "popup",
      });
    }
  }

  // Track clicks on offer buttons
  document.querySelectorAll(".offer-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      if (this.classList.contains("primary")) {
        trackOfferClick("claim_offers");
      } else if (this.classList.contains("secondary")) {
        trackOfferClick("remind_later");
      }
    });
  });

  // Track special offers button click
  if (openOffersBtn) {
    openOffersBtn.addEventListener("click", function () {
      trackOfferClick("view_all_offers");
    });
  }
});
