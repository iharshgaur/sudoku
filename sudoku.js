document.getElementById("solve").addEventListener("click", generateSolution);
document.getElementById("add").addEventListener("click", addSudoku);
document.getElementById("generate").addEventListener("click", generateBoard);
document.getElementById("clear").addEventListener("click", clear);
document.getElementById("validate").addEventListener("click", validate);

let a = [];
let toFill = [];
let useranswer = [];
//functions required to solve the sudoku

function checkSquare(x, y, e) {
  let r = Math.floor(x / 3) * 3;
  let c = Math.floor(y / 3) * 3;

  for (let i = r; i < r + 3; i++) {
    for (let j = c; j < c + 3; j++) {
      if (a[i][j] === e) {
        return false;
      }
    }
  }

  for (let j = 0; j < 9; j++) {
    if (a[x][j] === e) {
      return false;
    }
  }
  for (let i = 0; i < 9; i++) {
    if (a[i][y] === e) {
      return false;
    }
  }

  return true;
}

function solve(curr) {
  if (curr === toFill.length) {
    return true;
  } else {
    let i = toFill[curr][0];
    let j = toFill[curr][1];

    for (let choice = 1; choice < 10; choice++) {
      if (checkSquare(i, j, choice)) {
        a[i][j] = choice;

        let possible = solve(curr + 1);

        if (possible) {
          return true;
        }

        a[i][j] = 0;
      }
    }
    return false;
  }
}

// functions handling the frontend

function generateSolution() {
  let board = document.getElementById("board").value;

  if (board === "") {
    return;
  }
  document.getElementById("solve").disabled = true;
  document.getElementById("add").disabled = true;
  document.getElementById("validate").disabled = true;
  document.getElementById("generate").disabled = true;
  a = [];
  toFill = [];

  board = board.trim().split("\n");

  for (let i = 0; i < board.length; i++) {
    a.push(board[i].trim().split(" ").map(Number));
  }

  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < a.length; j++) {
      if (a[i][j] === 0) {
        toFill.push([i, j]);
      }
    }
  }

  let possible = solve(0);

  if (possible) {
    let temp = ``;

    for (let i = 0; i < a.length; i++) {
      temp += `<tr>`;
      for (let j = 0; j < a[i].length; j++) {
        temp += ` <td> <input id="${
          i * 10 + j < 10 ? `0${j}` : i * 10 + j
        }" type="text" min="1" max="9" maxlength="1" value="${
          a[i][j]
        }" disabled/></td>`;
      }
      temp += `</tr>`;
    }
    document.getElementById("sudoku").innerHTML = temp;
  } else {
    window.alert("No solution possible");
  }
}

function addSudoku() {
  let board = document.getElementById("board").value;

  if (board === "") {
    return;
  }
  document.getElementById("add").disabled = true;
  document.getElementById("generate").disabled = true;

  board = board.trim().split("\n");

  for (let i = 0; i < board.length; i++) {
    a.push(board[i].trim().split(" ").map(Number));
  }

  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < a.length; j++) {
      if (a[i][j] === 0) {
        toFill.push([i, j]);
      }
    }
  }

  let temp = ``;

  for (let i = 0; i < a.length; i++) {
    temp += `<tr>`;
    for (let j = 0; j < a[i].length; j++) {
      temp += ` <td> ${
        a[i][j] === 0
          ? `<input id="${
              i * 10 + j < 10 ? `0${j}` : i * 10 + j
            }" type="text" min="1" max="9" maxlength="1" />`
          : `<input id="${
              i * 10 + j < 10 ? `0${j}` : i * 10 + j
            }" type="text" min="1" max="9" maxlength="1" value="${
              a[i][j]
            }" disabled/>`
      }</td>`;
    }
    temp += `</tr>`;
  }
  document.getElementById("sudoku").innerHTML = temp;
}

function generateBoard() {
  document.getElementById("solve").disabled = false;
  document.getElementById("add").disabled = true;

  const url = "https://sugoku.herokuapp.com/board?difficulty=easy";
  const fetchPromise = fetch(url, { method: "GET" });

  fetchPromise
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let randomBoard = data.board;
      a = [];
      toFill = [];
      let temp = ``;

      for (let i = 0; i < 9; i++) {
        temp += `<tr>`;
        for (let j = 0; j < 9; j++) {
          temp += ` <td> ${`<input id="${
            i * 10 + j < 10 ? `0${j}` : i * 10 + j
          }" type="text" min="1" max="9" maxlength="1"  />`}</td>`;
        }
        temp += `</tr>`;
      }
      document.getElementById("sudoku").innerHTML = temp;

      temp = ``;

      for (let i = 0; i < randomBoard.length; i++) {
        temp += `<tr>`;
        for (let j = 0; j < randomBoard[i].length; j++) {
          temp += ` <td> ${
            randomBoard[i][j] === 0
              ? `<input id="${
                  i * 10 + j < 10 ? `0${j}` : i * 10 + j
                }" type="text" min="1" max="9" maxlength="1"  />`
              : `<input id="${
                  i * 10 + j < 10 ? `0${j}` : i * 10 + j
                }" type="text" min="1" max="9" maxlength="1" value="${
                  randomBoard[i][j]
                }" disabled/>`
          }</td>`;
        }
        temp += `</tr>`;
      }
      document.getElementById("sudoku").innerHTML = temp;

      for (let i = 0; i < randomBoard.length; i++) {
        randomBoard[i] = randomBoard[i].join(" ");
      }
      document.getElementById("board").value = randomBoard.join("\n");
    })
    .catch("Error in getting the data");
}

function clear() {
  document.getElementById("add").disabled = false;
  document.getElementById("solve").disabled = false;
  document.getElementById("validate").disabled = false;
  document.getElementById("generate").disabled = false;
  let temp = ``;

  for (let i = 0; i < 9; i++) {
    temp += `<tr>`;
    for (let j = 0; j < 9; j++) {
      temp += ` <td> ${`<input id="${
        i * 10 + j < 10 ? `0${j}` : i * 10 + j
      }" type="text" min="1" max="9" maxlength="1"  />`}</td>`;
    }
    temp += `</tr>`;
  }
  document.getElementById("sudoku").innerHTML = temp;
  a = [];
  toFill = [];
  document.getElementById("board").value = "";
}

function validate() {
  let useranswer = new Array(9);
  for (let i = 0; i < 9; i++) {
    useranswer[i] = new Array(9).fill(0);
  }

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      let index = i * 10 + j < 10 ? `0${j}` : i * 10 + j;
      let value = document.getElementById(index).value;
      if (value === " ") value = 0;

      index = index.toString();
      useranswer[i][j] = +document.getElementById(index).value;
    }
  }

  console.log(useranswer);
  a = [];
  toFill = [];

  let board = document.getElementById("board").value;

  board = board.trim().split("\n");

  for (let i = 0; i < board.length; i++) {
    a.push(board[i].trim().split(" ").map(Number));
  }
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < a.length; j++) {
      if (a[i][j] === 0) {
        toFill.push([i, j]);
      }
    }
  }

  let possible = solve(0);

  if (possible) {
    for (let i = 0; i < a.length; i++) {
      a[i] = a[i].join(" ");
    }

    a = a.join("\n");

    for (let i = 0; i < useranswer.length; i++) {
      useranswer[i] = useranswer[i].join(" ");
    }

    useranswer = useranswer.join("\n");

    window.alert(a === useranswer ? "correct answer" : "wrong answer");
  } else {
    window.alert("No solution Possible");
  }
}
