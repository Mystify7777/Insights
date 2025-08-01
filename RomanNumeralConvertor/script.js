// script.js

// Function to convert number to Roman numeral
function convertToRoman(num) {
  const romanNumerals = [
    { value: 1000, numeral: 'M' },
    { value: 900, numeral: 'CM' },
    { value: 500, numeral: 'D' },
    { value: 400, numeral: 'CD' },
    { value: 100, numeral: 'C' },
    { value: 90, numeral: 'XC' },
    { value: 50, numeral: 'L' },
    { value: 40, numeral: 'XL' },
    { value: 10, numeral: 'X' },
    { value: 9, numeral: 'IX' },
    { value: 5, numeral: 'V' },
    { value: 4, numeral: 'IV' },
    { value: 1, numeral: 'I' }
  ];

  let result = '';
  for (let i = 0; i < romanNumerals.length; i++) {
    while (num >= romanNumerals[i].value) {
      result += romanNumerals[i].numeral;
      num -= romanNumerals[i].value;
    }
  }
  return result;
}

// Get DOM elements
const numberInput = document.getElementById('number');
const convertBtn = document.getElementById('convert-btn');
const output = document.getElementById('output');

// Event listener for the convert button
convertBtn.addEventListener('click', () => {
  const num = parseInt(numberInput.value);

  // Handle invalid or empty input
  if (isNaN(num)) {
    output.textContent = 'Please enter a valid number';
  } 
  // Handle input less than 1
  else if (num < 1) {
    output.textContent = 'Please enter a number greater than or equal to 1';
  } 
  // Handle input greater than or equal to 4000
  else if (num >= 4000) {
    output.textContent = 'Please enter a number less than or equal to 3999';
  } 
  // Convert valid number to Roman numeral
  else {
    output.textContent = convertToRoman(num);
  }
});
