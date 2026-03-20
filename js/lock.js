const savedPIN = localStorage.getItem("appPIN");

function unlockApp() {
  const input = document.getElementById("pinInput").value;
  const error = document.getElementById("pinError");

  if (input === savedPIN) {
    sessionStorage.setItem("unlocked", "true"); // ✅ key fix
    document.getElementById("lockScreen").style.display = "none";
  } else {
    error.innerText = "Incorrect PIN ❌";
  }
}

// AUTO CHECK
window.onload = function () {
  const isUnlocked = sessionStorage.getItem("unlocked");

  if (!savedPIN || isUnlocked === "true") {
    document.getElementById("lockScreen").style.display = "none";
  }
};