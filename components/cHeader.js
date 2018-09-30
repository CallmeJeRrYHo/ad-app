Vue.component('c-header', {
		data: function () {
			return {
				style: {
					div: {
						width: '100%',
						height: '1.5rem',
						background: '#fff',
						position: 'fixed',
						top: '0',
						textAlign: 'center',
						fontSize: '0.54rem',
						lineHeight: '1.5rem',
						overflow: 'hidden',
						verticalAlign: 'middle',
            zIndex: '1000000',
            borderBottom: '1px solid #ccc',
            borderTop: '1px solid #ccc',
					},
					icon: {
						height: '0.88rem',
						width: '0.88rem',
						position: 'fixed',
						display:'block',
						top:'0.3rem',
						zIndex: '1000000',
					},
					back: {
						left: '0.15rem'
					},
					right: {
						right: '0.15rem',
					}
					
				},
			}
		},
		created: function () {
			// var self = this;
			// if (!self.back) {
			// 	systemBack();
			// } 
		},
		methods: {
			backFunc: function () {
				mui.back();	
			},
			plusFunc() {
        		this.plusf();
			},
		},
		props: {
			title: {
				type: [String],
				required: true,
			},
			back: {
				type: Boolean,
				default: true,
			},
			plus: {
				type: Boolean,
				default: false,
      },
      plusf: {
        type: Function,
      }
		},
		template: "\
		<div :style='style.div'>\
			<span v-if='back' @click='backFunc'>\
				<img :style='[style.icon, style.back]' src='../icons/back.png' />\
			</span>\
			<span v-if='plus' @click='plusFunc'>\
				<img :style='[style.icon, style.right]' src='../icons/add.png' />\
			</span>\
			{{ title }}\
			<slot></slot>\
		</div>\
		",
})