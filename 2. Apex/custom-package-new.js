// Simple Custom Package Form Functionality - NO FORM SUBMISSION HANDLING
document.addEventListener("DOMContentLoaded", function () {
  // Handle diver certification radio buttons and show/hide related fields
  const diverYesRadio = document.getElementById("diverYes");
  const diverNoRadio = document.getElementById("diverNo");
  const certificationLevelContainer = document.getElementById(
    "certificationLevelContainer"
  );
  const divingExperienceContainer = document.getElementById(
    "divingExperienceContainer"
  );

  // Only continue if we have the necessary elements
  if (
    diverYesRadio &&
    diverNoRadio &&
    certificationLevelContainer &&
    divingExperienceContainer
  ) {
    // Hide certification sections initially (since "No" is default)
    certificationLevelContainer.style.display = "none";
    divingExperienceContainer.style.display = "none";

    // Show certification fields when "Yes" is selected
    diverYesRadio.addEventListener("change", function () {
      if (this.checked) {
        certificationLevelContainer.style.display = "block";
        divingExperienceContainer.style.display = "block";
      }
    });

    // Hide certification fields when "No" is selected
    diverNoRadio.addEventListener("change", function () {
      if (this.checked) {
        certificationLevelContainer.style.display = "none";
        divingExperienceContainer.style.display = "none";

        // Reset certification level value
        const diverLevel = document.getElementById("diverLevel");
        if (diverLevel) {
          diverLevel.value = "";
        }
      }
    });
  }

  // Handle multi-step form navigation
  const formSteps = document.querySelectorAll(".form-step");
  const nextButtons = document.querySelectorAll(".next-step-btn");
  const prevButtons = document.querySelectorAll(".prev-step-btn");

  // Next step buttons
  nextButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const currentStep = this.closest(".form-step");
      if (!currentStep) return;

      const currentStepNum = parseInt(currentStep.dataset.step);
      currentStep.classList.remove("active");

      const nextStep = document.querySelector(
        `.form-step[data-step="${currentStepNum + 1}"]`
      );
      if (nextStep) {
        nextStep.classList.add("active");
      }
    });
  });

  // Previous step buttons
  prevButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const currentStep = this.closest(".form-step");
      if (!currentStep) return;

      const currentStepNum = parseInt(currentStep.dataset.step);
      currentStep.classList.remove("active");

      const prevStep = document.querySelector(
        `.form-step[data-step="${currentStepNum - 1}"]`
      );
      if (prevStep) {
        prevStep.classList.add("active");
      }
    });
  });

  // Initialize slider value displays
  const numDivesSlider = document.getElementById("numDives");
  const numDivesValue = document.getElementById("numDivesValue");
  if (numDivesSlider && numDivesValue) {
    numDivesValue.textContent = numDivesSlider.value;
    numDivesSlider.addEventListener("input", function () {
      numDivesValue.textContent = this.value;
    });
  }

  const numPeopleSlider = document.getElementById("numPeople");
  const numPeopleValue = document.getElementById("numPeopleValue");
  if (numPeopleSlider && numPeopleValue) {
    numPeopleValue.textContent = numPeopleSlider.value;
    numPeopleSlider.addEventListener("input", function () {
      numPeopleValue.textContent = this.value;
    });
  }

  const divingYearsSlider = document.getElementById("divingYears");
  const divingYearsValue = document.getElementById("divingYearsValue");
  if (divingYearsSlider && divingYearsValue) {
    divingYearsValue.textContent = divingYearsSlider.value;
    divingYearsSlider.addEventListener("input", function () {
      divingYearsValue.textContent = this.value;
    });
  }

  // NO FORM SUBMISSION HANDLING - let the browser handle it naturally
});
