const appHeight = () => {
    const doc = document.documentElement;
    doc.style.setProperty('--app-height', `${window.innerHeight}px`);
};

const getPrice = () => {
    const currency = ['usd'];
    const ids = ['the-open-network'];

    const priceContainer = document.querySelector('[data-card="price"]');
    const changeContainer = document.querySelector('[data-card="change"]');

    fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${ids.join(
            ','
        )}&vs_currencies=${currency.join(',')}&include_24hr_change=true`
    )
        .then((result) => result.json())
        .then((data) => {
            const coins = Object.getOwnPropertyNames(data);

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
        });

    setTimeout(getPrice, 20000);
};

window.addEventListener('resize', appHeight);
appHeight();

window.addEventListener('load', getPrice);
