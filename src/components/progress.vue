<style lang="scss" scoped>
    @import "../sass/variables";
    @import "../../node_modules/bootstrap-sass/assets/stylesheets/bootstrap/mixins";

    .veridu-embedded-widget-progress {
        display: block;
        width: 100%;
        height: 3px;
        background-color: #f1f1f1;
        position: relative;
        overflow: hidden;

        > div {
            position: absolute;
            display: inline-block;
            height: 100%;
            width: 0%;
            background-color: #424242;

            transition: width 0.25s ease-out;
            -webkit-transition: width 0.25s ease-out;
            transition-delay: 1s;
            -webkit-transition-delay: 1s;


            &.loading {
                background-color: $brand-primary;
            }

            &.veridu-embedded-widget-progress-bar {
                left: 0;
            }

            &.verified {
                background-color: $brand-primary
            }

            &.widget-loading__bar--1,
            &.widget-loading__bar--2 {
                transition: width 0.25s ease-out;
                -webkit-transition: width 0.25s ease-out;
                animation-name: LoadingComponentAnimation;
                animation-duration: 1.75s;
                animation-timing-function: linear;
                animation-iteration-count: infinite;
                top: 0;
                width: 4em;
            }

            &.widget-loading__bar--1 {
                left: -2em;
            }
            &.widget-loading__bar--2 {
                right: -10px;
            }
        }
    }

    @keyframes LoadingComponentAnimation{
        0% {
            transform: translate3d(0,0,0);
        }
        100% {
            transform: translate3d(250px,0,0);
        }
    }
</style>

<template>
    <div class="veridu-embedded-widget-progress" >
        <div v-show="(loading && ! $root.authenticated) || state === 'initial'" class="widget-loading__bar--1" :class="{'loading': loading}"></div>
        <div v-show="(loading && ! $root.authenticated) || state === 'initial'" class="widget-loading__bar--2" :class="{'loading': loading}"></div>
        <div v-show="state !== 'initial' && $root.authenticated" class="veridu-embedded-widget-progress-bar"  :class="{'verified' : $root.verified, 'loading' : loading}" :style="{ width: percentage }"></div>
    </div>
</template>

<script>
export default {
    props: {
        state: {},
        loading: {},
        percentage: {
            coerce: (val) => {
                return ((val * 10000) / 100) + '%';
            }
        }
    },
    methods: {},
    computed: {},
    components: {},
    ready() {
    }
}
</script>
