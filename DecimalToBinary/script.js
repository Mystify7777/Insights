const numberInput = document.getElementById("number-input");
const convertBtn = document.getElementById("convert-btn");
const result = document.getElementById("result");
const animationContainer = document.getElementById("animation-container");

// A helper function to pause execution, making async/await work for delays.
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * The core recursive function. It now has an optional parameter `steps`
 * to record the call stack for the animation.
 */
const decimalToBinary = (input, steps = []) => {
    // Record the function call
    const step = {
        input: input,
        msg: `decimalToBinary(${input}) called.`
    };
    steps.push(step);

    if (input === 0 || input === 1) {
        // Base case
        step.returned = String(input);
        step.msg = `Base case: decimalToBinary(${input}) returns "${String(input)}".`;
        return String(input);
    } else {
        const quotient = Math.floor(input / 2);
        const remainder = input % 2;
        
        // Recursive call
        const recursiveReturn = decimalToBinary(quotient, steps);
        
        const returnedValue = recursiveReturn + remainder;
        step.returned = returnedValue;
        step.msg = `decimalToBinary(${input}) returns "${recursiveReturn}" + ${remainder} => "${returnedValue}".`;
        return returnedValue;
    }
};

/**
 * The new async animation function. This orchestrates the visualization.
 */
const animateConversion = async (input) => {
    // Disable button during animation
    convertBtn.disabled = true;
    result.innerText = "Call Stack Animation";
    animationContainer.innerHTML = "";
    
    const steps = [];
    const finalResult = decimalToBinary(input, steps); // This also populates `steps`

    // Animate the "drilling down" of the recursion
    for (const step of steps) {
        await sleep(1200); // Wait before showing the next call
        const p = document.createElement("p");
        p.id = `step-${step.input}`;
        p.className = "animation-frame";
        p.textContent = `decimalToBinary(${step.input})`;
        animationContainer.appendChild(p);
    }
    
    // Animate the "returning" phase of the recursion
    for (let i = steps.length - 1; i >= 0; i--) {
        const step = steps[i];
        await sleep(1500); // Wait before showing the message
        const element = document.getElementById(`step-${step.input}`);
        element.textContent = step.msg;
        element.classList.add('returned'); // Highlight the returned frame
        
        await sleep(1500); // Wait before removing
        element.classList.add('fade-out'); // Trigger fade-out animation
        
        await sleep(500); // Wait for fade-out to finish
        element.remove();
    }

    await sleep(500);
    result.textContent = finalResult;
    // Re-enable button
    convertBtn.disabled = false;
};

const checkUserInput = () => {
    const inputInt = parseInt(numberInput.value);

    if (!numberInput.value || isNaN(inputInt) || inputInt < 0) {
        alert("Please provide a decimal number greater than or equal to 0");
        return;
    }
    
    // Always run the animation now!
    animateConversion(inputInt);
    numberInput.value = "";
};

convertBtn.addEventListener("click", checkUserInput);

numberInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        checkUserInput();
    }
});
