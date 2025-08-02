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

const applyFunction = (str) => {
  const noHigh = highPrecedence(str);
  const infix = /([\d.]+)([+-])([\d.]+)/;
  const str2 = infixEval(noHigh, infix);
  const functionCall = /([a-z0-9]*)\(([0-9., ]*)\)(?!.*\()/i;
  const toNumberList = (args) => args.split(",").map(parseFloat);
  const apply = (fn, args) =>
    spreadsheetFunctions[fn.toLowerCase()](toNumberList(args));
  return str2.replace(functionCall, (match, fn, args) =>
    spreadsheetFunctions.hasOwnProperty(fn.toLowerCase())
      ? apply(fn, args)
      : match
  );
};

const range = (start, end) =>
  Array(end - start + 1)
    .fill(start)
    .map((element, index) => element + index);
const charRange = (start, end) =>
  range(start.charCodeAt(0), end.charCodeAt(0)).map((code) =>
    String.fromCharCode(code)
  );

const evalFormula = (x, cells) => {
  const idToText = (id) => cells.find((cell) => cell.id === id).value;
  const rangeRegex = /([A-J])([1-9][0-9]?):([A-J])([1-9][0-9]?)/gi;
  const rangeFromString = (num1, num2) => range(parseInt(num1), parseInt(num2));
  const elemValue = (num) => (character) => idToText(character + num);
  const addCharacters = (character1) => (character2) => (num) =>
    charRange(character1, character2).map(elemValue(num));
  const rangeExpanded = x.replace(
    rangeRegex,
    (_match, char1, num1, char2, num2) =>
      rangeFromString(num1, num2).map(addCharacters(char1)(char2))
  );
  const cellRegex = /[A-J][1-9][0-9]?/gi;
  const cellExpanded = rangeExpanded.replace(cellRegex, (match) =>
    idToText(match.toUpperCase())
  );
  const functionExpanded = applyFunction(cellExpanded);
  return functionExpanded === x
    ? functionExpanded
    : evalFormula(functionExpanded, cells);
};

window.onload = () => {
  const container = document.getElementById("container");
  const formulaBar = document.getElementById("formula-bar");
  const selectedCellLabel = document.getElementById("selected-cell-label");

  // A more modular way to create the grid
  const createGrid = () => {
    // Create header row
    const headerRow = document.createElement("div");
    // Add empty top-left cell
    const emptyLabel = document.createElement("div");
    container.appendChild(emptyLabel);
    
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
        // Raw formula/value will be stored here
        input.dataset.formula = ""; 
        input.ariaLabel = letter + i;
        container.appendChild(input);
      });
    }
  };

  createGrid();

  let selectedCell; // Variable to keep track of the selected cell

  // Event delegation for cell interactions
  container.addEventListener("click", (event) => {
    const target = event.target;
    if (target.tagName === "INPUT") {
      // Remove previous selection
      if (selectedCell) {
        selectedCell.classList.remove("selected");
      }
      // Set new selection
      selectedCell = target;
      selectedCell.classList.add("selected");
      
      // Update formula bar
      selectedCellLabel.textContent = selectedCell.id;
      formulaBar.value = selectedCell.dataset.formula || selectedCell.value;
      formulaBar.focus();
    }
  });

  // Update cell value when formula bar changes
  formulaBar.addEventListener("input", () => {
    if (selectedCell) {
      selectedCell.dataset.formula = formulaBar.value;
    }
  });
  
  // Process the formula on blur from the formula bar or pressing Enter
  const processFormula = () => {
      if (!selectedCell) return;
      
      const rawValue = selectedCell.dataset.formula;
      if (rawValue.startsWith('=')) {
          selectedCell.value = evalFormula(
              rawValue.slice(1),
              Array.from(document.querySelectorAll("#container input"))
          );
      } else {
          selectedCell.value = rawValue;
      }
  };

  formulaBar.addEventListener("blur", processFormula);
  formulaBar.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
          processFormula();
          selectedCell.focus(); // Move focus back to the cell
      }
  });
};