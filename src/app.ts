import Select from './components/select';
import { GLOBAL_STORAGE_KEY } from './constants';
import store from './state';
import { elem, fixHeight, getCointPriceUpdate } from './utils';
import { WalletConnect } from './walletConnected';

const contentContainer = elem("[data-screen-content]");
const accountContainer = elem("[data-account]");
const slidebarToggle = elem("#slidebar .slidebar__toggle");
const slidebarBody = elem("#slidebar .slidebar__body");

const priceUpdate = async (currency: string, connect: any) => {
    const coin = await getCointPriceUpdate(currency);
    store.setPrice(coin.price);
    store.setChange(coin.change);
    connect.renderAccountContainer();
}

function toncoinScreen(props: {container: Element, isInit: boolean, connect: any}) {
    const container = props.container;
    const isInit = props.isInit || false;
    const connect = props.connect;

    container.innerHTML = `
        <div class="toncoinScreen">
            <div class="toncoinScreen__content">
                <h1 class="title">The current value of <span>The Open Network</span></h1>
                <div class="card" data-toncoin-card></div>
            </div>
        </div>
    `;
    const cardContainer = elem("[data-toncoin-card]");
    
    if (isInit) {
        cardContainer.innerHTML = `
            <div class="loader">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
    }

    priceUpdate(store.currency, connect).then(() => {
        cardContainer.innerHTML = `
            <div class="card__price">${store.currencyList[store.currency].symbol}${store.price}</div>
            <div class="card__change ${store.change < 0 ? 'falling' : 'rising'}"}">
                <strong>${store.change}% <span>&bull;</span> 24h</strong>
            </div>
        `;
    });

    setTimeout(() => toncoinScreen({
        container: container,
        connect: connect,
        isInit: false
    }), 60000);
}

const slidebarToggleHandler = () => {
    slidebarToggle.classList.toggle('active');
    slidebarBody.classList.toggle('active');
}

const getUrlFromHash = (connect: any) => {
    const urlFromHash = document.location.hash.substring(1).toLowerCase();

    if (urlFromHash) {

        switch (urlFromHash) {
            default:
                store.setCurrentScreen('/');
                toncoinScreen({
                    container: contentContainer,
                    isInit: true,
                    connect: connect
                });
                break;
        }
    } else {
        store.setCurrentScreen('/');
        toncoinScreen({
            container: contentContainer,
            isInit: true,
            connect: connect
        });
    }
}

// START
window.onload = () => {
    window.addEventListener('resize', fixHeight);
    fixHeight();

    store.setCurrency(
        localStorage.getItem(`${GLOBAL_STORAGE_KEY}_currency`) || 
        store.currency
    );

    const connect = new WalletConnect(accountContainer, store);

    getUrlFromHash(connect);
    window.onpopstate = () => getUrlFromHash(connect);

    // Select
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

    const changeCurrencyHandler = (item: {name: string, label: string}) => {
        store.setCurrency(item.name);
        localStorage.setItem(`${GLOBAL_STORAGE_KEY}_currency`, store.currency);
        getUrlFromHash(connect);
    };
    // end Select
    
    slidebarToggle.addEventListener('click', slidebarToggleHandler);
    accountContainer.append(connect.connectButtonSidebar());
};