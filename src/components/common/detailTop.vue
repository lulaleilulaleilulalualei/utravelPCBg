<template>
	<div class="detailBoxTop">
		<div class="actAuthorImg">
			<img :src="detailTop.avatar" alt="">
		</div>
		<div class="actAuthorInfo">
			<h3>{{detailTop.title}}</h3>
			<div class="actAuthorOperation">
				<div class="actAuthorName">
					<div>
						<span><span v-if="isActivity">活动发起人：</span>{{detailTop.nickname}}</span>
						<span>{{updatedTime}}</span>
					</div>
				</div>
				<div class="actCode">
					<div class="actCodeBox">
						<div @mouseover="mouseover" @mouseout="mouseout">
							<span>手机阅读</span>
							<b></b>
							<transition name="shortFade">
								<div class="readCode" v-show="isShowRead">
									<canvas id="canvas"></canvas>
								</div>
							</transition>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import QRCode from 'qrcode'
	import { mapGetters , mapActions } from 'vuex';
	import config from '@/config'
	
	export default {
		data() {
			return {
				isShowRead: false
			}
		},
		props: {
			isActivity: {
				type: Boolean,
				default: false
			},
			detailTop: {
				type: Object,
				default: {}
			},
			shareUrl: {
				type: String,
				default: ''
			}
		},
		computed: {
			...mapGetters([
				'c_userInfo'
				])
		},
		wacth: {

		},
		methods: {
			mouseover() {
				this.isShowRead = true
			},
			mouseout() {
				this.isShowRead = false
			},
			useqrcode(){
				const $this = this
		        let canvas = document.getElementById('canvas')
				QRCode.toCanvas(canvas, this.shareUrl, function (error) {
					if (error) {
						$this.$message({
							type: 'error',
							message: '分享链接加载失败',
							center: true
						});
					}
				})
		    },
		},
		computed: {
			updatedTime() {
				if(this.detailTop.updatedTime) {
					return this.detailTop.updatedTime.split(' ')[0]
				}
			}
		},
		mounted() {
			let timer = setInterval(() => {
				if(this.shareUrl != '') {
					this.useqrcode()
					clearInterval(timer);
				}
			}, 500)
		}	
	}
</script>

<style scoped>
	.detailBoxTop {
		display: flex;
		align-items: center;
		position: relative;
		height: 120px;
		top: -60px;
	}
	.actAuthorImg {
		width: 86px;
		height: 86px;
		margin-right: 15px;
		border-radius: 50%;
		overflow: hidden;
		border: 1px solid #efefef;
	}
	.actAuthorInfo {
		display: flex;
		flex-direction: column;
		flex: 1;
		height: 100%;
	}
	.actAuthorInfo>h3 {
		flex: 1;
		font-size: 24px;
		color: #FFFFFF;
		font-weight: 500;
		position: relative;
		display: flex;
		align-items: flex-end;
	}
	.actAuthorOperation {
		flex: 1;
		display: flex;
		justify-content: space-between;
	}
	.actAuthorName {
		padding-top: 8px;
	}
	.actAuthorName>div {
		display: flex;
		align-items: center;
	}
	.actAuthorName>div>span:first-child {
		font-size: 14px;
		color: #FFB132;
		display: block;
		margin-right: 10px;
	}
	.actAuthorName>div>span:nth-child(2) {
		font-size: 14px;
		 color: #9FA6AD;
		 display: block;
	}
	.actCode {
		font-size: 14px;
		color: #9FA6AD;
		padding-top: 8px;
	}
	.actCodeBox {
		display: flex;
	}
	.actCodeBox>div {
		display: flex;
		align-items: center;
		position: relative;
	}
	.actCodeBox>div>span {
		display: block;
		margin-right: 5px;
	}
	.actCodeBox>div>b {
		width: 21px;
		height: 21px;
		background: url('../../assets/img/small_code_icon.png') no-repeat center;
		background-size: 100%;
		margin-right: 5px;
	}
	.actCodeBox>div:first-child {
		margin-right: 15px;
	}
	.actCodeBox>div::after {
		content: '';
		display: block;
		border: 3px solid #373A3E;
		transform: rotate(45deg);
		border-top-color: transparent;
		border-left-color: transparent;
	}
	.actCodeBox>div:hover {
		cursor: pointer;
	}

	.readCode {
		position: absolute;
		top: 30px;
		right: 0;
		z-index: 30;
		width: 120px;
		height: 120px;
		overflow: hidden; 
	}
	#canvas {
		width: 120px!important;
		height: 120px!important;
	}
	.shortFade-enter-active, .shortFade-leave-active {
	  transition: all .3s ease;
	  transform-origin: right top 0;
	}
	.shortFade-enter, .shortFade-leave-to {
	  transform:scale(0,0); 
	}
</style>