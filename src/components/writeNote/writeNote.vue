<template>
	<div class="writeBox">
		<happy-scroll color="rgba(255,177,50,1)" size="2" resize hide-horizontal :scroll-top="c_backTopVal">
			<div class="writeNote">
				<writeTop @coverImg="coverImg" 
						@titleVal="titleVal"
						:hadCoverImg="hadCoverImg"
						:valTitle="valTitle"
						:coverType="coverType"></writeTop>
				<div class="noteContent">
					<div class="contentList">
						<div class="itemContent" v-for="(item, index) in contentArr" :key="index">
							<div v-if="item.travelType == 2" class="typeContent">
								<el-input
								  type="textarea"
								  :autosize="{ minRows: sizeValue}"
								  v-model="item.content"
								  resize="none"
								  :placeholder="item.placeTxt"
								  @focus="textFocus(index)">
								</el-input>
							</div>
							<div v-if="item.travelType == 1" class="typeContent" @mouseover="mouseover(index)" @mouseout="mouseout(index)">
								<div>
									<input type="text" placeholder="请输入段落标题" v-model="item.content">
									<transition name="rightShow">
										<div v-if="item.isShowDelete" class="deleteInputBox" @click.stop="deleteBox(item.travelType, index)" title="删除文本"><b></b></div>
									</transition>
								</div>
							</div>
							<div v-if="item.travelType == 3" class="typeContent" @mouseover="mouseover(index)" @mouseout="mouseout(index)">
								<div class="imgShowBox">
									<img :src="item.content" alt="">
									<transition name="upShow">
										<div v-if="item.isShowDelete" class="deleteBox" @click.stop="deleteBox(item.travelType, index)" title="删除图片"><b></b></div>
									</transition>
								</div>
							</div>
							<div v-if="item.travelType == 4" class="typeContent" @mouseover="mouseover(index)" @mouseout="mouseout(index)">
								<div class="videoBox">
									<video :class="'video_'+index" @click="playVideo(index)">
										<source :src="item.content" />
										<span>对不起；您的浏览器不支持HTML5视频,请更换或者升级浏览器</span>
									</video>
									<div class="videoPlay" v-if="!item.isPlay" @click.stop="playVideo(index)"><img src="../../assets/img/videoPlay.png" alt=""></div>
									<transition name="upShow">
										<div v-if="item.isShowDelete" class="deleteBox" @click.stop="deleteBox(item.travelType, index)" title="删除视频"><b></b></div>
									</transition>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="writeNoteBtn">
					<div @click="toPreview"><span>预览</span></div>
					<div @click="toNext"><span>下一步</span></div>
				</div>
			</div>
		</happy-scroll>
		
		
		<transition name="fade">
			<addSectionTitle v-if="wn_isShowSectionBox" @getSectionTitle="getSectionTitle"></addSectionTitle>
		</transition>
		<transition name="fade">
			<addImg v-if="wn_isShowAddimg"
					@getImgVal="getImgVal" ></addImg>
		</transition>
		<transition name="fade">
			<addVideo v-if="wn_isShowVideo" @getVideo="getVideo"></addVideo>
		</transition>
		<transition name="fade">
			<completeInfo v-if="wn_isShowNoteInfo"
						:noteTitle="valTitle"
						:coverImg="hadCoverImg"
						:contentArr="dataArr"
						:defaultVal="defaultVal"
						:noteId = "draftId"></completeInfo>
		</transition>
		<transition name="fade">
			<madeCode v-if="c_isShowMadeCode"
					:previewUrl="previewUrl"></madeCode>
		</transition>
	</div>
</template>

