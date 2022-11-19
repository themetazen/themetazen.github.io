const getPrice = () => {
    const currency = ['usd'];
    const ids = ['the-open-network'];

    const priceContainer = document.querySelector('[data-price]');
    const changeContainer = document.querySelector('[data-change]');

    fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${ids.join(',')}&vs_currencies=${currency.join(',')}&include_24hr_change=true`
    )
        .then((result) => result.json())
        .then((data) => {
            const coins = Object.getOwnPropertyNames(data);

            for (let coin of coins) {
                const coinInfo = data[`${coin}`];
                const price = coinInfo[`${currency}`];
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

getPrice();
