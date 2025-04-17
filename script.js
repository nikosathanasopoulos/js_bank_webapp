'use strict';

// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Nikos Athanasopoulos',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'John Cena',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Alan Walker',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Eminem',
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

containerMovements.innerHTML = '';

const displayMovements = function(movements, sort=false){
  containerMovements.innerHTML = '';
  const movs = sort ? movements.slice().sort((a,b) => a - b):movements;
  movs.forEach((movement,index) => {
    const type = movement > 0 ? 'deposit':'withdrawal';
    const html = `
         <div class="movements__row">
          <div class="movements__type movements__type--${type}">${index+1} ${type}</div>
          <div class="movements__value">${movement}  €</div>
        </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin',html);
//   console.log(containerMovements.innerHTML);

  })
}

const calcPrintBalance = function(account){
  account.balance  = account.movements.reduce((total,movement)=>total + movement,0);
  labelBalance.textContent = `${account.balance} EUR`;
}

const calcDisplaySummary = function(account){
  const movements = account.movements;
  const incomes = movements
      .filter(mov => mov > 0)
      .reduce((total,mov) => total + mov,0);
  labelSumIn.textContent = `${incomes} €`;

  const outcomes = movements
      .filter(mov => mov < 0)
      .reduce((total,mov) => total + Math.abs(mov),0);
  labelSumOut.textContent = `${outcomes} €`;

  const interest = movements
      .filter(mov => mov > 0) // filter only deposits
      .map((deposit) => (deposit * account.interestRate)/100,0) // find the interest for every deposit
      .filter(int => int >= 1) // only add interests greater than 1
      .reduce((total,int) => total + int,0); // add all accumulated interest
  labelSumInterest.textContent = `${interest} €`;
};

const createUsernames = function(accs){
  accs.forEach((acc)=>{
    acc.username = acc.owner
        .toLowerCase()
        .split(' ')
        .map(word=>  word[0])
        .join('');})
};
createUsernames(accounts);
console.log(accounts);

let currentAccount;

const updateUI = function(account){
  // Display movements
  displayMovements(account.movements);
  //Display balance
  calcPrintBalance(account);
  // Display summary
  calcDisplaySummary(account);
}
// Login
btnLogin.addEventListener('click', function(e){
  e.preventDefault(); // prevent form from submitting
  console.log('Login');
  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value.toLowerCase());
  console.log(currentAccount);
  if(currentAccount?.pin === Number(inputLoginPin.value)){
    console.log('Logged In');
    // Display UI and welcome message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;
    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    updateUI(currentAccount);
  }
})

// transfer amount to other user
btnTransfer.addEventListener('click', function(e){
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAccount = accounts.find(acc => acc.username === inputTransferTo.value);
  console.log(amount,receiverAccount);

  if (amount > 0 &&
      receiverAccount &&
      amount <= currentAccount.balance &&
      receiverAccount?.username !== currentAccount.username
  ){
    console.log('Transfer valid');
    currentAccount.movements.push(-amount);
    receiverAccount.movements.push(amount);
    updateUI(currentAccount);
  }
  inputTransferAmount.value = inputTransferTo.value = '';
})

// close account
btnClose.addEventListener('click', function(e){
  e.preventDefault();

  if(inputCloseUsername.value === currentAccount.username &&
  Number(inputClosePin.value) === currentAccount.pin){
    const index = accounts.findIndex(account => account.username === currentAccount.username);
    console.log(index);
    // Delete account
    accounts.splice(index,1);
    // hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
})

// loan
btnLoan.addEventListener('click', function(e){
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);

  if(amount > 0 && currentAccount.movements.some(movement => movement >= amount * 0.1) ){
    console.log('Loan approved');
    // add ammount
    currentAccount.movements.push(amount);

    updateUI(currentAccount);
  }
  inputLoanAmount.value  = '';

})

// sorting button
let sorted = false;
btnSort.addEventListener('click', function(e){
  e.preventDefault();
  displayMovements(currentAccount.movements,!sorted);
  sorted = !sorted

})




/////////////////////////////////////////////////

/////////////////////////////////////////////////

const user = 'Steven Thomas Williams';
let username = user.toLowerCase().split(' ').map((word)=> {return word[0]}).join('');
username = user
    .toLowerCase()
    .split(' ')
    .map(word=>  word[0])
    .join('');

console.log(username);

let arr = ['a', 'b', 'c', 'd', 'e'];

// slice
console.log(arr.slice(2)); // c d e
console.log(arr.slice(2,4)); // c d
console.log(arr.slice(-1)); // e
console.log(arr.slice()); // shallow copy of array , same as [...arr]

//splice
console.log(arr.splice(2)); // c d e, the data that were extracted are removed from original array
console.log(arr); // a b
arr = ['a', 'b', 'c', 'd', 'e'];
arr.splice(-1);
console.log(arr); // a b c d
arr.splice(1,2);
console.log(arr); // a d

// reverse
arr = ['a', 'b', 'c', 'd', 'e'];
let arr2 = ['a', 'b'];
arr.reverse();
console.log(arr); // e d c b a

arr.reverse();

// concat
const letters = arr.concat(arr2);
console.log(letters);
console.log([...arr],[...arr2]);

// join
console.log(letters.join('-'));

// at method
console.log(arr[0]);
console.log(arr.at(0));

console.log(arr.slice(-1)[0]);
console.log(arr.at(-1)); // Easier with at method

// Enhanced for loop
console.log('Enhanced for loop')
for(const c of arr){
  console.log(c);
}

console.log('Enhanced for loop')
for(const [i,c] of arr.entries()){
  console.log(i+':'+c);
}

// foreach
console.log('For each');
arr.forEach((element) => {console.log(element)});
console.log('For each');
arr.forEach(function(element){console.log(element)});
console.log('For each');
arr.forEach(function(element,index,array){console.log(index+':'+element);console.log(array)});

// foreach MAP
console.log('For each on currencies MAPS');
currencies.forEach(function(value,key,array){console.log(key+':'+value);console.log(array)});

// foreach SET
console.log('For each on currencies SETS');
const currenciesUnique = new Set([...currencies]);
console.log(currenciesUnique);

currenciesUnique.forEach((value,key,set) => {console.log(key+':'+value)})



// Map
const eurToUSd = 1.1;
let movementsUSD = movements.map(function(movement){
  return movement * eurToUSd;
});

movementsUSD = movements.map((movement)=>{
  return movement * eurToUSd;
});
console.log(movementsUSD,movements);

movementsUSD = movements.map((movement) => movement * eurToUSd);

console.log(movementsUSD,movements);

const movementsUsdFor = [];
for (const movement of movements) {
  movementsUsdFor.push(movement*eurToUSd);
}
console.log(movementsUsdFor);

const movementsUsdForeach = [];
movements.forEach(function(movement){
  movementsUsdForeach.push(movement*eurToUSd);
});

console.log(movementsUsdForeach);

const movementsDescription = movements.map((movement,index,arr)=>{
  return `Movement ${index+1}: You ${movement > 0?'deposited':'withdrew'} ${Math.abs(movement)}`;
  // if(movement > 0){
  //   return `Movement ${index+1}: You deposited ${movement}`;
  // }
  // else{
  //   return `Movement ${index+1}: You withdrew ${Math.abs(movement)}`;
  // }
});

console.log(movementsDescription);

// filter
let deposits = movements.filter(function(movement){
  return movement > 0;
});
deposits = movements.filter(movement => movement > 0);
console.log(deposits);

let withdraws = movements.filter(function(movement){
  return movement < 0;
});
withdraws = movements.filter(movement => movement < 0);
console.log(withdraws);

// find common elements
const array1 = [1,2,3,4,5,5];
const array2 = [3,4,5];

const common = array1.filter(num => array2.includes(num));
const commonSet = new Set(common);
console.log(commonSet);
const uniqueArray = [];
common.forEach(num => {
  if(!uniqueArray.includes(num)){
    uniqueArray.push(num);
  }
});
console.log(uniqueArray);


// reduce
let balance = movements.reduce(function(total,movement,index, array){
  return total + movement;
},0);
balance = movements.reduce((total,movement)=>total + movement,0);
console.log(balance);

const maxMovement = movements.reduce((max,movement)=>{
  if (max > movement)
    return max;
  else
    return movement;
},movements[0]);
console.log(maxMovement);

// find

const firsWithdrawal = movements.find(mov => mov < 0);
console.log(movements);
console.log(firsWithdrawal);

console.log(accounts);

const accountJessica = accounts.find(acc => acc.owner === 'Jessica Davis');
console.log(accountJessica);

// findLast
console.log(movements);
const lastWithdraw = movements.findLast(movement => movement < 0);
console.log(lastWithdraw);

const lastWithdrawIndex = movements.findLastIndex(movement => movement < 0);
console.log(lastWithdrawIndex);

// some
console.log(movements);
let anyDeposits = movements.some(movement => movement > 0);
console.log(anyDeposits);
anyDeposits = movements.some(movement => movement > 5000);
console.log(anyDeposits);

// every
console.log(movements);
let everyDeposits = movements.every(movement => movement > 0);
console.log(everyDeposits);

const deposit =  movement => movement > 0;
everyDeposits = movements.every(deposit);
console.log(everyDeposits);

// flat, flatMap
arr = [[1,2,3],[4,5,6],7,8];
console.log(arr.flat(1));

arr = [[[1,2],3],[4,5,6],7,8];
console.log(arr.flat(2));

const accountMovements = accounts.map(account => account.movements);
console.log(accountMovements);
const allMovements = accountMovements.flat();
console.log(allMovements);
let overallBalance = allMovements.reduce((total,movement) => total + movement,0);
console.log(overallBalance);

overallBalance = accounts
    .map(account => account.movements)
    .flat()
    .reduce((total,movement) => total + movement,0);
console.log(overallBalance);

overallBalance = accounts
    .flatMap(account => account.movements)
    .reduce((total,movement) => total + movement,0);
console.log(overallBalance);

console.log(movements);
const groupedMovements = Object.groupBy(movements,
        movement => movement > 0 ? 'deposits':'withdrawals');
console.log(groupedMovements);

// How to count with reduce

const numOfDeposits1000 = accounts
      .flatMap(account => account.movements)
      .reduce((count,movement) => (movement>=1000?count +1 :count),0);
console.log(numOfDeposits1000);

const {deposits1, withdrawals1} = accounts
      .flatMap(account => account.movements)
      .reduce((sums,cur) =>{
        sums[cur > 0 ? 'deposits1':'withdrawals1'] += cur;
        return sums;
      },{deposits1:0,withdrawals1:0}
      );
console.log(deposits1, withdrawals1);
