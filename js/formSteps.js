document.addEventListener("DOMContentLoaded", function () {
  const formSteps = document.querySelectorAll(".form-step");
  const nextButtons = document.querySelectorAll(".next-step");
  const prevButtons = document.querySelectorAll(".prev-step");
  const progressBar = document.getElementById("progress");
  const progressSteps = document.querySelectorAll(".progress-step");
  let currentStep = 0;

  function showStep(step) {
    formSteps.forEach((div, index) => {
      div.classList.toggle("active", index === step);
    });

    // Actualizar la barra de progreso
    const progressPercent = (step / (formSteps.length - 1)) * 100;
    progressBar.style.width = `${progressPercent}%`;

    // Actualizar los pasos visuales
    progressSteps.forEach((circle, index) => {
      if (index <= step) {
        circle.classList.add("active");
      } else {
        circle.classList.remove("active");
      }
    });
  }

  nextButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (currentStep < formSteps.length - 1) {
        currentStep++;
        showStep(currentStep);
      }
    });
  });

  prevButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (currentStep > 0) {
        currentStep--;
        showStep(currentStep);
      }
    });
  });

  showStep(currentStep);
});
