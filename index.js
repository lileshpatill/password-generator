const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#numbers");
const symbolCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".genratorbutton");
const allCheckbox = document.querySelectorAll("input[type=checkbox]");
const symbol = "!~@#$%&()[]{}+><,./?=|/";

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();

// set password length
function handleSlider() {
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;
}

//set indicator

function setIndicator(color) {
  indicator.style.backgroundColor = color;
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
function generateRandomNumber() {
  return getRndInteger(0, 9);
}
generateRandomNumber();

function generateLowercase() {
  return String.fromCharCode(getRndInteger(97, 123));
}

function generateUpperrcase() {
  return String.fromCharCode(getRndInteger(65, 91));
}

function generateSymbols() {
  const randNum = getRndInteger(0, symbol.length);
  return symbol.charAt(randNum);
}
// password strength
function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNum = false;
  let hasSym = false;

  if (uppercaseCheck.checked) hasUpper = true;
  if (lowercaseCheck.checked) hasLower = true;
  if (numberCheck.checked) hasNum = true;
  if (symbolCheck.checked) hasSym = true;

  if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
    setIndicator("#0f0");
  } else if (
    (hasLower || hasUpper) &&
    (hasNum || hasSym) &&
    passwordLength >= 6
  ) {
    setIndicator("#ff0");
  } else {
    setIndicator("#f00");
  }
}

//copy content
async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = "copied";
  } catch (e) {
    copyMsg.innerText = "Failed";
  }
  copyMsg.classList.add("active");

  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 2000);
}

function handleCheckBoxchange() {
  checkCount = 0;
  allCheckbox.forEach((checkbox) => {
    if (checkbox.checked) checkCount++;
    if (passwordLength < checkCount) {
      passwordLength = checkCount;
      handleSlider();
    }
  });
}

allCheckbox.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckBoxchange);
});

function shufflePassword(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];

    array[i] = array[j];
    array[j] = temp;
  }
  let str = "";
  array.forEach((el) => (str += el));
  return str;
}

inputSlider.addEventListener("input", (e) => {
  passwordLength = e.target.value;
  handleSlider();
});

copyBtn.addEventListener("click", () => {
  if (passwordDisplay.value) copyContent();
});

generateBtn.addEventListener("click", () => {
  if (checkCount <= 0) return;

  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }

  // let find new password
  password = "";

  let funcArr = [];
  if (uppercaseCheck.checked) funcArr.push(generateUpperrcase);

  if (lowercaseCheck.checked) funcArr.push(generateLowercase);

  if (numberCheck.checked) funcArr.push(generateRandomNumber);

  if (symbolCheck.checked) funcArr.push(generateSymbols);

  for (let i = 0; i < funcArr.length; i++) {
    password += funcArr[i]();
  }

  for (let i = 0; i < passwordLength - funcArr.length; i++) {
    let randIndex = getRndInteger(0, funcArr.length);
    password += funcArr[randIndex]();
  }
  password = shufflePassword(Array.from(password));
  passwordDisplay.value = password;
  calcStrength();
});
