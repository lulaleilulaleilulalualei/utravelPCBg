<template>
	<div class="showOfficialBox">
		<div class="codeBox">
			<img src="../../assets/img/Official_code.jpg" alt="">
			<h4>优旅家公众号</h4>
			<span>发现更多好玩</span>
		</div>
		<div class="codeBox">
			<img src="../../assets/img/small_App_code.jpg" alt="">
			<h4>优旅家小程序</h4>
			<span>发现更多精彩</span>
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
	.showOfficialBox {
		position: absolute;
		right: 50px;
		bottom: 40px;
		padding: 15px;
		background-color: #FFFFFF;
		box-shadow: 0 0 14px 0 #ECEDF1;
		height: auto;
		width: auto;
		display: flex;
	}
	.codeBox {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.codeBox:first-child {
		margin-right: 15px;
	}
	.codeBox>img {
		width: 128px;
		height: 128px;
		display: block;
		margin-bottom: 5px;
	}
	.codeBox>h4 {
		font-size: 14px;
		color: #373A3E;
		display: block;
		font-weight: normal;
	}
	.codeBox>span {
		display: block;
		font-size: 12px;
		color: #FFB132;
	}
</style>
