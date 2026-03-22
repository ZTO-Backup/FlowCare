function login() {
  const name = document.getElementById("usernameInput").value;
  const pass = document.getElementById("passwordInput").value;

  if (!name || !pass) {
    alert("Fill all fields");
    return;
  }

  localStorage.setItem("username", name);
  localStorage.setItem("userPass", pass);
  localStorage.setItem("isLoggedIn", "true");

  window.location.href = "index.html";
}

// AUTO REDIRECT IF NOT LOGGED IN
function protectPage() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  if (isLoggedIn !== "true") {
    window.location.href = "login.html";
  }
}

function logout() {
  localStorage.removeItem("isLoggedIn");
  window.location.href = "login.html";
}