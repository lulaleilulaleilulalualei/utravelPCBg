<template>
	<div class="spotList">
		<div class="spotListTop">
			<span>景点列表</span>
		</div>
		<div class="listContentBox" v-loading="boxLoading">
		<happy-scroll color="rgba(255,177,50,1)" size="4" hide-horizontal resize :scroll-top="c_backTopVal" v-if="!isShowBlank">
			<div class="spotListBox">
				<div class="itemSpot" v-for="(item, index) in dataList" :key="item.id">
					<div class="spotImg" @click="jumpToDetail(item.id)">
						<img :src="`${item.thumbImg}?x-oss-process=style/thumb`" alt="">
					</div>
					<div class="spotInfo">
						<h4>{{item.name}}</h4>
						<div class="spotInfoBasic">
							<span>发布时间：{{item.updatedTime | formatTime}}</span>
							<span>编号：{{item.id}}</span>
						</div>
						<div class="spotInfoBtn" v-if="signNum == 0">
							<div @click.stop="deleteSpot(item.id, index)" title="删除景点">
								<img src="../../assets/img/delete_act.png" alt="">
							</div>
							<div @click.stop="editSpot(item.id, index)" title="编辑景点">
								<img src="../../assets/img/edit_act.png" alt="">
							</div>
						</div>
						<div class="spotInfoBtn" v-else>
							<div @click.stop="checkEditSpot(item.id, index)" title="编辑景点">
								<img src="../../assets/img/edit_act.png" alt="">
							</div>
							<div @click.stop="checkSpotPass(item.id, index)" title="通过">
								<img src="../../assets/img/pass.png" alt="">
							</div>
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

		<transition name="fade">
			<showSpot v-if="c_isShowSpotContent.isShow"></showSpot>
		</transition>
	</div>
</template>

