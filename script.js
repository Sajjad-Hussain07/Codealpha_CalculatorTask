document.addEventListener("DOMContentLoaded", () => {
    const prevDisplay = document.getElementById("prev-display");
    const currDisplay = document.getElementById("curr-display");
    const buttons = document.querySelectorAll(".btn");

    let currentInput = "";
    let previousInput = "";
    let activeOperator = null;

    // --- 1. CORE FUNCTIONS ---
    
    function updateDisplay() {
        currDisplay.innerText = currentInput === "" ? "0" : formatDisplayNumber(currentInput);
        if (activeOperator != null) {
            prevDisplay.innerText = `${formatDisplayNumber(previousInput)} ${getOperatorSymbol(activeOperator)}`;
        } else {
            prevDisplay.innerText = "";
        }
    }

    function formatDisplayNumber(number) {
        if (number === "-") return "-";
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
        }
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    function getOperatorSymbol(op) {
        if (op === '/') return '÷';
        if (op === '*') return '×';
        if (op === '-') return '−';
        return op;
    }

    function appendNumber(num) {
        if (num === "." && currentInput.includes(".")) return;
        if (currentInput.length >= 12) return; // Prevent text overflow
        currentInput = currentInput.toString() + num.toString();
    }

    function chooseOperator(op) {
        if (currentInput === "" && previousInput === "") {
            if (op === "-") { // Allow negative number start
                currentInput = "-";
                updateDisplay();
            }
            return;
        }
        if (currentInput === "-") return;
        if (currentInput === "") {
            activeOperator = op;
            updateDisplay();
            return;
        }
        if (previousInput !== "") {
            compute();
        }
        activeOperator = op;
        previousInput = currentInput;
        currentInput = "";
    }

    function compute() {
        let computation;
        const prev = parseFloat(previousInput);
        const current = parseFloat(currentInput);
        if (isNaN(prev) || isNaN(current)) return;

        switch (activeOperator) {
            case "+": computation = prev + current; break;
            case "-": computation = prev - current; break;
            case "*": computation = prev * current; break;
            case "/": 
                if (current === 0) {
                    alert("Cannot divide by zero!");
                    clearAll();
                    return;
                }
                computation = prev / current; 
                break;
            case "%": computation = (prev / 100) * current; break;
            default: return;
        }

        // Float precise handling (e.g. 0.1 + 0.2)
        currentInput = parseFloat(computation.toFixed(8)).toString();
        activeOperator = null;
        previousInput = "";
    }

    function clearAll() {
        currentInput = "";
        previousInput = "";
        activeOperator = null;
    }

    function deleteDigit() {
        currentInput = currentInput.toString().slice(0, -1);
    }

    // --- 2. CLICK EVENT HANDLERS ---
    buttons.forEach(button => {
        button.addEventListener("click", () => {
            if (button.classList.contains("number-btn") || button.innerText === ".") {
                appendNumber(button.innerText);
            } else if (button.classList.contains("operator-btn")) {
                chooseOperator(button.getAttribute("data-operator"));
            } else if (button.id === "equals") {
                compute();
            } else {
                const action = button.getAttribute("data-action");
                if (action === "clear") clearAll();
                if (action === "delete") deleteDigit();
            }
            updateDisplay();
        });
    });

    // --- 3. KEYBOARD SUPPORT BONUS ---
    document.addEventListener("keydown", (e) => {
        if ((e.key >= "0" && e.key <= "9") || e.key === ".") appendNumber(e.key);
        if (e.key === "+" || e.key === "-" || e.key === "*" || e.key === "/" || e.key === "%") chooseOperator(e.key);
        if (e.key === "Enter" || e.key === "=") { e.preventDefault(); compute(); }
        if (e.key === "Backspace") deleteDigit();
        if (e.key === "Escape") clearAll();
        updateDisplay();
    });
});