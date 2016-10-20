<style lang="scss" scoped>
    @import "../sass/variables";
    @import "../sass/functions";
    @import "../../node_modules/bootstrap-sass/assets/stylesheets/bootstrap/mixins";

    ul.veridu-embedded-widget-providers {
        @include clearfix();
        @include make-row();
        padding: 0;
        list-style: none;
        margin-top: 0;
        margin-bottom: 0;

        > li {
            @include make-xs-column(3);

            > div {
                .veridu-embedded-widget-button {
                    height: 3.6em;
                }
            }
        }
    }
</style>

<template>
    <ul class="veridu-embedded-widget-providers" v-show="state === 'secondary-providers'">
        <li v-for="provider in providers">
            <veridu-button :provider="provider" :loading.sync="loadingProviders[provider.key]" :loaded="loadedProviders[provider.key]" :enabled="termsAccepted"></veridu-button>
        </li>
    </ul>
</template>

<script>
import VeriduButton from './veridu-button.vue';

export default {
    props: ['providers', 'state', 'loadingProviders', 'loadedProviders', 'termsAccepted'],
    methods: {},
    computed: {},
    components: {
        'veridu-button': VeriduButton
    },
    created() {
    }
}
</script>
