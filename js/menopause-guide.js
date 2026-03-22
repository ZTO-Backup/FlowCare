// TOGGLE SECTIONS
function toggleSection(header) {
  const content = header.nextElementSibling;

  if (content.style.display === "block") {
    content.style.display = "none";
  } else {
    content.style.display = "block";
  }
}

// SEARCH FUNCTION
const searchInput = document.getElementById("searchInput");

if (searchInput) {
  searchInput.addEventListener("input", function () {
    const query = this.value.toLowerCase();

    const sections = document.querySelectorAll(".section");

    sections.forEach(section => {
      const text = section.innerText.toLowerCase();

      if (text.includes(query)) {
        section.style.display = "block";
      } else {
        section.style.display = "none";
      }
    });
  });
}

// INITIAL STATE (collapsed)
document.querySelectorAll(".section .content").forEach(el => {
  el.style.display = "none";
});