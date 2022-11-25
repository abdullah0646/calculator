class Calculator {
  constructor(
    previousOperandTextValue,
    currentOperandTextValue,
    previousRecordTextValue
  ) {
    this.previousOperandTextValue = previousOperandTextValue;
    this.currentOperandTextValue = currentOperandTextValue;
    this.previousRecordTextValue = previousRecordTextValue;
    this.clear();
    this.clearPreviousRecord();
  }

  clear() {
    this.previousRecord = "";
    this.previousOperand = "";
    this.currentOperand = "";
    this.currentValue = "";
    this.singleOperationCalculation = "";
    this.calculation = "";
    this.operation = undefined;
    this.clickEqualButton = false;
    this.clickPercentageButton = false;
    this.lastBeforePercentageValue = "";
    this.lastOperation = undefined;
  }

  clearPreviousRecord() {
    this.previousRecord = "";
  }

  isNewInputs() {
    if (this.singleOperationCalculation != "") {
      this.clear();
    }
    if (this.calculation != "") {
      this.clear();
    }
  }

  getDigitsCountAfterDecimalPoint(value) {
    let getString = value.toString(),
      index = getString.indexOf(".") + 1;
    return index && getString.length - index;
  }

  appendNumber(number) {
    if (
      this.currentOperand.toString().includes(".") &&
      this.getDigitsCountAfterDecimalPoint(this.currentOperand) > 9
    ) {
      alert("After decimal point only ten digits are avaliable");
      return;
    }
    if (this.currentOperand.toString().length > 14) {
      alert("You cannot Enter more than 15 disgits");
      return;
    }
    if (number === "." && this.currentOperand.toString().includes(".")) {
      return;
    }
    this.currentOperand = this.currentOperand.toString() + number.toString();
    if (this.operation != undefined) {
      this.currentValue = this.currentValue.toString() + number.toString();
    }
  }

  previousRecordHistory(prev, operation, current) {
    if (this.previousRecord != "") {
      this.previousRecord =
        this.previousRecord.toString() + " => " + prev + operation + current;
    } else {
      this.previousRecord =
        this.previousRecord.toString() + prev + operation + current;
    }
  }

  delete() {
    if (this.currentOperand === "") {
      return;
    }
    if (this.clickEqualButton === true) {
      if (this.lastOperation === "-" || this.lastOperation === "÷") {
        let temp = this.previousOperand;
        this.previousOperand = this.currentOperand;
        this.currentOperand = temp;
      }
      this.operation = undefined;
      this.previousOperand = "";
      this.clickEqualButton = false;
    }
    if (this.clickPercentageButton == true) {
      this.clickPercentageButton = false;
      this.currentOperand = this.lastBeforePercentageValue;
      this.lastBeforePercentageValue = "";
    } else {
      this.currentOperand = this.currentOperand.toString().slice(0, -1);
    }
  }

  setStates(operation, previousValue, currentvalue) {
    this.operation = operation;
    this.previousOperand = previousValue;
    this.previousOperand = this.floatNumberAvailDecimalPoints(
      this.previousOperand
    );
    this.currentOperand = currentvalue;
    this.currentOperand = this.floatNumberAvailDecimalPoints(
      this.currentOperand
    );
  }

  setSingleOperationStates(operation, previousValue, currentvalue) {
    this.operation = operation;
    this.previousOperand = previousValue;
    this.currentOperand = currentvalue;
  }

  setDisplayText(current, prev, record) {
    this.previousRecordTextValue.innerText = record;
    this.currentOperandTextValue.innerText = current;
    this.previousOperandTextValue.innerText = prev;
  }

  selectOperation(operation) {
    if (this.currentOperand === "" && this.operation != operation) {
      this.operation = operation;
      return;
    }
    if (this.clickEqualButton === true) {
      if (this.lastOperation === "-" || this.lastOperation === "÷") {
        let temp = this.previousOperand;
        this.previousOperand = this.currentOperand;
        this.currentOperand = temp;
      }
      this.previousOperand = "";
      this.clickEqualButton = false;
    }
    if (this.singleOperationCalculation != "") {
      this.singleOperationCalculation = "";
    }
    if (this.calculation != "") {
      this.calculation = "";
    }
    if (this.currentValue != "") {
      this.currentValue = "";
    }
    if (this.currentOperand === "") {
      return;
    }
    if (this.previousOperand != "") {
      this.computeResult();
    }
    this.setStates(operation, this.currentOperand, "");
  }

  setSingleOperationCalculation(value) {
    this.singleOperationCalculation = value;
  }

  setCalculation(value) {
    this.calculation = value;
  }

  calculationProcess(prev, operation, current) {
    let computation = "";
    switch (operation) {
      case "+":
        computation = prev + current;
        break;
      case "-":
        computation = prev - current;
        break;
      case "*":
        computation = prev * current;
        break;
      case "÷":
        computation = prev / current;
        break;
      default:
        break;
    }

    return this.floatNumberAvailDecimalPoints(computation);
  }

  computeResult() {
    let computation;
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);
    if (isNaN(prev) || isNaN(current)) {
      return;
    }
    computation = this.calculationProcess(prev, this.operation, current);
    if (computation === "") {
      return;
    }
    this.previousRecordHistory(prev, this.operation, current);
    this.setStates(undefined, "", computation);
  }

  calculatePercentage() {
    if (this.previousOperandTextValue.innerText === "") {
      this.previousOperand = "";
    }
    if (this.previousOperand != "") {
      let computation;
      const prev = parseFloat(this.previousOperand);
      const current = parseFloat(this.currentOperand);
      const percent = current / 100;
      const getPercent = percent * prev;
      if (isNaN(prev) || isNaN(current)) {
        return;
      }
      computation = this.calculationProcess(prev, this.operation, getPercent);
      if (computation === "") {
        return;
      }
      this.previousRecordHistory(prev, this.operation, getPercent);
      this.setCalculation(computation);
      this.setStates(undefined, "", computation);
    } else {
      if (this.currentOperand === "") {
        return "";
      }
      if (this.singleOperationCalculation != "") {
        return;
      }
      this.clickPercentageButton = true;
      this.lastBeforePercentageValue = this.currentOperand;
      this.setSingleOperationStates(undefined, "", this.currentOperand / 100);
      this.setSingleOperationCalculation(this.currentOperand);
    }
  }

  calculateSquare() {
    if (this.previousOperandTextValue.innerText === "") {
      this.previousOperand = "";
    }
    if (this.previousOperand != "") {
      let computation;
      const prev = parseFloat(this.previousOperand);
      const current = parseFloat(this.currentOperand);
      const square = this.currentOperand * this.currentOperand;

      if (isNaN(prev) || isNaN(current)) {
        return;
      }
      computation = this.calculationProcess(prev, this.operation, square);
      if (computation === "") {
        return;
      }
      this.previousRecordHistory(prev, this.operation, square);
      this.setCalculation(computation);
      this.setStates(undefined, "", computation);
    } else {
      if (this.currentOperand === "") {
        return "";
      }
      if (this.singleOperationCalculation != "") {
        return;
      }
      this.setSingleOperationStates(
        undefined,
        "",
        this.floatNumberAvailDecimalPoints(
          this.currentOperand * this.currentOperand
        )
      );
      this.setSingleOperationCalculation(this.currentOperand);
    }
  }

  calculateCube() {
    if (this.previousOperandTextValue.innerText === "") {
      this.previousOperand = "";
    }
    if (this.previousOperand != "") {
      let computation;
      const prev = parseFloat(this.previousOperand);
      const current = parseFloat(this.currentOperand);
      const cube =
        this.currentOperand * this.currentOperand * this.currentOperand;

      if (isNaN(prev) || isNaN(current)) {
        return;
      }

      computation = this.calculationProcess(prev, this.operation, cube);
      if (computation === "") {
        return;
      }
      this.previousRecordHistory(prev, this.operation, cube);
      this.setCalculation(computation);
      this.setStates(undefined, "", computation);
    } else {
      if (this.currentOperand === "") {
        return "";
      }
      if (this.singleOperationCalculation != "") {
        return;
      }
      this.setSingleOperationStates(
        undefined,
        "",
        this.floatNumberAvailDecimalPoints(
          this.currentOperand * this.currentOperand * this.currentOperand
        )
      );
      this.setSingleOperationCalculation(this.currentOperand);
    }
  }

  calculateSquareRoot() {
    if (this.previousOperandTextValue.innerText === "") {
      this.previousOperand = "";
    }
    if (this.previousOperand != "") {
      let computation;
      const prev = parseFloat(this.previousOperand);
      const current = parseFloat(this.currentOperand);
      const squareRoot = Math.sqrt(this.currentOperand);
      if (isNaN(prev) || isNaN(current)) {
        return;
      }

      computation = this.calculationProcess(prev, this.operation, squareRoot);
      if (computation === "") {
        return;
      }
      this.previousRecordHistory(prev, this.operation, squareRoot);
      this.setCalculation(computation);
      this.setStates(undefined, "", computation);
    } else {
      if (this.currentOperand === "") {
        return "";
      }
      if (this.singleOperationCalculation != "") {
        return;
      }
      this.setSingleOperationStates(
        undefined,
        "",
        this.floatNumberAvailDecimalPoints(Math.sqrt(this.currentOperand))
      );
      this.setSingleOperationCalculation(this.currentOperand);
    }
  }

  getDisplayNumberInCommas(number) {
    const stringNumber = number.toString();
    const integerDigits = parseFloat(stringNumber.split(".")[0]);
    const decimalDigits = stringNumber.split(".")[1];
    let integerNumberDisplay;
    if (isNaN(integerDigits)) {
      integerNumberDisplay = "";
    } else {
      integerNumberDisplay = integerDigits.toLocaleString("en", {
        maximumFractionDigits: 0,
      });
    }
    if (decimalDigits != null) {
      return `${integerNumberDisplay}.${decimalDigits}`;
    } else {
      return integerNumberDisplay;
    }
  }

  updateDisplay() {
    if (this.operation != null) {
      if (
        this.previousOperand
          .toString()
          .charAt(this.previousOperand.length - 1) === "."
      ) {
        this.previousOperand = this.previousOperand.toString().slice(0, -1);
      }
      this.setDisplayText(
        this.getDisplayNumberInCommas(this.currentOperand),
        `${this.getDisplayNumberInCommas(this.previousOperand)} ${
          this.operation
        }`,
        this.previousRecord
      );
    } else {
      this.setDisplayText(
        this.getDisplayNumberInCommas(this.currentOperand),
        "",
        this.previousRecord
      );
    }
  }

  checkNumberIsFloat(value) {
    return Number(value) === value && value % 1 !== 0;
  }

  roundNumberIfFloat(value) {
    if (this.checkNumberIsFloat(value) === true) {
      value = value?.toFixed(10);
    }
    return value;
  }

  floatNumberAvailDecimalPoints(computation) {
    if (
      computation.toString().includes(".") &&
      this.getDigitsCountAfterDecimalPoint(computation) < 9
    ) {
      return computation;
    } else {
      return this.roundNumberIfFloat(computation);
    }
  }

  computeResultWithSamevalue() {
    this.clickEqualButton = true;
    let computation;
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);
    const lastInsertCurrent = parseFloat(this.currentValue);
    if (isNaN(prev) || isNaN(current)) {
      return;
    }
    computation = this.calculationProcess(prev, this.operation, current);
    if (computation === "") {
      return;
    }
    this.setCalculation(computation);
    this.lastOperation = this.operation;
    if (this.operation === "-" || this.operation === "÷") {
      this.previousOperand = computation;
      this.previousOperand = this.floatNumberAvailDecimalPoints(
        this.previousOperand
      );
      this.currentOperand = lastInsertCurrent;
      this.currentOperand = this.floatNumberAvailDecimalPoints(
        this.currentOperand
      );
      this.previousRecordHistory(prev, this.operation, current);
    } else {
      this.previousOperand = lastInsertCurrent;
      this.previousOperand = this.floatNumberAvailDecimalPoints(
        this.previousOperand
      );
      this.currentOperand = computation;
      this.currentOperand = this.floatNumberAvailDecimalPoints(
        this.currentOperand
      );

      if (this.previousRecord != "") {
        this.previousRecordHistory(current, this.operation, prev);
      } else {
        this.previousRecordHistory(prev, this.operation, current);
      }
    }
  }

  updateDisplayWithSamevalue() {
    if (this.currentOperand === "") {
      this.updateDisplay();
    } else {
      if (this.operation === "-" || this.operation === "÷") {
        this.setDisplayText(
          this.getDisplayNumberInCommas(this.previousOperand),
          "",
          this.previousRecord
        );
      } else {
        this.setDisplayText(
          this.getDisplayNumberInCommas(this.currentOperand),
          "",
          this.previousRecord
        );
      }
    }
  }
}

