import { get } from './utils/api.service';
import Select from './components/select';

import './style/main.scss';

const host = 'https://api.coingecko.com/api/v3'; 
const actions = {
    coin: '/coins/markets',
};
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
    address: null,
};

const elem = (sel) => document.querySelector(sel);
const fixHeight = () => {
    const doc = document.documentElement;
    doc.style.setProperty('--app-height', `${window.innerHeight}px`);
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
        <div class="card__change ${change < 0 ? 'falling' : 'rising'}"}">
            <strong>${change}% <span>&bull;</span> 24h<strong>
        </div>
    `;
};

const fetchCoin = async () => {
    get(
        host +
            actions.coin +
            `?vs_currency=${storage.currency}&ids=the-open-network`
    )
        .then(renderCard)
        .catch((e) => console.error(e.error));

    setTimeout(fetchCoin, 20000);
};

const changeCurrencyHandler = (item) => {
    storage.currency = item;
    localStorage.setItem(`${GLOBAL_STORAGE_KEY}`, JSON.stringify(storage));
    cardContainer.innerHTML = `<div class="loader"></div>`;
    fetchCoin();
};

// START
window.addEventListener('resize', fixHeight);
fixHeight();

window.addEventListener('load', () => {
    fetchCoin();
});

const cardContainer = elem('[data-toncoin-card]');

new Select('#select-currency', {
    data: currency,
    valueDefault: storage.currency,
    onChange(item) {
        changeCurrencyHandler(item);
    },
    position: 'top'
});

const slidebarToggle = elem("#slidebar .slidebar__toggle");
const slidebarBody = elem("#slidebar .slidebar__body");
const slidebarToggleHandler = () => {
    slidebarToggle.classList.toggle('active');
    slidebarBody.classList.toggle('active');
}
slidebarToggle.addEventListener('click', slidebarToggleHandler);

const connectBtn = elem("#connect-btn");
connectBtn.addEventListener('click', () => {
    alert("connect wallet");
})