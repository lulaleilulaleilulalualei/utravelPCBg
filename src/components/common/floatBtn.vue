<template>
	<div class="floatBtn">
		<div class="coupleBackInfo" v-if="c_userVal == 'user'">
			<div class="backInfoBox" @click="putOpinion">
				<div><img src="../../assets/img/couple_back_info.png" alt=""></div>
				<div><span>意见反馈</span></div>
			</div>
		</div>
		<div class="showCode" v-if="c_userVal == 'user'">
			<div class="showCodeBox" @mouseover="mouseover" @mouseout="mouseout">
				<div><img src="../../assets/img/show_code.png" alt=""></div>
				<div><img src="../../assets/img/hover_code.png" alt=""></div>
			</div>
		</div>
		<div class="backTop" @click="backTop">
			<div class="backTopBox">
				<div><img src="../../assets/img/back_top.png" alt=""></div>
				<div><span>返回顶部</span></div>
			</div>
		</div>
		<transition name="scaleFade">
			<officalCode v-if="c_isShowOfficialCode"></officalCode>
		</transition>
		
		<transition name="fade">
			<putOpinion v-if="c_isShowOpinionBox"></putOpinion>
		</transition>
	</div>
</template>

<script>
	import officalCode from './showOfficialCode.vue'
	import putOpinion from './putOpinion.vue'
	import { mapGetters , mapActions } from 'vuex'; 
	
	export default {
		data() {
			return {

			}
		},
		components: {officalCode, putOpinion},
		computed: {
			...mapGetters([
				'c_isShowOfficialCode',
				'c_isShowOpinionBox',
				'c_userVal'
				]),
		},
		methods: {
			...mapActions([
				'c_showOfficialCode',
				'c_toTop',
				'c_opinionBox'
				]),
			mouseover() {
				this.c_showOfficialCode(true)
			},
			mouseout() {
				this.c_showOfficialCode(false)
			},
			backTop() {
				this.c_toTop(0)
				setTimeout(() => {
					this.c_toTop(-1)
				},100)
			},
			putOpinion() {
				this.c_opinionBox(true)
			}
		}
	}
</script>

<style scoped>
	.floatBtn {
		position: absolute;
		bottom: 64px;
		right: -32px;
		z-index: 20;
		width: 38px;
		height: auto;
		display: flex;
		flex-direction: column;
	}
	.coupleBackInfo, .showCode, .backTop {
		border-radius: 2px;
		width: 100%;
		height: 40px;
		overflow: hidden;
	}
	.backInfoBox, .showCodeBox, .backTopBox {
		width: 76px;
		height: 100%;
		display: flex;
		font-size: 12px;
		color: #FFFFFF;
		transition: all 0.3s ease;
	}
	.backInfoBox:hover, .showCodeBox:hover, .backTopBox:hover {
		transform: translate3d(-38px, 0, 0);
		cursor: pointer;
	}
	.backInfoBox img, .showCodeBox img, .backTopBox img{
		height: auto;
		width: auto;
	}
	.backInfoBox>div, .showCodeBox>div, .backTopBox>div {
		width: 38px;
		height: 100%;
		padding: 6px 7px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.backInfoBox>div:first-child, .showCodeBox>div:first-child, .backTopBox>div:first-child {
		background-color: #fff;
	}
	.backInfoBox>div:nth-child(2), .showCodeBox>div:nth-child(2), .backTopBox>div:nth-child(2) {
		background-color: #FFB132;
	}
	.scaleFade-enter-active, .scaleFade-leave-active {
	  transition: all .5s ease;
	}
	.scaleFade-enter, .scaleFade-leave-to {
	  transform-origin:  right bottom 0;
	  transform:scale(0,0); 
	}
	.fade-enter-active, .fade-leave-active {
	  transition: opacity .5s;
	}
	.fade-enter, .fade-leave-to {
	  opacity: 0;
	}
</style>