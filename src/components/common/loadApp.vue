<template>
	<div class="loadApp">
		<img src="../../assets/img/qrCode.png" alt="">
		<span>优旅家APP</span>
		<p>让自驾成为一种生活方式</p>
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
	.loadApp {
		position: absolute;
		top: 70px;
		left: -50px;
		z-index: 200;
		padding: 15px;
		box-shadow: 0 0 14px 0 #ECEDF1;
		background-color: #fff;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 162px;
		height: auto;
	}
	.loadApp::before {
		content: '';
		display: block;
		position: absolute;
		top: -10px;
		left: 50%;
		margin-left: -14px;
		width: 20px;
		height: 20px;
		background-color: #fff;
		transform: rotate(45deg);
	}
	.loadApp>img {
		width: 128px;
		height: 128px;
		margin-bottom: 5px;
	}
	.loadApp>span {
		font-size: 14px;
		color: #373A3E;
	}
	.loadApp>p {
		font-size: 12px;
		color: #FFB132;
	}
</style>