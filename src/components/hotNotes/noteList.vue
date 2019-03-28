<template>
	<div class="noteList">
		<div class="noteListTop">
			<span>{{listTitle}}</span>
			<span>作者</span>
			<span>发布时间</span>
			<span>编号</span>
			<span>操作</span>
		</div>
		<div class="listContentBox" v-loading="boxLoading">
		<happy-scroll color="rgba(255,177,50,1)" size="4" hide-horizontal resize :scroll-top="c_backTopVal" v-if="!isShowBlank">
			<div class="noteListBox">
				<div class="itemNote" v-for="(item, index) in dataList" :key="item.id" >
					<div class="noteIntro" @click="jumpToDetail(item.id, item.selfFlag)">
						<div class="noteIntroImg">
							<img :src="`${item.coverImg}?x-oss-process=style/thumb`" alt="">
						</div>
						<div class="noteIntroText">
							<h3>{{item.title}}</h3>
							<p>{{item.content | textChange}}</p>
						</div>
					</div>
					<div :class="['noteAuthor', {officalNote: item.type == 1}]" title>{{item.nickname}}</div>
					<div class="notePushTime">{{item.updatedTime | formatTime}}</div>
					<div class="noteNumber">{{item.id}}</div>
					<div class="noteOperation" v-if="signNum == 0"> 
						<template v-if="c_userVal == 'admin'">
							<div @click="deleteNote(item.id, index)"><img src="../../assets/img/delete_act.png" alt=""></div>
							<div v-if="item.selfFlag == 1" @click="editNote(item.id)"><img src="../../assets/img/edit_act.png" alt=""></div>
						</template>
						<template v-else>
							<template v-if="item.selfFlag == 1">
								<div @click="deleteNote(item.id, index)"><img src="../../assets/img/delete_act.png" alt=""></div>
								<div @click="editNote(item.id)"><img src="../../assets/img/edit_act.png" alt=""></div>
							</template>
							<div v-else @click="colloctLine(item.id, item.collectFlag, index)"><img :src="item.collectFlag === 0? noCollect: hadCollect" alt=""></div>
						</template>
					</div>
					<div class="noteOperation" v-else>
						<div @click="toReject(item.id, index)"><img src="../../assets/img/reject_small.png" alt=""></div>
						<div @click="toPass(item.id, index)"><img src="../../assets/img/pass.png" alt=""></div>
					</div>
				</div>
			</div>
		</happy-scroll>
		<listBlank v-if="isShowBlank"></listBlank>
		</div>
		<div class="pagination">
			<el-pagination
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				:current-page.sync="currentPage"
				:page-size="size"
				layout="prev, pager, next, jumper"
				:total="total">
			</el-pagination>
		</div>
	</div>
</template>

