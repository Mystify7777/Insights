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

// --- Core Spreadsheet Functions (UPDATED) ---
const isEven = (num) => num % 2 === 0;

// Helper to filter for numeric values from an argument list
const numbers = nums => nums.map(parseFloat).filter(n => !isNaN(n));

const sum = (nums) => numbers(nums).reduce((acc, el) => acc + el, 0);
const average = (nums) => sum(nums) / numbers(nums).length;
const median = (nums) => {
  const sorted = numbers(nums).slice().sort((a, b) => a - b);
  const length = sorted.length;
  const middle = length / 2 - 1;
  return isEven(length)
    ? average([sorted[middle], sorted[middle + 1]])
    : sorted[Math.ceil(middle)];
};

// EXPANDED function library
const spreadsheetFunctions = {
  sum,
  average,
  median,
  min: (nums) => Math.min(...numbers(nums)),
  max: (nums) => Math.max(...numbers(nums)),
  count: (nums) => numbers(nums).length,
  concatenate: (nums) => nums.join(""),
  upper: (nums) => String(nums[0]).toUpperCase(),
  lower: (nums) => String(nums[0]).toLowerCase(),
  len: (nums) => String(nums[0]).length,
  even: (nums) => numbers(nums).filter(isEven),
  someeven: (nums) => numbers(nums).some(isEven),
  everyeven: (nums) => numbers(nums).every(isEven),
  firsttwo: (nums) => nums.slice(0, 2),
  lasttwo: (nums) => nums.slice(-2),
  has2: (nums) => numbers(nums).includes(2),
  increment: (nums) => numbers(nums).map((num) => num + 1),
  random: (nums) => Math.floor(Math.random() * nums[1] + nums[0]),
  range: (nums) => range(...numbers(nums)),
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

// --- Formula Evaluation Engine (UPDATED) ---

// NEW: Robust argument parser that handles quoted strings
const parseArgs = (argsString) => {
    // This regex splits by comma, but ignores commas inside double quotes
    const regex = /(".*?"|[^",\s]+)(?=\s*,|\s*$)/g;
    const matches = argsString.match(regex) || [];
    return matches.map(arg => {
        // If argument is a quoted string, remove the quotes
        if (arg.startsWith('"') && arg.endsWith('"')) {
            return arg.slice(1, -1);
        }
        return arg;
    });
}

const applyFunction = (str) => {
  const noHigh = highPrecedence(str);
  const infix = /([\d.]+)([+-])([\d.]+)/;
  const str2 = infixEval(noHigh, infix);

  // UPDATED regex to be more general
  const functionCall = /([a-zA-Z0-9]+)\((.*)\)/;
  const match = str2.match(functionCall);

  if (match) {
    const fnName = match[1].toLowerCase();
    const args = parseArgs(match[2]);
    if (fnName in spreadsheetFunctions) {
      return spreadsheetFunctions[fnName](args);
    }
    throw new Error("#NAME?");
  }
  return str2;
};


const evalFormula = (x, cells, evaluationChain) => {
  const idToText = (id) => {
    const cell = cells.find((c) => c.id === id);
    if (!cell) {
      throw new Error("#REF!");
    }
    if (evaluationChain.includes(id)) {
      throw new Error("#CIRC!");
    }
    const newChain = [...evaluationChain, id];
    const formula = cell.dataset.formula || "";
    if (formula.startsWith("=")) {
      return evalFormula(formula.slice(1), cells, newChain);
    }
    // For string values, wrap them in quotes to be parsed correctly
    return isNaN(cell.value) ? `"${cell.value}"` : cell.value;
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


// --- Window Onload and Event Handling (unchanged from previous step) ---
window.onload = () => {
  const container = document.getElementById("container");
  const formulaBar = document.getElementById("formula-bar");
  const selectedCellLabel = document.getElementById("selected-cell-label");
  const allCells = [];

  const createGrid = () => {
    container.appendChild(document.createElement("div"));
    const letters = charRange("A", "J");
    letters.forEach((letter) => {
      const label = document.createElement("div");
      label.className = "label";
      label.textContent = letter;
      container.appendChild(label);
    });

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
        allCells.push(input);
      });
    }
  };

  createGrid();

  let selectedCell;

  const selectCell = (cell) => {
    if (selectedCell) {
      selectedCell.classList.remove("selected");
    }
    selectedCell = cell;
    selectedCell.classList.add("selected");
    selectedCellLabel.textContent = selectedCell.id;
    formulaBar.value = selectedCell.dataset.formula || selectedCell.value;
  };
  
  container.addEventListener("click", (event) => {
    const target = event.target;
    if (target.tagName === "INPUT") {
      selectCell(target);
      formulaBar.focus();
    }
  });

  container.addEventListener("keydown", (event) => {
    const target = event.target;
    if (target.tagName !== "INPUT") return;

    const key = event.key;
    if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key)) {
      return;
    }

    event.preventDefault();

    const [col, row] = target.id.match(/([A-J])([0-9]+)/).slice(1);
    const rowNum = parseInt(row);
    const colNum = col.charCodeAt(0);

    let nextCellId;

    if (key === "ArrowUp") {
      nextCellId = rowNum > 1 ? col + (rowNum - 1) : null;
    } else if (key === "ArrowDown") {
      nextCellId = rowNum < 99 ? col + (rowNum + 1) : null;
    } else if (key === "ArrowLeft") {
      nextCellId = colNum > 'A'.charCodeAt(0) ? String.fromCharCode(colNum - 1) + row : null;
    } else if (key === "ArrowRight") {
      nextCellId = colNum < 'J'.charCodeAt(0) ? String.fromCharCode(colNum + 1) + row : null;
    }

    if (nextCellId) {
      const nextCell = document.getElementById(nextCellId);
      if (nextCell) {
        selectCell(nextCell);
        nextCell.focus();
      }
    }
  });

  const updateCell = (cell) => {
    cell.classList.remove("error");
    const rawValue = cell.dataset.formula || "";

    if (rawValue.startsWith('=')) {
        try {
            const result = evalFormula(rawValue.slice(1), allCells, [cell.id]);
            cell.value = result;
        } catch (error) {
            cell.value = error.message;
            cell.classList.add("error");
        }
    } else {
        cell.value = rawValue;
    }
  };
  
  const processFormulaAndRecalculate = () => {
    if (!selectedCell) return;
    
    selectedCell.dataset.formula = formulaBar.value;
    
    allCells.forEach(updateCell);
  };

  formulaBar.addEventListener("input", (e) => {
    if (selectedCell) {
      selectedCell.value = e.target.value;
    }
  });

  formulaBar.addEventListener("blur", processFormulaAndRecalculate);
  formulaBar.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
          e.preventDefault();
          processFormulaAndRecalculate();
          selectedCell.focus();
      }
  });
};