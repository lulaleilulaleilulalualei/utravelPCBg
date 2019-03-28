<template>
	<div class="writeTop" 
			v-loading="boxLoading"
			element-loading-text="图片上传中..."
			element-loading-background="rgba(0, 0, 0, 0.4)">
		<div class="writeBG">
			<img :src="`${bgImg}?x-oss-process=style/thumb840x240`" alt="">
		</div>
		<div class="writeBGBox">
			<el-upload
				v-if="!isSpotPage"
				:action= "imgUrl"
				name="files"
				:headers= "imgHeader"
				:on-success="upSuccess"
				:on-progress="upProgress"
				:on-error="upError"
				:disabled="isEditSpot">
				<div class="writeBoxCamera"></div>
			</el-upload>
			<div class="writeInputTitle">
				<input type="text" :class="{disabled: isEditSpot}" v-model.trim="titleVal" :disabled="isEditSpot" maxlength="30" @blur="inputBlur" placeholder="请输入标题">
				<span>{{titleVal.length || 0}}/30</span>
			</div>
		</div>
	</div>
</template>

<script>
	import config from '@/config'
	import { mapGetters , mapActions } from 'vuex';
	
	export default {
		data() {
			return {
				titleVal: '',
				bgImg: require('../../assets/img/writeBG.png'),
				imgUrl: '',
				imgHeader: {},
				imgData: {dir: 'route/thumb'},
				boxLoading: false
			}
		},
		props: {
			coverType: {
				type: String,
				default: ''
			},
			hadCoverImg: {
				type: String,
				default: ''
			},
			valTitle: {
				type: String,
				default: ''
			},
			isEditSpot: {
				type: Boolean,
				default: false
			},
			isSpotPage: {
				type: Boolean,
				default: false
			}
		},
		watch: {
			hadCoverImg(val) {
				this.bgImg = val
			},
			valTitle(val) {
				this.titleVal = val
			}
		},
		computed: {
			...mapGetters([
				'c_userInfo'
				])
		},
		methods: {
			changeBannerImg() {
				
			},
			inputBlur() {
				this.$emit('titleVal', this.titleVal)
			},
			upSuccess(response, file, fileList) {
				if(response.code == 0) {
					
					this.bgImg = response.data[0]
					this.$emit('coverImg', response.data[0])
					this.boxLoading = false
				}else {
					this.$message({
				        message: response.message,
				        type: 'error',
				        center: true
				    })
				    this.boxLoading = false
				}
			},
			upProgress() {
				this.boxLoading = true
			},
			upError(err) {
				this.$message({
			        message: err.message,
			        type: 'error',
			        center: true
			    })
			    this.boxLoading = false
			},
			imgDir() {
				this.imgHeader = {
					'API-User-Token': this.c_userInfo.token
				}
				if(this.coverType == 'line') {//路书封面
					this.imgUrl = `${config.uploadImg}?dir=route/thumb`
				}else if(this.coverType == 'spot') {//景点封面
					this.imgUrl = `${config.uploadImg}?dir=node/thumb`
				}else if(this.coverType == 'note') {//游记封面
					this.imgUrl = `${config.uploadImg}?dir=post/thumb`
				}
			}
		},
		mounted() {
			this.imgDir()
		}
	}
</script>

<style scoped>
	.writeTop {
		width: 100%;
		height: 240px;
		position: relative;
	}
	.writeBG {
		width: 100%;
		height: 100%;
		position: relative;
		z-index: 1;
	}
	.writeBGBox {
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
		z-index: 10;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center; 
	}
	.writeBoxCamera {
		width: 60px;
		height: 51px;
		background: url('../../assets/img/camera-icon.png') no-repeat center;
		background-size: 100%;
		margin-bottom: 60px;
	}
	.writeBoxCamera:hover {
		cursor: pointer;
	}
	.writeInputTitle {
		width: 660px;
		height: 45px;
		padding: 0 15px;
		display: flex;
		align-items: center;
		background-color: #fff;
	}
	.writeInputTitle>input {
		display: block;
		flex: 1;
		height: 100%;
		font-size: 18px;
		color: #373A3E;
	}
	.writeInputTitle>input::-webkit-input-placeholder { /* WebKit browsers */
    	color: #9FA6AD;
	}
	.writeInputTitle>input:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
	    color: #9FA6AD;
	}
	.writeInputTitle>input::-moz-placeholder { /* Mozilla Firefox 19+ */
	    color: #9FA6AD;
	}
	.writeInputTitle>input:-ms-input-placeholder { /* Internet Explorer 10+ */
	    color: #9FA6AD;
	}
	.writeInputTitle>span {
		display: block;
		font-size: 14px;
		color: #9FA6AD;
		padding-left: 10px;
	}

</style>