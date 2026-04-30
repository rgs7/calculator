function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    if (b === 0) {
        return "Error";
    }
    return a / b;
}

function operate(operator, num1, num2) {
    switch (operator) {
        case "+":
            return add(num1, num2);
        case "-":
            return subtract(num1, num2);
        case "*":
            return multiply(num1, num2);
        case "/":
            return divide(num1, num2);
        default:
            return "Error";
    }
}

const display = document.querySelector("#display");
const digitButtons = document.querySelectorAll("[data-digit]");
const operatorButtons = document.querySelectorAll("[data-operator]");
const decimalButton = document.querySelector("[data-decimal]");
const equalsButton = document.querySelector("#equals");
const clearButton = document.querySelector("#clear");
const backspaceButton = document.querySelector("#backspace");

let currentValue = "0";
let firstValue = null;
let currentOperator = null;
let waitingForSecondValue = false;

function updateDisplay(value) {
    display.textContent = String(value).slice(0, 12);
}

function clearCalculator() {
    currentValue = "0";
    firstValue = null;
    currentOperator = null;
    waitingForSecondValue = false;
    updateDisplay(currentValue);
}

function inputDigit(digit) {
    if (waitingForSecondValue) {
        currentValue = digit;
        waitingForSecondValue = false;
    } else {
        currentValue = currentValue === "0" ? digit : currentValue + digit;
    }
    updateDisplay(currentValue);
}

function inputDecimal() {
    if (waitingForSecondValue) {
        currentValue = "0.";
        waitingForSecondValue = false;
        updateDisplay(currentValue);
        return;
    }

    if (currentValue.includes(".")) {
        return;
    }

    currentValue += ".";
    updateDisplay(currentValue);
}

function inputOperator(nextOperator) {
    const inputValue = Number(currentValue);

    if (firstValue === null) {
        firstValue = inputValue;
    } else if (currentOperator && !waitingForSecondValue) {
        const result = operate(currentOperator, firstValue, inputValue);
        if (result === "Error") {
            clearCalculator();
            updateDisplay("Error");
            return;
        }
        firstValue = result;
        currentValue = String(result);
        updateDisplay(currentValue);
    }

    currentOperator = nextOperator;
    waitingForSecondValue = true;
}

function calculateResult() {
    if (currentOperator === null || waitingForSecondValue) {
        return;
    }

    const secondValue = Number(currentValue);
    const result = operate(currentOperator, firstValue, secondValue);
    if (result === "Error") {
        clearCalculator();
        updateDisplay("Error");
        return;
    }

    currentValue = String(result);
    firstValue = result;
    currentOperator = null;
    waitingForSecondValue = true;
    updateDisplay(currentValue);
}

function backspaceInput() {
    if (display.textContent === "Error") {
        clearCalculator();
        return;
    }

    if (waitingForSecondValue && currentOperator) {
        currentOperator = null;
        waitingForSecondValue = false;
        updateDisplay(currentValue);
        return;
    }

    if (waitingForSecondValue) {
        waitingForSecondValue = false;
    }

    if (currentValue.length <= 1) {
        currentValue = "0";
    } else {
        currentValue = currentValue.slice(0, -1);
        if (currentValue === "-" || currentValue === "") {
            currentValue = "0";
        }
    }

    if (firstValue !== null && currentOperator === null) {
        firstValue = Number(currentValue);
    }

    updateDisplay(currentValue);
}

digitButtons.forEach((button) => {
    button.addEventListener("click", () => {
        inputDigit(button.dataset.digit);
    });
});

operatorButtons.forEach((button) => {
    button.addEventListener("click", () => {
        inputOperator(button.dataset.operator);
    });
});

decimalButton.addEventListener("click", inputDecimal);
equalsButton.addEventListener("click", calculateResult);
clearButton.addEventListener("click", clearCalculator);
backspaceButton.addEventListener("click", backspaceInput);

document.addEventListener("keydown", (event) => {
    const { key } = event;

    if (/\d/.test(key)) {
        inputDigit(key);
        return;
    }

    if (["+", "-", "*", "/"].includes(key)) {
        inputOperator(key);
        return;
    }

    if (key === ".") {
        inputDecimal();
        return;
    }

    if (key === "Enter" || key === "=") {
        event.preventDefault();
        calculateResult();
        return;
    }

    if (key === "Backspace") {
        event.preventDefault();
        backspaceInput();
        return;
    }

    if (key === "Escape") {
        clearCalculator();
    }
});

updateDisplay(currentValue);
