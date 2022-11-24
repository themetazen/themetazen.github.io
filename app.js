const _ge = (elem) => document.querySelector(elem);

const appHeight = () => {
    const doc = document.documentElement;
    doc.style.setProperty('--app-height', `${window.innerHeight}px`);
};

const currency = {
    usd: 'United States Dollar',
    eur: 'Euro',
    rub: 'Russian Ruble',
    krw: 'South Korean Won',
    cny: 'China Yuan',
};

const currencySymbol = {
    usd: '$',
    eur: '€',
    rub: '₽',
    krw: '₩',
    cny: '¥',
};

let selectedCurrency;

const renderCard = (data) => {
    const coins = Object.keys(data);
    selectedCurrency = select.value;

    for (let coin of coins) {
        const coinInfo = data[coin];

        const price = coinInfo[selectedCurrency].toFixed(2);
        const change = coinInfo[`${selectedCurrency}_24h_change`].toFixed(2);

        priceContainer.innerText = `${currencySymbol[selectedCurrency]}${price}`;

        changeContainer.style.color = `${change < 0 ? 'red' : 'green'}`;
        changeContainer.innerHTML = `${
            change < 0 ? change : '+' + change
        }% <span>&bull;</span> 24h`;
    }
};

const getPrice = () => {
    selectedCurrency = select.value;
    try {
        fetch(
            `https://api.coingecko.com/api/v3/simple/price?ids=the-open-network&vs_currencies=${selectedCurrency}&include_24hr_change=true`
        )
            .then((result) => result.json())
            .then(renderCard);
    } catch (e) {
        console.error(e);
    }

    setTimeout(getPrice, 20000);
};

// start

window.addEventListener('resize', appHeight);
appHeight();

window.addEventListener('load', () => {
    getPrice();
});

// DOM
const priceContainer = _ge('[data-card="price"]');
const changeContainer = _ge('[data-card="change"]');

const select = _ge('[data-select]');
select.innerHTML = Object.keys(currency).map(
    (item) => `<option value=${item}>${currency[item]}</option>`
);
select.addEventListener('change', getPrice);
