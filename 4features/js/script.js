
document.addEventListener("DOMContentLoaded", function () {
  const startOnboardingBtn = document.getElementById("start-onboarding-btn");
  const a2pFormSection = document.getElementById("business-profile");

  if (startOnboardingBtn && a2pFormSection) {
    startOnboardingBtn.addEventListener("click", function () {
      a2pFormSection.scrollIntoView({ behavior: "smooth" });
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

      fetch("https://connect.pabbly.com/workflow/sendwebhookfiledata/IjU3NmQwNTY5MDYzNjA0M2Q1MjZjIg_3D_3D_pc/IjU3NjYwNTZiMDYzNjA0MzI1MjZjNTUzMDUxMzMi_pc", {
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
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("There was a problem submitting your form. Please try again.");
        });
    });
  }
});
