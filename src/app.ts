import Select from './components/select';
import { ICurrency, IState } from './types';
import { getStorage, setStorage } from './utils/storage';

import { CHAIN, THEME, TonConnectUI, toUserFriendlyAddress } from '@tonconnect/ui';

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

const logoutHandler = () => {
    return tonConnect.disconnect();
}

const connectHandler = () => {
    return tonConnect.connectWallet();
}

const connectButtonSidebar = () => {
    const button = document.createElement('button');
    button.classList.add('btn');
    button.textContent = 'Connect Wallet';
    button.addEventListener('click', connectHandler, false);
    return button;
}

const logoutButtonSidebar = () => {
    const a = document.createElement('a');
    a.innerHTML = `
        <div class="account__nav-content">
            <i class="icon logout"></i>Disconnect
         </div>
    `;
    a.addEventListener('click', logoutHandler, false);
    return a;
}

const copyButtonSidebar = (address: string) => {
    const a = document.createElement('a');
    a.innerHTML = '<i class="icon copy"></i>';
    a.addEventListener('click', () => {
        navigator.clipboard.writeText(address);
        a.innerHTML = '<i class="icon check"></i>';
        setTimeout(() => {
            a.innerHTML = '<i class="icon copy"></i>';
        }, 1000);
    }, false);
    return a;
}

tonConnect.onStatusChange(wallet => {
    if (wallet) {
        const userFriendlyAddress = toUserFriendlyAddress(wallet.account.address, wallet.account.chain === CHAIN.TESTNET);
        const userFriendlyAddressForm = `${userFriendlyAddress.slice(0, 4)}...${userFriendlyAddress.slice(-4)}`;

        accountContainer.replaceChildren();
        const ul = document.createElement('ul');
        ul.classList.add('account__nav');

        const itemWallet = document.createElement('li');
        itemWallet.classList.add('account__nav-item');
        itemWallet.innerHTML = `
            <div class="account__nav-content">
                <i class="icon wallet"></i>
                <a href="https://tonviewer.com/${userFriendlyAddress}" target="_blank">${userFriendlyAddressForm}</a>
            </div>
        `;
        itemWallet.append(copyButtonSidebar(userFriendlyAddress));

        const itemLogout = document.createElement('li');
        itemLogout.classList.add('account__nav-item', 'account__nav-item-clickable');
        itemLogout.append(logoutButtonSidebar());

        ul.append(itemWallet);
        ul.append(itemLogout);

        accountContainer.append(ul);
    } else {
        accountContainer.replaceChildren();
        accountContainer.append(connectButtonSidebar());
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

accountContainer.append(connectButtonSidebar());