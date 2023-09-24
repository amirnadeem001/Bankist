'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
// Bankist Application
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

let displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = ''; // To clear the html code from the container

  let movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    let type = mov > 0 ? 'deposit' : 'withdrawal';

    let html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i} ${type}</div>
          <div class="movements__value">${mov}$</div>
        </div>
      `;
    containerMovements.insertAdjacentHTML('afterbegin', html); //Add the above funtion from down to up
  });
};
// sort the movements
let sorted = false;
btnSort.addEventListener('click', e => {
  e.preventDefault();
  displayMovements(movements, !sorted);
  sorted = !sorted;
});

// calculate Balance

let calculateBlance = acc => {
  acc.balance = acc.movements.reduce((accu, mov) => accu + mov, 0);
  labelBalance.textContent = `${acc.balance.toFixed(2)}$`;
};

// Calculate the Summary(incoming & outcoming)

const calcSummary = acc => {
  let inPayment = acc.movements
    .filter(mov => mov > 0)
    .reduce((premov, currmov) => premov + currmov, 0);
  labelSumIn.textContent = `${inPayment.toFixed(2)}$`;

  let outPayment = acc.movements
    .filter(mov => mov < 0)
    .reduce((premov, currmov) => premov + currmov, 0);
  labelSumOut.textContent = `${outPayment.toFixed(2)}$`;

  let interest = acc.movements
    .filter(mov => mov > 0)
    .map(dep => (dep * `${acc.interestRate}`) / 100)
    .reduce((accu, int) => accu + int, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}$`;
};

// create usernames for each account
let createUsernames = account => {
  account.map(acc => {
    // let name = ;
    let userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(word => word[0])
      .join('');
    acc.username = userName;
  });
};
createUsernames(accounts);

let updateUI = acc => {
  calcSummary(acc);

  calculateBlance(acc);
  displayMovements(acc.movements);
};

// Login Implementing
let curruntAccount;
btnLogin.addEventListener('click', e => {
  e.preventDefault(); //prevent from reload when click
  // update the UI

  // Find the Account object using username
  curruntAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  if (curruntAccount?.pin === Number(inputLoginPin.value)) {
    containerApp.classList.remove('app-hide');
    labelWelcome.textContent = `Welcome Back, ${
      curruntAccount.owner.split(' ')[0]
    }`;

    // Update UI
    updateUI(curruntAccount);

    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
  }
});

// Transfer Amount

btnTransfer.addEventListener('click', e => {
  e.preventDefault(); // prevent form refresh
  let amount = Number(inputTransferAmount.value);
  let recieverAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  // deduct from current account
  curruntAccount.movements.push(-amount);
  recieverAccount.movements.push(amount);

  // updateUI
  updateUI(curruntAccount);

  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur();

  // Add to reciver Account
});

// Close the acccount

btnClose.addEventListener('click', e => {
  e.preventDefault();

  const index = accounts.findIndex(
    acc => inputCloseUsername.value === curruntAccount.username
  );
  accounts.splice(index, 1);
  if (
    inputCloseUsername.value === curruntAccount.username &&
    Number(inputClosePin.value) === curruntAccount.pin
  ) {
    containerApp.classList.add('app-hide');
    labelWelcome.textContent = `Log in to get started

`;
  }
});

// Enter Loan Amount

btnLoan.addEventListener('click', e => {
  e.preventDefault();
  let amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && curruntAccount.movements.some(mov => mov >= amount * 0.1)) {
    curruntAccount.movements.push(amount);
    updateUI(curruntAccount);
  }
  inputLoanAmount.value = '';
  inputLoanAmount.blur();
});

//////////////////////////////////////////////////////////////

// Dogs Cheaking Challenge

let juliaDogs = [3, 5, 2, 12, 7];
let kateDogs = [5, 1, 15, 8, 3];

let cheakDogs = (juliaDogs, kateDogs) => {
  let juliaDogsCopy = juliaDogs.slice();
  juliaDogsCopy.splice(0, 1);
  juliaDogsCopy.splice(-2);

  let kateDogsCopy = kateDogs.slice();
  kateDogsCopy.splice(0, 1);
  kateDogsCopy.splice(-2);

  let dogs = kateDogsCopy.concat(juliaDogsCopy);

  let printResult = (juliaDogsCopy, kateDogsCopy) => {
    dogs.forEach(function (age, i) {
      let agecheak =
        age >= 3
          ? `Dog number ${i + 1} is an Adult and is ${age} years old`
          : `Dog number ${i + 1} is still puppy`;
    });
  };
  printResult(juliaDogsCopy, kateDogsCopy);
};
cheakDogs(juliaDogs, kateDogs);
