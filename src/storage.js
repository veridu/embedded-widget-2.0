var Storage = {
    setItem: setItem,
    getItem: getItem,
    removeItem: removeItem
};

/**
 * Saves an item into localStorage.
 *
 * @param {string} key   The key on the { key => value } pair.
 * @param value The value.
 *
 * @return {void}
 */
function setItem(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value));
}

/**
 * Gets an item from the localStorage.
 *
 * @param  {string} key The key on the { key: value } pair.
 * 
 * @return The value.
 */
function getItem(key) {
    var _this = this;
    try {
        return JSON.parse(window.localStorage.getItem(key));
    } catch (e) {
        _this.removeItem(key);
        return null;
    }
}

/**
 * Removes an item.
 *
 * @param  {string} key The key on the { key: value } pair.
 *
 * @return {void}
 */
function removeItem(key) {
    window.localStorage.removeItem(key);
}

export default Storage;
