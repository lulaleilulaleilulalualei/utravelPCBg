	<template>
	<div class="draftShow">
		<div class="listContentBox" v-loading="boxLoading">
		<happy-scroll color="rgba(255,177,50,1)" size="4" resize :scroll-top="c_backTopVal" v-if="!isShowBlank">
			<div class="drafShowBox">
				<div class="draftBox" v-for="(item, index) in dataList" :key="item.id">
					<div class="draftImg">
						<img :src="item.coverImg" alt="">
					</div>
					<div class="draftInfo">
						<div class="draftInfoTop">
							<h3 :title="item.title">{{item.title}}</h3>
							<span>{{item.updatedTime}}</span>
						</div>
						<div class="draftInfoBottom">
							<div @click="deleteDraft(item.id, index)"><img src="../../assets/img/delete_act.png" alt=""></div>
							<div @click="editDraft(item.id)"><img src="../../assets/img/edit_act.png" alt=""></div>
						</div>
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
	import { mapGetters , mapActions } from 'vuex';
	import listBlank from './list_blank.vue'
	import config from '@/config'

	export default {
		data() {
			return {
				currentPage: 1,
				boxLoading: false,
				index:1,
				size:10,
				total:0,
				keyword: '',
				isShowBlank: false,
				isFirstLoad: true,
				dataList: []
			}
		},
		props: {
			draftType: {
				type: String,
				default: ''
			}
		},
		computed:{
			...mapGetters([
				'c_backTopVal',
				'c_loadingVal',
				'vhl_lineType',//线路状态
				'c_userInfo',
				'c_userVal',
				'c_isListUpdate',
				'c_routeSave'
				])
		},
		components: {listBlank},
		activated(){
			if(this.c_isListUpdate && this.c_routeSave == '/vHotLine') {//当状态为true列表更新
				this.index = 1
				this.isFirstLoad = true
				this.getDraftData()
				this.c_toTop(0)
				setTimeout(() => {
					this.c_toTop(-1)
				},100)
				this.c_listUpdate(false)
			}
			if(this.c_isListUpdate && this.c_routeSave == '/hotLine') {//当状态为true列表更新
				this.index = 1
				this.isFirstLoad = true
				this.getDraftData()
				this.c_toTop(0)
				setTimeout(() => {
					this.c_toTop(-1)
				},100)
				this.c_listUpdate(false)
			}
			if(this.c_isListUpdate && this.c_routeSave == '/hotNotes') {//当状态为true列表更新
				this.index = 1
				this.isFirstLoad = true
				this.getDraftData()
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
				'c_toTop',
				'c_listUpdate'
				]),
			handleSizeChange(val) {
		       console.log(`每页 ${val} 条`);
		    },
		    handleCurrentChange(val) {
		       	this.index = val
		    	this.currentPage = val
		       	this.getDraftData()
		       	this.c_toTop(0)
				setTimeout(() => {
					this.c_toTop(-1)
				},100)
		    },
			deleteDraft(id, index) {
				let noticeTxt = ''
				if(this.draftType == 'line') {
					noticeTxt = '确认删除线路'
				}else if(this.draftType == 'note') {
					noticeTxt = '确认删除游记'
				}
				this.$confirm(`${noticeTxt} ${this.dataList[index].title}`, '', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		        }).then(() => {

		          this.deleteMethod(id, index)

		        }).catch(() => {
		          this.$message({
		            type: 'info',
		            message: '已取消删除',
		            center: true
		          });          
		        });
			},
			deleteMethod(id, index) {
				const $this = this
				let url = ''
				if(this.draftType == 'line') {
					url = this.c_userVal == 'admin'? config.managerDeleteLine: config.userDeleteLine
				}else if(this.draftType == 'note') {
					url = config.deleteNote
				}
		    	this.$api.ajax({
		    		url: `${url}/${id}`,
		    		method: "DELETE",
		    		headers: {
						'Content-Type':'application/x-www-form-urlencoded',
						'API-User-Token': $this.c_userInfo.token
					},
					success: (res) => {
						if(res.code == 0) {
							let txt = ''
							if(this.draftType == 'line') {
								txt = '线路删除成功'
							}else if(this.draftType == 'note') {
								txt = '游记删除成功'
							}
							this.$message({
						        type: 'success',
						        message: txt,
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
						let txt = ''
						if(this.draftType == 'line') {
							txt = '删除线路失败'
						}else if(this.draftType == 'note') {
							txt = '删除游记失败'
						}
						this.$message({
					        type: 'error',
					        message: txt,
					        center: true
					    });
					}
		    	})
			},
			editDraft(id) {
				if(this.draftType == 'line') {
					this.c_loadingShow()
					setTimeout(() => {
					    this.$router.push({
							path: '/writeLine',
							query: {
								id: id
							}
						})
					}, 800)
				}else if(this.draftType == 'note') {
					this.c_loadingShow()
					setTimeout(() => {
					    this.$router.push({
							path: '/writeNote',
							query: {
								id: id,
								type: 'edit'
							}
						})
					}, 800);
				}
			},
			getDraftData() {
				const $this = this
				let url = ''
				if(this.draftType == 'line') {
					url = this.c_userVal == 'admin'? config.managerLineList: config.userLineList
				}else if(this.draftType == 'note') {
					url = config.managerNoteList
				}
		    	this.boxLoading = true
		    	this.$api.ajax({
		    		url: url,
		    		method: "POST",
		    		headers: {
						'Content-Type':'application/x-www-form-urlencoded',
						'API-User-Token': $this.c_userInfo.token
					},
					params: {
						pn: $this.index,
						ps: $this.size,
						type: 1,
						keyword: $this.keyword,
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
					        message: '数据请求失败',
					        center: true
					    });
					}
		    	})
			}
		},
		created() {
			// this.getDraftData()//数据加载
		},
		mounted() {
			this.getDraftData()//数据加载
		}
	}
</script>

<style scoped>
	.draftShow {
	  	background-color: #fff;
	  	margin-top: 40px;
	  	height: 100%;
	  	overflow-y: auto;
	  	flex: 1;
	  	display: flex;
	  	flex-direction: column;
	}
	.listContentBox {
		width: 100%;
	    height: 100%;
	    overflow: hidden;
	    position: relative;
	    background-color: #fff;
	}
	.drafShowBox {
		display: flex;
	  	flex-wrap: wrap;
	  	align-content: space-between;
	  	overflow-y: auto;
	  	height: 100%;
	  	
	}
	.draftBox {
		width: 274px;
		padding: 20px 0 20px 10px;
		border-bottom: 1px solid #E6E6E6;
		background-color: #fff;
		display: flex;
		background-color: #fff;
		transition: all 0.2s;
	}
	.draftBox:hover {
		cursor: pointer;
		background: #FFF2DD;
	}
	.draftImg {
		width: 125px;
		height: 125px;
		margin-right: 10px;
	}
	.draftInfo {
		width: 125px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	.draftInfoTop>h3 {
		display: block;
		width: 100%;
		font-size: 18px;
		color: #373A3E;
		margin-bottom: 5px;
		overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
	}
	.draftInfoTop>span {
		display: block;
		font-size: 14px;
		color: #9FA6AD;
	}
	.draftInfoBottom>div {
		width: 53px;
		height: 22px;
	}
	.draftInfoBottom>div:hover {
		cursor: pointer;
	}
	.draftInfoBottom>div:first-child {
		margin-bottom: 10px;
	}
</style>