<script>
	import writeTop from '../common/writeTop.vue'
	import textBox from '../common/textBox.vue'
	import addSectionTitle from './addSectionTitle.vue'
	import addImg from './addImg.vue'
	import addVideo from './addVideo.vue'
	import completeInfo from './completeInfo.vue'
	import madeCode from '../common/madeCode.vue'
	import { mapGetters , mapActions } from 'vuex';
	import config from '@/config'
	
	export default {
		data() {
			return {
				sizeValue: 1, //文本框大小
				coverType: 'note',
				hadCoverImg: '',
				valTitle: '',
				shareTale: '',
				place: '分享你的旅途故事...',
				contentArr: [{content: '', travelType: 2, placeTxt: '分享你的旅途故事...', isShowDelete: false, isPlay: false}],
				isShowShareTale: true,
				dataArr: [] ,//最后游记详情
				defaultVal: {}, //默认数据
				isShowPreview: false, //是否展示预览
				previewUrl: '',
				isSaveDraft: false, //保存了草稿
				draftId: '',// 游记id
				phoneImgTimer: '',//定时器
				phoneImgArr: [], //手机图片
				isFocus: false ,//是否被焦点
				focusIndex: '' ,// 替换下标
			}
		},
		components: {writeTop, textBox, addSectionTitle, addImg, addVideo, completeInfo, madeCode},
		computed: {
			...mapGetters([
				'wn_isShowSectionBox',
				'wn_isShowAddimg',
				'wn_isShowVideo',
				// 'wn_globalIndex',
				'wn_isShowNoteInfo',
				'c_backTopVal',
				'c_loadingVal',
				'c_isShowMadeCode',
				'c_userInfo',
				'wn_saveCount',
				'c_userVal'
				])
		},
		watch: {
			wn_saveCount(val) {
				if(val.saveType == 1) {
					this.isSaveDraft = true
					this.textNote()
				}else if(val.saveType == 2) {
					if(this.$route.query.id === undefined) {
						if(this.hadCoverImg != '' && 
							this.valTitle != '' && 
							(this.contentArr[0].content != '' || this.contentArr[1].content != '')){
							this.wn_canTellSave(true)
							this.isSaveDraft = true
							this.textNote()
						}
					}
				}
			},
			c_isShowMadeCode(val) {
				if(!val) {
					this.isShowPreview = false
				}
			},
		},
		methods: {
			...mapActions([
				// 'wn_addContent',
				'wn_showNoteInfo',
				'wn_autoAddText',
				'c_showMadeCode',
				'wn_showBtn',
				'wn_canTellSave'
				]),
			mouseover(index) {
				this.contentArr[index].isShowDelete = true
			},
			mouseout(index) {
				this.contentArr[index].isShowDelete = false
			},
			toNext() {
				this.textNote()
			},
			textNote() {
				if(this.hadCoverImg) {
					if(this.valTitle != '') {
						if(this.contentArr[0].content != '' || this.contentArr[1].content != '') {
							this.dataArr = []
							this.contentArr.map((v, i) => {
								if(v.content != '') {
									this.dataArr.push({
										content: v.content,
										travelType: v.travelType
									})
								}
							})
							if(this.isShowPreview || this.isSaveDraft) {
								this.toPreviewOrSave()
							}else {
								setTimeout(() => {
									this.wn_showNoteInfo(true)
								}, 200)
							}
							
						}else {
							this.$message({
					          message: '请输入至少一条文本内容',
					          type: 'error',
					          center: true
					        })
						}
					}else {
						this.$message({
				          message: '请输入标题',
				          type: 'error',
				          center: true
				        })
					}
				}else {
					this.$message({
			          message: '请选择封面图',
			          type: 'error',
			          center: true
			        })
				}
			},
			toPreview() {
				this.isShowPreview = true
				this.textNote()
			},
			toPreviewOrSave() {
				const $this = this
				let dataObj = {
						title: $this.valTitle,
						coverImg: $this.hadCoverImg,
						status: 1,
						contents: $this.dataArr
					}
				if(this.draftId != '') {
					dataObj.id = this.draftId
				}
				this.$api.ajax({
		    		url: this.c_userVal == 'admin'? config.createTravelNote: config.userNoteSave,
		    		method: "POST",
		    		headers: {
						'API-User-Token': $this.c_userInfo.token
					},
					data: dataObj,
					success: (res) => {//this.draftId
						if(res.code == 0) {
							if(this.isShowPreview) {
								this.getShareUrl(res.data)
								this.isShowPreview  = false					
							}
							if(this.isSaveDraft) {
								if(this.wn_saveCount.saveType == 1) {
									this.$message({
							          message: '草稿保存成功',
							          type: 'success',
							          center: true
							        })
								}
						        this.isSaveDraft = false
							}
							this.draftId = res.data
						}else {
							this.$message({
						        type: 'error',
						        message: res.message,
						        center: true
						    });
						}
					},
					error: (err) => {
						this.$message({
					        type: 'error',
					        message: '操作失败',
					        center: true
					    });
					}
		    	})
			},
			getShareUrl(id) { //获取预览地址
		    	const $this = this
		        this.$api.ajax({
		        	url: `${config.shareUrl}/travel`,
		        	headers: {
						'Content-Type':'application/x-www-form-urlencoded',
						'API-User-Token': $this.c_userInfo.token
					},
					success: (res) => {
						if(res.code == 0) {
							let time = new Date().getTime()
							this.previewUrl = `${res.data.split('?')[0]}?id=${id}&time=${time}`
							this.c_showMadeCode(true)
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
					        message: '预览链接加载失败',
					        center: true
					    });
					}
		        })
		    },
			coverImg(val) {
				this.hadCoverImg = val
			},
			titleVal(val) {
				this.valTitle = val
			},
			playVideo(index) {
				let tags = document.getElementsByTagName("video")
				let video = 'video_'+index
				for(let i=0;i<tags.length;i++) {
					if(tags[i].className.indexOf(video) != -1) {
						if(tags[i].paused) {
							tags[i].play()
							this.contentArr[index].isPlay = true
						}else {
							tags[i].pause()
							this.contentArr[index].isPlay = false
						}
					}else {
						tags[i].pause()
						let cName = tags[i].className,
							index = cName.split('_')[1]
						this.contentArr[index].isPlay = false
					}
				}
				
			},
			deleteBox(type, index) {
				let txt = ''
				if(type == 1) {
					txt = '确认删除当前段落标题'
				}else if(type == 3) {
					txt = '确认删除当前图片'
				}else if(type == 4) {
					txt = '确认删除当前视频'
				}
				this.$confirm(txt , '' , {
			          	confirmButtonText: '确定',
			          	cancelButtonText: '取消'
			    	}).then(() => {
			          this.$message({
			            type: 'success',
			            message: '删除成功!',
			            center: true
			          });
			          	if(index > 0) {
			          		if(this.contentArr[index - 1].travelType == 2 && this.contentArr[index + 1].travelType == 2) {
			          			let txt = this.contentArr[index - 1].content,
					          		afterTxt = this.contentArr[index + 1].content
					          	if(txt == ''&& afterTxt == '') {
					          		this.contentArr[index - 1].content = ''
					          	}else if(txt != ''&& afterTxt == '') {
					          		this.contentArr[index - 1].content = txt
					          	}else if(txt == ''&& afterTxt != '') {
					          		this.contentArr[index - 1].content = afterTxt
					          	}else {
					          		this.contentArr[index - 1].content = `${txt}\n${afterTxt}`
					          	} 
					    		this.contentArr.splice(index,  2)
			          		}else {
			          			this.contentArr.splice(index,  1)
			          		}
			          	}else {
			          		this.contentArr.splice(index,  1)
			          	}
			        }).catch((err) => {
			        	// console.log(err)
			          this.$message({
			            type: 'info',
			            message: '已取消删除',
			            center: true
			          });
			    })

			},
			getSectionTitle(obj) {
				this.getNoteData(obj)
			},
			getImgVal(obj) {
				this.getNoteData(obj)
			},
			getVideo(obj) {
				this.getNoteData(obj)
			},
			textFocus(index) {//splice
				this.isFocus = true
				this.focusIndex = index + 1
			},
			getNoteData(obj) {
				if(!this.isFocus) {
					this.contentArr.push(...[obj,{content: '', travelType: 2,placeTxt:'写点什么...', isShowDelete: false, isPlay: false}])
				}else {
					this.contentArr.splice(this.focusIndex,0,...[obj,{content: '', travelType: 2,placeTxt:'写点什么...', isShowDelete: false, isPlay: false}])
					this.isFocus = false
					this.focusIndex = ''
				}
				
			},
			// phoneImgCount(val) {
			// 	if(val) {
			// 		this.phoneGetImg()
			// 	}
			// },
			phoneGetImg() {
				const $this = this
		        this.$api.ajax({
		        	url: `${config.getPhoneImg}/${$this.c_userInfo.uid}`,
		        	headers: {
						'Content-Type':'application/x-www-form-urlencoded',
						'API-User-Token': $this.c_userInfo.token
					},
					success: (res) => {
						if(res.code == 0) {
							if(this.phoneImgArr.length != 0) {
								this.phoneImgArr.map((v, i) => {
									res.data.map((item, ind) => {
										if(v != item) {
											this.contentArr.push(...[
												{content: item, travelType: 3, placeTxt:'', isShowDelete: false, isPlay: false},
												{content: '', travelType: 2,placeTxt:'写点什么...', isShowDelete: false, isPlay: false}
												])
											this.phoneImgArr.push(item)
										}
									})
								})
							}else {
								if(res.data.length != 0) {
									this.contentArr.push(...[
										{content: res.data[0] ,travelType: 3, placeTxt:'', isShowDelete: false, isPlay: false},
										{content: '', travelType: 2,placeTxt:'写点什么...', isShowDelete: false, isPlay: false}
										])
								}
								this.phoneImgArr.push(res.data[0])
							}
						}else {
							this.$message({
						        type: 'error',
						        message: res.message,
						        center: true
						    });
						    clearInterval(this.phoneImgTimer);
						}
					},
					error: (err) => {
						console.log(err)
						this.$message({
					        type: 'error',
					        message: '图片加载错误',
					        center: true
					    });
					    clearInterval(this.phoneImgTimer);
					}
		        })
			},
			getDetailData() { //获取景点详情
				const $this = this
				this.$api.ajax({
					url: `${this.c_userVal == 'admin'? config.noteDetail: config.userNoteDetail}/${this.$route.query.id}`,
					headers: {
						'Content-Type':'application/x-www-form-urlencoded',
						'API-User-Token': $this.c_userInfo.token
					},
					success: (res) => {
						if(res.code == 0) {
							this.detailObj = res.data
							this.shareUrl = res.data.shareUrl
							if(this.c_loadingVal) {
								this.c_loadingVal.close()
							}
							this.valTitle = res.data.title
							this.hadCoverImg = res.data.coverImg
							this.contentArr = []
							let data = res.data.details,
								reg = /<\/?.+?>/g
							for(let i=0;i<data.length; i++) {
								if(data[i].travelType == 2) {
									this.contentArr.push({
										content: data[i].content,
										travelType: data[i].travelType, 
										placeTxt:'写点什么...', 
										isShowDelete: false, 
										isPlay: false
									})
								}else {
									if(data[i+1]) {
										if(data[i+1].travelType != 2) {
											this.contentArr.push(...[{
												content: data[i].content,
												travelType: data[i].travelType, 
												placeTxt:'', 
												isShowDelete: false, 
												isPlay: false
											}, {content: '', travelType: 2,placeTxt:'写点什么...', isShowDelete: false, isPlay: false}])
										}else {
											this.contentArr.push({
												content: data[i].content,
												travelType: data[i].travelType, 
												placeTxt:'', 
												isShowDelete: false, 
												isPlay: false
											})
										}
									}else {
										if(data[i].travelType != 2) {
											this.contentArr.push(...[{
												content: data[i].content,
												travelType: data[i].travelType, 
												placeTxt:'', 
												isShowDelete: false, 
												isPlay: false
											}, {content: '', travelType: 2,placeTxt:'写点什么...', isShowDelete: false, isPlay: false}])
										}else {
											this.contentArr.push({
												content: data[i].content,
												travelType: data[i].travelType, 
												placeTxt:'', 
												isShowDelete: false, 
												isPlay: false
											})
										}
									}
									
								}
							}
							this.defaultVal = res.data
						}else {
							this.$message({
						        type: 'error',
						        message: res.message,
						        center: true
						    });
						    if(this.c_loadingVal) {
								this.c_loadingVal.close()
							}
						}
					},
					error: (err) => {
						this.$message({
					        type: 'error',
					        message: '数据加载失败',
					        center: true
					    });
					    if(this.c_loadingVal) {
							this.c_loadingVal.close()
						}
					}
				})
			}
		},
		beforeDestroy() {
			clearInterval(this.phoneImgTimer);
		},
		created() {
			if(this.$route.query.type == 'edit') {
				this.getDetailData()
				this.draftId = this.$route.query.id
			}
		},
		mounted() {
			if(this.$route.query.type != 'edit') {
				if(this.c_loadingVal) {
					this.c_loadingVal.close()
				}
			}
			this.wn_canTellSave(false)//默认显示不保存
			this.wn_showBtn(true) //侧边栏按钮显示
		}
	}
