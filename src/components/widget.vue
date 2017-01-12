<style lang="scss">
    @import "../sass/functions";
    @import "../sass/variables";

    .veridu-embedded_widget {
        @import "../sass/reset";
        @import "../sass/bootstrap";

        font-size: $font-size-base;
        line-height: $line-height-base;
        color: $text-color;
        position: relative;
        display: inline-block;
        width: em(278);

        .veridu-embedded_widget__body {
            min-height: em(110);
            padding-top: em(15);
            padding-bottom: em(15);
        }
        
        * {
            text-align: left;
            text-transform: none;
        }

        button {
            cursor: pointer
        }
    }
</style>

<template>
    <div class="veridu-embedded_widget">
        <widget-header
            :state.sync="state"
            :loading="loading"
            :authenticated="authenticated"
            :percentage="percentage"
        ></widget-header>
        <div class="veridu-embedded_widget__body">
            <introduction
                v-show="state === 'initial'"
                :state.sync="state"
            ></introduction>
            <providers
                :state.sync="state"
                :providers="primaryProviders"
                :loading-providers.sync="loadingProviders"
                :loaded-providers.sync="loadedProviders"
                :terms-accepted="termsAccepted"
            ></providers>
            <secondary-providers
                :state.sync="state"
                :providers="secondaryProviders"
                :loading-providers="loadingProviders"
                :loaded-providers="loadedProviders"
                :terms-accepted="termsAccepted"
            ></secondary-providers>
            <finish
                v-show="state === 'finish'"
                :state="state"
            ></finish>
            <email-verification 
                :show-email-form.sync="showEmailForm"
            ></email-verification>
            <sms-verification 
                :show-sms-form.sync="showSmsForm"
            ></sms-verification>
        </div>
        <widget-footer
            :state="state"
            :terms-accepted.sync="termsAccepted"
            :merchant="merchant"
        ></widget-footer>
    </div>
</template>

<script>
import cfg from '../config';
import Vue from 'vue';

// components
import EmailVerification from './email-verification.vue';
import SmsVerification from './sms-verification.vue';
import ProvidersComponent from './providers.vue';
import SecondaryProvidersComponent from './secondary-providers.vue';
import WidgetHeaderComponent from './widget-header.vue';
import WidgetFooterComponent from './widget-footer.vue';
import IntroComponent from './introduction.vue';
import FinishComponent from './finish.vue';

var GATES = {
    NOCHARGEBACK: 'nochargebackgate'
};

