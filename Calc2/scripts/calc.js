let flag = 0;

function isNumber(char) {
  return /^\d$/.test(char);
}

document.getElementById("answer").readOnly = true;
let screen = document.getElementById("answer");
buttons = document.querySelectorAll("button");
let screenValue = "";
let lastScreenValue = "";
let maxItems = 6;
let isSign = true;

for (item of buttons) {
  item.addEventListener("click", (e) => {
    buttonText = e.target.innerText;
    if (buttonText == "X" && !isSign) {
      if (flag == 1) {
        flag = 0;
      }
      buttonText = "*";
      isSign = true;
      screenValue += buttonText;
      screen.value = screenValue;
    } else if (buttonText == "C") {
      if (flag == 1) {
        flag = 0;
      }
      screenValue = "";
      screen.value = screenValue;
      screen.classList.remove("negative"); 
      isSign = true;
    } else if (buttonText == "=") {
      checkForBracketMulti();
      if (parseFloat(screen.value) < 0) {
        screen.classList.add("negative");
      } else {
        screen.classList.remove("negative");
      }
    } else if (buttonText == "(" || buttonText == ")") {
      if (flag == 1) {
        flag = 0;
      }
      screenValue += buttonText;
      screen.value = screenValue;
    } else if (isNumber(buttonText)) {
      if (flag == 1) {
        screenValue = buttonText;
        flag = 0;
      } else {
        screenValue += buttonText;
      }
      screen.value = screenValue;
      isSign = false;
      screen.classList.remove("negative"); 
    } else {
      if (flag == 1) {
        flag = 0;
      }
      if (!isSign) {
        screenValue += buttonText;
        screen.value = screenValue;
        isSign = true;
      }
      screen.classList.remove("negative");
    }
  });
}

document.addEventListener("keydown", function (event) {
  const key = event.key;

  // Handle numeric keys
  if (isNumber(key)) {
    const button = Array.from(buttons).find(btn => btn.innerText === key);
    button?.click();
  }

  // Handle operator keys (fix for minus operator)
  if (key === '+' || key === '-' || key === '*' || key === '/') {
    const button = Array.from(buttons).find(btn => btn.innerText === (key === '*' ? 'X' : key));
    if (key === '-' && isSign) {
      // Prevent adding a minus if the last input is also an operator
      return;
    }
    button?.click();
  }

  // Handle Enter key
  if (key === 'Enter' || key === '=') {
    const button = Array.from(buttons).find(btn => btn.innerText === '=');
    button?.click();
  }

  // Handle clear key
  if (key === 'c' || key === 'C' || key === 'Delete' || key === 'Backspace') {
    const button = Array.from(buttons).find(btn => btn.innerText === 'C');
    button?.click();
  }

  // Handle parentheses
  if (key === '(' || key === ')') {
    const button = Array.from(buttons).find(btn => btn.innerText === key);
    button?.click();
  }

  // Handle multiplication (X) specifically
  if (key === 'x' || key === 'X') {
    const button = Array.from(buttons).find(btn => btn.innerText === 'X');
    button?.click();
  }
});

window.onerror = function () {
  alert("PLEASE INPUT VALID EXPRESSION");
  screenValue = "";
  screen.value = screenValue;
  screen.classList.remove("negative"); 
  console.clear();
};

function checkForBracketMulti() {
  try {
    if (screenValue !== '') {
      const result = eval(screenValue);
      screen.value = result;

      const historyEntry = {
        lastScreenValue: screenValue,
        result: result
      };

      let calcHistory = JSON.parse(localStorage.getItem("calcHistory")) || [];
      calcHistory.push(historyEntry); 

      localStorage.setItem("calcHistory", JSON.stringify(calcHistory));

      lastScreenValue = screenValue;
      screenValue = result.toString(); 

      if (result < 0) {
        screen.classList.add("negative");
      } else {
        screen.classList.remove("negative");
      }
    }
    flag = 1; 
  } catch (error) {
    alert("Please input a valid expression.");
  }
}
