var Storage = {
    setItem: setItem,
    getItem: getItem,
    removeItem: removeItem
};

function setItem(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value));
}

function getItem(key) {
    var _this = this;
    try {
        return JSON.parse(window.localStorage.getItem(key));
    } catch (e) {
        _this.removeItem(key);
        return null;
    }
}

function removeItem(key) {
    window.localStorage.removeItem(key);
}

export default Storage;
