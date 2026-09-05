const $ = (id) => document.getElementById(id);
const screens = { start: $('start-screen'), quiz: $('quiz-screen'), match: $('match-screen'), result: $('result-screen') };
// Google Apps Script 成績接收端。
const RESULTS_ENDPOINT = 'https://script.google.com/macros/s/AKfycbyrCXiquLsV_rLpAPKzK6u1McsV2wTWKKO2nERcsu9jb4I01TZrz9JRiClpvx0RRCZo/exec';
let state = { cardNumber:'', role:'', topic:'general', index:0, score:0, answers:[], locked:false };
let matchState = { mode:'', cardNumber:'', role:'', questions:[], index:0, score:0, answers:[], answered:false };

// 藥品資料與圖片取自使用者提供的「藥品圖檔.docx」。
const MATCH_DATA = [
  { id:'metformin', name:'Metformin', dose:'500 mg', indication:'第二型糖尿病', image:'assets/drugs/metformin.jpeg' },
  { id:'amlodipine', name:'Amlodipine', dose:'5 mg', indication:'高血壓、心絞痛等心血管疾病', image:'assets/drugs/amlodipine.jpeg' },
  { id:'pentoxifylline', name:'Pentoxifylline', dose:'400 mg', indication:'末稍血管循環障礙', image:'assets/drugs/pentoxifylline.png' },
  { id:'prednisolone', name:'Prednisolone', dose:'5 mg', indication:'風濕性關節炎、風濕熱、骨關節炎、風濕性脊椎炎、氣喘、過敏性疾病', image:'assets/drugs/prednisolone.jpeg' },
  { id:'famotidine', name:'Famotidine', dose:'20 mg', indication:'十二指腸潰瘍、胃潰瘍、上消化道出血、逆流性食道炎', image:'assets/drugs/famotidine.png' },
  { id:'trajenta-duo', name:'Trajenta Duo (Linagliptin + Metformin)', dose:'2.5 mg/850 mg', indication:'第2型糖尿病', image:'assets/drugs/trajenta-duo.jpeg' },
  { id:'jardiance-duo', name:'Jardiance Duo (Empagliflozin + Metformin)', dose:'12.5 mg/850 mg', indication:'第二型糖尿病', image:'assets/drugs/jardiance-duo.png' },
  { id:'furosemide', name:'Furosemide', dose:'40 mg', indication:'利尿、高血壓', image:'assets/drugs/furosemide.png' },
  { id:'imidapril', name:'Imidapril hydrochloride', dose:'10 mg', indication:'高血壓', image:'assets/drugs/imidapril.png' },
  { id:'rosuvastatin', name:'Rosuvastatin', dose:'10 mg', indication:'高膽固醇血症、高三酸甘油酯血症', image:'assets/drugs/rosuvastatin.png' },
  { id:'clopidogrel', name:'Clopidogrel', dose:'75 mg', indication:'預防中風、心肌梗塞或週邊動脈等之血管栓塞疾病', image:'assets/drugs/clopidogrel.png' },
  { id:'metoclopramide', name:'Metoclopramide', dose:'3.84 mg', indication:'預防嘔吐、逆流性消化性食道炎，胃腸蠕動異常', image:'assets/drugs/metoclopramide.png' }
];

function show(name){ Object.entries(screens).forEach(([k,v]) => v.classList.toggle('hidden', k !== name)); }

$('start-btn').addEventListener('click', () => {
  const cardNumber = $('card-number').value.trim();
  const role = $('role').value;
  const learningMode = $('learning-mode').value;
  const mode = learningMode === 'drug-learning' ? $('drug-learning-mode').value : learningMode;
  const topic = $('topic').value;
  if(!cardNumber || !role || !learningMode){ $('start-error').textContent = '請輸入卡號，並選擇身分及學習模式。'; return; }
  if(learningMode === 'drug-learning' && !mode){ $('start-error').textContent = '請選擇認識藥品的練習類型。'; return; }
  if(mode === 'quiz' && (!topic || !QUESTION_BANK[topic])){ $('start-error').textContent = '請選擇學習主題。'; return; }
  $('start-error').textContent = '';
  if(mode !== 'quiz'){ startMatching(mode, cardNumber, role); return; }
  state = { cardNumber, role, topic, index:0, score:0, answers:[], locked:false };
  $('learner-info').textContent = `卡號 ${maskCard(cardNumber)}｜${role}`;
  $('topic-title').textContent = QUESTION_BANK[topic].title;
  show('quiz'); renderQuestion();
});

