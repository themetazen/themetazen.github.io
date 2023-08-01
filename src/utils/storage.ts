function setStorage(key: string, value: any): void {
    localStorage.setItem(`${key}`, JSON.stringify(value));
}

function getStorage(key: string) {
    const value: string = localStorage.getItem(`${key}`);
    return value && JSON.parse(value);
}

export { setStorage, getStorage };