const $ = (id) => document.getElementById(id);
const screens = { start: $('start-screen'), quiz: $('quiz-screen'), match: $('match-screen'), result: $('result-screen') };
// 尚未確認資料接收端前，不自動傳送學員卡號與測驗結果。
const RESULTS_ENDPOINT = '';
let state = { cardNumber:'', role:'', topic:'general', index:0, score:0, answers:[], locked:false };
let matchState = { mode:'', selectedLeft:null, selectedRight:null, matched:0, attempts:0 };

// 功能版示範資料：正式使用前請替換為院內確認過的藥品資料與圖片。
const MATCH_DATA = [
  { id:'metformin', name:'Metformin', dose:'500 mg', indication:'第二型糖尿病', imageLabel:'Metformin\n示意圖' },
  { id:'amlodipine', name:'Amlodipine', dose:'5 mg', indication:'高血壓', imageLabel:'Amlodipine\n示意圖' },
  { id:'atorvastatin', name:'Atorvastatin', dose:'20 mg', indication:'高膽固醇血症', imageLabel:'Atorvastatin\n示意圖' },
  { id:'omeprazole', name:'Omeprazole', dose:'20 mg', indication:'胃食道逆流', imageLabel:'Omeprazole\n示意圖' }
];

function show(name){ Object.entries(screens).forEach(([k,v]) => v.classList.toggle('hidden', k !== name)); }

$('start-btn').addEventListener('click', () => {
  const cardNumber = $('card-number').value.trim();
  const role = $('role').value;
  const mode = $('learning-mode').value;
  const topic = $('topic').value;
  if(!cardNumber || !role || !mode){ $('start-error').textContent = '請輸入卡號，並選擇身分及學習模式。'; return; }
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
  $('topic-field').classList.toggle('hidden', !isQuiz);
  $('start-btn').textContent = isQuiz ? '開始測驗' : '開始配對';
});

function startMatching(mode, cardNumber, role){
  matchState = { mode, selectedLeft:null, selectedRight:null, matched:0, attempts:0 };
  $('match-learner-info').textContent = `卡號 ${maskCard(cardNumber)}｜${role}`;
  const titles = {'image-name':'藥品圖片 ↔ 藥品名稱','drug-dose':'藥品名稱 ↔ 劑量','drug-indication':'藥品名稱 ↔ 適應症'};
  $('match-title').textContent = titles[mode];
  $('match-feedback').className = 'feedback info';
  $('match-feedback').textContent = '請開始配對。';
  renderMatching(); show('match');
}

function renderMatching(){
  const left = MATCH_DATA.map(item => ({ id:item.id, value:matchState.mode === 'image-name' ? item.imageLabel : item.name, image:matchState.mode === 'image-name' }));
  const rightKey = matchState.mode === 'image-name' ? 'name' : matchState.mode === 'drug-dose' ? 'dose' : 'indication';
  const right = shuffle(MATCH_DATA.map(item => ({ id:item.id, value:item[rightKey] })));
  renderMatchColumn('match-left', left, 'left'); renderMatchColumn('match-right', right, 'right'); updateMatchProgress();
}

function renderMatchColumn(containerId, items, side){
  const container = $(containerId); container.innerHTML = '';
  items.forEach(item => {
    const button = document.createElement('button');
    button.className = `match-card${item.image ? ' medicine-placeholder' : ''}`;
    button.dataset.id = item.id; button.textContent = item.value;
    button.addEventListener('click', () => selectMatch(button, side));
    container.appendChild(button);
  });
}

function selectMatch(button, side){
  if(button.classList.contains('matched')) return;
  const key = side === 'left' ? 'selectedLeft' : 'selectedRight';
  const column = side === 'left' ? $('match-left') : $('match-right');
  [...column.children].forEach(card => card.classList.remove('selected'));
  button.classList.add('selected'); matchState[key] = button;
  if(matchState.selectedLeft && matchState.selectedRight) checkMatch();
}

function checkMatch(){
  const left = matchState.selectedLeft, right = matchState.selectedRight;
  matchState.attempts++;
  if(left.dataset.id === right.dataset.id){
    left.classList.add('matched'); right.classList.add('matched'); left.disabled = true; right.disabled = true; matchState.matched++;
    $('match-feedback').className = 'feedback good';
    $('match-feedback').textContent = matchState.matched === MATCH_DATA.length ? `全部完成！共嘗試 ${matchState.attempts} 次。` : '配對正確！請繼續。';
  } else {
    left.classList.add('mismatch'); right.classList.add('mismatch');
    $('match-feedback').className = 'feedback bad'; $('match-feedback').textContent = '配對不正確，請再試一次。';
    setTimeout(() => { left.classList.remove('mismatch'); right.classList.remove('mismatch'); }, 450);
  }
  left.classList.remove('selected'); right.classList.remove('selected'); matchState.selectedLeft = null; matchState.selectedRight = null; updateMatchProgress();
}

function updateMatchProgress(){ $('match-progress').textContent = `${matchState.matched} / ${MATCH_DATA.length}`; }
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
    wrongQuestions: state.answers.filter(a => !a.correct).map((a,i) => ({ questionNo:i+1, question:a.question }))
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
