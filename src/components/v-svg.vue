<style lang="scss">
.veridu-embedded_widget {
    .veridu-embedded-widget-button {
        svg {
            position: relative;
            top: 1px;
            z-index: 5;
            height: 1.30em !important;
            max-width: 26px;
        }
        .v-hidden {
            opacity: 0;
        }
    }
}
</style>

<template>
    <span>{{{ content }}}</span>
</template>


<script>

export default {
    data() {
        return {
            content: ''
        }
    },
    props: ['src', 'color', 'height'],
    computed: {},
    created() {
        this.$http.get(this.src)
            .then(
                resp => {
                    let svg = resp.data;
                    if (this.$root.cfg.preferences.buttonIconColor && this.$root.cfg.preferences.buttonIconColor.length) {
                        svg = svg.replace(/#FFFFFF/g, this.$root.cfg.preferences.buttonIconColor);
                    }
                    if (this.color && this.color.length) {
                        svg = svg.replace(/#FFFFFF/g, this.color);
                        svg = svg.replace(/#000000/g, this.color);
                    }
                    this.content = svg;

                    // setTimeout(()=>{
                    //     let svg = this.$el.querySelector('svg');
                    //     svg.style.fill = this.color || this.$root.cfg.preferences.buttonIconColor;
                    // }, 0);
                }
            );
    }
}
</script>