$('learning-mode').addEventListener('change', (event) => {
  const isQuiz = event.target.value === 'quiz';
  const isDrugLearning = event.target.value === 'drug-learning';
  $('topic-field').classList.toggle('hidden', !isQuiz);
  $('drug-learning-field').classList.toggle('hidden', !isDrugLearning);
  $('start-btn').textContent = isDrugLearning ? '開始練習' : '開始測驗';
});

function startMatching(mode, cardNumber, role){
  matchState = {
    mode,
    cardNumber,
    role,
    questions: shuffle(MATCH_DATA).slice(0, Math.min(10, MATCH_DATA.length)),
    index: 0,
    score: 0,
    answers: [],
    answered: false
  };
  $('match-learner-info').textContent = `卡號 ${maskCard(cardNumber)}｜${role}`;
  const titles = {'image-name':'藥品圖片辨識','drug-dose':'藥品劑量辨識','drug-indication':'藥品適應症辨識'};
  $('match-title').textContent = titles[mode];
  $('match-next-btn').classList.add('hidden');
  show('match');
  renderMatchingQuestion();
}

function renderMatchingQuestion(){
  const item = matchState.questions[matchState.index];
  const total = matchState.questions.length;
  matchState.answered = false;
  $('match-progress').textContent = `${matchState.index + 1} / ${total}`;
  $('match-feedback').className = 'feedback info';
  $('match-feedback').textContent = '請選擇正確答案。';
  $('match-next-btn').classList.add('hidden');

  const left = $('match-left');
  const right = $('match-right');
  left.innerHTML = '';
  right.innerHTML = '';

  const questionCard = document.createElement('div');
  questionCard.className = 'match-question-card';

  if(matchState.mode === 'image-name'){
    const prompt = document.createElement('div');
    prompt.className = 'match-question-label';
    prompt.textContent = '這是哪一種藥品？';
    const img = document.createElement('img');
    img.src = item.image;
    img.alt = '請辨識此藥品';
    img.className = 'medicine-photo medicine-photo-large';
    questionCard.append(prompt, img);
  } else {
    const prompt = document.createElement('div');
    prompt.className = 'match-question-label';
    prompt.textContent = matchState.mode === 'drug-dose' ? '請選擇正確劑量' : '請選擇正確適應症';
    const drugName = document.createElement('strong');
    drugName.className = 'match-drug-name';
    drugName.textContent = item.name;
    questionCard.append(prompt, drugName);
  }
  left.appendChild(questionCard);

  const answerKey = matchState.mode === 'image-name' ? 'name' : matchState.mode === 'drug-dose' ? 'dose' : 'indication';
  const duoPair = {
    'trajenta-duo': 'jardiance-duo',
    'jardiance-duo': 'trajenta-duo'
  };
  const requiredPair = duoPair[item.id]
    ? MATCH_DATA.find(other => other.id === duoPair[item.id])
    : null;
  const candidates = shuffle(MATCH_DATA.filter(other =>
    other.id !== item.id && (!requiredPair || other.id !== requiredPair.id)
  ));
  const distractorItems = [
    ...(requiredPair ? [requiredPair] : []),
    ...candidates
  ];
  // 適應症選項統一糖尿病名稱，並避免「第二型／第2型」同義選項重複。
  const formatOptionValue = (value) => {
    if(matchState.mode !== 'drug-indication') return value;
    if(value === '糖尿病') return '第一型糖尿病';
    if(value === '第2型糖尿病') return '第二型糖尿病';
    return value;
  };
  const correctValue = formatOptionValue(item[answerKey]);
  const distractors = distractorItems
    .map(other => ({id:other.id, value:formatOptionValue(other[answerKey])}))
    .filter((option, idx, array) =>
      option.value !== correctValue &&
      array.findIndex(entry => entry.value === option.value) === idx
    )
    .slice(0, 3);
  const options = shuffle([{id:item.id, value:correctValue}, ...distractors]);

  options.forEach((option, idx) => {
    const button = document.createElement('button');
    button.className = 'match-card answer-option';
    button.dataset.correct = option.id === item.id ? 'true' : 'false';
    button.textContent = `${String.fromCharCode(65 + idx)}. ${option.value}`;
    button.addEventListener('click', () => chooseMatchingAnswer(button, option.value, correctValue));
    right.appendChild(button);
  });
}

