const _ge = (elem) => document.querySelector(elem);

const appHeight = () => {
    const doc = document.documentElement;
    doc.style.setProperty('--app-height', `${window.innerHeight}px`);
};

const host = 'https://api.coingecko.com/api/v3';

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
    selectedCurrency = select.value;

    const coin = Object.assign({}, ...data);
    const { current_price, price_change_percentage_24h } = coin;

    const price = current_price.toFixed(2);
    const change = price_change_percentage_24h.toFixed(2);
    const symbol = currencySymbol[selectedCurrency];

    cardContainer.innerHTML = `
        <div class="card__price">${symbol}${price}</div>
        <div class="card__change" style="color: ${
            change < 0 ? 'red' : 'green'
        }">${change < 0 ? change : '+' + change}% <span>&bull;</span> 24h</div>
    `;
};

const fetchCoin = () => {
    selectedCurrency = select.value;

    try {
        fetch(
            `${host}/coins/markets?vs_currency=${selectedCurrency}&ids=the-open-network`
        )
            .then((result) => result.json())
            .then(renderCard);
    } catch (e) {
        console.error(e);
    }

    setTimeout(fetchCoin, 20000);
};

// START
window.addEventListener('resize', appHeight);
appHeight();

window.addEventListener('load', () => {
    fetchCoin();
});

// DOM
const cardContainer = _ge('[data-toncoin-card]');

const select = _ge('[data-select]');
select.innerHTML = Object.keys(currency).map(
    (item) => `<option value=${item}>${currency[item]}</option>`
);
select.addEventListener('change', fetchCoin);