<script>
	import listBlank from '../common/list_blank.vue' //普通用户才有收藏按钮，自己的可以编辑和删除，管理员可以编辑或者删除，不是自己的可以删除，
	import { mapGetters , mapActions } from 'vuex';
	import config from '@/config'
	
	export default {
		data() {
			return {
				noCollect: require('../../assets/img/no_collect.png'),
				hadCollect: require('../../assets/img/had_collect.png'),
				currentPage: 1,
				listTitle: '游记标题',
				index: 1,
				size: 10,
				cityName: '',
				keyword: '',
				dataList: [],
				isFirstLoad: true,
				isShowBlank: false,
				boxLoading: false,
				total: 0,
				portUrl: '',
				rejectInd: '', //驳回索引
			}
		},
		props: {
			signNum: {
				type: Number,
				default: 0
			},
			cityVal: {
				type: String,
				default: ''
			}
		},
		components: {listBlank},
		computed:{
			...mapGetters([
				'c_backTopVal',
				'c_loadingVal',
				'c_userInfo',
				'c_userVal',
				'wn_noteType',
				'c_isListUpdate',
				'c_searchText',
				'c_routeSave',
				'wc_isShowRejectBox',
				'c_updateStatus'
				])
		},
		watch: {
			cityVal(val) {
				this.index = 1
				this.isFirstLoad = true
				if(val != '选择区域') {
					this.cityName = val
				}else {
					this.cityName = ''
				}
				this.currentPage = 1
				this.getListData()
				this.c_toTop(0)
				setTimeout(() => {
					this.c_toTop(-1)
				},100)
			},
			wn_noteType(val) {
				this.index = 1
				this.isFirstLoad = true
				this.currentPage = 1
				this.getListData()
				this.c_toTop(0)
				setTimeout(() => {
					this.c_toTop(-1)
				},100)
			},
			wc_isShowRejectBox(val) { //通用列表，驳回驳回删除操作
				if(val.type == 99) {
					this.dataList.splice(this.rejectInd, 1)
					if(this.dataList.length == 0) {
						this.isShowBlank = true
					}
				}
			},
			c_searchText(val) {
				if(this.signNum == 0) {
					if(this.c_routeSave == '/hotNotes') {
						this.index = 1
					    this.currentPage = 1
					    this.isFirstLoad = true
					    this.keyword = val
					    this.getListData()
					    this.c_toTop(0)
						setTimeout(() => {
							this.c_toTop(-1)
						},100)
					}
				}else {
					if(this.c_routeSave == '/waitCheck') {
						this.index = 1
					    this.currentPage = 1
					    this.isFirstLoad = true
					    this.keyword = val
					    this.getListData()
					    this.c_toTop(0)
						setTimeout(() => {
							this.c_toTop(-1)
						},100)
					}
				}
			},
			c_updateStatus(val) {
				if(val.type == 1 && this.c_routeSave == '/hotNotes') {//当状态为true列表更新
					this.index = 1
					this.isFirstLoad = true
					this.currentPage = 1
					this.wn_changeNoteType(2)
					this.getListData()
					this.c_toTop(0)
					setTimeout(() => {
						this.c_toTop(-1)
					},100)
				}
			}
		},
		filters:{
		    formatTime:function(time){
		    	if(time) {
		    		return time.split(' ')[0]
		    	}else {
		    		return ''
		    	}
		    },
		    textChange(txt) {
		    	let reg = /<\/?.+?>/g,
		    		text = txt
		    	if(txt) {
		    		text = txt.replace(reg,"\n")
		    	}
		    	return text
		    }
		},
		activated(){
			if(this.c_isListUpdate && this.c_routeSave == '/hotNotes') {//当状态为true列表更新
				this.index = 1
				this.isFirstLoad = true
				this.wn_changeNoteType(2)
				this.getListData()
				this.c_toTop(0)
				setTimeout(() => {
					this.c_toTop(-1)
				},100)
				this.c_listUpdate(false)
			}
		},
		methods: {
			...mapActions([
				'c_loadingShow',
				'wc_showRejectBox',
				'c_toTop',
				'nd_showHandleBtn',
				'c_listUpdate',
				'wn_changeNoteType'
				]),
			colloctLine(id, isColloct, index) {
		    	let txt = ''
		    	if(isColloct === 0) {
		    		txt = `确认收藏游记 ${this.dataList[index].title}`
		    	}else {
		    		txt = `确认取消收藏游记 ${this.dataList[index].title}`
		    	}
		    	this.$confirm(txt, '', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		        }).then(() => {
		        	let type = ''
		        	if(isColloct === 0){
		        		type = 1 //收藏
		        	}else {
		        		type = 2 //取消收藏
		        	}
		        	this.colloctMehod(id, type, index)

		        }).catch(() => {
		          this.$message({
		            type: 'info',
		            message: '已取消收藏',
		            center: true
		          });          
		        });
		    },
		    colloctMehod(id, type, index) {
		    	const $this = this
		    	this.$api.ajax({
		    		url: config.userCollectNote,
		    		headers: {
						'Content-Type':'application/x-www-form-urlencoded',
						'API-User-Token': $this.c_userInfo.token
					},
					params: {
						postId: id,
						type: type
					},
					success: (res) => {
						if(res.code == 0) {
							let txt = '游记收藏成功'
							if(type == 2) {
								txt = '已取消收藏'
							}
							this.$message({
						        type: 'success',
						        message: txt,
						        center: true
						    });
						    if(type == 1) {
						    	this.dataList.map((v, i) => {
									if(index == i) {
										v.collectFlag = 1
									}
								})
						    }else {
						    	this.dataList.map((v, i) => {
									if(index == i) {
										v.collectFlag = 0
									}
								})
						    }
							
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
					        message: '收藏游记失败',
					        center: true
					    });
					}
		    	})
		    },
			handleSizeChange(val) {
		       console.log(`每页 ${val} 条`);
		    },
		    handleCurrentChange(val) {
		       	this.index = val
		    	this.currentPage = val
		       	this.getListData()
		       	this.c_toTop(0)
				setTimeout(() => {
					this.c_toTop(-1)
				},100)
		    },
		    getListData() {//获取列表数据
		    	const $this = this
		    	this.boxLoading = true
		    	this.$api.ajax({
		    		url: $this.portUrl,
		    		method: "POST",
		    		headers: {
						'Content-Type':'application/x-www-form-urlencoded',
						'API-User-Token': $this.c_userInfo.token
					},
					params: {
						pn: $this.index,
						ps: $this.size,
						type: $this.wn_noteType, //默认值2
						keyword: $this.keyword,
						city: $this.cityName
					},
					success: (res) => {
						if(res.code == 0) {
							this.total = res.total
							if(res.data.length != 0) {
								setTimeout(() => {
									this.boxLoading  = false
								}, 200)
								this.dataList = res.data
								this.isFirstLoad = false
								this.isShowBlank = false
							}else {
								if(this.isFirstLoad) {
									this.isShowBlank = true
									setTimeout(() => {
										this.boxLoading  = false
									}, 200)
								}
							}
						}else {
							if(this.isFirstLoad) {
								this.isShowBlank = true
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
		    jumpToDetail(id, selfFlag) {
		    	this.c_loadingShow()
		    	if(this.signNum == 2) {
		    		setTimeout(() => {
		    			this.$router.push({
							path: '/hotLineDetail',
							query:{
					          id: id
					        }
						})
		    		}, 600)
		    	}else {
					setTimeout(() => {
						if(selfFlag == 1) {
							this.nd_showHandleBtn({id: id, isShow: true})
						}else {
							this.nd_showHandleBtn({id: '', isShow: false})
						}
					    this.$router.push({
							path: '/noteDetail',
							query:{
					          id: id
					        }
						})
					}, 600);
		    	}	
		    },
		    deleteNote(id, index) {
		    	this.$confirm(`确认删除游记 ${this.dataList[index].title}`, '', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		        }).then(() => {

		          	this.deleteNoteMethod(id, index)

		        }).catch(() => {
		          this.$message({
		            type: 'info',
		            message: '已取消删除',
		            center: true
		          });          
		        });
		    },
		    deleteNoteMethod(id, index) {
		    	const $this = this
		    	this.$api.ajax({
		    		url: `${$this.c_userVal == 'admin'? config.deleteNote: config.userNoteDelete}/${id}`,
		    		method: "DELETE",
		    		headers: {
						'Content-Type':'application/x-www-form-urlencoded',
						'API-User-Token': $this.c_userInfo.token
					},
					success: (res) => {
						if(res.code == 0) {
							this.$message({
						        type: 'success',
						        message: '游记删除成功',
						        center: true
						    });
							this.dataList.splice(index, 1)
							if(this.dataList.length == 0) {
								this.isShowBlank = true
							}
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
					        message: '删除游记失败',
					        center: true
					    });
					}
		    	})
		    },
		    editNote(id) {
		    	this.c_loadingShow()
				setTimeout(() => {
				    this.$router.push({
						path: '/writeNote',
						query: {
							id: id,
							type: 'edit'
						}
					})
				}, 600);
		    },
		    // 关联审核页面
		    toReject(id, index) { //驳回
		    	if(this.signNum == 1) {
		    		this.wc_showRejectBox({isShow: true, type: 1, id: id})
		    	}else if(this.signNum == 2) {
		    		this.wc_showRejectBox({isShow: true, type: 2, id: id})
		    	}
		    	this.rejectInd = index
		    },
		    toPass(id, index) { //通过
		    	this.$confirm(`确认通过 ${this.dataList[index].title}`, '', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		        }).then(() => {
		          	if(this.signNum == 1) {
			    		this.passOpreate(id, index)
			    	}else if(this.signNum == 2) {
			    		this.passOpreate(id, index)
			    	}

		        }).catch(() => {
		          this.$message({
		            type: 'info',
		            message: '已取消通过',
		            center: true
		          });          
		        });
		    },
		    passOpreate(id, index) { //通过操作
		    	const $this = this
		    	let url = ''
		    	if(this.signNum == 1) {//游记
		    		url = config.noteOrVideoPass
		    	}else if(this.signNum == 2) { //路书
		    		url = config.linePass
		    	}
		    	this.$api.ajax({
		    		url: `${url}/${id}`,
		    		headers: {
						'Content-Type':'application/x-www-form-urlencoded',
						'API-User-Token': $this.c_userInfo.token
					},
					success: (res) => {
						if(res.code == 0) {
							this.$message({
						        type: 'success',
						        message: '操作成功',
						        center: true
						    });
						    this.dataList.splice(index, 1)
						    if(this.dataList.length == 0) {
								this.isShowBlank = true
							}
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
					        message: '操作失败',
					        center: true
					    });
					}
		    	})
		    },
		    statusChange() {
		    	if(this.signNum == 1) {
		    		this.portUrl = config.checkNote
		    		this.getListData()
		    	}else if(this.signNum == 2) {
		    		this.portUrl = config.checkLine
		    		this.getListData()
		    		this.listTitle = '线路标题'
		    	}
		    },
		},
		created() {
			if(this.signNum != 0){
				this.statusChange()
			}else {
				this.portUrl = this.c_userVal == 'admin'? config.managerNoteList: config.userNoteList
				this.getListData()
			}
		},
		mounted() {
			if(this.c_loadingVal) {
				this.c_loadingVal.close()
			}
		}
	}
