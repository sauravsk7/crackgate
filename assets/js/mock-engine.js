/* CrackGate — Mock Test Engine */
(function () {
  const params = new URLSearchParams(location.search);
  const mockId = params.get('id') || 'mn-mock-01';
  const mock = (window.MOCKS || []).find(m => m.id === mockId);
  if (!mock) { document.body.innerHTML = '<div class="section"><h2>Mock not found.</h2></div>'; return; }

  // All material requires login (free or paid). Plan determines tier access.
  if (!CG.getUser()) {
    location.href = '/pages/signup.html?next=' + encodeURIComponent(location.pathname + location.search);
    return;
  }
  if (mock.tier !== 'free' && !CG.hasAccess(mock.tier)) {
    location.href = '/pages/pricing.html?reason=upgrade';
    return;
  }
  CG.logActivity('mock_start', { mockId: mock.id, mockTitle: mock.title });

  const state = {
    current: 0,
    answers: {},        // qIdx -> { value, status: 'answered'|'marked'|'visited' }
    startTime: Date.now(),
    durationMs: mock.duration * 60 * 1000,
    timerId: null
  };

  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function renderTimer() {
    const remaining = Math.max(0, state.durationMs - (Date.now() - state.startTime));
    const s = Math.floor(remaining / 1000);
    document.getElementById('timer').textContent = `${pad(Math.floor(s/3600))}:${pad(Math.floor((s%3600)/60))}:${pad(s%60)}`;
    if (remaining <= 0) { submit(true); }
  }

  function renderQuestion() {
    const q = mock.questions[state.current];
    if (!state.answers[state.current]) state.answers[state.current] = { value: null, status: 'visited' };
    const main = document.getElementById('mock-main');
    const sel = state.answers[state.current].value;

    let optsHtml = '';
    if (q.type === 'MCQ' || q.type === 'MSQ') {
      optsHtml = '<div class="opts">' + q.options.map((opt, i) => {
        const checked = q.type === 'MSQ'
          ? (Array.isArray(sel) && sel.includes(i) ? 'checked' : '')
          : (sel === i ? 'checked' : '');
        const klass = (q.type === 'MSQ' ? (Array.isArray(sel) && sel.includes(i)) : sel === i) ? 'opt selected' : 'opt';
        const inputType = q.type === 'MSQ' ? 'checkbox' : 'radio';
        return `<label class="${klass}"><input type="${inputType}" name="opt" value="${i}" ${checked}/> <span><b>${String.fromCharCode(65+i)}.</b> ${opt}</span></label>`;
      }).join('') + '</div>';
    } else if (q.type === 'NAT') {
      optsHtml = `<div><input type="number" step="any" class="nat-input" id="nat-input" value="${sel ?? ''}" placeholder="Enter numerical answer"/></div>`;
    }

    main.innerHTML = `
      <div class="qmeta">
        <span>Question ${state.current + 1} of ${mock.questions.length}</span>
        <span><span class="subject-pill">${q.subject}</span> Type: <b>${q.type}</b> · Marks: <b>+${q.marks}</b>${q.type==='MCQ' ? ` / −${(q.marks/3).toFixed(2)}` : ''}</span>
      </div>
      <div class="qstem">${q.stem}</div>
      ${optsHtml}
      <div class="mock-actions">
        <button class="btn btn-ghost" onclick="window.__mock.prev()">← Previous</button>
        <button class="btn btn-ghost" onclick="window.__mock.clear()">Clear</button>
        <button class="btn btn-accent" onclick="window.__mock.mark()">Mark & Next</button>
        <button class="btn btn-primary" onclick="window.__mock.saveNext()">Save & Next →</button>
        <span class="spacer"></span>
        <button class="btn btn-primary" onclick="window.__mock.submit()">Submit Test</button>
      </div>`;

    // event handlers
    main.querySelectorAll('input[name=opt]').forEach(inp => {
      inp.addEventListener('change', () => {
        if (q.type === 'MSQ') {
          const arr = [...main.querySelectorAll('input[name=opt]:checked')].map(x => +x.value);
          state.answers[state.current].value = arr;
        } else {
          state.answers[state.current].value = +inp.value;
        }
      });
    });
    const nat = document.getElementById('nat-input');
    if (nat) nat.addEventListener('input', () => {
      const v = parseFloat(nat.value);
      state.answers[state.current].value = isNaN(v) ? null : v;
    });

    renderPalette();
  }

  function renderPalette() {
    const palette = document.getElementById('palette');
    palette.innerHTML = mock.questions.map((_, i) => {
      const a = state.answers[i];
      let cls = '';
      if (a) {
        if (a.status === 'marked') cls = 'marked';
        else if (a.value !== null && a.value !== undefined && !(Array.isArray(a.value) && a.value.length === 0)) cls = 'answered';
        else cls = 'visited';
      }
      if (i === state.current) cls += ' current';
      return `<button class="${cls}" onclick="window.__mock.go(${i})">${i+1}</button>`;
    }).join('');

    const counts = { answered:0, marked:0, visited:0, unseen:0 };
    mock.questions.forEach((_, i) => {
      const a = state.answers[i];
      if (!a) counts.unseen++;
      else if (a.status === 'marked') counts.marked++;
      else if (a.value !== null && a.value !== undefined && !(Array.isArray(a.value) && a.value.length === 0)) counts.answered++;
      else counts.visited++;
    });
    document.getElementById('palette-summary').innerHTML = `
      <div>Answered: <b>${counts.answered}</b></div>
      <div>Marked for review: <b>${counts.marked}</b></div>
      <div>Not answered: <b>${counts.visited}</b></div>
      <div>Not visited: <b>${counts.unseen}</b></div>`;
  }

  function isCorrect(q, val) {
    if (val === null || val === undefined) return null; // skipped
    if (q.type === 'MCQ') return val === q.answer ? 'correct' : 'wrong';
    if (q.type === 'NAT') {
      const tol = q.tolerance ?? 0.01;
      return Math.abs(val - q.answer) <= tol ? 'correct' : 'wrong';
    }
    if (q.type === 'MSQ') {
      const ans = Array.isArray(q.answer) ? q.answer : [q.answer];
      const got = Array.isArray(val) ? val.slice().sort() : [];
      return JSON.stringify(got) === JSON.stringify(ans.slice().sort()) ? 'correct' : 'wrong';
    }
    return null;
  }

  function submit(auto = false) {
    if (!auto && !confirm('Submit test? You will see your results & SWOT analysis.')) return;
    clearInterval(state.timerId);

    const review = [];
    let totalMarks = 0, scored = 0, correct = 0, wrong = 0, skipped = 0;
    const subjectStats = {};

    mock.questions.forEach((q, idx) => {
      totalMarks += q.marks;
      const a = state.answers[idx];
      const verdict = a ? isCorrect(q, a.value) : null;
      let mark = 0;
      if (verdict === 'correct') { mark = q.marks; correct++; }
      else if (verdict === 'wrong') { mark = q.type === 'MCQ' ? -(q.marks / 3) : 0; wrong++; }
      else { skipped++; }
      scored += mark;

      const subj = q.subject;
      subjectStats[subj] ||= { attempted:0, correct:0, marks:0, totalMarks:0 };
      subjectStats[subj].totalMarks += q.marks;
      if (verdict !== null) subjectStats[subj].attempted++;
      if (verdict === 'correct') { subjectStats[subj].correct++; subjectStats[subj].marks += q.marks; }
      if (verdict === 'wrong') { subjectStats[subj].marks -= (q.type === 'MCQ' ? q.marks/3 : 0); }

      review.push({ id: q.id, subject: q.subject, type: q.type, stem: q.stem, options: q.options, answer: q.answer, solution: q.solution, marks: q.marks, given: a ? a.value : null, verdict });
    });

    const attempt = {
      mockId: mock.id,
      mockTitle: mock.title,
      submittedAt: Date.now(),
      durationUsed: Math.round((Date.now() - state.startTime) / 1000),
      totalMarks, scored: Math.round(scored * 100) / 100, correct, wrong, skipped,
      subjectStats, review
    };
    CG.saveAttempt(mock.id, attempt);
    state.submitted = true;
    location.href = '/pages/result.html?id=' + encodeURIComponent(mock.id);
  }

  // expose actions
  window.__mock = {
    go(i) { state.current = i; renderQuestion(); },
    prev() { if (state.current > 0) state.current--; renderQuestion(); },
    saveNext() {
      if (state.answers[state.current].value !== null && state.answers[state.current].value !== undefined)
        state.answers[state.current].status = 'answered';
      if (state.current < mock.questions.length - 1) state.current++;
      renderQuestion();
    },
    mark() {
      state.answers[state.current].status = 'marked';
      if (state.current < mock.questions.length - 1) state.current++;
      renderQuestion();
    },
    clear() {
      state.answers[state.current].value = null;
      state.answers[state.current].status = 'visited';
      renderQuestion();
    },
    submit() { submit(false); }
  };

  // initial render
  document.getElementById('mock-title').textContent = mock.title;
  document.getElementById('mock-meta').textContent = `${mock.questions.length} Questions · ${mock.duration} min · Pattern: ${mock.pattern}`;
  renderQuestion();
  state.timerId = setInterval(renderTimer, 1000);
  renderTimer();

  window.addEventListener('beforeunload', (e) => {
    if (state.submitted) return;          // allow navigation to result page
    e.preventDefault();
    e.returnValue = '';
  });
})();
