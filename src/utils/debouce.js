export const debounce = (fn, ms) => {
    let handle;

    return (...args) => {
        clearTimeout(handle);
        handle = setTimeout(() => {
            fn.apply(this, args)
        }, ms);
    }
}