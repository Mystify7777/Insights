document.getElementById('check-btn').addEventListener('click', function() {
  const inputElement = document.getElementById('text-input');
  const resultElement = document.getElementById('result');
  const checkerElement = document.getElementById('palindrome-checker');
  const inputValue = inputElement.value;

  // Clear previous results and styles
  resultElement.textContent = '';
  checkerElement.classList.remove('success', 'failure');
  resultElement.classList.remove('result-animation');

  if (!inputValue) {
    alert('Please input a value');
    return;
  }

  const cleanedInput = inputValue.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  const reversedInput = cleanedInput.split('').reverse().join('');
  const isPalindrome = cleanedInput === reversedInput;

  // Build a more descriptive result message
  let resultMessage = `<strong>${inputValue}</strong> is ${isPalindrome ? '' : 'not '}a palindrome.`;
  if (cleanedInput !== inputValue.toLowerCase()) {
      resultMessage += `<br><small>(Checked as: "${cleanedInput}")</small>`;
  }

  // Update the result content
  resultElement.innerHTML = resultMessage;
  resultElement.classList.add('result-animation');


  // Apply visual feedback and confetti
  if (isPalindrome) {
    checkerElement.classList.add('success');
    // Launch confetti!
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.6 }
    });
  } else {
    checkerElement.classList.add('failure');
  }
});