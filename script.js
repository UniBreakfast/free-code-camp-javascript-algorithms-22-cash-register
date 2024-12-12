let price = 19.5;
let cid = [
  ['PENNY', 1.01],
  ['NICKEL', 2.05],
  ['DIME', 3.1],
  ['QUARTER', 4.25],
  ['ONE', 90],
  ['FIVE', 55],
  ['TEN', 20],
  ['TWENTY', 60],
  ['ONE HUNDRED', 100]
];

const dict = {
  'ONE HUNDRED': 100,
  'TWENTY': 20,
  'TEN': 10,
  'FIVE': 5,
  'ONE': 1,
  'QUARTER': 0.25,
  'DIME': 0.1,
  'NICKEL': 0.05,
  'PENNY': 0.01,
}

const cidOrder = Object.keys(dict).reverse();

const changeDueOut = document.getElementById('change-due');
const priceInput = document.getElementById('price');
const cashInput = document.getElementById('cash');
const totalOut = document.getElementById('total');
const hundredOut = document.getElementById('hundred-sum');
const hundredInput = document.getElementById('hundred');
const twentyOut = document.getElementById('twenty-sum');
const twentyInput = document.getElementById('twenty');
const tenOut = document.getElementById('ten-sum');
const tenInput = document.getElementById('ten');
const fiveOut = document.getElementById('five-sum');
const fiveInput = document.getElementById('five');
const oneOut = document.getElementById('one-sum');
const oneInput = document.getElementById('one');
const quarterOut = document.getElementById('quarter-sum');
const quarterInput = document.getElementById('quarter');
const dimeOut = document.getElementById('dime-sum');
const dimeInput = document.getElementById('dime');
const nickelOut = document.getElementById('nickel-sum');
const nickelInput = document.getElementById('nickel');
const pennyOut = document.getElementById('penny-sum');
const pennyInput = document.getElementById('penny');
const purchaseBtn = document.getElementById('purchase-btn');

purchaseBtn.onclick = handlePurchaseClick;

hundredInput.oninput = handleHundredInput;
twentyInput.oninput = handleTwentyInput;
tenInput.oninput = handleTenInput;
fiveInput.oninput = handleFiveInput;
oneInput.oninput = handleOneInput;
quarterInput.oninput = handleQuarterInput;
dimeInput.oninput = handleDimeInput;
nickelInput.oninput = handleNickelInput;
pennyInput.oninput = handlePennyInput;

fillInCID();

function handleInput(type, inputElement) {
  let item = cid.find(pair => pair[0] === type);

  if (!item) {
    item = [type, 0];
    cid.push(item);
    cid.sort((a, b) => cidOrder.indexOf(a[0]) - cidOrder.indexOf(b[0]));
  }

  item[1] = multiply(inputElement.valueAsNumber, dict[type]);

  fillInCID();
}

function handleHundredInput() {
  handleInput('ONE HUNDRED', hundredInput);
}

function handleTwentyInput() {
  handleInput('TWENTY', twentyInput);
}

function handleTenInput() {
  handleInput('TEN', tenInput);
}

function handleFiveInput() {
  handleInput('FIVE', fiveInput);
}

function handleOneInput() {
  handleInput('ONE', oneInput);
}

function handleQuarterInput() {
  handleInput('QUARTER', quarterInput);
}

function handleDimeInput() {
  handleInput('DIME', dimeInput);
}

function handleNickelInput() {
  handleInput('NICKEL', nickelInput);
}

function handlePennyInput() {
  handleInput('PENNY', pennyInput);
}

function fillInCID() {
  const cidDict = Object.fromEntries(cid);

  hundredOut.value = '$' + cidDict['ONE HUNDRED'] || 0;
  twentyOut.value = '$' + cidDict['TWENTY'] || 0;
  tenOut.value = '$' + cidDict['TEN'] || 0;
  fiveOut.value = '$' + cidDict['FIVE'] || 0;
  oneOut.value = '$' + cidDict['ONE'] || 0;
  quarterOut.value = '$' + zeroPad(cidDict['QUARTER'] || 0);
  dimeOut.value = '$' + zeroPad(cidDict['DIME'] || 0);
  nickelOut.value = '$' + zeroPad(cidDict['NICKEL'] || 0);
  pennyOut.value = '$' + zeroPad(cidDict['PENNY'] || 0);

  hundredInput.value = divide(cidDict['ONE HUNDRED'] || 0, dict['ONE HUNDRED']);
  twentyInput.value = divide(cidDict['TWENTY'] || 0, dict['TWENTY']);
  tenInput.value = divide(cidDict['TEN'] || 0, dict['TEN']);
  fiveInput.value = divide(cidDict['FIVE'] || 0, dict['FIVE']);
  oneInput.value = divide(cidDict['ONE'] || 0, dict['ONE']);
  quarterInput.value = divide(cidDict['QUARTER'] || 0, dict['QUARTER']);
  dimeInput.value = divide(cidDict['DIME'] || 0, dict['DIME']);
  nickelInput.value = divide(cidDict['NICKEL'] || 0, dict['NICKEL']);
  pennyInput.value = divide(cidDict['PENNY'] || 0, dict['PENNY']);

  totalOut.value = '$' + zeroPad(cid.reduce((sum, [, amount]) => add(sum, amount), 0));
}

function handlePurchaseClick(e) {
  e.preventDefault();

  const inputValue = cashInput.valueAsNumber;

  if (inputValue < price) {
    alert("Customer does not have enough money to purchase the item");
  } else if (inputValue === price) {
    changeDueOut.textContent = "No change due - customer paid with exact cash";
  } else {
    const change = getChange(inputValue);

    if (!change) {
      changeDueOut.textContent = "Status: INSUFFICIENT_FUNDS";
    } else {
      changeDueOut.textContent = format(change);
    }
  }
}

function getChange(cash) {
  const change = {};
  const inCash = Object.fromEntries(cid);

  cash = +(cash - price).toFixed(2);

  for (const name in dict) {
    let sum = 0;

    while (inCash[name] && cash >= dict[name]) {
      cash = subtract(cash, dict[name]);
      sum = add(sum, dict[name]);
      inCash[name] = subtract(inCash[name], dict[name]);
    }


    if (sum) change[name] = sum;
  }

  if (cash) return false;

  for (const pair of cid) {
    const [name] = pair;

    if (change[name]) {
      pair[1] = +(pair[1] - change[name]).toFixed(2);
    }
  }

  return Object.entries(change);
}

function format(change) {
  const sum = cid.reduce(
    (sum, [, amount]) => +(sum + amount).toFixed(2), 0
  );
  const status = sum ? 'OPEN ' : 'CLOSED ';

  let str = "Status: " + status + change.map(
    ([name, amount]) => name + ': $' + amount
  ).join(' ')

  return str;
}

function zeroPad(num) {
  if (Number.isInteger(num)) return num;

  return num.toFixed(2);
}

function add(a, b, ...rest) {
  if (!rest.length) return +(a + b).toFixed(2);

  return add(add(a, b), ...rest);
}

function subtract(a, b) {
  return +(a - b).toFixed(2);
}

function divide(a, b) {
  return +(a / b).toFixed(2);
}

function multiply(a, b) {
  return +(a * b).toFixed(2);
}
