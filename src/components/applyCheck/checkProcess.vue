<!-- 认证流程 -->
<template>
	<div class="checkProcess checkProcessCommonStyle">
		<div class="checkProcessBox">
			<div class="checkProcessStatus">
				<div :class="['itemCheckProcess', {currentStatus: c_checkStatus == 0}]"><span>①</span>认证资料</div><b></b>
				<div :class="['itemCheckProcess', {currentStatus: c_checkStatus == 1 || c_checkStatus == 2 || c_checkStatus == 3}]"><span>②</span>资质审核</div><b></b>
				<div :class="['itemCheckProcess', {currentStatus: c_checkStatus == 4}]"><span>③</span>绑定微信</div>
			</div>
			<div class="infoContentShowBox">
				<happy-scroll v-if="c_checkStatus == 0" color="rgba(255,177,50,1)" size="4" hide-horizontal resize :scroll-top="c_backTopVal">
					<certificateInfo ></certificateInfo>
				</happy-scroll>
				<checkType v-if="c_checkStatus == 1 || c_checkStatus == 2 || c_checkStatus == 3"></checkType>
				<bindWx v-if="c_checkStatus == 4"></bindWx>
			</div>
		</div>
	</div>
</template>

<script>
	import certificateInfo from './certificateInfo.vue'
	import checkType from './checkType.vue'
	import bindWx from './bindWx.vue'
	import { mapGetters , mapActions } from 'vuex';
	
	export default {
		data() {
			return {

			}
		},
		components: {certificateInfo, checkType, bindWx},
		computed: {
			...mapGetters([
				'c_loadingVal',
				'c_backTopVal',
				'c_checkStatus'
				])
		},
		methods: {
			...mapActions([
				'c_toApplyCheck'
				]),
		},
		mounted() {
			if(this.c_loadingVal) {
				this.c_loadingVal.close()
			}
			this.c_toApplyCheck(false)
		}
	}
</script>

<style scoped>
	.checkProcess {
		width: 100%;
		height: 100%;
	}
	.checkProcessBox {
		width: 100%;
		height: 100%;
		background-color: #fff;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}
	.checkProcessStatus {
		width: 100%;
		height: 60px;
		border-bottom: 1px solid #DDE2E6;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.itemCheckProcess {
		font-size: 14px;
		color: #9D9D9D;
	}
	.checkProcessStatus b {
		display: block;
		width: 18px;
		height: 1px;
		background-color: #DDE2E6;
		margin: 0 12px;
	}
	.itemCheckProcess>span {
		display: inline-block;
		font-size: 20px;
		margin-right: 10px;
	}
	.itemCheckProcess.currentStatus {
		color: #49AF49;
	}
	.infoContentShowBox {
		flex: 1;
		overflow-y: auto;
	}
</style>