import Vue from 'vue';
import { ConfiguredWrapper } from '../src/polyfills';
const appTemplate = require('./app.vue').default;
new Vue(Object.assign(appTemplate, {
	directives: {
		wrap: ConfiguredWrapper({
			lineHeight: '1.5em',
		}),
		noalign: ConfiguredWrapper({
			align: 'none'
		}),
		wrapPad: ConfiguredWrapper({
			width: 200,
			padding: 20
		})
	},
	el: '#app',
	data: {
		text: null,
		fmtText: null
	},
	// watch: {
	// 	text: function(a, b){
	// 		console.log('atualziou')
	// 	}
	// },
	methods: {
		afterReflow(sender) {
			console.log('Reflow:', sender);
		}
	},
	mounted() {
		window.setTimeout(() => {
			this.text = 'dkkdkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk kkkkkkkkkkkkkdjddjj j j j j jdjdjdjdjddj jjjjjjjjjjjjjjjjj jjjjjjjjjjjjjjjjj j       ';
			this.fmtText = '<tspan style="font-weight:bold">Lorem ipsum, dolor</tspan><tspan fill="red"> sit amet consectetur adipisicing elit. Adipisci</tspan><tspan style="font-style:italic"> enim laudantium, quisrepelle ndusipsum oditremomnisv elitiusto!</tspan> Similique porro sint libero quas, voluptate fugiat aliquid laborum. Non, asperiores.';
		}, 500);
	}
}));