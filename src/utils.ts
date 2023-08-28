import { COINGECKO_ENDPOINT, COIN_KEY, TONAPI_ENDPOINT } from "./constants";

export const elem = (selector: string) => document.querySelector(selector);

export const screenAddress = (address: string) => address.slice(0, 4) + "\u2026" + address.slice(-4);

export const fixHeight = () => {
    const doc = document.documentElement;
    doc.style.setProperty('--app-height', `${window.innerHeight}px`);
};

let LAST_PRICE_UPDATE_DATE: null| number = null;
let LAST_PRICE: any;
let LAST_CHANGE: any;

export const getCointPriceUpdate = (currency: number) => {
    if (LAST_PRICE && LAST_CHANGE && LAST_PRICE_UPDATE_DATE && (Date.now() - LAST_PRICE_UPDATE_DATE < 100 * 60 * 10)) {
        return Promise.resolve({
            price: LAST_PRICE,
            change: LAST_CHANGE
        });
    }

    return getCoinPrice(currency).then((data) => {
        LAST_PRICE_UPDATE_DATE = Date.now();
        LAST_PRICE = data.price;
        LAST_CHANGE = data.change;

        return {
            price: LAST_PRICE,
            change: LAST_CHANGE
        }
    });
}

export const getCoinPrice = (currency: number) => {
    const apiUrl = 
        `${COINGECKO_ENDPOINT}/coins/markets?vs_currency=${currency}&ids=${COIN_KEY}`;

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

export const getAccountInfo = (address: string) => {
    const apiUrl = `${TONAPI_ENDPOINT}/accounts/${address}`;

    return fetch(apiUrl)
        .then((res) => res.json())
        .then((res) => res)
        .catch((e) => {
            throw e;
        });
}