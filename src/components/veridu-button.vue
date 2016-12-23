<style lang="scss" scoped>
    @import "../sass/variables";
    @import "../sass/functions";

    .veridu-embedded-widget-button-container {
        text-align: center;
        transition: box-shadow 0.2s ease-out;
        animation-name: VeriduEmbbeddedWidgetProvidersFadeIn;
        animation-duration: 0.35s;
        animation-fill-mode: both;
        animation-timing-function: linear;
        margin-bottom: 0.43em;

        small {
            text-transform: capitalize;
            &.veridu-embedded-widget-button-logout {
                display: none;
            }
            &.veridu-embedded-widget-button-label {
                text-align: center;
                display: block;
            }
        }
    }

    @keyframes VeriduEmbbeddedWidgetProvidersFadeIn {
      from {
          opacity: 0;
      }

      100% {
          opacity: 1;
      }
    }

    .veridu-embedded-widget-button {
        content:  ' ';
        width: 100%;
        height: 3.6em;
        border-radius: 10px;
        outline: 0;
        border: 0;
        margin-bottom: 0.2em;
        position: relative;
        font-size: 1em;
        text-align: center;
        background-color: #29b6f6;
        background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.2), transparent), linear-gradient(#29b6f6, #299cd6);
        transition: background-color 0.25s linear, box-shadow 0.15s linear;

        &:hover:not(.has-image):not(.loaded):not(.loading) {
            &:after {
                opacity: 0.3;
            }
        }
        &:active:not(.has-image):not(.loaded):not(.loading),
        &:focus:not(.has-image):not(.loaded):not(.loading){
            &:after {
                opacity: 0.5;
            }
        }

        &.has-image {
            background-size: 100% auto;
            background-color: transparent !important;
        }

        &:disabled {
            background-image: none;
            background-color: lighten($gray-light, 20%);
            cursor: not-allowed;
        }

        &:after {
            content: ' ';
            transition: opacity 0.25s ease-out;
            opacity: 0;
            position: absolute;
            background-color: black;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            border-radius: inherit;
            z-index: 2;
        }

        &.loading {
            background-image: none;

            &:after {
                display: block;
                animation-name: VeriduEmbbeddedWidgetButtonLoadingX;
                -webkit-animation-name: VeriduEmbbeddedWidgetButtonLoadingX;
                animation-duration: 1.75s;
                animation-fill-mode: both;
                animation-timing-function: ease-in-out;
                animation-iteration-count: infinite;
            }
        }

        &.loaded:not(.has-image) {
            &:after {
                opacity: 0.3;
            }
        }

        @keyframes VeriduEmbbeddedWidgetButtonLoadingX {
            0%, 100% {
                opacity: 0;

            }

            50% {
                opacity: 0.35;
            }
        }
    }
</style>

<template>
    <div
        class="veridu-embedded-widget-button-container"
        :class="{'loading': loading, 'loaded': loaded}"
    >
        <button
            type="button"
            @click="auth"
            class="veridu-embedded-widget-button"
            :class="{'loading': loading, 'loaded': loaded, 'has-image': picture}"
            :style="{
                backgroundImage: backgroundImage,
                backgroundColor: $root.cfg.preferences.buttonColor || ''
            }"
            :disabled="isDisabled"
            :title="title"
        >
            <v-svg :class="{ 'v-hidden' : picture}" :src="baseImgUrl + '/' + provider.key + '.svg'"></v-svg>
        </button>
        <small class="veridu-embedded-widget-button-label">
            {{ label }}
        </small>
<!--         <small class="veridu-embedded-widget-button-logout">
            {{ translate('general.logout') }}
        </small>
 -->   
    </div>
</template>


<script>
import cfg from '../config';
import Veridu from '../veridu';
import Util from '../util';
import vSvgComponent from './v-svg.vue';

export default {
    data() {
        return {
            baseImgUrl: cfg.imgAssetsBaseUrl,
            isDisabled: false
        }
    },
    props: ['provider', 'type', 'loading', 'loaded', 'enabled', 'dummy'],
    components: {
        'v-svg': vSvgComponent
    },
    methods: {
        auth() {
            if (this.dummy) return;

            if (this.loading) {
                return alert(this.translate('provider.loading', [this.provider.key]));
            }
            if (this.loaded) {
                return this.$root.logout(this.provider.key);
            } else {
                // shows the oauth step
                switch(this.provider.key) {
                    case 'email':
                        return this.showEmail();
                    break;
                    default:
                        return this.showSocial();
                    break;
                }
            }
        },
        showEmail() {
            this.$root.showEmail();
        },
        showSocial() {
            let uri,
                publicKey = cfg.credential.public,
                companySlug = cfg.companySlug,
                base_url = cfg.URL.WIDGET;
            
            if (this.$root.authenticated) {
                uri  = `oauth/${this.provider.key}/${companySlug}/${publicKey}?userToken=${this.$root.userToken}`;
            } else {
                uri  = `sso/${this.provider.key}/${companySlug}/${publicKey}`;
            }

            let url = base_url + uri;
            Util.showWindow(url);
        },
        disabled() {
            if (this.provider.key !== 'email') {
                this.isDisabled =  ! this.enabled;
            } else {
                this.isDisabled =  this.enabled ? ! this.$root.userToken : true;
            }
        }
    },
    computed: {
        picture() {
            if (this.loaded && this.$root.sources[this.provider.key]) {
                return this.$root.sources[this.provider.key].tags.profile_picture;
            }
            return '';
        },
        backgroundImage() {
            return (this.picture && this.picture.length) ? `url('${this.picture}')` : (this.$root.cfg.preferences.buttonColor || '');
        },
        title() {
            if (this.loading) {
                return `${this.provider.label} - `+ this.translate('general.loading.dots');
            }
            if (this.loaded) {
                return `${this.provider.label}`;
                // `+ this.translate('general.logout') +`
            }

            return this.provider.label;
        },
        label() {
            return this.provider.label;
        }
    },
    ready() {
        this.$on('user-token', () => {
            this.disabled();
        });
        this.$on('provider.added', provider => {
            if (provider == this.provider.key) {
                this.authenticated = true;
                this.loading = true;
            }
        });

        this.$on(`provider.removed`, provider => {
            this.authenticated = false;
            this.loaded = false;
            this.loading = true;
        });

        this.$on('idle', (provider) => {
            if (provider == this.provider.key) {
                this.loading = false;
                this.loaded = true;
            }
        });
    }
}
</script>