//Accessing html in javascript
const previousRecordTextValue = document.querySelector(
  "[data-previous-record]"
);
const numberButtons = document.querySelectorAll("[data-number]");
const operationButtons = document.querySelectorAll("[data-operation]");
const equalButtons = document.querySelector("[data-equals]");
const deleteButtons = document.querySelector("[data-delete]");
const clearButtons = document.querySelector("[data-all-clear]");
const previousOperandTextValue = document.querySelector(
  "[data-previous-operand]"
);
const currentOperandTextValue = document.querySelector(
  "[data-current-operand]"
);
const percentageButton = document.querySelector("[data-percentage]");
const squareButton = document.querySelector("[data-square]");
const cubeButton = document.querySelector("[data-cube]");
const squareRootButton = document.querySelector("[data-squareRoot]");

const calculator = new Calculator(
  previousOperandTextValue,
  currentOperandTextValue,
  previousRecordTextValue
);

//for number input
numberButtons.forEach((button) => {
  button.addEventListener("click", () => {
    calculator.isNewInputs();
    calculator.appendNumber(button.innerText);
    calculator.updateDisplay();
  });
});

//for operations
operationButtons.forEach((button) => {
  button.addEventListener("click", () => {
    calculator.selectOperation(button.innerText);
    calculator.updateDisplay();
  });
});

// for equal button
// equalButtons.addEventListener('click',()=>{
//   calculator.computeResult()
//   calculator.updateDisplay()
// })

equalButtons.addEventListener("click", () => {
  calculator.computeResultWithSamevalue();
  calculator.updateDisplayWithSamevalue();
});

// for clear button
clearButtons.addEventListener("click", () => {
  calculator.clearPreviousRecord();
  calculator.clear();
  calculator.updateDisplay();
});

// for delete button
deleteButtons.addEventListener("click", () => {
  calculator.delete();
  calculator.updateDisplay();
});

//  percentageButton
percentageButton.addEventListener("click", () => {
  calculator.calculatePercentage();
  calculator.updateDisplay();
});

// square
squareButton.addEventListener("click", () => {
  calculator.calculateSquare();
  calculator.updateDisplay();
});

// cubeButton
cubeButton.addEventListener("click", () => {
  calculator.calculateCube();
  calculator.updateDisplay();
});

//sqrt
squareRootButton.addEventListener("click", () => {
  calculator.calculateSquareRoot();
  calculator.updateDisplay();
});
