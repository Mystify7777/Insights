const numberInput = document.getElementById('number-input');
const convertBtn = document.getElementById('convert-btn');
const output = document.getElementById('output');

// A data-driven approach is cleaner and more scalable.
const romanNumerals = [
  { value: 1000, symbol: 'M' },
  { value: 900, symbol: 'CM' },
  { value: 500, symbol: 'D' },
  { value: 400, symbol: 'CD' },
  { value: 100, symbol: 'C' },
  { value: 90, symbol: 'XC' },
  { value: 50, symbol: 'L' },
  { value: 40, symbol: 'XL' },
  { value: 10, symbol: 'X' },
  { value: 9, symbol: 'IX' },
  { value: 5, symbol: 'V' },
  { value: 4, symbol: 'IV' },
  { value: 1, symbol: 'I' }
];

/**
 * Converts a decimal number to a Roman numeral.
 * @param {number} num The number to convert.
 * @returns {string} The Roman numeral representation.
 */
const convertToRoman = (num) => {
  let result = '';
  let remaining = num;
  for (const { value, symbol } of romanNumerals) {
    while (remaining >= value) {
      result += symbol;
      remaining -= value;
    }
  }
  return result;
};

/**
 * Validates user input and updates the output display.
 */
const updateOutput = () => {
    const inputVal = numberInput.value;
    
    // Reset output styles
    output.classList.remove('error');
    
    if (!inputVal) {
        output.innerHTML = `<p class="placeholder">Enter a number to see the Roman numeral equivalent.</p>`;
        return;
    }

    const inputInt = parseInt(inputVal, 10);

    if (isNaN(inputInt)) {
        output.classList.add('error');
        output.innerHTML = `<p class="error-message">Please enter a valid number.</p>`;
        return;
    }

    if (inputInt < 1) {
        output.classList.add('error');
        output.innerHTML = `<p class="error-message">Please enter a number greater than or equal to 1.</p>`;
        return;
    }

    if (inputInt >= 4000) {
        output.classList.add('error');
        output.innerHTML = `<p class="error-message">Please enter a number less than or equal to 3999.</p>`;
        return;
    }

    // If all checks pass, show the result
    const romanResult = convertToRoman(inputInt);
    output.innerHTML = `<p class="result">${romanResult}</p>`;
};

// --- Event Listeners ---

// For the "Convert" button click
convertBtn.addEventListener('click', updateOutput);

// For live conversion as the user types
numberInput.addEventListener('input', updateOutput);

// For handling the "Enter" key
numberInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    updateOutput();
  }
});
