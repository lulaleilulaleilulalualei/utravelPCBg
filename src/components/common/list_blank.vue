<template>
	<div class="list_blank">
		<div>
			<img src="../../assets/img/list_blank.png" alt="">
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
	.list_blank {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.list_blank>div {
		width: 300px;
		height: 265px;
	}
</style>