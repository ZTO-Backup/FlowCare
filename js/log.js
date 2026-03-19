function saveLog() {
  const flow = document.getElementById("flow").value;
  const mood = document.getElementById("mood").value;
  const pads = document.getElementById("pads").value;

  // get symptoms
  const symptomElements = document.querySelectorAll('input[type="checkbox"]:checked');
  const symptoms = [];
  symptomElements.forEach(el => symptoms.push(el.value));

  const today = new Date().toISOString().split("T")[0];

  const entry = {
    date: today,
    flow,
    mood,
    pads,
    symptoms
  };

  // get existing data
  let logs = JSON.parse(localStorage.getItem("logs")) || [];

  // replace if same date exists
  logs = logs.filter(log => log.date !== today);
  logs.push(entry);

  // save
  localStorage.setItem("logs", JSON.stringify(logs));

  alert("Saved successfully ✅");
}