</script>

<style scoped>
	.noteList {
		margin-top: 40px;
		width: 100%;
		height: 100%;
		overflow: hidden;
		flex: 1;
		display: flex;
		flex-direction: column;
		position: relative;
	}
	.noteListTop {
		display: flex;
		justify-content: space-between;
		font-size: 14px;
		color: #373A3E;
		font-weight: 600;
		border-bottom: 1px solid #EAEBED;
		margin-bottom: 15px;
		padding: 0 15px 15px 15px;
	}
	.noteListTop>span:first-child {
		width: 350px;
	}
	.noteListTop>span:nth-child(2) {
		width: 115px;
	}
	.noteListTop>span:nth-child(3) {
		width: 77px;
	}
	.noteListTop>span:nth-child(4) {
		width: 60px;
	}
	.noteListTop>span:nth-child(5) {
		width: 53px;
	}
	.listContentBox {
		width: 100%;
	    height: 100%;
	    overflow: hidden;
	    position: relative;
	    background-color: #fff;
	}
	.noteListBox {
		flex: 1;
		overflow-y: auto;
		background-color: #fff;
	}
	.itemNote {
		padding: 15px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #fff;
		transition: all 0.2s;
	}
	.itemNote:hover {
		background: #FFF2DD;
	}
	.itemNote:not(:last-child) {
		border-bottom: 1px solid #E6E6E6;
	}
	.noteIntro {
		display: flex;
		align-items: center;
		width: auto;
		height: 100px;
	}
	.noteIntro:hover {
		cursor: pointer;
	}
	.noteIntroImg {
		width: 100px;
		height: 100%;
		border-radius: 10px;
		overflow: hidden;
		margin-right: 10px;
	}
	.noteIntroText {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		width: 240px;
		height: 100%;
	}
	.noteIntroText>h3 {
		font-size: 15px;
		color: #373A3E;
	}
	.noteIntroText>p {
		font-size: 14px;
		color: #373A3E;
		line-height: 20px;
		display: -webkit-box;    
		-webkit-box-orient: vertical;    
		-webkit-line-clamp: 2;    
		overflow: hidden; 
	}
	.noteAuthor {
		font-size: 15px;
		color: #373A3E;
		width: 115px;
		height: auto;
		overflow:hidden;
		text-overflow:ellipsis;
		white-space:nowrap
	}
	.noteAuthor.officalNote {
		color: #FFB132;
	}
	.notePushTime {
		font-size: 15px;
		color: #373A3E;
	}
	.noteNumber {
		font-size: 15px;
		color: #A9AFB6;
		width: 60px;
		height: auto;
	}
	.noteOperation {
		width: auto;
		height: auto;
		display: flex;
		flex-direction: column;
	}
	.noteOperation>div {
		width: 53px;
		height: 22px;
	}
	.noteOperation>div:nth-child(2) {
		margin-top: 10px;
	}
	.noteOperation>div:hover {
		cursor: pointer;
	}
</style>