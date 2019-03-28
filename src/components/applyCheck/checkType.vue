<template>
	<div class="checkType">
		<div  v-if="c_checkStatus == 1" class="checkHaving">
			<div class="signImg">
				<img src="../../assets/img/checkHaving.png" alt="">
			</div>
			<h4 class="checkTypeText">提交成功，请等待管理员审核！</h4>
			<p class="checkNoticeText">预计3个工作日内审核完毕，审核结果会通过短信通知到您的注册手机上。</p>
			<a class="checkBtn" href="javascript:;" @click.prevent="hadWaitCheck">确定</a>
		</div>
		<div v-if="c_checkStatus == 2" class="checkSuccess">
			<div class="signImg">
				<img src="../../assets/img/checkSuccess.png" alt="">
			</div>
			<h4 class="checkTypeText">恭喜，您的地区管理审核成功！</h4>
			<p class="checkNoticeText">马上去邀请您的小助手绑定附属帐户吧！</p>
			<a class="checkBtn" href="javascript:;" @click.prevent="toBindWx">绑定微信</a>
		</div>
		<div v-if="c_checkStatus == 3" class="checkNopass">
			<div class="signImg">
				<img src="../../assets/img/checkNopass.png" alt="">
			</div>
			<h4 class="checkTypeText">抱歉，您的资质审核未通过！</h4>
			<p class="checkNoticeText">资质评估信息填写有误，请修改后重新申请。。</p>
			<a class="checkBtn" href="javascript:;">修改信息</a>
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
		computed: {
			...mapGetters([
				'c_checkStatus'
				])
		},
		methods: {
			...mapActions([
				'c_changeCheckStatus'
				]),
			hadWaitCheck() {
				this.c_changeCheckStatus(2)
			},
			toBindWx() {
				this.c_changeCheckStatus(4)
			}
		}
	}
</script>

<style scoped>
	.checkType {
		width: 100%;
		height: 100%;
	}
	.checkHaving, .checkSuccess, .checkNopass {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
	}
	.signImg {
		width: 105px;
		height: 105px;
		margin-bottom: 50px;
	}
	.checkTypeText {
		font-size: 16px;
		color: #373A3E;
		margin-bottom: 15px;
	}
	.checkNoticeText {
		font-size: 14px;
		color: #999898;
		margin-bottom: 30px;
	}
	.checkBtn {
		padding: 8px 22px;
		background: #F5A623;
		border-radius: 4px;
		font-size: 14px;
		color: #FFFFFF;
	}

</style>