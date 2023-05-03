import { get } from './utils/api.service';
import Select from './components/select';

import './style/main.scss';

const host = 'https://api.coingecko.com/api/v3'; 
const actions = {
    coin: '/coins/markets',
};
const GLOBAL_STORAGE_KEY = 'metazen';

const currency = {
    usd: {name: 'United States Dollar', symbol: '$'},
    eur: {name: 'Euro', symbol: '€'},
    rub: {name: 'Russian Ruble', symbol: '₽'},
    krw: {name: 'South Korean Won', symbol: '₩'},
    cny: {name: 'China Yuan', symbol: '¥'},
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
    const symbol = currency[storage.currency].symbol;

    cardContainer.innerHTML = `
        <div class="card__price">${symbol}${price}</div>
        <div class="card__change ${change < 0 ? 'falling' : 'rising'}"}">
            <strong>${change}% <span>&bull;</span> 24h<strong>
        </div>
    `;
};

const fetchCoin = async () => {
    try {
        const response = await get(`${host}${actions.coin}?vs_currency=${storage.currency}&ids=the-open-network`);
        renderCard(response);
    } catch (error) {
        console.error(error.message);
    }
    setTimeout(fetchCoin, 20000);
};

const changeCurrencyHandler = (item) => {
    storage.currency = item.name;
    localStorage.setItem(`${GLOBAL_STORAGE_KEY}`, JSON.stringify(storage));
    cardContainer.innerHTML = `<div class="loader"></div>`;
    fetchCoin();
};

const slidebarToggleHandler = () => {
    slidebarToggle.classList.toggle('active');
    slidebarBody.classList.toggle('active');
}

// START
window.addEventListener('resize', fixHeight);
fixHeight();

window.addEventListener('load', () => {
    fetchCoin();
});

const cardContainer = elem('[data-toncoin-card]');
const slidebarToggle = elem("#slidebar .slidebar__toggle");
const slidebarBody = elem("#slidebar .slidebar__body");
const connectBtn = elem("#connect-btn");

const dataSelectCurrency = Object.entries(currency).map((cur) => ({
    name: cur[0],
    label: cur[1].name
}));

new Select('#select-currency', {
    data: dataSelectCurrency,
    valueDefault: storage.currency,
    onChange(item) {
        changeCurrencyHandler(item);
    },
    position: 'top'
});

slidebarToggle.addEventListener('click', slidebarToggleHandler);
connectBtn.addEventListener('click', () => {
    alert("connect wallet");
})