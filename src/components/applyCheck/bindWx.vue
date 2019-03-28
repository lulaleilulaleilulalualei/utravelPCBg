<template>
	<div class="bindWx">
		<div class="bindWxNotice">一个账户至多绑定四个附属微信帐号，可直接登录优旅家，并拥有xxxxx权限，请谨慎设置。 <b></b></div>
		<div class="itemBindWx" v-for="(item,index) in acountArr" :key="index">
			<b class="itemBindWxIcon"></b>
			<span class="itemCountNum">附属账号{{index + 1}}</span>
			<div v-if="item.isBind" class="hadBindWx">
				<div class="wxCountBox">
					<span>{{item.wxAcount}}</span>
					<span>已绑定</span>
				</div>
				<span class="bindWxEdit">修改</span>
				<span class="bindWxDelete">删除</span>
			</div>
			<div v-if="!item.isBind" class="noBindWx">
				<div class="toBindWx">绑定微信</div>
			</div>
		</div>
		<div class="bindComplete"> <span @click="toJumpHome">完成</span> </div>

		<div class="wxScanCode" v-if="false">
			<div class="showCodeImg">
				<img src="../../assets/img/qrCode.png" alt="">
			</div>
			<div class="showCodeNotice">
				为了您的账户安全<br/>
				请使用主账号扫码确认
			</div>
		</div>
	</div>
</template>

<script>
	import { mapGetters , mapActions } from 'vuex';

	export default {
		data() {
			return {
				acountArr: [
					{
						isBind: true,
						wxAcount: 17788886323
					},
					{
						isBind: false,
						wxAcount: ''
					},
					{
						isBind: false,
						wxAcount: ''
					},
					{
						isBind: false,
						wxAcount: ''
					}
				]
			}
		},
		methods: {
			...mapActions([
				'c_loadingShow'
				]),
			toJumpHome() {
				this.c_loadingShow()
				setTimeout(() => {
					this.$router.push({
						path: '/activityList',
					})
				}, 600);
			}
		}
	}
</script>

<style scoped>
	.bindWx {
		width: 100%;
		height: 100%;
		padding-top: 65px;
		padding-left: 100px;
	}
	.bindWxNotice {
		font-size: 14px;
		color: #000000;
		position: relative;
		margin-bottom: 45px;
	}
	.bindWxNotice>b {
		position: absolute;
		width: 16px;
		height: 16px;
		top: 3px;
		left: -31px;
		background:  url('../../assets/img/notice_icon_2.png') no-repeat center;
		background-size: 100%;
	}
	.itemBindWx {
		display: flex;
		align-items: center;
		margin-bottom: 40px;
	}
	.itemBindWxIcon {
		display: block;
		width: 40px;
		height: 33px;
		background: url('../../assets/img/wx-icon.png') no-repeat center;
		background-size: 100%;
		margin-right: 20px;
	}
	.itemCountNum {
		display: block;
		font-size: 16px;
		color: #373A3E;
		margin-right: 24px;
	}
	.hadBindWx {
		display: flex;
		align-items: center;
	}
	.hadBindWx>span:hover {
		cursor: pointer;
	}
	.wxCountBox {
		width: 245px;
		padding: 10px 15px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 16px;
		color: #9FA6AD;
		background: #F5F8F9;
		border-radius: 4px;
	}
	.bindWxEdit {
		background: #FFB132;
		border-radius: 100px;
		font-size: 14px;
		color: #FFFFFF;
		padding: 4px 14px;
		margin-left: 15px;
	}
	.bindWxDelete {
		border: 2px solid #373A3E;
		border-radius: 100px;
		padding: 4px 14px;
		margin-left: 15px;
		font-size: 14px;
		color: #373A3E;
	}
	.toBindWx {
		padding: 10px 15px;
		background: #F5F8F9;
		border-radius: 4px;
		font-size: 16px;
		color: #9FA6AD;
	}
	.toBindWx:hover {
		cursor: pointer;
	}
	.bindComplete {
		width: 100%;
		display: flex;
		justify-content: center;
		margin-top: 80px;
	}
	.bindComplete>span {
		background: #F5A623;
		border-radius: 4px;
		font-size: 14px;
		color: #FFFFFF;
		width: 100px;
		height: 36px;
		line-height: 36px;
		text-align: center;
	}
	.bindComplete>span:hover {
		cursor: pointer;
	}


	.wxScanCode {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 999;
		background-color: rgba(0,0,0,0.8);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.showCodeImg {
		width: 280px;
		height: 280px;
		margin-bottom: 20px;
	}
	.showCodeNotice {
		width: 280px;
		height: 54px;
		font-size: 14px;
		color: #FFFFFF;
		background: #232323;
		border-radius: 100px;
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
	}
</style>