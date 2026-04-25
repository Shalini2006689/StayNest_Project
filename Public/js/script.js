(() => {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".needs-validation");

  Array.from(forms).forEach(form => {
  form.addEventListener(
    "submit",  //prevent submission 
    (event) => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }

      form.classList.add("was-validated");
    }, 
    false,
  );
 });
})();

// index

const taxSwitch = document.getElementById("flexSwitchCheckDefault");
if (taxSwitch) {
  taxSwitch.addEventListener("change", () => {
    const taxInfo = document.getElementsByClassName("tax-info");
    for (const info of taxInfo) {
      info.style.display = taxSwitch.checked ? "inline" : "none";
    }
  });
}

//NAVBAR

const toggle = document.getElementById("menuToggle");
const menu = document.getElementById("navMenu");

if (toggle && menu) {
  toggle.addEventListener("click", () => {
    menu.classList.toggle("active");
  });
}

// scrollFilters

const filterRow = document.getElementById("filters-wrap");
const leftBtn = document.getElementById("scrollLeft");
const rightBtn = document.getElementById("scrollRight");
const scrollAmount = 250; //1 CLICK = 300PX SCROLL

if (filterRow && leftBtn && rightBtn) {
  leftBtn.addEventListener("click", () => {
    filterRow.scrollBy({
      left: -scrollAmount, //SCROLL LEFT
      behavior: "smooth",
    });
    rightBtn.addEventListener("click", () => {
      filterRow.scrollBy({ left: scrollAmount, behavior: "smooth" });
    });
  });
  const updateButtons = () => {
    leftBtn.style.display = filterRow.scrollLeft > 0 ? "block" : "none";

    rightBtn.style.display =
      filterRow.scrollLeft + filterRow.clientWidth < filterRow.scrollWidth
        ? "block"
        : "none";
  };
  filterRow.addEventListener("scroll", updateButtons);
  window.addEventListener("load", updateButtons);
}