function chooseMatchingAnswer(button, selectedAnswer, correctAnswer){
  if(matchState.answered) return;
  matchState.answered = true;
  const correct = button.dataset.correct === 'true';
  if(correct) matchState.score++;

  const item = matchState.questions[matchState.index];
  const question = matchState.mode === 'image-name'
    ? `藥品圖片辨識（${item.image.split('/').pop()}）`
    : matchState.mode === 'drug-dose'
      ? `${item.name} 的正確劑量為何？`
      : `${item.name} 的適應症為何？`;
  matchState.answers.push({
    question,
    selectedAnswer,
    correctAnswer,
    correct
  });

  [...$('match-right').children].forEach(option => {
    option.disabled = true;
    if(option.dataset.correct === 'true') option.classList.add('matched');
  });
  if(!correct) button.classList.add('mismatch');

  $('match-feedback').className = `feedback ${correct ? 'good' : 'bad'}`;
  $('match-feedback').textContent = correct ? '答對了！' : `答錯了，正確答案是：${correctAnswer}`;
  $('match-next-btn').textContent = matchState.index === matchState.questions.length - 1 ? '查看結果' : '下一題';
  $('match-next-btn').classList.remove('hidden');
}

$('match-next-btn').addEventListener('click', () => {
  if(matchState.index < matchState.questions.length - 1){
    matchState.index++;
    renderMatchingQuestion();
  } else {
    renderMatchingResult();
  }
});

function renderMatchingResult(){
  const total = matchState.questions.length;
  const pct = Math.round(matchState.score / total * 100);
  $('match-title').textContent = '練習結果';
  $('match-progress').textContent = `${total} / ${total}`;
  $('match-left').innerHTML = `<div class="match-result-score"><strong>${matchState.score} / ${total}</strong><span>答對題數</span></div>`;
  $('match-right').innerHTML = '';
  $('match-feedback').className = `feedback ${matchState.score >= 8 ? 'good' : 'info'}`;
  $('match-feedback').textContent = '成績送出中…';
  $('match-next-btn').classList.add('hidden');
  submitMatchingResult(total, pct);
}

async function submitMatchingResult(total, pct){
  const titles = {
    'image-name':'藥品圖片辨識',
    'drug-dose':'藥品劑量辨識',
    'drug-indication':'藥品適應症辨識'
  };
  const payload = {
    cardNumber: matchState.cardNumber,
    role: matchState.role,
    topic: titles[matchState.mode],
    score: pct,
    correct: matchState.score,
    total,
    completedAt: new Date().toISOString(),
    answers: matchState.answers.map((answer, index) => ({
      questionNo: index + 1,
      question: answer.question,
      selectedAnswer: answer.selectedAnswer,
      correctAnswer: answer.correctAnswer,
      correct: answer.correct
    }))
  };
  try {
    await fetch(RESULTS_ENDPOINT, {
      method:'POST',
      mode:'no-cors',
      headers:{'Content-Type':'text/plain;charset=utf-8'},
      body:JSON.stringify(payload)
    });
    $('match-feedback').className = 'feedback good';
    $('match-feedback').textContent = matchState.score >= 8
      ? '表現很好！成績已送出。'
      : '成績已送出，可以返回首頁再練習一次。';
  } catch (err) {
    $('match-feedback').className = 'feedback bad';
    $('match-feedback').textContent = '成績送出失敗，請稍後再試。';
  }
}

function shuffle(items){
  const copy = [...items];
  for(let i=copy.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [copy[i],copy[j]]=[copy[j],copy[i]]; }
  return copy;
}
$('match-home-btn').addEventListener('click', () => show('start'));

function renderQuestion(){
  const bank = QUESTION_BANK[state.topic].questions;
  const item = bank[state.index];
  state.locked = false;
  $('question-number').textContent = `第 ${state.index + 1} 題`;
  $('question-text').textContent = item.q;
  $('progress-text').textContent = `${state.index + 1} / ${bank.length}`;
  $('progress-bar').style.width = `${((state.index + 1)/bank.length)*100}%`;
  $('feedback').className = 'feedback hidden';
  $('feedback').textContent = '';
  $('next-btn').classList.add('hidden');
  const wrap = $('options'); wrap.innerHTML = '';
  item.options.forEach((text, idx) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = `${String.fromCharCode(65+idx)}. ${text}`;
    btn.addEventListener('click', () => choose(idx));
    wrap.appendChild(btn);
  });
}

function choose(choice){
  if(state.locked) return;
  state.locked = true;
  const bank = QUESTION_BANK[state.topic].questions;
  const item = bank[state.index];
  const correct = choice === item.answer;
  if(correct) state.score++;
  state.answers.push({ question:item.q, choice, correctIndex:item.answer, correct, options:item.options, explanation:item.explanation });
  [...$('options').children].forEach((btn, idx) => {
    btn.disabled = true;
    if(idx === item.answer) btn.classList.add('correct');
    if(idx === choice && idx !== item.answer) btn.classList.add('wrong');
  });
  const feedback = $('feedback');
  feedback.className = `feedback ${correct ? 'good' : 'bad'}`;
  feedback.textContent = `${correct ? '答對了！' : '這題答錯了。'} ${item.explanation}`;
  $('next-btn').textContent = state.index === bank.length - 1 ? '查看成績' : '下一題';
  $('next-btn').classList.remove('hidden');
}

