export async function get(route) {
    return await fetch(route, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    }).then((response) => {
        if (!response.ok) throw new Error(response.statusText);

        try {
            const body = response.json();
            return Promise.resolve(body);
        } catch (e) {
            return Promise.reject({ error: 'Error parce' });
        }
    });
}
