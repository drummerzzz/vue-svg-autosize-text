<template>
	<div>
		<input v-model="text" style="font-size: 50px">
		<svg style="padding-top: 5rem" viewBox="0 0 400 400" width="400" height="400">
			<g transform="translate(10, 10)">
				<use  href="#origin-mark"></use>
				<text  font-size="50" v-wrap.200="text"></text>
				<rect x="0" y="-1" width="200" height="100" fill="none" stroke="blue" stroke-width="5" />
			</g>
			<g transform="translate(250, 10)">
				<use href="#origin-mark"></use>
				<text  font-size="50" v-wrap="{ physicalMeasurement: false, text: text, width: 200}"></text>
			</g>
		</svg>
	</div>
</template> 


<script>
export default {
	data () {
		return {
			text: 'teste inicial',
			width: 500
		}
	}
}
</script>