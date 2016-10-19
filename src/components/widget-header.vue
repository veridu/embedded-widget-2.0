<style lang="scss" scoped>
    @import "../sass/functions";

    .veridu-embedded-widget-header {
        h4 {
            font-size: em(17);
            margin-top: em(15,17);
            margin-bottom: em(15,17);
            font-weight: bold;
            text-align: left !important;

            img {
                width: 1.4em;
                cursor: pointer;
                position: relative;
                top: -2px;
            }
        }
        p {
            margin: 0;
        }
        
        .veridu-embedded-widget-progress {
            display: block;
            margin-bottom: 0.8em
        }
    }
</style>

<template>
    <header class="veridu-embedded-widget-header">
        <h4><small
                v-show="state === 'secondary-providers'"
                @click="state = 'auth'"
            >
            <img :src="arrowLeftImg" /></small>
            {{ title }}
        </h4>
        <progress :state="state" :loading="loading" :percentage="percentage"></progress>
        <p v-show="state === 'auth' || state === 'secondary-providers'">{{subtitle}}</p>
    </header>
</template>

<script>
import cfg from '../config.js';
import ProgressComponent from './progress.vue';

export default {
    data() {
        return {
            arrowLeftImg: `${cfg.imgAssetsBaseUrl}/material-arrow-left.svg`,
            authenticated: false,
            verified: false
        };
    },
    props: ['state', 'loading', 'percentage'],
    methods: {},
    components: {
        progress: ProgressComponent
    },
    computed: {
        title() {
            switch (this.state) {
                case 'auth':
                case 'secondary-providers':
                    if (this.loading)
                        return this.translate('header.title.loading');
                    if (this.authenticated)
                        return this.verified ? this.translate('header.title.verified') : this.translate('header.title.more_sources_needed');
                    return this.translate('header.title.default');
                    break;

                case 'finish':
                    if (this.verified)
                        return this.translate('header.title.verified');
                    return this.translate('header.title.failed');
                    break;
                case 'initial':
                    return this.translate(`header.title.introduction`);
                    break;
                default:

            }
        },
        subtitle() {
            switch (this.state) {
                case 'auth':
                case 'secondary-providers':
                    if (this.loading)
                        return this.translate('header.subtitle.loading');
                    if (this.authenticated)
                        return this.verified ? '' : this.translate('header.subtitle.more_sources_needed');
                    return this.translate('header.subtitle.default');
                    break;

                case 'initial':
                    return ``;
                    break;
                default:
            }

        }
    },
    ready() {
        this.$on('authenticated', e => this.authenticated = true);
        this.$on('logged-out', e => this.authenticated = false);
        this.$on('verified', e => this.verified = true);
    }
}
</script>
