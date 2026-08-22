const $ = (id) => document.getElementById(id);
const screens = { start: $('start-screen'), quiz: $('quiz-screen'), result: $('result-screen') };
const RESULTS_ENDPOINT = 'https://script.google.com/macros/s/AKfycbyrCXiquLsV_rLpAPKzK6u1McsV2wTWKKO2nERcsu9jb4I01TZrz9JRiClpvx0RRCZo/exec'; // 之後貼上 Google Apps Script Web App 網址
let state = { cardNumber:'', role:'', topic:'general', index:0, score:0, answers:[], locked:false };

function show(name){ Object.entries(screens).forEach(([k,v]) => v.classList.toggle('hidden', k !== name)); }

$('start-btn').addEventListener('click', () => {
  const cardNumber = $('card-number').value.trim();
  const role = $('role').value;
  const topic = $('topic').value;
  if(!cardNumber || !role){ $('start-error').textContent = '請先輸入卡號並選擇身分。'; return; }
  $('start-error').textContent = '';
  state = { cardNumber, role, topic, index:0, score:0, answers:[], locked:false };
  $('learner-info').textContent = `卡號 ${maskCard(cardNumber)}｜${role}`;
  $('topic-title').textContent = QUESTION_BANK[topic].title;
  show('quiz'); renderQuestion();
});

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
    ['健保藥品給付規定學習平台'],
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
