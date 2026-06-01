/* CrackGate — Result + SWOT */
(function () {
  const id = new URLSearchParams(location.search).get('id');
  const attempt = CG.getAttempt(id);
  if (!attempt) { document.getElementById('result-root').innerHTML = '<div class="section">No attempt found.</div>'; return; }

  const accuracy = attempt.correct + attempt.wrong > 0
    ? Math.round((attempt.correct / (attempt.correct + attempt.wrong)) * 100)
    : 0;
  const percent = Math.round((attempt.scored / attempt.totalMarks) * 100);

  // ---- header tiles ----
  document.getElementById('mock-title').textContent = attempt.mockTitle;
  document.getElementById('score-big').textContent = `${attempt.scored} / ${attempt.totalMarks}`;
  document.getElementById('tiles').innerHTML = `
    <div class="score-tile"><b>${attempt.correct}</b><span>Correct</span></div>
    <div class="score-tile"><b>${attempt.wrong}</b><span>Wrong</span></div>
    <div class="score-tile"><b>${attempt.skipped}</b><span>Skipped</span></div>
    <div class="score-tile"><b>${accuracy}%</b><span>Accuracy</span></div>`;

  // ---- Subject-wise table + radar chart ----
  const subjects = Object.keys(attempt.subjectStats);
  const pctData = subjects.map(s => {
    const ss = attempt.subjectStats[s];
    return ss.totalMarks > 0 ? Math.max(0, Math.round((ss.marks / ss.totalMarks) * 100)) : 0;
  });

  const ctx = document.getElementById('radar').getContext('2d');
  new Chart(ctx, {
    type: 'radar',
    data: {
      labels: subjects,
      datasets: [{
        label: 'Your % score',
        data: pctData,
        backgroundColor: 'rgba(30,58,138,.20)',
        borderColor: '#1e3a8a',
        pointBackgroundColor: '#f59e0b',
        borderWidth: 2
      }, {
        label: 'Target (80%)',
        data: subjects.map(() => 80),
        backgroundColor: 'rgba(245,158,11,.08)',
        borderColor: '#f59e0b',
        borderDash: [5,5],
        pointRadius: 0
      }]
    },
    options: {
      responsive: true,
      scales: { r: { beginAtZero: true, max: 100, ticks: { stepSize: 20 } } },
      plugins: { legend: { position: 'bottom' } }
    }
  });

  // Bar chart: subject-wise correct vs total
  const ctxBar = document.getElementById('barChart').getContext('2d');
  new Chart(ctxBar, {
    type: 'bar',
    data: {
      labels: subjects,
      datasets: [
        { label: 'Correct', data: subjects.map(s => attempt.subjectStats[s].correct), backgroundColor: '#16a34a' },
        { label: 'Attempted', data: subjects.map(s => attempt.subjectStats[s].attempted), backgroundColor: '#0ea5e9' }
      ]
    },
    options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
  });

  // ---- SWOT ----
  // S: subjects ≥ 80% with ≥1 question; W: <50%; O: <80% but attempted; T: 0 attempted
  const S = [], W = [], O = [], T = [];
  subjects.forEach((s, i) => {
    const ss = attempt.subjectStats[s];
    const pct = pctData[i];
    if (ss.attempted === 0) { T.push(`${s} — not attempted (0/${ss.totalMarks/1 | 0} marks). Risk of negative impact in real GATE.`); return; }
    if (pct >= 80) S.push(`${s}: ${pct}% (${ss.correct}/${ss.attempted} attempted). Maintain consistency.`);
    else if (pct < 50) W.push(`${s}: ${pct}%. Revisit concepts & solve PYQs.`);
    else O.push(`${s}: ${pct}%. With ~2 weeks focused practice, easily push to 80%+.`);
  });
  if (S.length === 0) S.push("Build at least one strong subject — pick your interest.");
  if (W.length === 0) W.push("No critical weak area. Keep momentum!");
  if (O.length === 0) O.push("Move borderline subjects to mastery by daily PYQ practice.");
  if (T.length === 0) T.push("No fully-skipped subjects. Excellent coverage.");

  document.getElementById('swot').innerHTML = `
    <div class="swot-box swot-S"><h4>Strengths</h4><ul>${S.map(x=>'<li>'+x+'</li>').join('')}</ul></div>
    <div class="swot-box swot-W"><h4>Weaknesses</h4><ul>${W.map(x=>'<li>'+x+'</li>').join('')}</ul></div>
    <div class="swot-box swot-O"><h4>Opportunities</h4><ul>${O.map(x=>'<li>'+x+'</li>').join('')}</ul></div>
    <div class="swot-box swot-T"><h4>Threats</h4><ul>${T.map(x=>'<li>'+x+'</li>').join('')}</ul></div>`;

  // Personalized recommendation
  let band, advice;
  if (percent >= 75) { band = "Top 1%"; advice = "You are GATE-ready! Take Mock 09 & 10 to fine-tune time management. Solve last 5 years' PYQs in 2-hr sessions."; }
  else if (percent >= 55) { band = "Likely Qualifier"; advice = "Strong base. Convert weak areas using subject-wise tests + PYQ analysis."; }
  else if (percent >= 35) { band = "Borderline"; advice = "Revise standard texts (Hartman, Tatiya, Hustrulid). Take 1 mock + 5 PYQ Q's daily."; }
  else { band = "Foundation Building"; advice = "Spend 3–4 weeks on theory revision before next mock. Use our study materials & video solutions."; }
  document.getElementById('verdict').innerHTML = `
    <div class="alert ${percent>=55?'alert-ok':percent>=35?'alert-warn':'alert-info'}">
      <b>Performance band:</b> ${band} (${percent}%). <br>${advice}
    </div>`;

  // ---- Question review ----
  const reviewEl = document.getElementById('review');
  reviewEl.innerHTML = attempt.review.map((r, i) => {
    const klass = r.verdict === 'correct' ? 'correct' : r.verdict === 'wrong' ? 'wrong' : 'skipped';
    const youGave = r.given === null || r.given === undefined ? '<i>Not attempted</i>'
      : r.type === 'MCQ' ? `${String.fromCharCode(65+r.given)}. ${r.options[r.given]}`
      : Array.isArray(r.given) ? r.given.map(x => String.fromCharCode(65+x)).join(', ')
      : r.given;
    const correctAns = r.type === 'MCQ' ? `${String.fromCharCode(65+r.answer)}. ${r.options[r.answer]}` : r.answer;
    return `<div class="review-q ${klass}">
      <div style="display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:6px">
        <b>Q${i+1}.</b> <span class="subject-pill">${r.subject}</span>
        <span style="font-size:12px;color:#64748b">${r.type} · +${r.marks}</span>
      </div>
      <div>${r.stem}</div>
      <div style="margin-top:8px;font-size:14px"><b>Your answer:</b> ${youGave}</div>
      <div style="font-size:14px;color:var(--ok)"><b>Correct answer:</b> ${correctAns}</div>
      <div class="solution"><b>Solution:</b> ${r.solution}</div>
    </div>`;
  }).join('');
})();
