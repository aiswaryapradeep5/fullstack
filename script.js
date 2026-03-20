let input = '';

// Show value on screen
function updateScreen(value) {
  document.getElementById('screen').innerText = value;
}

// Called when a button is pressed
function press(value) {
  input += value;
  updateScreen(input);
}

// Clear everything
function clearScreen() {
  input = '';
  updateScreen('0');
}

// Delete last character
function deleteLast() {
  input = input.slice(0, -1);
  updateScreen(input || '0');
}

// Calculate the result
function calculate() {
  try {
    // Replace % with /100 for calculation
    let expression = input.replace(/(\d+)%/g, '($1/100)');
    let result = eval(expression);
    updateScreen(result);
    input = String(result);
  } catch {
    updateScreen('Error');
    input = '';
  }
}
