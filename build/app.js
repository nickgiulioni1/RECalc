const formatCurrency = (value) =>
  value.toLocaleString(undefined, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });

const state = {
  purchasePrice: 320000,
  downPaymentPercent: 20,
  interestRate: 6.25,
  loanTermYears: 30,
  monthlyRent: 2400,
  vacancyRate: 5,
  maintenanceRate: 5,
  monthlyTaxes: 375,
  monthlyInsurance: 140,
  monthlyOther: 75,
};

const elements = {};

document.querySelectorAll('input').forEach((input) => {
  elements[input.id] = input;
  input.value = state[input.id];
  input.addEventListener('input', () => {
    state[input.id] = Number(input.value) || 0;
    render();
  });
});

const view = {
  monthlyMortgage: document.getElementById('monthlyMortgage'),
  monthlyCashFlow: document.getElementById('monthlyCashFlow'),
  annualCashFlow: document.getElementById('annualCashFlow'),
  capRate: document.getElementById('capRate'),
  cashOnCash: document.getElementById('cashOnCash'),
  ltv: document.getElementById('ltv'),
  vacancyReserve: document.getElementById('vacancyReserve'),
  maintenanceReserve: document.getElementById('maintenanceReserve'),
  totalExpenses: document.getElementById('totalExpenses'),
};

const mortgagePayment = ({ principal, rate, years }) => {
  const monthlyRate = rate / 100 / 12;
  const totalMonths = years * 12;
  if (monthlyRate === 0) {
    return principal / totalMonths;
  }
  const factor = Math.pow(1 + monthlyRate, totalMonths);
  return (principal * monthlyRate * factor) / (factor - 1);
};

const render = () => {
  const purchasePrice = state.purchasePrice;
  const downPaymentAmount = purchasePrice * (state.downPaymentPercent / 100);
  const loanAmount = purchasePrice - downPaymentAmount;
  const monthlyMortgage = mortgagePayment({
    principal: loanAmount,
    rate: state.interestRate,
    years: state.loanTermYears,
  });

  const vacancyReserve = state.monthlyRent * (state.vacancyRate / 100);
  const maintenanceReserve = state.monthlyRent * (state.maintenanceRate / 100);

  const totalExpenses =
    monthlyMortgage +
    state.monthlyTaxes +
    state.monthlyInsurance +
    state.monthlyOther +
    vacancyReserve +
    maintenanceReserve;

  const netCashFlow = state.monthlyRent - totalExpenses;
  const annualCashFlow = netCashFlow * 12;

  const operatingIncome =
    state.monthlyRent - (vacancyReserve + maintenanceReserve + state.monthlyTaxes + state.monthlyInsurance + state.monthlyOther);
  const capRate = (operatingIncome * 12) / purchasePrice * 100;
  const cashOnCash = (annualCashFlow / downPaymentAmount) * 100;
  const ltv = (loanAmount / purchasePrice) * 100;

  view.monthlyMortgage.textContent = formatCurrency(monthlyMortgage);
  view.vacancyReserve.textContent = formatCurrency(vacancyReserve);
  view.maintenanceReserve.textContent = formatCurrency(maintenanceReserve);
  view.totalExpenses.textContent = formatCurrency(totalExpenses);
  view.monthlyCashFlow.textContent = formatCurrency(netCashFlow);
  view.annualCashFlow.textContent = formatCurrency(annualCashFlow);
  view.capRate.textContent = `${capRate.toFixed(1)}%`;
  view.cashOnCash.textContent = `${cashOnCash.toFixed(1)}%`;
  view.ltv.textContent = `${ltv.toFixed(0)}%`;
};

render();
