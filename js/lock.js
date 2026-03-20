const savedPIN = localStorage.getItem("appPIN");

function unlockApp() {
  const input = document.getElementById("pinInput").value;
  const error = document.getElementById("pinError");

  if (input === savedPIN) {
    document.getElementById("lockScreen").style.display = "none";
  } else {
    error.innerText = "Incorrect PIN ❌";
  }
}

// AUTO CHECK
window.onload = function () {
  if (!savedPIN) {
    document.getElementById("lockScreen").style.display = "none";
  }
};