import cfg from '../config';

export default {
    methods: {
        translate(key, params) {
            // gives preference to user inputs
            let translated = this.$root.translations[key];
            if (! translated) {
                translated = this.$t(key, params);
                // if translation was not found
                // if (translated === key)
                //     translated = this.$t(key, cfg.preferences.fallbackLang);
            }
            return translated;
        }
    }
};
