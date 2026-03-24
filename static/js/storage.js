// Helpers pour le localstorage, évite de se taper les parse/stringify partout
export function saveToStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

export function getFromStorage(key) {
    return JSON.parse(localStorage.getItem(key));
}