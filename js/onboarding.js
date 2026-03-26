let current = 0;

const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");
const btn = document.getElementById("nextBtn");

btn.onclick = () => {
  slides[current].classList.remove("active");
  dots[current].classList.remove("active");

  current++;

  if (current >= slides.length) {
    localStorage.setItem("onboarded", "true");
    window.location.href = "index.html";
    return;
  }

  slides[current].classList.add("active");
  dots[current].classList.add("active");

  if (current === slides.length - 1) {
    btn.innerText = "Get Started 💖";
  }
};