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

  // Form select elements
  const travelMonth = document.getElementById("travelMonth");
  const travelYear = document.getElementById("travelYear");

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

  // Add event listeners to form elements for summary updates
  function addSummaryUpdateListeners() {
    // Add listeners to sliders
    const sliders = [
      numDivesSlider,
      numNightsSlider,
      numPeopleSlider,
      divingYearsSlider,
    ];
    sliders.forEach((slider) => {
      if (slider) {
        slider.addEventListener("change", updatePackageSummary);
      }
    });

    // Add listeners to select fields
    const selects = [
      travelMonth,
      travelYear,
      document.getElementById("diverLevel"),
    ];
    selects.forEach((select) => {
      if (select) {
        select.addEventListener("change", updatePackageSummary);
      }
    });

    // Add listener to certified diver toggle
    if (certifiedDiverToggle) {
      certifiedDiverToggle.addEventListener("change", updatePackageSummary);
    }
  }

  // Set default year to 2025
  if (travelYear) {
    travelYear.value = "2025";
  }

  // Multi-step form navigation
  const formSteps = document.querySelectorAll(".form-step");
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

      // Update step indicators instead of progress bar
      updateStepIndicators(nextStepNum);

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

      // Update step indicators instead of progress bar
      updateStepIndicators(prevStepNum);

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

  // Update step indicators instead of progress bar
  function updateStepIndicators(stepNum) {
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

    // Update summary when going to step 3
    if (stepNum === 3) {
      updatePackageSummary();
    }
  }

  // Function to update package summary
  function updatePackageSummary() {
    // Get summary elements
    const summaryDives = document.getElementById("summaryDives");
    const summaryNights = document.getElementById("summaryNights");
    const summaryPeople = document.getElementById("summaryPeople");
    const summaryDate = document.getElementById("summaryDate");
    const summaryDiverStatus = document.getElementById("summaryDiverStatus");
    const summaryCertification = document.getElementById(
      "summaryCertification"
    );
    const summaryExperience = document.getElementById("summaryExperience");
    const summaryCertificationContainer = document.getElementById(
      "summaryCertificationContainer"
    );
    const summaryExperienceContainer = document.getElementById(
      "summaryExperienceContainer"
    );

    // Update values from inputs
    if (summaryDives && numDivesSlider) {
      summaryDives.textContent = numDivesSlider.value;
    }

    if (summaryNights && numNightsSlider) {
      summaryNights.textContent = numNightsSlider.value;
    }

    if (summaryPeople && numPeopleSlider) {
      summaryPeople.textContent = numPeopleSlider.value;
    }

    // Update travel date
    if (summaryDate && travelMonth && travelYear) {
      if (travelMonth.value && travelYear.value) {
        const monthText = travelMonth.options[travelMonth.selectedIndex].text;
        summaryDate.textContent = `${monthText} ${travelYear.value}`;
      } else {
        summaryDate.textContent = "Not selected";
      }
    }

    // Update diver info
    if (summaryDiverStatus && certifiedDiverToggle) {
      summaryDiverStatus.textContent = certifiedDiverToggle.checked
        ? "Certified Diver"
        : "Not certified";
    }

    // Update certification level
    if (summaryCertification) {
      const diverLevel = document.getElementById("diverLevel");
      if (
        certifiedDiverToggle &&
        certifiedDiverToggle.checked &&
        diverLevel &&
        diverLevel.value
      ) {
        const levelText = diverLevel.options[diverLevel.selectedIndex].text;
        summaryCertification.textContent = levelText;
        if (summaryCertificationContainer) {
          summaryCertificationContainer.style.display = "flex";
        }
      } else {
        summaryCertification.textContent = "-";
        if (summaryCertificationContainer) {
          summaryCertificationContainer.style.display =
            certifiedDiverToggle.checked ? "flex" : "none";
        }
      }
    }

    // Update years of experience
    if (summaryExperience && divingYearsSlider) {
      if (certifiedDiverToggle && certifiedDiverToggle.checked) {
        summaryExperience.textContent = divingYearsSlider.value + " years";
        if (summaryExperienceContainer) {
          summaryExperienceContainer.style.display = "flex";
        }
      } else {
        summaryExperience.textContent = "-";
        if (summaryExperienceContainer) {
          summaryExperienceContainer.style.display = "none";
        }
      }
    }
  }

  // Simple validation for demonstration
  function validateStep(stepNum) {
    if (stepNum === 1) {
      // Validate travel date fields
      if (travelMonth && travelYear) {
        if (!travelMonth.value) {
          alert("Please select a travel month");
          return false;
        }
        if (!travelYear.value) {
          alert("Please select a travel year");
          return false;
        }
      }
    } else if (stepNum === 2) {
      // Validate diver certification info if "Yes" is selected
      const certifiedDiver = document.getElementById("certifiedDiver");
      const diverLevel = document.getElementById("diverLevel");

      // If certified diver is checked, verify certification level is selected
      if (
        certifiedDiver &&
        certifiedDiver.checked &&
        diverLevel &&
        !diverLevel.value
      ) {
        alert("Please select your certification level");
        return false;
      }
    }
    return true; // Skip other validations for now
  }

  // Toggle certified diver options
  const certifiedDiverToggle = document.getElementById("certifiedDiver");
  const diverInfoContainers = document.querySelectorAll(".diverInfo-container");
  const certificationLevelContainer = document.getElementById(
    "certificationLevelContainer"
  );
  const divingExperienceContainer = document.getElementById(
    "divingExperienceContainer"
  );
  const additionalRequestsContainer = document.getElementById(
    "additionalRequestsContainer"
  );

  if (certifiedDiverToggle) {
    // Initialize the form based on toggle state
    toggleDiverInfo(certifiedDiverToggle.checked);

    // Add event listener for toggle changes
    certifiedDiverToggle.addEventListener("change", function () {
      toggleDiverInfo(this.checked);
    });
  }

  // Function to toggle visibility of diver information sections
  function toggleDiverInfo(isCertified) {
    // Show/hide certification level and diving experience
    if (diverInfoContainers) {
      diverInfoContainers.forEach((container) => {
        container.style.display = isCertified ? "block" : "none";
      });
    }

    // If user changed to "No", reset certification level
    if (!isCertified) {
      const diverLevel = document.getElementById("diverLevel");
      if (diverLevel) {
        diverLevel.value = "";
      }
    }
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

    // Build package summary message
    let summaryMsg = "\n\n--- Your Package Details ---";
    summaryMsg += `\nNumber of Dives: ${
      numDivesSlider ? numDivesSlider.value : "0"
    }`;
    summaryMsg += `\nNumber of Nights: ${
      numNightsSlider ? numNightsSlider.value : "0"
    }`;
    summaryMsg += `\nNumber of People: ${
      numPeopleSlider ? numPeopleSlider.value : "0"
    }`;

    // Add travel date
    if (travelMonth && travelYear && travelMonth.value && travelYear.value) {
      summaryMsg += `\nTravel Date: ${
        travelMonth.options[travelMonth.selectedIndex].text
      } ${travelYear.value}`;
    }

    // Add diver info
    if (certifiedDiverToggle) {
      summaryMsg += `\nDiver Status: ${
        certifiedDiverToggle.checked ? "Certified Diver" : "Not certified"
      }`;

      // Add certification details if certified
      if (certifiedDiverToggle.checked) {
        const diverLevel = document.getElementById("diverLevel");
        if (diverLevel && diverLevel.value) {
          summaryMsg += `\nCertification Level: ${
            diverLevel.options[diverLevel.selectedIndex].text
          }`;
        }

        if (divingYearsSlider) {
          summaryMsg += `\nYears of Experience: ${divingYearsSlider.value}`;
        }
      }
    }

    // Add additional requests if any
    const additionalRequests = document.getElementById("additionalRequests");
    if (additionalRequests && additionalRequests.value.trim()) {
      summaryMsg += `\n\nAdditional Requests: ${additionalRequests.value.trim()}`;
    }

    // For demo purposes, just show success message
    alert(
      "Thank you! Your custom package request has been submitted. We will contact you soon with a personalized quote." +
        summaryMsg
    );

    // Optional: Reset form
    customForm.reset();

    // Set default year back to 2025
    if (travelYear) {
      travelYear.value = "2025";
    }

    // Return to first step
    formSteps.forEach((step) => step.classList.remove("active"));
    formSteps[0].classList.add("active");
    updateStepIndicators(1);
  });

  // Initialize
  updateSliderValues();
  addSummaryUpdateListeners();
});
