const tips = [
  {
    title: "Is irregular period normal?",
    text: "Yes sometimes. Stress and hormones can affect your cycle."
  },
  {
    title: "How to manage cramps?",
    text: "Use warm compress, rest, and drink water."
  },
  {
    title: "Why do moods change?",
    text: "Hormones affect emotions. It's normal."
  },
  {
    title: "When should I see a doctor?",
    text: "If pain is severe or periods stop for months."
  },
  {
    title: "Can I exercise during period?",
    text: "Yes, light exercise can reduce cramps."
  },
  {
    title: "Is heavy flow normal?",
    text: "Occasionally yes, but frequent heavy flow needs attention."
  },
  {
    title: "What foods help?",
    text: "Iron-rich foods, fruits, and water help a lot."
  },
  {
    title: "Why am I tired?",
    text: "Hormonal changes can cause fatigue."
  },
  {
    title: "Can stress delay period?",
    text: "Yes, stress affects hormones."
  },
  {
    title: "Is spotting normal?",
    text: "Light spotting can happen, but frequent cases need checking."
  },


  // 👉 You can keep adding until 30
{ title: "Can I get pregnant during period?", text: "It's less likely but still possible." },
  { title: "Why do I get headaches?", text: "Hormonal changes can trigger headaches or migraines." },
  { title: "How many days should period last?", text: "Typically 3–7 days." },
  { title: "Why is my cycle different every month?", text: "Small changes are normal due to lifestyle and hormones." },
  { title: "Is it okay to use pads all day?", text: "No, change every 4–6 hours to prevent infection." },
  { title: "Why do I feel bloated?", text: "Hormonal changes cause water retention." },
  { title: "Can I bathe during period?", text: "Yes, it’s important to stay clean." },
  { title: "Why is my blood dark?", text: "Dark blood is older blood leaving the body — usually normal." },
  { title: "Can I swim during period?", text: "Yes, with proper protection like tampons or cups." },
  { title: "Why do I get acne?", text: "Hormonal changes can trigger breakouts." },
  { title: "Can I drink cold water?", text: "Yes, but warm drinks may help cramps more." },
  { title: "Why do I feel emotional?", text: "Hormones can affect mood and emotions." },
  { title: "Is skipping period normal?", text: "Occasionally yes, but frequent skipping needs checking." },
  { title: "What is PMS?", text: "Premenstrual Syndrome includes mood swings, cramps, and fatigue." },
  { title: "Can I use painkillers?", text: "Yes, but follow dosage and avoid overuse." },
  { title: "Why do I have lower back pain?", text: "Uterine contractions can cause back pain." },
  { title: "How do I track my cycle?", text: "Use apps like FlowCare to log and monitor patterns." },
  { title: "Can dehydration affect period?", text: "Yes, it can worsen cramps and fatigue." },
  { title: "Is discharge normal?", text: "Yes, it helps keep the reproductive system healthy." },
  { title: "When should I worry about my period?", text: "If symptoms are severe, unusual, or persistent." }
];

const container = document.getElementById("tipsContainer");

tips.forEach(tip => {
  container.innerHTML += `
    <div class="card">
      <h4>${tip.title}</h4>
      <p>${tip.text}</p>
    </div>
  `;
});