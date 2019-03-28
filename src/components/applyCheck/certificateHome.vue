<template>
	<div class="certificateHome">
		<div class="toApplyHome">
			<div class="applyHomeBg"></div>
			<div class="jumpToWritePage">
				<h2>Enterprise Certification</h2>
				<p>欢迎申请优旅家官方合作认证，欢迎申请优旅家官方合作认证，欢迎申请优旅家官方合作认证</p>
				<div class="jumpToBtn" @click="jumpToWritePage">开始认证</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { mapGetters , mapActions } from 'vuex';
	
	export default {
		data() {
			return {

			}
		},
		methods: {
			...mapActions([
				'c_loadingShow',
				'c_changeCheckStatus'
				]),
			jumpToWritePage() {
				this.c_loadingShow()
				this.c_changeCheckStatus(0)
					setTimeout(() => {
						this.$router.push({
							path: '/checkProcess',
						})
				}, 600);
			}
		}
	}
</script>

<style scoped>
	.certificateHome {
		position: fixed;
		left: 0;
		top: 0;
		z-index: 99;
		width: 100%;
		height: 100%;
		margin-top: 70px;
	}
	.toApplyHome {
		width: 100%;
		height: 100%;
		position: relative;
	}
	.applyHomeBg {
		width: 100%;
		height: 100%;
		position: relative;
		z-index: 1;
		background: url('../../assets/img/applyBg.png') no-repeat center center;
		background-size: cover;
	}
	.jumpToWritePage {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 10;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.jumpToWritePage>h2 {
		font-size: 60px;
		color: #fff;
		font-weight: 500;
		padding-bottom: 15px;
		border-bottom: 1px solid #fff;
		margin-bottom: 15px;
	}
	.jumpToWritePage>p {
		font-size: 22px;
		color: #fff;
		letter-spacing: 2px;
	}
	.jumpToBtn {
		width: 150px;
		height: 54px;
		border-radius: 100px;
		background: #D9DB53;
		line-height: 54px;
		text-align: center;
		font-size: 14px;
		color: #fff;
		margin-top: 120px;
	}
	.jumpToBtn:hover {
		cursor: pointer;
	}
</style>