$('next-btn').addEventListener('click', () => {
  const bank = QUESTION_BANK[state.topic].questions;
  if(state.index < bank.length - 1){ state.index++; renderQuestion(); }
  else renderResult();
});

function renderResult(){
  const total = QUESTION_BANK[state.topic].questions.length;
  const pct = Math.round(state.score / total * 100);
  $('result-score').textContent = `${state.score} / ${total}`;
  $('result-summary').textContent = `卡號 ${maskCard(state.cardNumber)}（${state.role}）本次得分 ${pct} 分。`;
  submitResult(total, pct);
  const list = $('review-list'); list.innerHTML='';
  state.answers.forEach((a, i) => {
    const div = document.createElement('div'); div.className='review-item';
    const userAns = a.options[a.choice]; const correctAns = a.options[a.correctIndex];
    div.innerHTML = `<strong>第 ${i+1} 題：${escapeHtml(a.question)}</strong>
      <div class="${a.correct ? 'right' : 'wrong-text'}">你的答案：${escapeHtml(userAns)} ${a.correct ? '✓' : '✗'}</div>
      ${a.correct ? '' : `<div class="right">正確答案：${escapeHtml(correctAns)}</div>`}
      <div class="muted">解析：${escapeHtml(a.explanation)}</div>`;
    list.appendChild(div);
  });
  show('result');
}

$('retry-btn').addEventListener('click', () => { show('start'); });
$('download-btn').addEventListener('click', downloadResult);

function downloadResult() {
  const total = QUESTION_BANK[state.topic].questions.length;
  const pct = Math.round(state.score / total * 100);
  const topic = QUESTION_BANK[state.topic].title;

  const rows = [
    ['藥學互動學習平台'],
    ['卡號', state.cardNumber],
    ['身分', state.role],
    ['學習主題', topic],
    ['答對題數', state.score],
    ['總題數', total],
    ['分數', pct + '分'],
    ['測驗時間', new Date().toLocaleString('zh-TW')],
    [],
   ['題號', '題目', '你的答案', '正確答案', '作答結果', '解析']
  ];

  state.answers.forEach((a, i) => {
  const question = QUESTION_BANK[state.topic].questions[i];

  rows.push([
    i + 1,
    question.q,
    question.options[a.choice] ?? '',
    question.options[question.answer] ?? '',
    a.correct ? '答對' : '答錯',
    question.explanation ?? ''
  ]);
});

  const csv = rows
    .map(row => row.map(cell =>
      `"${String(cell ?? '').replace(/"/g, '""')}"`
    ).join(','))
    .join('\n');

  const dataUrl =
  'data:text/csv;charset=utf-8,' +
  encodeURIComponent('\uFEFF' + csv);

const link = document.createElement('a');
link.href = dataUrl;
link.download = `NHI_Quiz_${state.cardNumber}_${topic}.csv`;
link.style.display = 'none';

document.body.appendChild(link);
link.click();
document.body.removeChild(link);
}
async function submitResult(total, pct){
  const status = $('submit-status');
  if(!RESULTS_ENDPOINT){
    status.className = 'feedback info';
    status.textContent = '目前為本機測試版，成績尚未回傳至 Google Sheet。';
    return;
  }
  status.className = 'feedback info';
  status.textContent = '成績送出中…';
  const payload = {
    cardNumber: state.cardNumber,
    role: state.role,
    topic: QUESTION_BANK[state.topic].title,
    score: pct,
    correct: state.score,
    total,
    completedAt: new Date().toISOString(),
    answers: state.answers.map((answer, index) => ({
      questionNo: index + 1,
      question: answer.question,
      selectedAnswer: answer.options[answer.choice],
      correctAnswer: answer.options[answer.correctIndex],
      correct: answer.correct
    }))
  };
  try {
    await fetch(RESULTS_ENDPOINT, { method:'POST', mode:'no-cors', headers:{'Content-Type':'text/plain;charset=utf-8'}, body:JSON.stringify(payload) });
    status.className = 'feedback good';
    status.textContent = '成績已送出。';
  } catch (err) {
    status.className = 'feedback bad';
    status.textContent = '成績送出失敗，請稍後再試。';
  }
}

function maskCard(card){
  if(card.length <= 4) return card;
  return `${'*'.repeat(Math.max(0, card.length - 4))}${card.slice(-4)}`;
}

function escapeHtml(s){ return s.replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
