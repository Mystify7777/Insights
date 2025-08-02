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

// --- Core Spreadsheet Functions (unchanged) ---
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

// --- Formula Evaluation Engine (unchanged) ---
const applyFunction = (str) => {
  const noHigh = highPrecedence(str);
  const infix = /([\d.]+)([+-])([\d.]+)/;
  const str2 = infixEval(noHigh, infix);
  const functionCall = /([a-z0-9]*)\(([0-9., ]*)\)(?!.*\()/i;
  const toNumberList = (args) => args.split(",").map(parseFloat);
  const apply = (fn, args) => {
    if (fn.toLowerCase() in spreadsheetFunctions) {
      return spreadsheetFunctions[fn.toLowerCase()](toNumberList(args));
    }
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
      throw new Error("#REF!");
    }
    if (evaluationChain.includes(id)) {
      throw new Error("#CIRC!");
    }
    const newChain = [...evaluationChain, id];
    if (cell.dataset.formula && cell.dataset.formula.startsWith("=")) {
      return evalFormula(cell.dataset.formula.slice(1), cells, newChain);
    }
    return cell.value;
  };

  const rangeRegex = /([A-J])([1-9][0-9]?):([A-J])([1-9][0-9]?)/gi;
  const rangeFromString = (num1, num2) => range(parseInt(num1), parseInt(num2));
  const elemValue = (num) => (character) => idToText(character + num);
  const addCharacters = (character1) => (character2) => (num) =>
    charRange(character1, character2).map(elemValue(num));
  
  const expandedRange = x.toUpperCase().replace(
    rangeRegex,
    (_match, char1, num1, char2, num2) =>
      rangeFromString(num1, num2).map(addCharacters(char1)(char2))
  );

  const cellRegex = /[A-J][1-9][0-9]?/gi;
  const expandedCells = expandedRange.replace(cellRegex, (match) => idToText(match));
  
  const appliedFunctions = applyFunction(expandedCells);
  return appliedFunctions;
};


// --- Window Onload and Event Handling ---
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

  // NEW: Keyboard Navigation
  container.addEventListener("keydown", (event) => {
    const target = event.target;
    if (target.tagName !== "INPUT") return;

    const key = event.key;
    if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key)) {
      return;
    }

    event.preventDefault(); // Prevent cursor movement inside input/scrolling

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
    
    // Update all cells. This ensures any dependent cells are updated.
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