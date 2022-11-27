import Select from './libs/Select/index.js';

const q = (elem) => document.querySelector(elem);

const appHeight = () => {
    const doc = document.documentElement;
    doc.style.setProperty('--app-height', `${window.innerHeight}px`);
};

const host = 'https://api.coingecko.com/api/v3';
const GLOBAL_STORAGE_KEY = 'metazen';

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

const defaultStorage = {
    currency: 'usd',
};

const storage =
    JSON.parse(localStorage.getItem(`${GLOBAL_STORAGE_KEY}`)) || defaultStorage;

const renderCard = (data) => {
    const coin = Object.assign({}, ...data);
    const { current_price, price_change_percentage_24h } = coin;

    const price = current_price.toFixed(2);
    const change = price_change_percentage_24h.toFixed(2);
    const symbol = currencySymbol[storage.currency];

    cardContainer.innerHTML = `
        <div class="card__price">${symbol}${price}</div>
        <div class="card__change" style="color: ${
            change < 0 ? 'red' : 'green'
        }">${change < 0 ? change : '+' + change}% <span>&bull;</span> 24h</div>
    `;
};

const fetchCoin = async () => {
    try {
        await fetch(
            `${host}/coins/markets?vs_currency=${storage.currency}&ids=the-open-network`
        )
            .then((result) => result.json())
            .then(renderCard);
    } catch (e) {
        console.error(e);
    }

    setTimeout(fetchCoin, 20000);
};

/*const changeCurrencyHandler = (e) => {
    storage.currency = e.target.value;
    localStorage.setItem(`${GLOBAL_STORAGE_KEY}`, JSON.stringify(storage));
    cardContainer.innerHTML = `<div class="loader"></div>`;
    fetchCoin();
};*/

// START
window.addEventListener('resize', appHeight);
appHeight();

window.addEventListener('load', () => {
    fetchCoin();
});

// DOM
const cardContainer = q('[data-toncoin-card]');

/*const selectCurrency = q('[data-select-currency]');
selectCurrency.innerHTML = Object.keys(currency).map(
    (item) => `<option value=${item}>${currency[item]}</option>`
);
selectCurrency.value = storage.currency;
selectCurrency.addEventListener('change', changeCurrencyHandler);*/

const selectCurrency = new Select('#select-currency', {
    data: currency,
    valueDefault: storage.currency,
    onChange(item) {
        storage.currency = item;
        localStorage.setItem(`${GLOBAL_STORAGE_KEY}`, JSON.stringify(storage));
        cardContainer.innerHTML = `<div class="loader"></div>`;
        fetchCoin();
    },
});
