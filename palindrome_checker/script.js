document.getElementById('check-btn').addEventListener('click', function() {
  const inputElement = document.getElementById('text-input');
  const resultElement = document.getElementById('result');
  const inputValue = inputElement.value;

  if (!inputValue) {
    alert('Please input a value');
    return;
  }

  const cleanedInput = inputValue.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  const reversedInput = cleanedInput.split('').reverse().join('');
  const isPalindrome = cleanedInput === reversedInput;

  resultElement.textContent = `${inputValue} is ${isPalindrome ? '' : 'not '}a palindrome`;
});
