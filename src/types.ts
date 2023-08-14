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

export interface userData {
    address: string;
    balance: number;
    name: string | undefined;
    status?: string;
    is_scam?: boolean;
}

export interface IState {
    price: number;
    change: number;
    userData: userData;
    defaultStorage: IStorage;
}