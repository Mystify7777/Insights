// Global variables as required by the tests
let price = 19.5;
let cid = [
    ["PENNY", 1.01],
    ["NICKEL", 2.05],
    ["DIME", 3.1],
    ["QUARTER", 4.25],
    ["ONE", 90],
    ["FIVE", 55],
    ["TEN", 20],
    ["TWENTY", 60],
    ["ONE HUNDRED", 100]
];

// Define currency units and their values in cents for precision
const currencyValues = {
    "PENNY": 1,
    "NICKEL": 5,
    "DIME": 10,
    "QUARTER": 25,
    "ONE": 100,
    "FIVE": 500,
    "TEN": 1000,
    "TWENTY": 2000,
    "ONE HUNDRED": 10000
};

// Get DOM elements with corrected IDs
const cashInput = document.getElementById('cash');
const purchaseBtn = document.getElementById('purchase-btn');
const changeDueDiv = document.getElementById('change-due');

/**
 * The main function to handle the cash register logic.
 */
const checkCashRegister = () => {
    // Convert all currency to cents to avoid floating point issues
    const priceInCents = Math.round(price * 100);
    const cashInCents = Math.round(parseFloat(cashInput.value) * 100);

    // Check if cash provided is valid
    if (isNaN(cashInCents)) {
        changeDueDiv.textContent = "Please enter a valid amount.";
        return;
    }

    // Case 1: Insufficient payment
    if (cashInCents < priceInCents) {
        alert("Customer does not have enough money to purchase the item");
        return;
    }

    // Case 2: Exact cash provided
    if (cashInCents === priceInCents) {
        changeDueDiv.textContent = "No change due - customer paid with exact cash";
        return;
    }

    let changeDueInCents = cashInCents - priceInCents;
    
    // Create a copy of the cash-in-drawer in cents
    const cidInCents = cid.map(([name, amount]) => [name, Math.round(amount * 100)]);
    let totalCIDInCents = cidInCents.reduce((sum, [, amount]) => sum + amount, 0);

    // Case 3: Total cash in drawer is less than change due
    if (totalCIDInCents < changeDueInCents) {
        changeDueDiv.textContent = "Status: INSUFFICIENT_FUNDS";
        return;
    }

    // Case 4: Total cash in drawer equals change due
    if (totalCIDInCents === changeDueInCents) {
        // Build the output string, filtering out any denominations that are empty in the drawer.
        const changeArr = cid
            .filter(([, amount]) => amount > 0)
            .reverse() // Sort from highest to lowest
            .map(([name, amount]) => `${name}: $${amount.toFixed(2)}`)
            .join(" ");
        changeDueDiv.textContent = `Status: CLOSED ${changeArr}`;
        return;
    }
    
    // Case 5: Calculate change to give from largest to smallest denomination
    let changeToGive = [];
    const cidReversedInCents = [...cidInCents].reverse();

    for (let [name, availableAmountInCents] of cidReversedInCents) {
        const unitValueInCents = currencyValues[name];
        let amountToReturnInCents = 0;

        // While we still owe change and have bills/coins of the current denomination
        while (changeDueInCents >= unitValueInCents && availableAmountInCents > 0) {
            changeDueInCents -= unitValueInCents;
            availableAmountInCents -= unitValueInCents;
            amountToReturnInCents += unitValueInCents;
        }

        if (amountToReturnInCents > 0) {
            // Add the denomination to our change array, converting back to dollars for display
            changeToGive.push(`${name}: $${amountToReturnInCents / 100}`);
        }
    }

    // If changeDueInCents is still greater than 0, we couldn't make exact change
    if (changeDueInCents > 0) {
        changeDueDiv.textContent = "Status: INSUFFICIENT_FUNDS";
    } else {
        changeDueDiv.textContent = `Status: OPEN ${changeToGive.join(" ")}`;
    }
};

// Event listener for the purchase button
purchaseBtn.addEventListener('click', checkCashRegister);
