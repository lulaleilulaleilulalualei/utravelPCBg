<template>
	<div class="addVideo">
		<div class="addVideoArea">
			<div class="addVideoBox"
					v-loading="boxLoading"
					element-loading-text="视频上传中...">
				<el-upload
					:action= "imgUrl"
					name="file"
					:headers= "imgHeader"
					:on-success="upSuccess"
					:on-error="upError"
					:before-upload="beforeLoad">
				<div class="videoSubmit"><span>上传本地视频</span></div>
				</el-upload>
				<span class="videoNotice">请上传大小30M以内的视频</span>
				<div class="closeBox" @click="closeBox"></div>
			</div>
		</div>
	</div>
</template>

<script>
	import { mapGetters , mapActions } from 'vuex';
	import config from '@/config'
	
	export default {
		data() {
			return {
				imgUrl: '',
				imgHeader: {},
				boxLoading: false
			}
		},
		computed: {
			...mapGetters([
				'c_userInfo'
				])
		},
		methods: {
			...mapActions([
				'wn_addVideo'
				]),
			closeBox() {
				this.wn_addVideo(false)
			},
			beforeLoad() {
				this.boxLoading = true
			},
			upSuccess(response, file, fileList) {
				if(response.code == 0) {
					this.$emit('getVideo', {content: response.data.videoUrl, travelType: 4, placeTxt:'', isShowDelete: false, isPlay: false})
					this.boxLoading = false
					setTimeout(() => {
						this.wn_addVideo(false)
					}, 100)
				}else {
					this.$message({
				        message: response.message,
				        type: 'error',
				        center: true
				    })
				}
			},
			upError() {
				this.$message({
			        message: '视频上传失败',
			        type: 'error',
			        center: true
			    })
			},
			imgDir() {
				this.imgHeader = {
					'API-User-Token': this.c_userInfo.token
				}
				this.imgUrl = `${config.uploadVideo}`
			}
		},
		mounted() {
			this.imgDir()
		}
	}
</script>

<style scoped>
	.addVideo {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 30;
		background-color: rgba(0,0,0, 0.29);
	}
	.addVideoArea {
		width: 1180px;
		height: 100%;
		margin: 0 auto;
		padding-left: 300px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.addVideoBox {
		width: 600px;
		height: 200px;
		background: #FFFFFF;
		border-radius: 7px;
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.videoSubmit {
		background-image: linear-gradient(129deg, #FFCA59 0%, #FF840F 100%);
		border-radius: 100px;
		width: 240px;
		height: 60px;
		margin-bottom: 20px;
		font-size: 18px;
		color: #FFFFFF;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.videoSubmit:hover {
		cursor: pointer;
	}
	.videoNotice {
		display: block;
		font-size: 12px;
		color: #9FA6AD;
		padding-top: 10px;
	}
	.closeBox {
		position: absolute;
		top: 10px;
		right: 10px;
		width: 24px;
		height: 24px;
		background: url('../../assets/img/close.png') no-repeat center;
		background-size: 100%;
	}
	.closeBox:hover {
		cursor: pointer;
	}
</style>