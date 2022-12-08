export async function get(route) {
    return await fetch(route, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    })
        .then((response) => {
            if (!response.ok) throw new Error(response.statusText);
            return response;
        })
        .then((response) => {
            const body = response.json();
            return Promise.resolve(body);
        })
        .catch((err) => Promise.reject({ error: 'Error parse' }));
}

export async function post(route, body) {
    return await fetch(route, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    })
        .then((response) => {
            if (!response.ok) throw new Error(response.statusText);
            return response;
        })
        .then((response) => {
            const body = response.json();
            return Promise.resolve(body);
        })
        .catch((err) => Promise.reject({ error: 'Error parse' }));
}
