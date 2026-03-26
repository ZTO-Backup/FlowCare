document.addEventListener("DOMContentLoaded", () => {
  
  // =======================
  // LOAD SAVED SETTINGS
  // =======================
  const savedName = localStorage.getItem("username");
  const savedCycle = localStorage.getItem("cycleLength");
  const notifEnabled = localStorage.getItem("notifications");
  
  const usernameEl = document.getElementById("username");
  const cycleEl = document.getElementById("cycleLength");
  const notifEl = document.getElementById("notifToggle");
  const ageInput = document.getElementById("ageInput");
  
  // SET VALUES
  if (usernameEl && savedName) usernameEl.value = savedName;
  if (cycleEl && savedCycle) cycleEl.value = savedCycle;
  if (notifEl && notifEnabled === "true") notifEl.checked = true;
  
  if (ageInput) {
    ageInput.value = localStorage.getItem("age") || "";
    
    ageInput.addEventListener("input", () => {
      localStorage.setItem("age", ageInput.value);
    });
  }
  
  // =======================
  // SAVE NAME
  // =======================
  if (usernameEl) {
    usernameEl.addEventListener("input", (e) => {
      localStorage.setItem("username", e.target.value);
    });
  }
  
  // =======================
  // SAVE CYCLE
  // =======================
  if (cycleEl) {
    cycleEl.addEventListener("input", (e) => {
      localStorage.setItem("cycleLength", e.target.value);
    });
  }
  
  // =======================
  // NOTIFICATIONS
  // =======================
  if (notifEl) {
    notifEl.addEventListener("change", (e) => {
      localStorage.setItem("notifications", e.target.checked);
      
      if (e.target.checked && "Notification" in window) {
        Notification.requestPermission();
      }
    });
  }
  
});


// =======================
// RESET DATA
// =======================
function resetData() {
  if (confirm("⚠️ This will delete all your data permanently. Continue?")) {
    localStorage.clear();
    location.reload();
  }
}


// =======================
// LOGOUT SYSTEM
// =======================
function confirmLogout() {
  const box = document.getElementById("logoutConfirmBox");
  if (box) {
    box.style.display = "block";
    
    // auto-hide after 5s ONLY when shown
    setTimeout(() => {
      box.style.display = "none";
    }, 5000);
  }
}

function finalLogout() {
  logout();
}

function hideLogoutBox() {
  const box = document.getElementById("logoutConfirmBox");
  if (box) box.style.display = "none";
}


// =======================
// PIN SYSTEM
// =======================
function setPIN() {
  const pin = prompt("Enter a 4-digit PIN:");
  
  if (!pin) return;
  
  if (pin.length !== 4 || isNaN(pin)) {
    alert("Please enter a valid 4-digit PIN");
    return;
  }
  
  localStorage.setItem("appPIN", pin);
  alert("PIN saved 🔒");
}