const _ge = (elem) => document.querySelector(elem);

const appHeight = () => {
    const doc = document.documentElement;
    doc.style.setProperty('--app-height', `${window.innerHeight}px`);
};

const currency = {
    'usd': 'United States Dollar',
    'eur': 'Euro',
    'rub': 'Russian Ruble',
    'krw': 'South Korean Won'
};

const selectedCurrency = Object.keys(currency)[0];

const renderCard = (data) => {
    const coins = Object.keys(data);

    for (let coin of coins) {
        const coinInfo = data[coin];
        const price = coinInfo[currency].toFixed(2);
        const change = coinInfo[`${currency}_24h_change`].toFixed(2);

        priceContainer.innerText = `$${price}`;

        changeContainer.style.color = `${change < 0 ? 'red' : 'green'}`;
        changeContainer.innerHTML = `${
            change < 0 ? change : '+' + change
        }% <span>&bull;</span> 24h`;
    }
}

const getPrice = () => {
    fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=the-open-network&vs_currencies=${selectedCurrency}&include_24hr_change=true`
    ).then((result) => result.json())
    .then(renderCard);

    setTimeout(getPrice, 20000);
};

window.addEventListener('resize', appHeight);
appHeight();

window.addEventListener('load', () => {
    getPrice();
});

// DOM
const priceContainer = _ge('[data-card="price"]');
const changeContainer = _ge('[data-card="change"]');