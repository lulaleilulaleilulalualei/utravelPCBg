<template>
	<div class="moreInfoSpot">
		<div class="infoSArea">
			<div class="infoBox">
				<div class="uploadImg">
						<el-upload
						  :action= "imgUrl"
						  name="files"
						  list-type="picture-card"
						  :headers= "imgHeader"
						  :limit="upLimit"
						  :file-list="fileList"
						  :on-success="upSuccess"
						  :on-preview="handlePictureCardPreview"
						  :on-remove="handleRemove">
						  <i class="el-icon-plus"></i>
						</el-upload>
						<el-dialog :visible.sync="dialogVisible">
						  <img width="100%" :src="dialogImageUrl" alt="">
						</el-dialog>
				</div>
				<div class="areaName lineStyle">
					<span>{{wl_addMoreInfoObj.type == 1? '住宿名称': '美食店名'}}</span>
					<input type="text" v-model.trim="nameVal">
				</div>
				<div class="areaAdd lineStyle">
					<span>{{wl_addMoreInfoObj.type == 1? '住宿地址': '美食店址'}}</span>
					<input type="text" v-model.trim="addVal">
				</div>
				<div class="areaOtherInfo">
					<div>
						<span>{{wl_addMoreInfoObj.type == 1? '住宿电话': '联系电话'}}</span>
						<input type="text" v-model.trim="phoneVal">
					</div>
					<div>
						<span>{{wl_addMoreInfoObj.type == 1? '标间消费': '人均消费'}}</span>
						<input type="text" v-model.trim="costVal">
					</div>
				</div>
				<div class="areaDec">
					<textarea :placeholder="wl_addMoreInfoObj.type == 1? '住宿描述': '美食描述'" v-model.trim="infoDesc"></textarea>
				</div>
				<div class="areaBtn">
					<div @click="cancelMoreInfo">取消</div>
					<div @click="sureMoreInfo">确定</div>
				</div>
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
				imgFileList: [],
				fileList: [], //展示列表
				nameVal:'',
				addVal: '',
				phoneVal: '',
				costVal: '',
				infoDesc: '',
				imgUrl: '',
				imgHeader: {},
				dialogImageUrl: '',
        		dialogVisible: false,
        		upLimit: 1,
        		isNoticeImg: false
			}
		},
		computed: {
			...mapGetters([
				'wl_addMoreInfoObj',
				'c_userInfo'
				])
		},
		methods: {
			...mapActions([
				'wl_addMOreINfo'
				]),
			handleRemove(file, fileList) {
		        this.imgFileList.map((v, i) => {
		        	if(file.hasOwnProperty('response')) {
		        		if(file.response.code == 0) {
		        			if(v == file.response.data[0]) {
		        				this.imgFileList.splice(i, 1)
		        			}
		        		}else {
		        			this.$message({
						       	message: res.message,
						        type: 'error',
						        center: true
						   	})
		        		}
		        	}else {
		        		if(v == file.url) {
		        			this.imgFileList.splice(i, 1)
		        		}
		        	}
		        	
		        })
		    },
		    handlePictureCardPreview(file) {
		        this.dialogImageUrl = file.url;
		        this.dialogVisible = true;
		        setTimeout(() => {
		      		let model = document.querySelector('.v-modal')
		      		model.style.display = 'none'
		      	}, 10)
		    },
			cancelMoreInfo() {
				this.wl_addMOreINfo({type: '', isShow: false, infoObj: {}, isEdit: false})
			},
			sureMoreInfo() {
				if(this.imgFileList.length != 0) {
					if(this.nameVal != '') {
						if(this.addVal != '') {
							if(this.infoDesc != '') {
								this.wl_addMOreINfo({type: this.wl_addMoreInfoObj.type, isShow: false, infoObj: {
									thumb: this.imgFileList[0],
									pictures: this.imgFileList.join(','),
									name: this.nameVal,
									address: this.addVal,
									tel: this.phoneVal,
									cost: this.costVal,
									desc: this.infoDesc,
									type: this.wl_addMoreInfoObj.type
								}, isEdit: this.wl_addMoreInfoObj.isEdit})
							}else {
								this.$message({
						          message: '描述不能为空',
						          type: 'error',
						          center: true
						        })
							}
						}else {
							this.$message({
					          message: '地址不能为空',
					          type: 'error',
					          center: true
					        })
						}
					}else {
						this.$message({
				          message: '名称不能为空',
				          type: 'error',
				          center: true
				        })
					}
				}else {
					this.$message({
			          message: '图片不能为空',
			          type: 'error',
			          center: true
			        })
				}
			},
			upSuccess(response, file, fileList) {
				if(response.code == 0) {
					this.imgFileList.push(response.data[0])
					if(!this.isNoticeImg) {
						this.$message({
					        message: '注意：暂时只支持上传一张图片作为封面图！',
					        type: 'warning',
					        center: true
					    })
					    this.isNoticeImg = true
					}
				}else {
					this.$message({
				        message: response.message,
				        type: 'error',
				        center: true
				    })
				}
			},
			upError(err) {
				this.$message({
			        message: err.message,
			        type: 'error',
			        center: true
			    })
			},
			imgDir() {
				this.imgHeader = {
					'API-User-Token': this.c_userInfo.token
				}
				if(this.wl_addMoreInfoObj.type == 1) {
					this.imgUrl = `${config.uploadImg}?dir=hotel/thumb`
				}else {
					this.imgUrl = `${config.uploadImg}?dir=food/thumb`
				}
				
			}
		},
		mounted() {
			this.imgDir()
			if(!this.$api.isEmptyObject(this.wl_addMoreInfoObj.infoObj)) {
				let obj = this.wl_addMoreInfoObj.infoObj,
					reg = /<\/?.+?>/g
					
				this.imgFileList = obj.pictures.split(',')
				obj.pictures.split(',').map((v) => {
					this.fileList.push({url: v})
				})
				this.nameVal = obj.name
				this.addVal = obj.address
				this.phoneVal = obj.tel
				this.costVal = obj.cost
				this.infoDesc = obj.desc.replace(reg,"\n") || ''
			}
		}
	}
