<template>
	<div class="browserLoad">
		<div><i class="el-icon-info"></i> <span>您的浏览器版本过低，请升级或者更换浏览器！</span></div>
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
	.browserLoad {
		width: 100%;
		padding-top: 50px;
	}
	.browserLoad>div {
		font-size: 24px;
		color: #373A3E;
		text-align: center;
	}
	.browserLoad>div>span {
		display: block;
		padding-top: 20px;
		text-align: center;
	}
</style>