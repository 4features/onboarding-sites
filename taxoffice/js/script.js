document.addEventListener("DOMContentLoaded", function () {
  const startOnboardingBtn = document.getElementById("start-onboarding-btn");
  const a2pFormSection = document.getElementById("business-profile");
  if (startOnboardingBtn && a2pFormSection) {
    startOnboardingBtn.addEventListener("click", function () {
      a2pFormSection.scrollIntoView({ behavior: "smooth" });
    });
  }

  // Plan selection logic - show/hide Jasmine setup
  const planSelect = document.querySelector("select[name='taxoffice_plan']");
  const jasmineSetup = document.getElementById("jasmine-setup");
  
  if (planSelect && jasmineSetup) {
    planSelect.addEventListener("change", function() {
      const selectedPlan = this.value;
      
      if (selectedPlan === "small-firm" || selectedPlan === "growth-pro") {
        jasmineSetup.style.display = "block";
        // Make Jasmine fields required for plans that include it
        const jasmineFields = jasmineSetup.querySelectorAll("select[name='greeting_style'], input[name='languages_spoken']");
        jasmineFields.forEach(field => field.required = true);
      } else {
        jasmineSetup.style.display = "none";
        // Remove required attribute for Solo Practitioner
        const jasmineFields = jasmineSetup.querySelectorAll("select[name='greeting_style'], input[name='languages_spoken']");
        jasmineFields.forEach(field => field.required = false);
      }
    });
  }

  const navLinks = document.querySelectorAll("#sticky-header nav a");
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        const header = document.getElementById("sticky-header");
        let headerOffset = 0;
        if (header && getComputedStyle(header).position === "sticky") {
          headerOffset = header.offsetHeight;
        }
        const elementPosition = targetSection.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  const businessInfoForm = document.getElementById("business-info-form");
  const submitAllFormsBtn = document.getElementById("submit-all-forms-btn");
  const submissionConfirmation = document.getElementById("submission-confirmation");
  
  if (submitAllFormsBtn && businessInfoForm && submissionConfirmation) {
    submitAllFormsBtn.addEventListener("click", function (event) {
      event.preventDefault();
      let isValid = true;
      const requiredFields = businessInfoForm.querySelectorAll("[required]");
      
      requiredFields.forEach((field) => {
        if (!field.value.trim()) {
          isValid = false;
          field.style.borderColor = "red";
        } else {
          field.style.borderColor = "#ccc";
        }
      });
      
      if (!isValid) {
        alert("Please fill in all required fields marked with an asterisk (*).");
        return;
      }

      const formData = new FormData();
      
      // Append all form fields
      const allFields = new FormData(businessInfoForm);
      for (let [key, value] of allFields.entries()) {
        formData.append(key, value);
      }
      
      // Capture checked use_case checkboxes
      const useCases = businessInfoForm.querySelectorAll("input[name='use_case']:checked");
      useCases.forEach((checkbox) => {
        formData.append("use_case[]", checkbox.value);
      });
      
      // Append logo if provided
      const logoFile = businessInfoForm.querySelector("input[name='logo_upload']").files[0];
      if (logoFile) {
        formData.append("logo_upload", logoFile);
      }

      // Determine which tag to apply based on plan selection
      const selectedPlan = planSelect ? planSelect.value : "";
      let onboardingTag = "";
      
      if (selectedPlan === "solo-practitioner") {
        onboardingTag = "TaxOffice_Solo_Onboarded";
      } else if (selectedPlan === "small-firm" || selectedPlan === "growth-pro") {
        onboardingTag = "TaxOffice_Jasmine_Onboarded";
      }
      
      // Add the appropriate tag to form data
      if (onboardingTag) {
        formData.append("onboarding_tag", onboardingTag);
      }
      
      // Add plan information
      formData.append("selected_plan", selectedPlan);

      fetch("https://connect.pabbly.com/workflow/sendwebhookfiledata/IjU3NmQwNTY5MDYzNjA0M2Q1MjZjIg_3D_3D_pc/IjU3NjYwNTZiMDYzMTA0Mzc1MjZmNTUzNjUxMzMi_pc", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.text())
        .then((data) => {
          console.log("Pabbly response:", data);
          submissionConfirmation.style.display = "block";
          submissionConfirmation.scrollIntoView({ behavior: "smooth" });
          
          // Reveal calendar on success
          const calendarSection = document.getElementById("calendar-embed");
          if (calendarSection) {
            calendarSection.style.display = "block";
          }
          
          businessInfoForm.reset();
          
          // Hide Jasmine setup after reset
          if (jasmineSetup) {
            jasmineSetup.style.display = "none";
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("There was a problem submitting your form. Please try again.");
        });
    });
  }
});