export const elem = (sel: string) => document.querySelector(sel);

export const fixHeight = () => {
    const doc = document.documentElement;
    doc.style.setProperty('--app-height', `${window.innerHeight}px`);
};