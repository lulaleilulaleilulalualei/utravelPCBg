<template>
	<div class="lookPhoto">
		<div class="listImgArea">
			<div class="imgBox" v-loading="boxLoading" :element-loading-text="imgLoadNotice">
				<happy-scroll color="rgba(255,177,50,1)" size="3" resize hide-vertical>
					<div class="imgsListShow">
						<div class="itemImgShow" v-for="(item, index) in photoList" :key="index" @mouseover="mouseover(index)" @mouseout="mouseout">
							<img :src="`${item.imgUrl}??x-oss-process=style/thumb146x146`" alt="">
							<div :class="['toSelectImg', {hadSelectImg: item.isSelect}]" @click.stop="toSelectImg(index)">
								<i class="el-icon-check" v-if="item.isSelect"></i>
							</div>
							<transition name="fade">
								<div class="dealImg" v-if="item.isShow">
									<i class="el-icon-circle-plus-outline" @click="previewPhotImg(item.imgUrl)"></i>
								</div>
							</transition>
						</div>
					</div>
				</happy-scroll>
				<div class="listBtn">
					<div v-if="photoId.type == 1" @click="toDeleteImg">勾选删除</div>
					<div v-if="photoId.type == 2" @click="toCollectImg">勾选收集</div>
					<div @click="toNextPage">下一页</div>
					<div @click="sureChange">关闭</div>
				</div>
			</div>
		</div>
		<transition name="fade">
			<div class="showPreView" v-if="dialogVisible" @click="clickPreviewBox">
				<div class="preViewBox">
					<div class="topColse"><i class="el-icon-close" @click="closePreviewBox"></i></div>
					<div class="imgShowBox">
						<img :src="dialogImageUrl" alt="">
					</div>
				</div>
			</div>
		</transition>
	</div>
</template>

<script>
	import config from '@/config'
	
	export default {
		data() {
			return {
				photoList: [],
				index: 1,
				boxLoading: false,
				imgLoadNotice: '',
				isFirstLoad: true,
				dialogImageUrl: '',
        		dialogVisible: false,
        		isChange: false, //是否修改
			}
		},
		props: {
			photoId: Object
		},
		methods: {
			getPhotoList() {
				let url = ''
				if(this.photoId.type == 2) {
					url = `http://${config.collectApi}/api/select/photo/${this.photoId.id}`
				}else if(this.photoId.type == 1) {
					url = `http://${config.collectApi}/api/show/photo/${this.photoId.id}`
				}
				const $this = this
		    	this.boxLoading = true
		    	this.$api.ajax({
		    		url: url,
		    		headers: {
						'Content-Type':'application/x-www-form-urlencoded',
						// 'API-User-Token': $this.c_userInfo.token
					},
					params: {
						page: $this.index,
					},
					success: (res) => {
						if(res.code == 0) {
							if(res.data.length != 0) {
								setTimeout(() => {
									this.boxLoading  = false
								}, 200)
								if(this.photoId.type == 2) {
									res.data.map((v, i) => {
										this.photoList.push({
											...v,
											isShow: false,
											isSelect: false
										})
									})
								}else if(this.photoId.type == 1) {
									res.data.map((v, i) => {
										this.photoList.push({
											...v,
											imgUrl: v.url,
											isShow: false,
											isSelect: false
										})
									})
								}
								
								this.isFirstLoad = false
							}else {
								if(this.isFirstLoad) {
									this.$message({
								        type: 'info',
								        message: '当前景点没有相册',
								        center: true
								    });
									setTimeout(() => {
										this.boxLoading  = false
									}, 200)
								}
							}
						}else {
							if(this.isFirstLoad) {
								this.$message({
								    type: 'info',
								    message: '当前景点没有相册',
								    center: true
								});
							}
							setTimeout(() => {
								this.boxLoading  = false
							}, 200)
							this.$message({
					           type: 'error',
					           message: res.message,
					           center: true
					        });
						}
					},
					error: () => {
						this.$message({
					        type: 'error',
					        message: '数据请求失败',
					        center: true
					    });
					}
		    	})
			},
			mouseover(index) {
				this.photoList.map((v, i) => {
					if(i == index) {
						v.isShow = true
					}else {
						v.isShow = false
					}
				})
			},
			mouseout() {
				this.photoList.map(v => v.isShow = false)
			},
			previewPhotImg(url) {
				this.dialogVisible = true
				this.dialogImageUrl = url
			},
			toSelectImg(index) {
				this.photoList.map((v, i) => {
					if(i == index) {
						if(v.isSelect) {
							v.isSelect = false
						}else {
							v.isSelect = true
						}
					}
				})
			},
			closePreviewBox() {
				this.dialogVisible = false
				this.dialogImageUrl = ''
			},
			clickPreviewBox(e) {
				if(e.target.className == 'showPreView') {
					this.dialogVisible = false
					this.dialogImageUrl = ''
				}
			},
		    sureChange() {
		    	this.$emit('closePhoto', {isShow: false, isChange: this.isChange})
		    },
		    toNextPage() {
		    	this.index++
		    	this.getPhotoList()
		    },
		    toCollectImg() {
		    	let imgs = []
		    	this.photoList.map((v, i) => {
					if(v.isSelect) {
						imgs.push(v.imgUrl)
					}
		    	})
		    	if(imgs.length == 0) {
					this.$message({
						type: 'info',
						message: '您还没有勾选哦~',
						center: true
					});
		    		return
		    	}
		    	this.boxLoading = true
				this.imgLoadNotice = '图片上传中...'
				const $this = this
		    	this.$api.ajax({
		    		url: `http://${config.collectApi}/api/upload/photo`,
		    		method: "POST",
		    		headers: {
						'Content-Type':'application/x-www-form-urlencoded',
						// 'API-User-Token': $this.c_userInfo.token
					},
					params: {
						pId: $this.photoId.id,
						images: imgs.join(',')
					},
					success: (res) => {
						if(res.code == 0) {
							this.$message({
							    type: 'success',
							    message: '图片上传成功',
							    center: true
							});
							setTimeout(() => {
								this.boxLoading = false
								this.imgLoadNotice = ''
							}, 200)
							this.isChange = true
						}else {
							this.$message({
							    type: 'error',
							    message: res.message,
							    center: true
							});
						}
					},
					error: () => {
						this.$message({
					        type: 'error',
					        message: '收集失败',
					        center: true
					    });
					}
		    	})
		    },
		    toDeleteImg() {
				let ids = []
		    	this.photoList.map((v, i) => {
					if(v.isSelect) {
						ids.push(v.id)
					}
		    	})
		    	if(ids.length == 0) {
					this.$message({
						type: 'info',
						message: '您还没有勾选哦~',
						center: true
					});
		    		return
		    	}
				const $this = this
		    	this.$api.ajax({
		    		url: `http://${config.collectApi}/api/del/photo`,
		    		method: "PUT",
		    		headers: {
						'Content-Type':'application/x-www-form-urlencoded',
						// 'API-User-Token': $this.c_userInfo.token
					},
					params: {
						ids: ids.join(',')
					},
					success: (res) => {
						if(res.code == 0) {
							this.$message({
							    type: 'success',
							    message: '图片删除成功',
							    center: true
							});
							let arr = [...this.photoList]
							this.photoList = arr.filter(item => item.isSelect == false)
							this.isChange = true
						}else {
							this.$message({
							    type: 'error',
							    message: res.message,
							    center: true
							});
						}
					},
					error: () => {
						this.$message({
					        type: 'error',
					        message: '删除失败',
					        center: true
					    });
					}
		    	})
		    }
		},
		created() {
			this.getPhotoList()
		},
		mounted() {
			
		}
	}
