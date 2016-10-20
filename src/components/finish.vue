<style lang="scss" scoped>
    p {
        margin-top: 0;
    }
</style>

<template>
    <p>
        {{ message }}
    </p>
</template>

<script>

export default {
    props: ['state'],
    methods: {},
    computed: {
        message() {
            return (this.$root.verified) ? this.translate('finish.success') : this.translate('finish.fail');
        }
    },
    created() {}
}
</script>
