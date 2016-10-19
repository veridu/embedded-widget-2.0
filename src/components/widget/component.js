import Vue from 'vue';
import tpl from './template.html';

// define
var Component = Vue.extend({
    template: tpl,
    props: [],
    data() {
        return {
            state: 'initial'
        }
    },
    methods: {},
    components: {},
    created() {
    }
});

export default Component;