</script>

<style scoped>
	.lookPhoto {
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
	.listBtn>div:not(:last-child) {
		margin-right: 15px;
	}
	.listBtn>div:hover {
		cursor: pointer;
	}
	.listBtn>div {
		background: #FFB132;
	}
	.imgsListShow {
		width: 100%;
		height: 100%;
		flex: 1;
	}
	.itemImgShow {
		display: inline-block;
		width: 146px;
		height: 146px;
		background-color: #efefef;
		border-radius: 6px;
		overflow: hidden;
		margin: 0 8px 8px 0;
		position: relative;
	}
	/* .itemImgShow:hover {
		cursor: pointer;
	} */
	.dealImg {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 10;
		width: 100%;
		height: 100%;
		background: rgba(0,0,0,0.4);
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.dealImg i{
		display: block;
		margin-right: 5px;
		color: #fff;
		font-size: 20px;
	}
	.dealImg i:hover {
		cursor: pointer;
	}
	.showPreView {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 200;
		width: 100%;
		height: 100%;
		background-color: rgba(0,0,0,0.3);
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.preViewBox {
		width: 600px;
		height:  auto;
		padding: 10px;
		background-color: #fff;
		margin: 50px 0;
	}
	.topColse {
		height: 40px;
		width: 100%;
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}
	.topColse i {
		font-size: 30px;
	}
	.topColse i:hover {
		cursor: pointer;
	}
	.imgShowBox {
		width: 100%;
		height: auto;
	}
	.toSelectImg {
		position: absolute;
		right: 10px;
		bottom: 10px;
		z-index: 20;
		width: 20px;
		height: 20px;
		border: 2px solid #fff;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.toSelectImg:hover {
		cursor: pointer;
	}
	.toSelectImg i {
		color: #FFB132;
	}
	.toSelectImg.hadSelectImg {
		background-color: #fff;
	}
</style>