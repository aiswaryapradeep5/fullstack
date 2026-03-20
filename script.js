const expressionEl = document.getElementById('expression');
const resultEl     = document.getElementById('result');

let currentInput  = '';
let justEvaluated = false;

function updateDisplay(value) {
  resultEl.textContent = value || '0';
}

function handleButton(btn) {
  const value  = btn.dataset.value;
  const action = btn.dataset.action;

  // Press animation
  btn.classList.add('pressed');
  setTimeout(() => btn.classList.remove('pressed'), 120);

  if (action === 'clear') {
    currentInput = '';
    expressionEl.innerHTML = '&nbsp;';
    updateDisplay('0');
    justEvaluated = false;
    return;
  }

  if (action === 'delete') {
    if (justEvaluated) return;
    currentInput = currentInput.slice(0, -1);
    updateDisplay(currentInput || '0');
    return;
  }

  if (action === 'equals') {
    if (!currentInput) return;
    try {
      expressionEl.textContent = currentInput + ' =';
      let expr = currentInput.replace(/×/g, '*').replace(/÷/g, '/');
      if (/[^0-9+\-*/.%() ]/.test(expr)) throw new Error('Invalid');
      // Handle % as /100
      expr = expr.replace(/(\d+(\.\d+)?)%/g, '($1/100)');
      let res = Function('"use strict"; return (' + expr + ')')();
      res = parseFloat(res.toFixed(10));
      updateDisplay(res);
      currentInput  = String(res);
      justEvaluated = true;
    } catch {
      updateDisplay('Error');
      currentInput  = '';
      justEvaluated = false;
    }
    return;
  }

  const operators = ['+', '-', '*', '/', '%'];
  const lastChar  = currentInput.slice(-1);

  // After evaluation: operator continues, digit starts fresh
  if (justEvaluated) {
    if (operators.includes(value)) {
      justEvaluated = false;
    } else {
      currentInput  = '';
      expressionEl.innerHTML = '&nbsp;';
      justEvaluated = false;
    }
  }

  // Replace consecutive operators
  if (operators.includes(value) && operators.includes(lastChar)) {
    currentInput = currentInput.slice(0, -1);
  }

  // Prevent multiple dots in same number
  if (value === '.') {
    const segments = currentInput.split(/[+\-*/]/);
    if (segments[segments.length - 1].includes('.')) return;
    if (!currentInput || operators.includes(lastChar)) {
      currentInput += '0';
    }
  }

  currentInput += value;

  // Show running expression (replace operator symbols for display)
  const display = currentInput
    .replace(/\*/g, '×')
    .replace(/\//g, '÷');
  expressionEl.textContent = display;
  updateDisplay(display);
}

// Click events
document.querySelector('.keypad').addEventListener('click', (e) => {
  const btn = e.target.closest('.key');
  if (btn) handleButton(btn);
});

// Keyboard support
document.addEventListener('keydown', (e) => {
  const map = {
    '0':'[data-value="0"]', '1':'[data-value="1"]', '2':'[data-value="2"]',
    '3':'[data-value="3"]', '4':'[data-value="4"]', '5':'[data-value="5"]',
    '6':'[data-value="6"]', '7':'[data-value="7"]', '8':'[data-value="8"]',
    '9':'[data-value="9"]', '.':'[data-value="."]', '+':'[data-value="+"]',
    '-':'[data-value="-"]', '*':'[data-value="*"]', '%':'[data-value="%"]',
  };
  if (e.key === '/' )        { e.preventDefault(); click('[data-value="/"]'); }
  else if (e.key === 'Enter' || e.key === '=') click('[data-action="equals"]');
  else if (e.key === 'Backspace') click('[data-action="delete"]');
  else if (e.key === 'Escape')    click('[data-action="clear"]');
  else if (map[e.key])            click(map[e.key]);
});

function click(selector) {
  const el = document.querySelector(selector);
  if (el) el.click();
}