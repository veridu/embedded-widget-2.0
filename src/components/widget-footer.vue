<style lang="scss" scoped>
    @import "../sass/functions";

    .veridu-embedded-widget-footer {
        color: #9b9b9b;
        font-size: em(13);

        h4 {}
        p {}

        table {
            width: 100%;
        }

        td.veridu-embedded-widget-veridu-id {
            padding-right: 0.25em;
            text-align: left;
            width: 3.0em;
        }

        #gray-id {
            width: 2.2em !important;
            height: 2.2em !important;
        }

        td.veridu-embedded-widget-t_c {
            span {
                position: relative;
                top: - em(1);
                line-height: 1.3;
                svg {
                    height: 1.5em;
                    fill: #cbcacb;
                    cursor: pointer;
                    position: relative;
                    top: em(4);
                    left: - em(7);
                }
            }
            a {
                color: inherit;
                span > span:first-of-type {
                    position: relative;
                    left: - em(12);
                }
            }

            font-size: em(13);
        }

        td.veridu-embedded-widget__img {
            text-align: right;
        }
    }
</style>

<template>
    <footer class="veridu-embedded-widget-footer">
        <table>
            <tbody>
                <tr>
                    <td class="veridu-embedded-widget-t_c">
                        <span class="checked" v-show="termsAccepted" @click="termsAccepted = false">
                            <svg fill="#9b9b9b" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0 0h24v24H0z" fill="none"/>
                                <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                            </svg>
                        </span>
                        <span class="not-checked" v-show="! termsAccepted" @click="termsAccepted = true">
                            <svg fill="#9b9b9b" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
                                <path d="M0 0h24v24H0z" fill="none"/>
                            </svg>
                        </span>
                        <a :href="merchant.termsOfUse" target="_blank">
                            <span v-show="terms.length === 2">
                                <span track-by="$index" v-for="term in terms">{{ term }}<br></span>
                            </span>
                            <span v-show="terms.length !== 2">
                                {{ terms }}
                            </span>
                        </a>
                    </td>
                    <td class="veridu-embedded-widget__img">
                        <a :href="merchant.url" target="_blank">
                            <img class="merchant__logo" :src="merchant.logo" :title="merchant.name" />
                        </a>
                    </td>
                </tr>
            </tbody>
        </table>
    </footer>
</template>

<script>
import cfg from '../config.js';
import vSvgComponent from './v-svg.vue';

export default {
    data() {
        return {
            baseImgUrl: cfg.imgAssetsBaseUrl
        };
    },
    computed: {
        logo(){
            return `${this.baseImgUrl}/big-id.svg`;
        },
        terms() {
            let t = this.translate('footer.terms_and_conditions'),
                v = [];

            if (t.indexOf('<br') !== -1) {
                v.push(t.replace(/(.*)<br.?>.*/, '$1'));
                v.push(t.replace(/.*br.?>/, ''));
            } else {
                v.push(t);
            }
            return v;
        }
    },
    props: {
        merchant: {
            type: Object,
            required: true,
            coerce: prop => {
                if (! prop )
                    return {};

                prop.url        = cfg.preferences.logoUrl || `https://veridu.com`;
                prop.name       = cfg.preferences.logoUrl || `https://veridu.com`;
                prop.logo       = cfg.preferences.logo || `${cfg.imgAssetsBaseUrl}/verified-gray.svg`;
                prop.termsOfUse = cfg.preferences.terms_and_conditions || `https://veridu.com/wiki/Terms_%26_Conditions`;

                return prop;
            }
        },
        termsAccepted: {}
    },
    components: {
        'v-svg': vSvgComponent
    },
    ready() {
        let img = this.$el.querySelector('.merchant__logo');

        if (this.merchant.logoWidth)
            img.style.width = this.merchant.logoWidth;
        if (this.merchant.logoHeight)
            img.style.height = this.merchant.logoHeight;

    }
}
</script>
