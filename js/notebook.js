function getNotes() {
  return JSON.parse(localStorage.getItem("notes")) || [];
}

function saveNotes(notes) {
  localStorage.setItem("notes", JSON.stringify(notes));
}

function saveNote() {
  const date = document.getElementById("noteDate").value;
  const period = document.getElementById("periodStart").value;
  const mood = document.getElementById("noteMood").value;
  const symptoms = document.getElementById("noteSymptoms").value;
  const text = document.getElementById("noteText").value;

  if (!date) {
    alert("Please select a date");
    return;
  }

  let notes = getNotes();

  const entry = { date, period, mood, symptoms, text };

  notes = notes.filter(n => n.date !== date);
  notes.push(entry);

  saveNotes(notes);

  alert("Saved ✅");
  displayNotes();
}

function displayNotes() {
  const notes = getNotes().sort((a, b) => new Date(b.date) - new Date(a.date));

  const container = document.getElementById("notesList");
  container.innerHTML = "";

  notes.forEach(note => {
    container.innerHTML += `
      <div class="card">
        <strong>${note.date}</strong><br>
        Period: ${note.period}<br>
        Mood: ${note.mood}<br>
        Symptoms: ${note.symptoms || "-"}<br>
        Notes: ${note.text || "-"}
      </div>
    `;
  });
}

// load on page open
displayNotes();