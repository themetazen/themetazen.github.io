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
let LAST_CURRENCY: string;

export const getCointPriceUpdate = (currency: string) => {
    if (LAST_PRICE && LAST_CHANGE && LAST_PRICE_UPDATE_DATE && (Date.now() - LAST_PRICE_UPDATE_DATE < 100 * 60 * 10) && LAST_CURRENCY === currency) {
        return Promise.resolve({
            price: LAST_PRICE,
            change: LAST_CHANGE
        });
    }

    return getCoinPrice(currency)
        .then((data) => {
            const coin = Object.assign({}, ...data);
            const {
                current_price,
                price_change_percentage_24h
            } = coin;

            LAST_CURRENCY = currency;
            LAST_PRICE_UPDATE_DATE = Date.now();
            LAST_PRICE = current_price.toFixed(2);
            LAST_CHANGE = price_change_percentage_24h.toFixed(2);

            return {
                price: LAST_PRICE,
                change: LAST_CHANGE
            }
        })
        .catch(() => {
            return {
                price: 0.00,
                change: 0.00
            }
        });
}

export const getCoinPrice = (currency: string) => {
    const apiUrl = 
        `${COINGECKO_ENDPOINT}/coins/markets?vs_currency=${currency}&ids=${COIN_KEY}`;

    return fetch(apiUrl)
        .then((res) => res.json())
        .then((res) => res)
        .catch((err) => {
            throw err;
        });
}

export const getAccountInfo = (address: string) => {
    const apiUrl = `${TONAPI_ENDPOINT}/accounts/${address}`;

    return fetch(apiUrl)
        .then((res) => res.json())
        .then((res) => res)
        .catch((err) => {
            throw err;
        });
}