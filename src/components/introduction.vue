<style lang="scss" scoped>
    @import "../sass/functions";

    h5 {
        margin-top: 0;
        font-size: em(13);
        font-weight: 500;
        margin-bottom: em(9);
        letter-spacing: initial;
        line-height: 1.4;
    }
    a {
        font-size: em(13);
        text-decoration: underline;
        text-transform: capitalize;
    }
</style>

<template>
    <div>
        <h5>
            {{ translate('general.introduction') }}
        </h5>
        <a href="javascript:;" @click.prevent="state = 'auth'">{{ translate('general.continue') }}</a>
    </div>
</template>

<script>
export default {
    props: ['state'],
    methods: {},
    computed: {},
    created() {
    }
}
</script>
