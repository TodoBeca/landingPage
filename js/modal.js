document.getElementById("openModal").onclick = function () {
  document.getElementById("educationModal").style.display = "block";
};
document.getElementById("closeModal").onclick = function () {
  document.getElementById("educationModal").style.display = "none";
};
window.onclick = function (event) {
  if (event.target == document.getElementById("educationModal")) {
    document.getElementById("educationModal").style.display = "none";
  }
};

let startYearSelect = document.getElementById("start-year");
for (let year = new Date().getFullYear(); year >= 1900; year--) {
  let option = document.createElement("option");
  option.value = year;
  option.textContent = year;
  startYearSelect.appendChild(option);
}

let endYearSelect = document.getElementById("end-year");
for (let year = new Date().getFullYear(); year >= 1900; year--) {
  let option = document.createElement("option");
  option.value = year;
  option.textContent = year;
  endYearSelect.appendChild(option);
}
