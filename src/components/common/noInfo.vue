<template>
	<div class="noInfo">
		<div>
			<img src="../../assets/img/no_info.png" alt="">
		</div>
	</div>
</template>

<script>
	
	export default {
		data() {
			return {

			}
		}
	}
</script>

<style scoped>
	.noInfo {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.noInfo>div {
		width: 300px;
		height: 249px;
	}
</style>