<script>
	import listBlank from '../common/list_blank.vue'
	import showSpot from '../common/showSpot.vue' 
	import { mapGetters , mapActions } from 'vuex';
	import config from '@/config'
	
	export default {
		data() {
			return {
				currentPage: 1,
				index: 1,
				size: 30,
				total: 0,
				cityName: '',
				keyword: '',
				dataList: [],
				isFirstLoad: true,
				isShowBlank: false,
				boxLoading: false,
				portUrl: ''
			}
		},
		props: {
			signNum: {
				type: Number,
				default: 0
			},
			cityVal: {
				props:String,
				default: ''
			}
		},
		components: {listBlank, showSpot},
		computed:{
			...mapGetters([
				'c_backTopVal',
				'c_userInfo',
				'c_cityObj',
				'c_isListUpdate',
				'c_isShowSpotContent',
				'c_searchText',
				'c_routeSave'
				])
		},
		filters:{
		    formatTime:function(time){
		    	if(time) {
		    		return time.split(' ')[0]
		    	}else {
		    		return ''
		    	}
		    }
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
			c_searchText(val) {
				if(this.signNum == 0) {
					if(this.c_routeSave == '/spotList') {
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
			}
		},
		activated(){
			if(this.c_isListUpdate && this.c_routeSave == '/spotList' || this.c_isListUpdate && this.c_routeSave == '/waitCheck') {//当状态为true列表更新
				this.index = 1
				this.currentPage = 1
				this.isFirstLoad = true
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
				'c_toTop',
				'c_listUpdate',
				'c_showSpotContent'
				]),
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
		    jumpToDetail(id) {
		    	if(this.signNum != 0) {
		    		this.c_showSpotContent({id: id, isShow: true})
		    	}else {
		    		this.c_loadingShow()
					setTimeout(() => {
					    this.$router.push({
							path: '/addEditSpot',
							query: {
								type: 'read',
								id: id
							}
						})
					}, 600);
		    	}
		    },
		    editSpot(id, index) {
		    	this.c_loadingShow()
				setTimeout(() => {
				    this.$router.push({
						path: '/addEditSpot',
						query: {
							type: 'edit',
							id: id
						}
					})
				}, 600);
		    },
		    getListData() {
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
		    deleteSpot(id, index) {
		    	this.$confirm(`<p>确认删除景点 <b>${this.dataList[index].name}</b></p>` , '' , {
		    			dangerouslyUseHTMLString: true,
			          	confirmButtonText: '确定',
			          	cancelButtonText: '取消'
			    	}).then(() => {

			          this.deleteSpotMethod(id, index)

			        }).catch(() => {
			          this.$message({
			            type: 'info',
			            message: '已取消删除',
			            center: true
			          });
			    })
		    },
		    deleteSpotMethod(id, index) {
		    	const $this = this
		    	this.$api.ajax({
		    		url: `${config.deleteSpot}/${id}`,
		    		method: "DELETE",
		    		headers: {
						'Content-Type':'application/x-www-form-urlencoded',
						'API-User-Token': $this.c_userInfo.token
					},
					success: (res) => {
						if(res.code == 0) {
							this.$message({
						        type: 'success',
						        message: '景点删除成功',
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
					        message: '删除线路失败',
					        center: true
					    });
					}
		    	})
		    },
		    checkEditSpot(id, index) {
		    	this.c_loadingShow()
				setTimeout(() => {
				    this.$router.push({
						path: '/addEditSpot',
						query: {
							type: 'edit',
							id: id,
							from: 'check'
						}
					})
				}, 600);
		    },
		    checkSpotPass(id, index) {
		    	this.$confirm(`确认通过景点 ${this.dataList[index].name}`, '', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		        }).then(() => {

			    	this.passOpreate(id, index)

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
		    	this.$api.ajax({
		    		url: `${config.spotPass}/${id}`,
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
		},
		created() {
			if(this.signNum != 0) {
				this.portUrl = config.checkSpot
				this.getListData();//数据列表加载
			}else {
				this.portUrl = config.getManagerSpotList
				this.getListData();//数据列表加载
			}
		},
		mounted() {
			
		}
	}
</script>

<style scoped>
	.spotList {
		margin-top: 30px;
		width: 100%;
		height: 100%;
		overflow: hidden;
		flex: 1;
		display: flex;
		flex-direction: column;
		position: relative;
	}
	.spotListTop {
		font-size: 14px;
		color: #373A3E;
		font-weight: 600;
		border-bottom: 1px solid #EAEBED;
		margin-bottom: 15px;
		padding: 0 15px 15px 15px;
	}
	.listContentBox {
		width: 100%;
	    height: 100%;
	    overflow: hidden;
	    position: relative;
	    background-color: #fff;
	}
	.spotListBox {
		flex: 1;
		overflow-y: auto;
		background-color: #fff;
		display: flex;
		flex-wrap: wrap;
	}
	.itemSpot {
		padding: 15px;
		border-bottom: 1px solid #E6E6E6;
		background-color: #fff;
		transition: all 0.2s;
		display: flex;
		width: auto;
		height: 130px;
		width: 274px;
	}
	.itemSpot:hover {
		background: #FFF2DD;
	}
	.spotImg {
		width: 100px;
		height: 100px;
		border-radius: 10px;
		overflow: hidden;
		margin-right: 10px;
	}
	.spotImg:hover {
		cursor: pointer;
	}
	.spotInfo {
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	.spotInfo>h4 {
		width: 120px;
		font-size: 18px;
		color: #373A3E;
		max-width: 135px;
		overflow:hidden;
	    text-overflow:ellipsis;
	    white-space:nowrap
	}
	.spotInfoBasic {
		font-size: 12px;
		color: #373A3E;
	}
	.spotInfoBasic>span {
		display: block;
	}
	.spotInfoBtn {
		display: flex;
	}
	.spotInfoBtn>div {
		width: 53px;
		height: 22px;
	}
	.spotInfoBtn>div:hover {
		cursor: pointer;
	}
	.spotInfoBtn>div:first-child {
		margin-right: 10px;
	}
</style>