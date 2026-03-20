// REQUEST PERMISSION
function requestNotificationPermission() {
  if ("Notification" in window) {
    Notification.requestPermission();
  }
}

// SHOW NOTIFICATION
function showNotification(title, body) {
  if (Notification.permission === "granted") {
    new Notification(title, { body });
  }
}

// CHECK PERIOD REMINDER
function checkPeriodReminder() {
  let logs = JSON.parse(localStorage.getItem("logs")) || [];

  if (logs.length === 0) return;

  // get last period
  const periodLogs = logs
    .filter(log => log.flow !== "none")
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  if (!periodLogs.length) return;

  const lastDate = new Date(periodLogs[0].date);
  const cycleLength = 28;

  const nextPeriod = new Date(lastDate);
  nextPeriod.setDate(lastDate.getDate() + cycleLength);

  const today = new Date();
  const diffDays = Math.ceil((nextPeriod - today) / (1000 * 60 * 60 * 24));

  if (diffDays === 2) {
    showNotification("FlowCare Reminder 💡", "Your period is likely in 2 days. Stay prepared!");
  }

  if (diffDays === 0) {
    showNotification("FlowCare Alert 🩸", "Your period may start today.");
  }
}

// RUN DAILY CHECK
requestNotificationPermission();
checkPeriodReminder();