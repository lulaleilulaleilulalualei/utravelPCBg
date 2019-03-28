<template>
	<div class="addImg">
		<div class="addImgArea">
			<div class="addImgBox"
				v-loading="boxLoading"
				element-loading-text="图片上传中...">
				<!-- <div class="showCode">
					<div>
						<canvas id="canvas"></canvas>
					</div>
					<h4>上传手机照片</h4>
					<span>用微信扫描二维码轻松上传手机照片</span>
					<p @click="toPhoneImg">我已上传照片</p>
				</div> -->
				<el-upload
					:action= "imgUrl"
					name="files"
					:headers= "imgHeader"
					:multiple= "isMultiple"
					:on-success="upSuccess"
					:on-error="upError"
					:before-upload="beforeLoad">
					<div class="upImgBtn">
						<span>上传本地图片</span>
					</div>
				</el-upload>
				<div class="closeBox" @click="closeBox"></div>
			</div>
		</div>
	</div>
</template>

<script>
	import { mapGetters , mapActions } from 'vuex';
	import QRCode from 'qrcode'
	import config from '@/config'
	
	export default {
		data() {
			return {
				isMultiple: true,
				imgUrl: '',
				imgHeader: {},
				boxLoading: false,
				runCount: 0
			}
		},
		computed: {
			...mapGetters([
				'c_userInfo'
				])
		},
		methods: {
			...mapActions([
				'wn_addImg'
				]),
			closeBox() {
				this.wn_addImg(false)
			},
			beforeLoad() {
				this.boxLoading = true
			},
			toPhoneImg() {
				this.$emit('phoneImgCount', true)
				setTimeout(() => {
					this.wn_addImg(false)
				}, 100)
			},
			upSuccess(response, file, fileList) {
				if(response.code == 0) {
					this.runCount ++
					if(this.runCount == fileList.length) {
						this.$emit('getImgVal', {content: response.data[0] ,travelType: 3, placeTxt:'', isShowDelete: false, isPlay: false})
						this.boxLoading = false
						setTimeout(() => {
							this.wn_addImg(false)
						}, 100)
					}else {
						this.$emit('getImgVal', {content: response.data[0] ,travelType: 3, placeTxt:'', isShowDelete: false, isPlay: false})
					}
				}else {
					this.$message({
				        message: response.message,
				        type: 'error',
				        center: true
				    })
				    this.boxLoading = false
				}	
			},
			upError() {
				this.$message({
			        message: '图片上传失败',
			        type: 'error',
			        center: true
			    })
			    this.boxLoading = false
			},
			useqrcode(){ 
		      	//生成的二维码内容，可以添加变量
				//this.QueryDetail='http://www.kspxzx.com/#/guard'+"?unique_code="+this.QueryDetail;
				const $this = this
				let canvas = document.getElementById('canvas')
		        QRCode.toCanvas(canvas, `http://192.168.119.12:8081/?uid=${$this.c_userInfo.uid}&token=${$this.c_userInfo.token}&type=1`, function (error) {
			        if (error) {
			        	$this.$message({
							message: '二维码生成失败，请稍后再试',
							type: 'error',
							center: true
						})
						return
			        }
		        })
		    },
			imgDir() {
				this.imgHeader = {
					'API-User-Token': this.c_userInfo.token
				}
				this.imgUrl = `${config.uploadImg}?dir=post/images`
			}
		},
		mounted() {
			this.imgDir()
			// this.useqrcode()
		}
	}
</script>

<style scoped>
	.addImg {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 30;
		background-color: rgba(0,0,0,0.29);
	}
	.addImgArea {
		width: 1180px;
		height: 100%;
		padding-left: 300px;
		margin: 0 auto;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.addImgBox {
		background: #FFFFFF;
		border-radius: 7px;
		width: 600px;
		height: auto;
		padding: 60px 20px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		position: relative;
		overflow: hidden;
	}
	.showCode {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-bottom: 60px;
	}
	.showCode>div {
		margin-bottom: 10px;
	}
	#canvas {
		width: 150px!important;
		height: 150px!important;
	}
	.showCode>h4 {
		font-size: 18px;
		color: #373A3E;
		margin-bottom: 5px;
	}
	.showCode>span {
		font-size: 12px;
		color: #9FA6AD;
		margin-bottom: 5px;
	}
	.showCode>p {
		display: block;
		color: #fff;
		font-size: 16px;
		padding: 6px 18px;
		border-radius: 20px;
		background-color: #FFB132;
	}
	.showCode>p:hover {
		cursor: pointer;
	}
	.upImgBtn {
		background-image: linear-gradient(129deg, #FFCA59 0%, #FF840F 100%);
		border-radius: 100px;
		width: 240px;
		height: 60px;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 18px;
		color: #FFFFFF;
	}
	.upImgBtn:hover {
		cursor: pointer;
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