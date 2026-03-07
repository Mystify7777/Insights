import { useState } from 'react';

function AddTaskForm() {
  const [inputValue, setInputValue] = useState('');

  function handleChange(event) {
    setInputValue(event.target.value);
  }

  // 1. A new function to handle the form submission.
  function handleSubmit(event) {
    // 2. This stops the browser from reloading the page.
    event.preventDefault();

    // 3. We can now see the submitted task!
    alert(`New task added: ${inputValue}`);

    // 4. Clear the input field after submission.
    setInputValue('');
  }

  return (
    // 5. Add the onSubmit handler to the form.
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
      />
      <button type="submit">Add Task</button>
    </form>
  );
}
export default AddTaskForm;
