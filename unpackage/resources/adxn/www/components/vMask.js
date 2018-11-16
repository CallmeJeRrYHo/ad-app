Vue.component('v-mask', {
    data: function () {
        return {
            style: {
                div: {
                    position: 'fixed',
                    top: '0',
                    right: '0',
                    left: '0',
                    bottom: '0',
                    zIndex: '10000',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                },   
            },
        }
    },
    created: function () {
        
    },
    methods: {
        
    },
    props: {
        show: {
            type: Boolean,
            required: true,
        },	
    },
    methods: {
      closeMask() {
        this.$emit('close');
      }
    },
    template: '\
    <div :style="style.div" v-if="show" @click="closeMask">\
    </div>\
    ',
})