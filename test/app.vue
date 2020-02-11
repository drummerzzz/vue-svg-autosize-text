<template>
	<div>
		<input v-model="text" style="font-size: 50px">
		<svg style="padding-top: 5rem" viewBox="0 0 1080 1080" width="1080" height="1080">
			<!-- <g transform="translate(10, 10)">
				<text  font-size="50" v-wrap.400="text"></text>
			</g> -->
			<g transform="translate(300, 10)">
				<text  font-size="50" v-wrap="{ physicalMeasurement: false, text: text, width: 400}"></text>
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