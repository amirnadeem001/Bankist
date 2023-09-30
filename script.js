'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2,
  pin: 1111,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'GBP',
  locale: 'en-GB',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,

  movementsDates: [
    '2023-03-22T07:55:49.234Z',
    '2023-04-30T12:10:05.789Z',
    '2023-05-19T18:30:56.345Z',
    '2022-12-01T17:10:22.567Z',
    '2023-01-25T11:48:30.234Z',
    '2023-02-14T08:05:17.789Z',
    '2023-03-30T14:30:42.456Z',
    '2023-04-08T09:55:55.345Z',
  ],
  currency: 'JPY',
  locale: 'ja-JP',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,

  movementsDates: [
    '2023-03-22T07:55:49.234Z',
    '2023-04-30T12:10:05.789Z',
    '2023-05-19T18:30:56.345Z',
    '2023-06-07T12:33:40.678Z',
    '2023-07-25T09:50:55.234Z',
    '2023-08-14T14:15:18.456Z',
    '2023-09-20T17:22:30.345Z',
    '2023-10-03T08:38:49.987Z',
  ],
  currency: 'AUD',
  locale: 'en-AU',
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
// Bankist Application
/////////////////////////////////////////////////

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

let currFormat = (acc, num) => {
  return new Intl.NumberFormat(acc.locale, {
    style: 'currency',
    currency: acc.currency,
  }).format(num);
};

let displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = ''; // To clear the html code from the container

  let movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    let type = mov > 0 ? 'deposit' : 'withdrawal';

    let date = new Date(acc.movementsDates[i]);

    let html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i} ${type}</div>
          <div class="movements__date">${date.getDate()}/${date.getMonth()}/${date.getFullYear()}</div>
          <div class="movements__value">${currFormat(acc, mov)}</div>
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
  labelBalance.textContent = `${currFormat(acc, acc.balance)}`;
};

// Calculate the Summary(incoming & outcoming)

const calcSummary = acc => {
  let inPayment = acc.movements
    .filter(mov => mov > 0)
    .reduce((premov, currmov) => premov + currmov, 0);
  labelSumIn.textContent = `${currFormat(acc, inPayment)}`;

  let outPayment = acc.movements
    .filter(mov => mov < 0)
    .reduce((premov, currmov) => premov + currmov, 0);
  labelSumOut.textContent = `${currFormat(acc, outPayment)}`;

  let interest = acc.movements
    .filter(mov => mov > 0)
    .map(dep => (dep * `${acc.interestRate}`) / 100)
    .reduce((accu, int) => accu + int, 0);
  labelSumInterest.textContent = `${currFormat(acc, interest)}`;
};

// create usernames for each account
let createUsernames = account => {
  account.map(acc => {
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
  displayMovements(acc);
};

// LogOut Timer

const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    // In each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    // When 0 seconds, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }

    // Decrease 1s
    time--;
  };

  // Set time to 5 minutes
  let time = 120;

  // Call the timer every second
  tick();
  const timer = setInterval(tick, 1000);

  return timer;
};

// Login Implementing
let curruntAccount, timer;

let now = new Date();
let day = `${now.getDate()}`.padStart(2, '0');
let month = `${now.getMonth()}`.padStart(2, '0');
let year = now.getFullYear();

labelDate.textContent = `${day}/${month}/${year} ${now.getHours()}:${now.getMinutes()}`;

btnLogin.addEventListener('click', e => {
  e.preventDefault(); //prevent from reload when click

  // Find the Account object using username
  curruntAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  if (curruntAccount?.pin === Number(inputLoginPin.value)) {
    containerApp.classList.remove('app-hide');
    labelWelcome.textContent = `Welcome Back, ${
      curruntAccount.owner.split(' ')[0]
    }`;
    // Timer
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
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

  // Reset timer
  clearInterval(timer);
  timer = startLogOutTimer();

  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur();
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

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && curruntAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      // Add movement
      curruntAccount.movements.push(amount);
      console.log(movements);
      // Add loan date
      curruntAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(curruntAccount);

      // Reset timer
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 2500);
  }
  inputLoanAmount.value = '';
});
