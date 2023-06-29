export interface ICurrency {
    [index: string]: {
        name: string;
        symbol: string;
    }
}

export interface IStorage {
    currency: string;
    address: string | null;
    lastPrice: number;
    lastChange: number;
}

export interface IState {
    price: number;
    change: number;
    defaultStorage: IStorage;
}