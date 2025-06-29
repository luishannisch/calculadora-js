const display = document.querySelector('#display');
const buttons = document.querySelector('.buttons');

let firstOperand = null;
let operator = null;
let waitingSecondOperand = false;
let currentDisplayValue = '0';

// Inicializa o visor usando updateDisplay()
updateDisplay();

function inputDigit(digit){
    if (waitingSecondOperand) {
        currentDisplayValue = digit;
        waitingSecondOperand = false;
    } else {
        if (currentDisplayValue === '0') {
            currentDisplayValue = digit;
        } else {
            currentDisplayValue = currentDisplayValue + digit;
        }
    }
}

function inputDecimal(){
    if (waitingSecondOperand) {
        currentDisplayValue = '0.';
        waitingSecondOperand = false;
        return;
    }
    if (!currentDisplayValue.includes('.')) {
        currentDisplayValue += '.';
    }
}

function clearAll(){
    firstOperand = null;
    operator = null;
    waitingSecondOperand = false;
    currentDisplayValue = '0';
    updateDisplay();
}

function operate(a, b, op) {
  let result;

  switch (op) {
    case 'add':
      result = a + b;
      break;
    case 'subtract':
      result = a - b;
      break;
    case 'multiply':
      result = a * b;
      break;
    case 'divide':
      result = (b === 0 ? NaN : a / b);
      break;
    case 'power':
      result = Math.pow(a, b);
      break;
    default:
      result = b;
  }

  return parseFloat(result.toFixed(10));
}


function updateDisplay() {
    display.value = isNaN(Number(currentDisplayValue))
      ? 'Erro'
      : currentDisplayValue;
}

function handleOperator(nextOperator){
    const inputValue = parseFloat(currentDisplayValue);

    if (firstOperand === null) {
        firstOperand = inputValue;
    } else if (operator) {
        const result = operate(firstOperand, inputValue, operator);
        currentDisplayValue = String(result);
        firstOperand = result;
    }

    operator = nextOperator;
    waitingSecondOperand = true;
}

function handleSqrt(){
    const value = parseFloat(currentDisplayValue);
    currentDisplayValue = String(value < 0 ? NaN : Math.sqrt(value));
    waitingSecondOperand = true;
}

function calculateResult(){
    if (operator === null) {
        return;
    }
    const secondOperand = parseFloat(currentDisplayValue);
    const result = operate(firstOperand, secondOperand, operator);
    currentDisplayValue = String(result);
    firstOperand = null;
    operator = null;
    waitingSecondOperand = false;
}

buttons.addEventListener('click', (event) => {
    const btn = event.target;
    if (btn.tagName !== 'BUTTON') {
        return;
    }

    const action = btn.dataset.action;
    const value = btn.textContent;

    if (!action) {
        inputDigit(value);
    } else if (action === 'decimal') {
        inputDecimal();
    } else if (action === 'clear') {
        clearAll();
    } else if (['add','subtract','multiply','divide','power'].includes(action)) {
        handleOperator(action);
    } else if (action === 'sqrt') {
        handleSqrt();
    } else if (action === 'equals') {
        calculateResult();
    }

    // Atualiza o display via função centralizada
    updateDisplay();
});