</script>

<style scoped>
	.moreInfoSpot {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 1000;
		background: rgba(0,0,0,0.29);
	}
	.infoSArea {
		width: 1180px;
		height: 100%;
		margin: 0 auto;
		padding-left: 300px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.infoBox {
		width: 600px;
		height: auto;
		background: #FFFFFF;
		border-radius: 7px;
		padding: 15px;
	}
	.infoBox>div:not(:last-child) {
		border: 1px solid #DDDEE1;
		border-radius: 4px;
		margin-bottom: 10px;
	}
	.uploadImg {
		width: 100%;
		min-height: 226px;
		overflow: hidden;
		position: relative;
		padding: 10px;
	}
	.imgShow {
		width: 100%;
		height: auto;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 10;
	}
	/* .uploadBtn {
		display: flex;
		flex-wrap: wrap;
		min-height: 226px;
		width: 100%;
		position: absolute;
		top: 0;
		left: 0;
		padding: 10px;
	} */
	.codeUpload {
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
	}
	.codeUpload>img {
		width: 130px;
		height: 130px;
		margin-bottom: 10px;
	}
	.codeUpload>p {
		font-size: 16px;
		color: #373A3E;
		margin-bottom: 5px;
	}
	.codeUpload>span {
		font-size: 12px;
		color: #9FA6AD;
	}
	/* .btnUpload {
		height: 60px;
		width: 240px;
		background-image: linear-gradient(129deg, #FFCA59 0%, #FF840F 100%);
		border-radius: 100px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 18px;
		color: #FFFFFF;
	}
	.btnUpload:hover {
		cursor: pointer;
	} */
	.lineStyle {
		height: 42px;
		width: 100%;
		padding: 0 15px;
		display: flex;
		align-items: center;
	}
	.lineStyle>span {
		font-size: 16px;
		color: #9FA6AD;
		display: block;
	}
	.lineStyle>input {
		flex: 1;
		padding-left: 15px;
		font-size: 16px;
		color: #373A3E;
		display: block;
		height: 100%;
	}
	.infoBox div.areaOtherInfo {
		display: flex;
		justify-content: space-between;
		border: none;
		margin-bottom: 10px;
	}
	.areaOtherInfo>div {
		width: 280px;
		height: 42px;
		border: 1px solid #DDDEE1;
		border-radius: 4px;
		padding: 0 15px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.areaOtherInfo>div>span {
		font-size: 16px;
		color: #9FA6AD;
		display: block;
	}
	.areaOtherInfo>div>input {
		width: 170px;
		height: 100%;
		font-size: 16px;
		color: #373A3E;
	}
	.areaDec {
		width: 100%;
		height: 108px;
		border: 1px solid #DDDEE1;
		border-radius: 4px;
		padding: 10px 15px;
		font-size: 16px;
		color: #373A3E;
	}
	.areaDec>textarea {
		font-size: 16px;
		color: #373A3E;
		width: 100%;
		height: 100%;
		resize: none;
		margin-bottom: 30px;
	}
	.areaDec>textarea::-webkit-scrollbar {
		display: none;
	}
	.areaBtn {
		width: 100%;
		height: auto;
		display: flex;
		justify-content: flex-end;
		margin-top: 30px;
	}
	.areaBtn>div {
		border-radius: 100px;
		padding: 10px 40px;
		font-size: 16px;
		color: #FFFFFF;
	}
	.areaBtn>div:hover {
		cursor: pointer;
	}
	.areaBtn>div:first-child {
		background: #DDDEE1;
		margin-right: 10px;
	}
	.areaBtn>div {
		background: #FFB132;
	}
</style>