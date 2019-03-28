<template>
	<div class="videoPlay">
		<div class="videoArea">
			<div class="videoBox" @mouseover="mouseover" @mouseout="mouseout">
				<video id="video" ref="video" autoplay @click="playVideo">
					<source :src="videoUrl" />
					<span>对不起；您的浏览器不支持HTML5视频,请更换或者升级浏览器</span>
				</video>
				<div class="playBtn" @click="playVideo" v-if="isShowPlayBtn">
					<img src="../../assets/img/videoPlay.png" alt="">
				</div>
				<div class="closeVideo" @click.stop="closeVideo" v-if="isShowCloseBtn">
					<img src="../../assets/img/close_02.png" alt="">
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { mapGetters , mapActions } from 'vuex';
	
	export default {
		data() {
			return {
				isShowCloseBtn: false,
				isShowPlayBtn: false
			}
		},
		props: {
			videoUrl: {
				type: String,
				default: ''
			}
		},
		methods: {
			...mapActions([
				'wc_showVideo'
				]),
			mouseover() {
				this.isShowCloseBtn = true
			},
			mouseout() {
				this.isShowCloseBtn = false
			},
			playVideo() {
				let video = this.$refs.video
				if(video.paused) {
					video.play()
					this.isShowPlayBtn = false
				}else {
					video.pause()
					this.isShowPlayBtn = true
				}
			},
			closeVideo() {
				this.wc_showVideo(false)
			},
			videoComplete() {
				let video = document.querySelector('#video')
				const $this = this
				video.addEventListener("ended",function(){
				   $this.isShowPlayBtn = true
				},false);
			}
		},
		mounted() {
			this.videoComplete()
		}
	}
</script>

<style scoped>
	.videoPlay {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 30;
		width: 100%;
		height: 100%;
		background-color: rgba(255,255,255,0.29);
	}
	.videoArea {
		width: 1180px;
		height: 100%;
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.videoBox {
		background-color: #000;
		border-radius: 7px;
		overflow: auto;
		height: 540px;
		width: 960px;
		position: relative;
		overflow: hidden;
	}
	.videoBox>video {
		height: 100%;
		width: auto;
		margin: 0 auto;
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
	}
	.playBtn {
		position: absolute;
		top: 50%;
		left: 50%;
		height: 50px;
		width: 50px;
		margin-top: -25px;
		margin-left: -25px;
	}
	.playBtn:hover {
		cursor: pointer;
	}
	.closeVideo {
		position: absolute;
		top: 10px;
		right: 10px;
		width: 30px;
		height: 30px;
	}
	.closeVideo:hover {
		cursor: pointer;
	}
</style>