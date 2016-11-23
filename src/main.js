import Vue from 'vue';
import cfg from './config';
import Widget from  './components/widget.vue';
import vueResource from 'vue-resource';
import VueLocalForage from 'vue-localforage'
import vuei18n from 'vue-i18n';

// locales
import en from './i18n/en';
import pt from './i18n/pt';
import fr from './i18n/fr';

const locales = {
    en,
    pt,
    fr
};

// mixins
import translate from './mixins/translate';

// Register Vue's dependencies
Vue.use(vueResource);
Vue.use(vuei18n);
Vue.use(VueLocalForage);
Vue.mixin(translate);


// default && fallback if not found on "translations" object
Vue.config.lang = cfg.preferences.lang;

// Vue debug
if (! cfg.debug) {
  Vue.config.devtools = Vue.config.debug  = Vue.config.silent = false;
}

// common http headers
delete Vue.http.headers.delete['Content-Type'];

// set locales
Object.keys(locales).map(function (lang) {
	Vue.locale(lang, locales[lang])
});
Widget.el = cfg.preferences.selector;
window['VeriduEmbeddedWidget'] = new Vue(Widget);
