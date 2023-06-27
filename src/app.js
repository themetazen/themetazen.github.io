import Select from './components/select';
import { ButtonComponent } from './components/button';

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
    aed: {name: 'UAE Dirham', symbol: 'DH'},
    krw: {name: 'South Korean Won', symbol: '₩'},
    cny: {name: 'China Yuan', symbol: '¥'},
};

const state = {
    price: 0,
    change: 0,

    defaultStorage: {
        currency: 'usd',
        address: null,
        lastPrice: 0.00,
        lastChange: 0.00
    }
};

const elem = (sel) => document.querySelector(sel);

const fixHeight = () => {
    const doc = document.documentElement;
    doc.style.setProperty('--app-height', `${window.innerHeight}px`);
};

const storage =
    JSON.parse(localStorage.getItem(`${GLOBAL_STORAGE_KEY}`)) || state.defaultStorage;

const renderCard = () => {
    // const coin = Object.assign({}, ...data);
    // const { current_price, price_change_percentage_24h } = coin;

    // state.price = current_price.toFixed(2);
    // state.change = price_change_percentage_24h.toFixed(2);

    const card = `
        <div class="card__price">${currency[storage.currency].symbol}${state.price}</div>
        <div class="card__change ${state.change < 0 ? 'falling' : 'rising'}"}">
            <strong>${state.change}% <span>&bull;</span> 24h<strong>
        </div>
    `;
    cardContainer.innerHTML = card;
};

const renderLoader = () => {
    let loader = `<div class="loader"></div>`;
    cardContainer.innerHTML = loader;
}

const fetchCoin = async (isInit = false) => {
    if(isInit) {
        renderLoader();
    }

    try {
        const response = await fetch(`${host}${actions.coin}?vs_currency=${storage.currency}&ids=the-open-network`);

        if (!response.ok) {
            throw new Error(await response.text());
        }

        const data = await response.json();

        const coin = Object.assign({}, ...data);
        const { current_price, price_change_percentage_24h } = coin;

        state.price = current_price.toFixed(2);
        state.change = price_change_percentage_24h.toFixed(2);

        renderCard();
    } catch (error) {
        throw error;
    }

    setTimeout(fetchCoin, 60000);
};

const changeCurrencyHandler = (item) => {
    storage.currency = item.name;
    localStorage.setItem(`${GLOBAL_STORAGE_KEY}`, JSON.stringify(storage));
    fetchCoin(true);
};

const slidebarToggleHandler = () => {
    slidebarToggle.classList.toggle('active');
    slidebarBody.classList.toggle('active');
}

// START
window.addEventListener('resize', fixHeight);
fixHeight();

window.addEventListener('load', () => {
    fetchCoin(true);
});

const cardContainer = elem('[data-toncoin-card]');
const slidebarToggle = elem("#slidebar .slidebar__toggle");
const slidebarBody = elem("#slidebar .slidebar__body");
const accountContainer = elem("[data-account]");

const dataSelectCurrency = Object.entries(currency).map((cur) => ({
    name: cur[0],
    label: cur[1].name
}));

new Select('[data-select-currency]', {
    data: dataSelectCurrency,
    valueDefault: storage.currency,
    onChange(item) {
        changeCurrencyHandler(item);
    },
    position: 'top'
});

slidebarToggle.addEventListener('click', slidebarToggleHandler);

accountContainer.append(
    ButtonComponent({
        disabled: true,
        text: 'Connect Wallet',
        onClick: () => alert('auth')
    })
);

// test createElement
// const array = ['hello', 'world', 'hey'];
// const boolTest = true;
// accountContainer.append(createElement('ul', {},
//     array.map((a) => createElement('li', {style: {color: '#fff', backgroundColor: 'green'}}, a)),
//     (boolTest ? createElement('li', {}, 'test true') : ''),
//     createElement('li', {}, 'test')
// ));