import Select from './components/select';
import { ButtonComponent } from './components/button';
import { ICurrency, IState } from './types';
import { getStorage, setStorage } from './utils/storage';

import { THEME, TonConnectUI } from '@tonconnect/ui';
import { createElement } from './utils/createElement';

/** settings */
enum coinGecko {
    host = 'https://api.coingecko.com/api/v3',
    actionCoin = '/coins/markets'
}

const GLOBAL_STORAGE_KEY = 'metazen';

const currency: ICurrency = {
    usd: {name: 'United States Dollar', symbol: '$'},
    eur: {name: 'Euro', symbol: '€'},
    rub: {name: 'Russian Ruble', symbol: '₽'},
    aed: {name: 'UAE Dirham', symbol: 'DH'},
    krw: {name: 'South Korean Won', symbol: '₩'},
    cny: {name: 'China Yuan', symbol: '¥'},
};

const state: IState = {
    price: 0,
    change: 0,

    defaultStorage: {
        currency: 'usd',
        address: null,
        lastPrice: 0.00,
        lastChange: 0.00
    }
};

/** helpers */
const elem = (sel: string) => document.querySelector(sel);

const fixHeight = () => {
    const doc = document.documentElement;
    doc.style.setProperty('--app-height', `${window.innerHeight}px`);
};

/** application */
const tonConnect = new TonConnectUI({
    manifestUrl: 'https://themetazen.xyz/tonconnect-manifest.json',
    buttonRootId: 'connector',
    uiPreferences: {
        theme: THEME.DARK,
        borderRadius: 'none'
    }
});
tonConnect.onStatusChange(wallet => {
    if (wallet) {
        console.log(wallet);
        accountContainer.replaceChildren();
        accountContainer.append(
            createElement('ul', {
                className: 'account__nav'
            }, 
                createElement('li', {
                    className: 'account__nav-item'
                }, 
                    createElement('a', {
                        className: 'account__nav-link',
                        onclick: () => tonConnect.disconnect()
                    }, 'Disconnect')
                )
            )
        );
    } else {
        accountContainer.replaceChildren();
        accountContainer.append(
            ButtonComponent({
                disabled: false,
                text: 'Connect Wallet',
                onClick: () => tonConnect.connectWallet()
            })
        );
    }
});

const storage = getStorage(GLOBAL_STORAGE_KEY) || state.defaultStorage;

const renderCard = () => {
    cardContainer.innerHTML = `
        <div class="card__price">${currency[storage.currency].symbol}${state.price}</div>
        <div class="card__change ${state.change < 0 ? 'falling' : 'rising'}"}">
            <strong>${state.change}% <span>&bull;</span> 24h<strong>
        </div>
    `;
};

const renderLoader = () => {
    cardContainer.innerHTML = `<div class="loader"></div>`;
}

const fetchCoin = async (isInit = false) => {
    if(isInit) {
        renderLoader();
    }

    try {
        const response = await fetch(`${coinGecko.host}${coinGecko.actionCoin}?vs_currency=${storage.currency}&ids=the-open-network`);

        if (!response.ok) {
            throw new Error(await response.text());
        }

        const data = await response.json();

        const coin = Object.assign({}, ...data);
        const { current_price, price_change_percentage_24h } = coin;

        state.price = current_price.toFixed(2);
        state.change = price_change_percentage_24h.toFixed(2);

        renderCard();
    } catch (err) {
        throw err;
    }

    setTimeout(fetchCoin, 60000);
};

const changeCurrencyHandler = (item: {name: string, label: string}) => {
    storage.currency = item.name;
    setStorage(GLOBAL_STORAGE_KEY, storage);
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
    onChange(item: {name: string, label: string}) {
        changeCurrencyHandler(item);
    },
    position: 'top'
});

slidebarToggle.addEventListener('click', slidebarToggleHandler);

accountContainer.append(
    ButtonComponent({
        disabled: false,
        text: 'Connect Wallet',
        onClick: () => tonConnect.connectWallet()
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