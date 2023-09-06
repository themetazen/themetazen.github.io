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

export const getCointPriceUpdate = async (currency: string) => {
    if (LAST_PRICE && 
        LAST_CHANGE && 
        LAST_PRICE_UPDATE_DATE && 
        (Date.now() - LAST_PRICE_UPDATE_DATE < 100 * 60 * 10) && 
        LAST_CURRENCY === currency
    ) {
        return Promise.resolve({
            price: LAST_PRICE,
            change: LAST_CHANGE
        });
    }

    try {
        const data = await getCoinPrice(currency);
        const coin = Object.assign({}, ...data);
        const {
            current_price, price_change_percentage_24h
        } = coin;

        LAST_CURRENCY = currency;
        LAST_PRICE_UPDATE_DATE = Date.now();
        LAST_PRICE = current_price.toFixed(2);
        LAST_CHANGE = price_change_percentage_24h.toFixed(2);
        return {
            price: LAST_PRICE,
            change: LAST_CHANGE
        };
    } catch {
        return {
            price: 0,
            change: 0
        };
    }
}

export const getCoinPrice = async (currency: string) => {
    const apiUrl = 
        `${COINGECKO_ENDPOINT}/coins/markets?vs_currency=${currency}&ids=${COIN_KEY}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error.message);
    }
}

export const getAccountInfo = async (address: string) => {
    const apiUrl = `${TONAPI_ENDPOINT}/accounts/${address}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error.message);
    }
}