</script>

<style scoped>
	.writeBox {
		background-color: #fff;
		width: 100%;
		height: 100%;
		position: relative;
		/* padding-bottom: 60px; */
	}
	.writeNote {
		width: 100%;
		height: auto;
		overflow-y: auto;
		position: relative;
	}
	.noteContent {
		width: 100%;
		min-height: 476px;
		padding: 15px 100px;
	}
	.contentList {
		margin-top: 15px;
	}
	.writeNoteBtn {
		/* position: absolute;
		bottom: 0;
		left: 0; */
		padding-bottom: 15px;
		width: 100%;
		display: flex;
		justify-content: center;
		background-color: #fff;
	}
	.writeNoteBtn>div {
		padding: 10px 40px;
		font-size: 16px;
	}
	.writeNoteBtn>div:hover {
		cursor: pointer;
	}
	.writeNoteBtn>div:first-child {
		color: #FFB132;
		margin-right: 60px;
		background: #FFFFFF;
		box-shadow: 0 0 14px 0 #ECEDF1;
		border-radius: 100px;
	}
	.writeNoteBtn>div:nth-child(2) {
		color: #fff;
		background: #FFB132;
		box-shadow: 0 0 14px 0 rgba(255,177,50,0.40);
		border-radius: 100px;
	}
	.itemContent {
		width: auto;
		height: auto;
	}
	.typeContent {
		width: 100%;
		height: auto;
	}
	.typeContent>div {
		margin-bottom: 10px;
		position: relative;
		overflow: hidden;
	}
	.typeContent input {
		display: block;
		height: 32px;
		width: 100%;
		font-weight: 600;
		padding-right: 40px;
		font-size: 18px;
		color: #373A3E;
	}
	.typeContent img{
		width: 100%;
		height: auto;
		border-radius: 10px;
		margin-bottom: 10px;
	}
	.typeContent .videoBox {
		width: 640px;	
		height: 360px;
		position: relative;
		overflow: hidden;
	}
	.videoBox>video{
		height: 100%;
		width: auto;
		margin: 0 auto;
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
	}
	.deleteBox {
		position: absolute;
		top: 0;
		right: 0;
		z-index: 20;
		height: 40px;
		width: 100%;
		padding: 0 15px;
		background-color: rgba(0,0,0,0.4);
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}
	.deleteInputBox {
		position: absolute;
		top: 0;
		right: 0;
		z-index: 20;
		width: 40px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: rgba(0,0,0,0.4);
	}
	.deleteBox>b, .deleteInputBox>b {
		display: block;
		width: 18px;
		height: 17px;
		background: url('../../assets/img/deleteNote.png') no-repeat center;
		background-size: 100%;
	}
	.deleteBox>b:hover,.deleteInputBox>b:hover {
		cursor: pointer;
	}
	.imgShowBox {
		border-radius: 10px;
	}
	.videoPlay {
		width: 40px;
		height: 40px;
		position: absolute;
		top: 50%;
		left: 50%;
		margin-top: -20px;
		margin-left: -20px;
	}
	.videoPlay:hover {
		cursor: pointer;
	}
	.upShow-enter-active, .upShow-leave-active {
	  transition: all .2s;
	}
	.upShow-enter, .upShow-leave-to {
	  transform: translate3d(0, -40px, 0);
	  opacity: 0;
	}

	.rightShow-enter-active, .rightShow-leave-active {
	  transition: all .2s;
	}
	.rightShow-enter, .rightShow-leave-to {
	  transform: translate3d(40px, 0, 0);
	  opacity: 0;
	}
</style>