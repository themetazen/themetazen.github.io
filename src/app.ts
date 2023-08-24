import Select from './components/select';
import { COINGECKO_ENDPOINT, COIN_KEY, GLOBAL_STORAGE_KEY } from './constants';
import { State } from './state';
import { elem, fixHeight } from './utils';
import { WalletConnect } from './walletConnected';

// state
const store = new (State as any)();

store.address = '';
store.name = '';
store.balance = null;
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

const cardContainer = elem('[data-toncoin-card]');
const accountContainer = elem("[data-account]");
const slidebarToggle = elem("#slidebar .slidebar__toggle");
const slidebarBody = elem("#slidebar .slidebar__body");

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
                price: 0.00,
                change: 0.00
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

const slidebarToggleHandler = () => {
    slidebarToggle.classList.toggle('active');
    slidebarBody.classList.toggle('active');
}

// START
window.addEventListener('resize', fixHeight);
fixHeight();

renderCardPrice(cardContainer, true);
const connect = new WalletConnect(accountContainer, store);

const changeCurrencyHandler = (item: {name: string, label: string}) => {
    store.setCurrency(item.name);
    renderCardPrice(cardContainer, true);
    setTimeout(() => connect.renderAccountContainer(), 200);
    localStorage.setItem(`${GLOBAL_STORAGE_KEY}_currency`, store.currency);
};

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

accountContainer.append(connect.connectButtonSidebar());