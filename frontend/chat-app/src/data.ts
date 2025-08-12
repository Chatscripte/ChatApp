export async function getData(url: string) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Network response was not ok', { cause: response });
    }
    const data = await response.json();
    return data
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function postData(url: string, data: any) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error('Network response was not ok', { cause: response });
    }
    const result = await response.json();
    return result;
}

