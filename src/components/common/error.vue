<template>
	<div class="noInternet">
		<div>
			<img src="../../assets/img/no_internet.png" alt="">
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
	.noInternet {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.noInternet>div {
		width: 300px;
		height: 297px;
	}
</style>