export default {
    data: () => {
        return {
            // states: ['initial', 'auth', 'secondary-providers', 'finish']
            state: 'initial',
            addedSources: [],
            sources: {},
            showEmailForm: false,
            showSmsForm: false,
            tokens: {},
            loading: false,
            ga: undefined,
            goals: {},
            termsAccepted: true,
            verified: false,
            authenticated: false,
            percentage: 0,
            loadingProviders: {facebook : false, google : false, linkedin : false, twitter : false, amazon : false, instagram : false, paypal : false, spotify : false, yahoo : false, dropbox : false },
            loadedProviders: {facebook : false, google : false, linkedin : false, twitter : false, amazon : false, instagram : false, paypal : false, spotify : false, yahoo : false, dropbox : false },
            DOM: {},
            cfg: cfg
        }
    },
    props: {
        merchant: {
            type: Object,
            coerce: prop => {
                if (! prop) return {};
                return JSON.parse(prop.replace(/'/g,'"'));
            }
        },
        translations: {
            type: Object,
            coerce: prop => {
                if (! prop) return {};
                let translations = JSON.parse(prop.replace(/'/g,'"'));
                return translations;
            }
        }
    },
    methods: {
        queryDOM(selector) {
            if (this.DOM[selector]) {
                return this.DOM[selector];
            }
            this.DOM[selector] = document.querySelector(selector);
            return this.DOM[selector];
        },
        dispatchEvent(type, data) {
            let evt = new CustomEvent('Veridu.EmbeddedWidget');
            evt.payload = { type, data };
            window.dispatchEvent(evt);
        },
        showEmail() {
            this.showEmailForm = true;
        },
        showSms() {
            this.showSmsForm = true;
        },
        logout(provider) {
            
        },
        initAnalytics() {
            (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
            (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
            m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
            })(window,document,'script','https://www.google-analytics.com/analytics.js','VeriduEmbeddedWidgetAnalytics');

            window.VeriduEmbeddedWidgetAnalytics('create', 'UA-78049487-3', 'auto');
            window.VeriduEmbeddedWidgetAnalytics('send', 'pageview');
            this.ga = window.VeriduEmbeddedWidgetAnalytics;
        },
        goal(key) {
            if ((! this.goals[key]) && this.ga) {
                this.goals[key] = true;
                this.ga('send', 'event', 'goal', key, key, 1);
            }
        },
        finish(data) {
            this.state = 'finish';
            this.percentage = 1;
            this.verified = true;
            this.loading = false;
            this.$broadcast('verified', data);
            this.dispatchEvent('verification-success', data);
            this.goal('user-verified');
        },
        providerAdded(key) {
            this.$root.$broadcast('provider.added', key);
            this.$root.$broadcast('idle', key);
            this.addedSources.push(key);
            this.$setItem('addedSources', this.addedSources);
        },
        reset() {
            return this.$removeItem('addedSources') && this.$removeItem('userToken');
        },
        poll() {
            const url = `${cfg.URL.API}profiles/_self`;
            this.polling = true;
            this.$http.get(url, {}, {
                headers : {
                    'Authorization': `UserToken ${this.userToken}`
                }
            }).then(
                    resp => {
                        let data = resp.data.data,
                            lightFacts = {},
                            pass = 0,
                            gates = data.gates,
                            sources = data.sources;

                        this.dispatchEvent('poll', data);
                        this.rawData = data.attributes;

                        gates.map(gate => {
                            if (gate.pass) {
                                pass++;
                                if (gate.slug === `${GATES.NOCHARGEBACK}-${this.confidenceLevel}`) {
                                    return this.finish(data);
                                }
                            }
                        });

                        this.sources = {};
                        
                        sources = sources.map(source => {
                            this.sources[source.name] = source;
                        });

                        for (let sourceName in this.sources) {
                            if(this.addedSources.indexOf(sourceName) === -1) {
                                this.addedSources.push(sourceName);
                                this.$broadcast('provider.added', sourceName);
                                this.$broadcast('idle', sourceName);
                            }
                        };

                        this.percentage = this.verified ? 1 : (pass / gates.length);
                        setTimeout(this.poll, 2000);
                    }
                );
        }
    },
    components: {
        'providers': ProvidersComponent,
        'secondary-providers': SecondaryProvidersComponent,
        'widget-header': WidgetHeaderComponent,
        'widget-footer': WidgetFooterComponent,
        'email-verification': EmailVerification,
        'sms-verification': SmsVerification,
        'introduction': IntroComponent,
        'finish': FinishComponent
    },
    computed: {
        primaryProviders() {
            let max = 3; // 3rd el
            return cfg.olc.providers.filter((e, i) => {
                if (! e.data.enabled) {
                    max++;
                }
                return e.data.enabled && i < max;
            });
        },
        secondaryProviders() {
            let max = 3; // 3rd el
            return cfg.olc.providers.filter((e, i) => {
                if (! e.data.enabled) {
                    max++;
                }
                return e.data.enabled && i >= max;
            });
        }
    },

    created(){
        this.initAnalytics();
        this.confidenceLevel = 'medium';

        // initialize token from storage
        // let $addedSources = this.$getItem('addedSources'),
        //     $userToken = this.$getItem('userToken');

        // $userToken.then(token => {
        //     if (! token) return;

        //     this.userToken = token;
        //     this.$broadcast('user-token');
        //     this.authenticated = true;
        //     if (! this.polling) {
        //         this.poll();
        //     }
        // });

        // $addedSources.then(sources => {
        //     if (sources && sources.length) {
        //         sources.map(source => {
        //             this.$broadcast('provider.added', source);
        //             this.$broadcast('idle', source);
        //         });

        //         this.addedSources = sources;
        //     }
        // });

        // preferences
        if (+cfg.preferences.introDuration === 0) {
            this.state = 'auth';
        } else {
            if (cfg.preferences.introDuration !== 'indefinite') {
                setTimeout(() => {
                    if (this.state === 'initial')
                        this.state = 'auth';
                }, (+cfg.preferences.introDuration * 1000));
            }
        }

        // received feedback from widget endpoint
        window.addEventListener('message', evt => {
            if (evt.origin.indexOf('widget.idos.io') !== -1) {
                let data = evt.data;
                if (data.message === 'idos:source.added') {
                    this.$broadcast('provider.added', data.source);
                    this.addedSources.push(data.source);
                    this.$setItem('addedSources', this.addedSources);

                    if (! this.authenticated) {
                        this.authenticated = true;
                        this.userToken = data.tokens.user_token;
                        this.$setItem('userToken', this.userToken);
                        this.$broadcast('user-token');
                    }
                }
    
                if (! this.polling) {
                    this.poll();
                }

                this.loading = true;
                setTimeout(() => {
                    this.loading = false;
                    this.loaded = true;
                    this.$broadcast('idle', data.source);
                }, 3500);
            }
        });
    }

};
</script>
