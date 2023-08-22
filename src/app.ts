import Select from './components/select';
import { State } from './state';
import { elem, fixHeight } from './utils';

import { CHAIN, THEME, TonConnectUI, toUserFriendlyAddress } from '@tonconnect/ui';

/** const */
const COINGECKO_ENDPOINT = 'https://api.coingecko.com/api/v3';
const TONAPI_ENDPOINT = 'https://tonapi.io/v2';
const COIN_KEY = 'the-open-network';

const GLOBAL_STORAGE_KEY = 'metazen';

// state
const store = new (State as any)();

store.isLogged = false;

store.address = '';
store.name = '';
store.balance = 0;
store.activeStatus = '';

store.price = '';
store.change = '';

store.currencyList = {
    usd: {name: 'United States Dollar', symbol: '$'},
    eur: {name: 'Euro', symbol: '€'},
    rub: {name: 'Russian Ruble', symbol: '₽'},
    aed: {name: 'UAE Dirham', symbol: 'DH'},
    krw: {name: 'South Korean Won', symbol: '₩'},
    cny: {name: 'China Yuan', symbol: '¥'},
};

store.currency = 'usd';

store.setIsLogged = function(value: boolean) {
    this.isLogged = value;
}

store.setAddress = function(address: string) {
    this.address = address;
}

store.setName = function(name: string | undefined) {
    this.name = name;
}

store.setBalance = function(balance: number) {
    this.balance = balance;
}

store.setActiveStatus = function(status: string) {
    this.activeStatus = status;
}

store.setPrice = function(price: number) {
    this.price = price;
}

store.setChange = function(change: number) {
    this.change = change;
}

store.setCurrency = function(currency: string) {
    this.currency = currency;
}
// end state

store.setCurrency(
    localStorage.getItem(`${GLOBAL_STORAGE_KEY}_currency`) || 
    store.currency
);

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
        <div class="account__nav-content logout">
            <i class="icon logout"></i>Log Out
         </div>
    `;
    a.addEventListener('click', logoutHandler, false);
    return a;
}

const copyButtonSidebar = (address: string) => {
    const a = document.createElement('a');
    a.setAttribute('title', 'Copy address');
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

const getCoinPrice = () => {
    const apiUrl = 
        `${COINGECKO_ENDPOINT}/coins/markets?vs_currency=${store.currency}&ids=${COIN_KEY}`;

    return fetch(apiUrl)
        .then((res) => res.json())
        .then((res) => {
            const coin = Object.assign({}, ...res);
            const {
                current_price,
                price_change_percentage_24h
            } = coin;

            const price = current_price.toFixed(2);
            const change = price_change_percentage_24h.toFixed(2);

            return {
                price: price,
                change: change
            }
        })
        .catch(() => {
            return {
                price: 0,
                change: 0
            }
        });
}

function renderCardPrice(container:Element, isInit:boolean = false) {
    if (isInit) {
        container.innerHTML = `<div class="loader"></div>`;
    }

    getCoinPrice().then((coin) => {
        store.setPrice(coin.price);
        store.setChange(coin.change);

        container.innerHTML = `
            <div class="card__price">${store.currencyList[store.currency].symbol}${store.price}</div>
            <div class="card__change ${store.change < 0 ? 'falling' : 'rising'}"}">
                <strong>${store.change}% <span>&bull;</span> 24h</strong>
            </div>
        `;
    });

    setTimeout(() => renderCardPrice(container), 60000);
}

function renderAccountContainer() {
    if (store.isLogged === false) {
        return;
    }

    accountContainer.replaceChildren();

    const ul = document.createElement('ul');
    ul.classList.add('account__nav');
        
    const userFriendlyAddress = 
        toUserFriendlyAddress(store.address, tonConnect.account.chain === CHAIN.TESTNET);
    const screenUserFriendlyAddress = 
            userFriendlyAddress.slice(0, 6) + "\u2026" + userFriendlyAddress.slice(-4);

        const balance = (store.balance * 1e-9).toFixed(2);
        const currencyBalance = (store.price * Number(balance)).toFixed(2);

        const itemWallet = document.createElement('li');
        itemWallet.classList.add('account__nav-item');
        itemWallet.innerHTML = `
            <div class="account__nav-content">
                <i class="icon wallet"></i>
                <a href="https://tonviewer.com/${userFriendlyAddress}" target="_blank">
                    <div class="name">${store.name ? store.name.slice(0, -4) : screenUserFriendlyAddress}</div>
                    ${store.name ? `<div class="sub">${screenUserFriendlyAddress}</div>` : ''}
                </a>
            </div>
        `;
        itemWallet.appendChild(copyButtonSidebar(userFriendlyAddress));

        const itemBalance = document.createElement('li');
        itemBalance.classList.add('account__nav-item');
        itemBalance.innerHTML = `
            <div class="account__nav-content">
                <i class="icon toncoin"></i>
                <div><div class="balance">${balance} TON</div>
                <div class="sub">~ ${store.currencyList[store.currency].symbol}${currencyBalance}</div></div>
            </div>
        `;

        const itemLogout = document.createElement('li');
        itemLogout.classList.add('account__nav-item');
        itemLogout.appendChild(logoutButtonSidebar());

        ul.appendChild(itemWallet);
        ul.appendChild(itemBalance);
        ul.appendChild(itemLogout);

        accountContainer.appendChild(ul);
}

const tonConnect = new TonConnectUI({
    manifestUrl: 'https://themetazen.xyz/tonconnect-manifest.json',
    buttonRootId: 'connector',
    uiPreferences: {
        theme: THEME.DARK,
        borderRadius: 'none'
    }
});

tonConnect.onStatusChange(async wallet => {
    if (wallet) {
        store.setIsLogged(true);
        store.setAddress(wallet.account.address);

        try {
            const response = await fetch(`${TONAPI_ENDPOINT}/accounts/${store.address}`);
    
            if (!response.ok) {
                throw new Error(await response.text());
            }
    
            const data = await response.json();
    
            const {
                balance,
                name,
                status
            } = data;
    
            store.setBalance(balance);
            store.setName(name);
            store.setActiveStatus(status);
            
        } catch (err) {
            throw err;
        }
        
        renderAccountContainer();
    } else {
        accountContainer.replaceChildren();
        accountContainer.appendChild(connectButtonSidebar());
        store.setIsLogged(false);
    }
});

const changeCurrencyHandler = (item: {name: string, label: string}) => {
    store.setCurrency(item.name);
    localStorage.setItem(`${GLOBAL_STORAGE_KEY}_currency`, store.currency);
    renderCardPrice(cardContainer, true);
    setTimeout(() => renderAccountContainer(), 100);
};

const slidebarToggleHandler = () => {
    slidebarToggle.classList.toggle('active');
    slidebarBody.classList.toggle('active');
}

// START
window.addEventListener('resize', fixHeight);
fixHeight();

window.addEventListener('load', () => {
    renderCardPrice(cardContainer, true);
});

const cardContainer = elem('[data-toncoin-card]');
const slidebarToggle = elem("#slidebar .slidebar__toggle");
const slidebarBody = elem("#slidebar .slidebar__body");
const accountContainer = elem("[data-account]");

const dataSelectCurrency = Object.entries(store.currencyList).map((cur: any) => ({
    name: cur[0],
    label: cur[1].name
}));

new Select('[data-select-currency]', {
    data: dataSelectCurrency,
    valueDefault: store.currency,
    onChange(item: {name: string, label: string}) {
        changeCurrencyHandler(item);
    },
    position: 'top'
});

slidebarToggle.addEventListener('click', slidebarToggleHandler);

accountContainer.append(connectButtonSidebar());