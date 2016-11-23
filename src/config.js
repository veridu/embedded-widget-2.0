import Util from './util';
let version = window.IDOS_EMBEDDED_WIDGET_CONFIG.version || '1.0';
let local = window.location.toString().indexOf('http://localhost') === 0;
const prefs = normalizePrefs(window.IDOS_EMBEDDED_WIDGET_CONFIG.preferences);

export default {
    debug: local,
    URL: {
        WIDGET: local ? 'http://widget.idos.io:8001/index.php/1.0/' : 'https://widget.idos.io/1.0/',
        API: local ? 'http://api.idos.io:8000/index.php/1.0/' : 'https://api.idos.io/1.0/'
    },
    assetsBaseUrl: local ? `./` : `https://assets.idos.io/1.0/`,
    imgAssetsBaseUrl: local ? `./img` : `https://assets.idos.io/1.0/img/embedded-widget`,
    version: version,
    companySlug: IDOS_EMBEDDED_WIDGET_CONFIG.widget.companySlug, 
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
    var alloweds = ['facebook', 'twitter', 'google', 'yahoo', 'spotify', 'linkedin', 'google', 'amazon', 'paypal', 'dropbox', 'email'];
    return providers.filter(p => alloweds.indexOf(p.key) !== -1);
}

/**
 * Normalize preferences.
 *
 * @param      object  preferences  The preferences
 * @return     object  The normalized preferences
 */
function normalizePrefs(preferences) {
    const langs = ['en', 'pt', 'fr'];

    function normalizeLang(lang) {
        return lang.substring(0,2).toLowerCase();
    }

    // lang
    if (preferences.lang == 'auto') {
        const lang = (window.navigator.languages && window.navigator.languages[0])
            || window.navigator.browserLanguage
            || window.navigator.language;

        preferences.lang = normalizeLang(lang);
    } else {
        preferences.lang = normalizeLang(preferences.lang);
    }

    if (langs.indexOf(preferences.lang) === -1) {
        preferences.lang = 'en';
    }
    
    console.log(preferences.lang);

    return preferences;
}
