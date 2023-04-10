export const debounce = (fn, ts) => {
    let handle;

    return () => {
        clearTimeout(handle);
        handle = setTimeout(() => {
            fn.apply(this, arguments)
        }, ms);
    }
}