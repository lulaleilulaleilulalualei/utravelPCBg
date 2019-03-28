<template>
	<div class="listImg">
		<div class="listImgArea">
			<div class="imgBox">
				<happy-scroll color="rgba(255,177,50,1)" size="3" resize hide-vertical>
				<div class="addPointImg">
					<el-upload
						:action= "imgUrl"
						name="files"
						:data="dataObj"
						:headers= "imgHeader"
						:multiple= "isMultiple"
						list-type="picture-card"
						:file-list="defaultImgArr"
						:on-preview="handlePictureCardPreview"
						:on-remove="handleRemove"
						:on-success="handSuccess"
						:on-error="handError"
						:before-remove="beforeMove"
						:disabled="isDisabled">
						<i class="el-icon-plus"></i>
					</el-upload>
					<el-dialog :visible.sync="dialogVisible">
						<img width="100%" :src="dialogImageUrl" alt="">
					</el-dialog>
				</div>
				</happy-scroll>
				<div class="listBtn">
					<div @click="sureChange">{{!isDisabled? '保存': '关闭'}}</div>
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
				isMultiple: true,
				imgHeader: {},
				imgUrl: '',
				imgArr: [],
				defaultImgArr: [],
				dialogImageUrl: '',
        		dialogVisible: false,
			}
		},
		props: {
			imgList: {
				type: Array,
				default: []
			},
			isDisabled: {
				type: Boolean,
				default: false
			}
		},
		computed: {
			...mapGetters([
				'c_userInfo'
				]),
			dataObj() {
				return {
					nodeId: this.$route.query.id
				}
			}
		},
		methods: {
			...mapActions([
				'c_showImgList'
				]),
			sureChange() {
				if(!this.isDisabled) {
					let arr = []
					this.imgArr.map((v, i) => {
						arr.push({
							id: v.id,
							url: v.url
						})
					})
					this.$emit('getImgList', arr)
				}
				this.c_showImgList(false)
			},
			async beforeMove(file, fileList) {
				var isDeleteSuccess = true //默认成功
				if(file.id) {
					await this.deleteSpotImg(file.id, (status) => {
						isDeleteSuccess = status
					})
				}
				return isDeleteSuccess
			},
			handleRemove(file) {
		    	this.imgArr.map((v, i) => {
		        	if(file.hasOwnProperty('response')) {
		        		if(file.response.code == 0) {
		        			if(v.url == file.response.data[0]) {
		        				this.imgArr.splice(i, 1)
		        			}
		        		}else {
		        			this.$message({
						       	message: res.message,
						        type: 'error',
						        center: true
						   	})
		        		}
		        	}else {
		        		if(v.url == file.url) {
		        			this.imgArr.splice(i, 1)
		        		}
		        	}
		        	
		        })
		    },
		    deleteSpotImg(id, callBack) {
		    	const $this = this
		    	this.$api.ajax({
		    		url: `${config.deleteSpotImg}/${id}`,
		    		method: 'DELETE',
		    		headers: {
						'Content-Type':'application/x-www-form-urlencoded',
						'API-User-Token': $this.c_userInfo.token
					},
					success: (res) => {
						if(res.code == 0) {
							this.$message({
					        	message: '图片删除成功',
						        type: 'success',
						        center: true
						    })
							typeof callBack == 'function' && callBack(true)
						}else {
							this.$message({
					        	message: res.message,
						        type: 'error',
						        center: true
						    })
						    typeof callBack == 'function' && callBack(false)
						}
					},
					error: () => {
						this.$message({
				        	message: '删除图片失败',
					        type: 'error',
					        center: true
					    })
					    typeof callBack == 'function' && callBack(false)
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
		    handSuccess(response, file, fileList) {
		    	if(response.code == 0) {
					this.imgArr.push({
						url: response.data[0].url,
						id: response.data[0].id
					})
		    	}else {
		    		this.$message({
			        	message: response.message,
				        type: 'error',
				        center: true
				    })
		    	}
		    },
		   //  addSpotImg(url) {
		   //  	const $this = this
		   //  	this.$api.ajax({
		   //  		url: config.addSpotImg,
		   //  		method: 'POST',
		   //  		headers: {
					// 	'Content-Type':'application/x-www-form-urlencoded',
					// 	'API-User-Token': $this.c_userInfo.token
					// },
					// params: {
					// 	nodeId: this.$route.query.id,
					// 	url: url
					// },
					// success: (res) => {
					// 	if(res.code == 0) {
					// 		this.$message({
					//         	message: '图片添加成功',
					// 	        type: 'success',
					// 	        center: true
					// 	    })
					// 	    this.imgArr.push({ //这里可能存在bug，在连续10ms内如果存在数据连接问题，将导致上传图片絮乱
					// 	    	url: url,
					// 	    	id: res.data
					// 	    })
					// 	}else {
					// 		this.$message({
					//         	message: res.message,
					// 	        type: 'error',
					// 	        center: true
					// 	    })
					// 	}
					// },
					// error: () => {
					// 	this.$message({
				 //        	message: '图片添加失败',
					//         type: 'error',
					//         center: true
					//     })
					// }
		   //  	})
		   //  },
		    handError(err, file, fileList) {
		    	this.$message({
			        message: '图片上传失败',
			        type: 'error',
			        center: true
			    })
		    },
			imgDir() {
				this.imgHeader = {
					'API-User-Token': this.c_userInfo.token
				}
				this.imgUrl = `${config.uploadSpotImg}?dir=node/images`
			},
		},
		mounted() {
			this.imgDir()
			if(this.imgList.length != 0) {
				this.defaultImgArr = this.imgList
				this.imgList.map((v, i) => {
					this.imgArr.push({
						url: v.url,
						id: v.id
					})
				})
			}
		}
	}
</script>

<style scoped>
	.listImg {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 60;
		width: 100%;
		height: 100%;
		background-color: rgba(0,0,0,0.29);
	}
	.listImgArea {
		width: 1180px;
		height: 100%;
		padding-left: 204px;
		margin: 0 auto;
		overflow: hidden;
	}
	.imgBox {
		height: 100%;
		width: 100%;
		background-color: #fff;
		padding: 20px 16px 50px 24px;
		overflow: hidden;
		position: relative;
	}
	.listBtn {
		position: absolute;
		left: 0;
		bottom: 0;
		height: 50px;
		width: 100%;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		padding: 0 20px;
	}
	.listBtn>div {
		border-radius: 100px;
		font-size: 16px;
		color: #FFFFFF;
		width: 114px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.listBtn>div:hover {
		cursor: pointer;
	}
	.listBtn>div {
		background: #FFB132;
	}
</style>