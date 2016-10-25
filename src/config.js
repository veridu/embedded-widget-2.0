import Util from './util';
let version = window.IDOS_EMBEDDED_WIDGET_CONFIG.version || '1.0';
let local = window.location.toString().indexOf('http://localhost') === 0;
const prefs = normalizePrefs(window.IDOS_EMBEDDED_WIDGET_CONFIG.preferences);

export default {
    debug: local,
    assetsBaseUrl: local ? `./` : `https://assets.idos.io/1.0/`,
    imgAssetsBaseUrl: local ? `./img` : `https://assets.idos.io/1.0/img/embedded-widget`,
    version: version,
    credential: IDOS_EMBEDDED_WIDGET_CONFIG.widget.credential,
    preferences: prefs,
    olc: {
        providers :  normalizeProviders(window.IDOS_EMBEDDED_WIDGET_CONFIG.providers)
    }
};

/**
 * Normalize providers.
 *
 * @param      array  providers  The providers
 * 
 * @return     array  The normalized providers
 */
function normalizeProviders(providers) {
    var alloweds = ['facebook', 'twitter', 'google', 'yahoo', 'spotify', 'linkedin', 'google', 'amazon', 'paypal', 'dropbox'];
    return providers.filter(p => alloweds.indexOf(p.key) !== -1);
}

/**
 * Normalize preferences.
 *
 * @param      object  preferences  The preferences
 * @return     object  The normalized preferences
 */
function normalizePrefs(preferences) {
    const langs = ['en', 'pt', 'fr', 'ja', 'de', 'nl', 'es', 'it', 'zh', 'ja'];

    // lang
    if (preferences.lang == 'auto') {
        preferences.lang = (window.navigator.language) ? window.navigator.language.substring(0,2).toLowerCase() : window.navigator.browserLanguage.substring(0,2).toLowerCase();
    } else {
        preferences.lang = preferences.lang.substring(0,2).toLowerCase();
    }
    if (langs.indexOf(preferences.lang) === -1) {
        preferences.lang = 'en';
    }

    return preferences;
}
