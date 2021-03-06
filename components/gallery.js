Vue.component('gallery', {
    data: function () {
        return {
            style: {
                div: {
                    position: 'absolute',
                    top: '7rem',
                    right: '1rem',
                    left: '1rem',
                    zIndex: '10001',
                    backgroundColor: '#fff',
                    borderRadius: '0.1rem',
                },
                item: {
                    height: '1.5rem',
                    width: '100%',
                    paddingLeft: '0.3rem',
                    borderTop: '1px solid #ccc',
                    fontSize: '0.47rem',
                    lineHeight: '1.5rem',

                }

            },
        }
    },
    created: function () {

    },
    methods: {
        handleSelect: function (val, key) {
            this.$emit('selected', {
                index: val,
                key: key,
            });
        }
    },
    props: {
        itemdata: {
            type: Array,
            required: true,
        },
        show: {
            type: Boolean,
            required: true,
        },
    },
    template: '\
        <div class="mui-content-padded">\
            <img src="../images/yuantiao.jpg" data-preview-src="" data-preview-group="1" />\
            <img src="../images/muwu.jpg" data-preview-src="" data-preview-group="1" />\
            <img src="../images/shuijiao.jpg" data-preview-src="" data-preview-group="1" />\
        </div>\
        ',
})