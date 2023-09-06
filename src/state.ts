function State() {
    this.actions = {};
    this.subscriptions = [];
    this.history = [];
}

State.prototype.subscribe = function(elem: any, action: string | number, callback: { apply: (arg0: any, arg1: any) => void; }) {
    this.subscriptions[action] = this.subscriptions[action] || [];
    this.subscriptions[action].push(function(data: any) {
        callback.apply(elem, data);
    });
}

State.prototype.dispatch = function(action: string | number, data: any[]) {
    if (!Array.isArray(data)) {
        data = [data];
    } else if (Array.isArray(data)) {
        data = data || [];
    }

    this.history.push([action, data]);

    if ("function" === typeof this[action]) {
        this[action].apply(this, data);
    }

    data.push(action);
    data.push(this);

    this.subscriptions[action] = this.subscriptions[action] || [];
    this.subscriptions[action].forEach(
        function(subscription: (arg0: any) => void) {
            subscription(data);
        }
    );
}

const store = new (State as any)();

store.currentScreen = '';

store.address = '';
store.name = '';
store.balance = null;
store.activeStatus = '';

store.loadingCoin = true;
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

store.setCurrentScreen = function(screen: string) {
    this.currentScreen = screen;
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

store.setLoadingCoin = function(status: boolean) {
    this.loadingCoin = status;
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

export default store;