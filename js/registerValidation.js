document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("simpleRegisterForm");
  const password = document.getElementById("password");
  const confirmPassword = document.getElementById("confirmPassword");
  const email = document.getElementById("email");
  const confirmEmail = document.getElementById("confirmEmail");
  const passwordError = document.getElementById("passwordError");
  const emailError = document.getElementById("emailError");
  const togglePasswordIcons = document.querySelectorAll(".toggle-password");

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    let isValid = true;

    if (!email.value.trim()) {
      alert("El correo electrónico es obligatorio.");
      return;
    }

    if (password.value !== confirmPassword.value) {
      passwordError.style.display = "block";
      isValid = false;
    } else {
      passwordError.style.display = "none";
    }

    if (email.value !== confirmEmail.value) {
      emailError.style.display = "block";
      isValid = false;
    } else {
      emailError.style.display = "none";
    }

    if (!isValid) {
      return;
    }

    const formData = new FormData(form);

    const getArrayValue = (key, defaultValue = []) => {
      const value = formData.get(key);
      return value ? value.split(",") : defaultValue;
    };

    const getValue = (key, defaultValue = "") => {
      return formData.get(key)?.trim() || defaultValue;
    };

    const userData = {
      email: getValue("email"),
      password: getValue("password"),
      personalData: {
        firstName: getValue("firstName", ""),
        lastName: getValue("lastName", ""),
        birthDate: getValue("birthDate", ""),
        gender: getValue("gender", ""),
        phone: getValue("phone", ""),
        nationality: getValue("nationality", ""),
        additionalCitizenship: [],
        currentCity: getValue("currentCity", ""),
        minorityGroups: [],
      },
      academicData: [],
      workData: {
        jobExperience: getValue("jobExperience", ""),
      },
      hobbies: [],
      languages: [],
      socialMedia: {
        linkedin: getValue("linkedin", ""),
        instagram: getValue("instagram", ""),
        twitter: getValue("twitter", ""),
      },
      scholarshipProfile: {
        areasOfInterest: getArrayValue("areasOfInterest", []),
        regionsOfInterest: getArrayValue("regionsOfInterest", []),
        countriesOfInterest: getArrayValue("countriesOfInterest", []),
        scholarshipTypes: getArrayValue("scholarshipTypes", []),
        startDate: getValue(
          "startDate",
          new Date().toISOString().split("T")[0]
        ),
        economicVulnerability: false,
        researchTopics: getArrayValue("researchTopics", []),
      },
      role: "user",
    };

    try {
      const response = await fetch(CONFIG.API_URL_POST_USUARIO, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (response.ok) {
        alert(
          "Usuario registrado con éxito. Verifica tu correo electrónico para activar tu cuenta."
        );
        form.reset();
        window.location.href = "/";
      } else {
        alert(result.msg || "Error en el registro");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      alert("Hubo un problema al registrar el usuario");
    }
  });

  togglePasswordIcons.forEach((icon) => {
    icon.addEventListener("click", function () {
      const targetId = this.getAttribute("data-target");
      const passwordField = document.getElementById(targetId);

      if (passwordField.type === "password") {
        passwordField.type = "text";
        this.classList.add("active");
      } else {
        passwordField.type = "password";
        this.classList.remove("active");
      }
    });

    const targetId = icon.getAttribute("data-target");
    const passwordField = document.getElementById(targetId);
  });
});
