// --- Infix and Basic Math Functions (unchanged) ---
const infixToFunction = {
  "+": (x, y) => x + y,
  "-": (x, y) => x - y,
  "*": (x, y) => x * y,
  "/": (x, y) => x / y,
};
const infixEval = (str, regex) =>
  str.replace(regex, (_match, arg1, operator, arg2) =>
    infixToFunction[operator](parseFloat(arg1), parseFloat(arg2))
  );
const highPrecedence = (str) => {
  const regex = /([\d.]+)([*\/])([\d.]+)/;
  const str2 = infixEval(str, regex);
  return str === str2 ? str : highPrecedence(str2);
};

// --- Core Spreadsheet Functions ---
const isEven = (num) => num % 2 === 0;
const sum = (nums) => nums.reduce((acc, el) => acc + el, 0);
const average = (nums) => sum(nums) / nums.length;
const median = (nums) => {
  const sorted = nums.slice().sort((a, b) => a - b);
  const length = sorted.length;
  const middle = length / 2 - 1;
  return isEven(length)
    ? average([sorted[middle], sorted[middle + 1]])
    : sorted[Math.ceil(middle)];
};
const spreadsheetFunctions = {
  sum,
  average,
  median,
  even: (nums) => nums.filter(isEven),
  someeven: (nums) => nums.some(isEven),
  everyeven: (nums) => nums.every(isEven),
  firsttwo: (nums) => nums.slice(0, 2),
  lasttwo: (nums) => nums.slice(-2),
  has2: (nums) => nums.includes(2),
  increment: (nums) => nums.map((num) => num + 1),
  random: ([x, y]) => Math.floor(Math.random() * y + x),
  range: (nums) => range(...nums),
  nodupes: (nums) => [...new Set(nums).values()],
};

// --- Utility Functions (unchanged) ---
const range = (start, end) =>
  Array(end - start + 1)
    .fill(start)
    .map((element, index) => element + index);
const charRange = (start, end) =>
  range(start.charCodeAt(0), end.charCodeAt(0)).map((code) =>
    String.fromCharCode(code)
  );

// --- NEW: Formula Evaluation Engine with Error Handling ---
const applyFunction = (str) => {
  const noHigh = highPrecedence(str);
  const infix = /([\d.]+)([+-])([\d.]+)/;
  const str2 = infixEval(noHigh, infix);
  const functionCall = /([a-z0-9]*)\(([0-9., ]*)\)(?!.*\()/i;
  const toNumberList = (args) => args.split(",").map(parseFloat);
  const apply = (fn, args) => {
    // Check if function exists (case-insensitive)
    if (fn.toLowerCase() in spreadsheetFunctions) {
      return spreadsheetFunctions[fn.toLowerCase()](toNumberList(args));
    }
    // If function doesn't exist, throw a #NAME? error
    throw new Error("#NAME?");
  };
  return str2.replace(functionCall, (match, fn, args) =>
    apply(fn, args)
  );
};

const evalFormula = (x, cells, evaluationChain) => {
  const idToText = (id) => {
    const cell = cells.find((c) => c.id === id);
    if (!cell) {
      throw new Error("#REF!"); // Cell does not exist
    }
    // Check for circular reference
    if (evaluationChain.includes(id)) {
      throw new Error("#CIRC!");
    }
    const newChain = [...evaluationChain, id];
    // If the referenced cell has a formula, evaluate it recursively
    if (cell.dataset.formula && cell.dataset.formula.startsWith("=")) {
      return evalFormula(cell.dataset.formula.slice(1), cells, newChain);
    }
    // Otherwise, return its plain value
    return cell.value;
  };

  const rangeRegex = /([A-J])([1-9][0-9]?):([A-J])([1-9][0-9]?)/gi;
  const rangeFromString = (num1, num2) => range(parseInt(num1), parseInt(num2));
  const elemValue = (num) => (character) => idToText(character + num);
  const addCharacters = (character1) => (character2) => (num) =>
    charRange(character1, character2).map(elemValue(num));
  
  // Uppercase formula for case-insensitivity before processing
  const expandedRange = x.toUpperCase().replace(
    rangeRegex,
    (_match, char1, num1, char2, num2) =>
      rangeFromString(num1, num2).map(addCharacters(char1)(char2))
  );

  const cellRegex = /[A-J][1-9][0-9]?/gi;
  // Replace cell IDs with their actual values
  const expandedCells = expandedRange.replace(cellRegex, (match) => idToText(match));
  
  // Apply functions and arithmetic
  const appliedFunctions = applyFunction(expandedCells);
  return appliedFunctions;
};


// --- Window Onload and Event Handling ---
window.onload = () => {
  const container = document.getElementById("container");
  const formulaBar = document.getElementById("formula-bar");
  const selectedCellLabel = document.getElementById("selected-cell-label");
  const allCells = []; // Keep a reference to all cell inputs

  const createGrid = () => {
    // Create header row
    container.appendChild(document.createElement("div")); // Empty top-left
    const letters = charRange("A", "J");
    letters.forEach((letter) => {
      const label = document.createElement("div");
      label.className = "label";
      label.textContent = letter;
      container.appendChild(label);
    });

    // Create numbered rows and inputs
    for (let i = 1; i <= 99; i++) {
      const rowLabel = document.createElement("div");
      rowLabel.className = "label";
      rowLabel.textContent = i;
      container.appendChild(rowLabel);
      letters.forEach((letter) => {
        const input = document.createElement("input");
        input.type = "text";
        input.id = letter + i;
        input.dataset.formula = "";
        input.ariaLabel = letter + i;
        container.appendChild(input);
        allCells.push(input); // Add to our cell reference array
      });
    }
  };

  createGrid();

  let selectedCell;

  container.addEventListener("click", (event) => {
    const target = event.target;
    if (target.tagName === "INPUT") {
      if (selectedCell) {
        selectedCell.classList.remove("selected");
      }
      selectedCell = target;
      selectedCell.classList.add("selected");
      selectedCellLabel.textContent = selectedCell.id;
      formulaBar.value = selectedCell.dataset.formula || selectedCell.value;
      formulaBar.focus();
    }
  });
  
  const updateCell = (cell) => {
      // Clear previous error styling
      cell.classList.remove("error");
      const rawValue = cell.dataset.formula || "";

      if (rawValue.startsWith('=')) {
          try {
              // Start evaluation with the cell's own ID in the chain
              const result = evalFormula(rawValue.slice(1), allCells, [cell.id]);
              cell.value = result;
          } catch (error) {
              cell.value = error.message;
              cell.classList.add("error"); // Add error styling
          }
      } else {
          cell.value = rawValue;
      }
  };
  
  const processFormula = () => {
      if (!selectedCell) return;
      
      selectedCell.dataset.formula = formulaBar.value;
      
      // Update the current cell
      updateCell(selectedCell);

      // A simple way to update all other cells. Could be optimized later.
      allCells.forEach(cell => {
          if (cell.id !== selectedCell.id) {
              updateCell(cell);
          }
      });
  };

  formulaBar.addEventListener("input", () => {
    if (selectedCell) {
      // Live update the cell value as formula is typed (without evaluation)
      selectedCell.value = formulaBar.value;
    }
  });

  formulaBar.addEventListener("blur", processFormula);
  formulaBar.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
          e.preventDefault(); // Prevent form submission
          processFormula();
          selectedCell.focus();
      }
  });
};