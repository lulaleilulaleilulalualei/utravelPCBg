<template>
	<div class="lineTable">
		<div class="lineTableTop">
			<span>线路标题</span>
			<span>来源</span>
			<span>操作</span>
		</div>
		<div class="listContentBox" v-loading="boxLoading">
		<happy-scroll color="rgba(255,177,50,1)" size="4" hide-horizontal resize :scroll-top="c_backTopVal" v-if="!isShowBlank">
			<div class="lineTableBox">
				<div class="itemTr" v-for="(item, index) in dataList" :key="item.id">
					<div class="lineIntro" @click="jumpTopDetail(item.id, item.selfFlag)">
						<div class="lineIntroImg"><img :src="`${item.coverImg}?x-oss-process=style/thumb220x150`" alt=""></div>
						<div class="lineIntroText">
							<h3>{{item.title}}</h3>
							<p>{{item.description.length>80? item.description.substring(0, 80) + '...': item.description}}</p>
							<div class="lineIntroInfo">
								<div><span>{{item.nickname}}</span></div>
								<span>发布时间：{{item.updatedTime | formatTime}}</span>
								<span>编号：{{item.id}}</span>
							</div>
						</div>
					</div>
					<div :class="item.type == 1? 'lineType': 'pensonalType'">{{item.type == '1'? '官方': '个人'}}</div>
					<div class="lineOperation" v-if="item.selfFlag != 1">
						<div @click="colloctLine(item.id, item.collectFlag, index)"><img :src="item.collectFlag === 0? noCollect: hadCollect" alt=""></div>
						<div v-if="false" @click="toStartAct(item.id)"><img :src="startAct" alt=""></div>
					</div>
					<div class="lineOperation" v-else>
						<div @click="editLine(item.id)"><img :src="editIcon" alt=""></div>
						<div @click="deleteLine(item.id, index)"><img :src="deleteIcon" alt=""></div>
						<div class="mineIcon" v-if="vhl_lineType == 4" @click="applyCheck(item.id, item.status, index)"><img :src="item.status == 4?uploadIcon: item.status == 2?checking: item.status == 3? passIcon: ''" alt=""></div>
						<div v-if="false" @click="toStartAct(item.id)"><img :src="startAct" alt=""></div>
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
	import listBlank from '../common/list_blank.vue'
	import { mapGetters , mapActions } from 'vuex'
	import config from '@/config'
	
	export default {
		data() {
			return {
				deleteIcon: require('../../assets/img/delete_act.png'),
				editIcon: require('../../assets/img/edit_act.png'),
				noCollect: require('../../assets/img/no_collect.png'),
				hadCollect: require('../../assets/img/had_collect.png'),
				uploadIcon: require('../../assets/img/uploadOffical.png'),
				checking: require('../../assets/img/chenking.png'),
				passIcon: require('../../assets/img/pass.png'),
				startAct: require('../../assets/img/startAct.png'),
				currentPage: 1,
				index: 1,
				size: 10,
				total: 0,
				dataList: [],
				cityName: '',
				keyword: '',
				isFirstLoad: true,
				isShowBlank: false,
				boxLoading: false ,//内容加载
			}
		},
		props: {
			cityVal: {
				type: String,
				default: ''
			}
		},
		computed:{
			...mapGetters([
				'c_backTopVal',
				'c_isListUpdate',
				'c_routeSave',
				'c_searchText',
				'vhl_lineType',
				'c_userInfo'
				])
		},
		components: {listBlank},
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
			vhl_lineType(val) {
				this.index = 1
				this.isFirstLoad = true
				this.currentPage = 1
				this.getDataList()
				this.c_toTop(0)
				setTimeout(() => {
					this.c_toTop(-1)
				},100)
			},
			cityVal(val) {
				this.index = 1
				this.isFirstLoad = true
				if(val != '选择区域') {
					this.cityName = val
				}else {
					this.cityName = ''
				}
				this.currentPage = 1
				this.getDataList()
				this.c_toTop(0)
				setTimeout(() => {
					this.c_toTop(-1)
				},100)
			},
			c_searchText(val) {
				if(this.c_routeSave == '/hotLine') {
					this.index = 1
				    this.currentPage = 1
				    this.isFirstLoad = true
				    this.keyword = val
				    this.getDataList()
				    this.c_toTop(0)
					setTimeout(() => {
						this.c_toTop(-1)
					},100)
				}
			}
		},
		activated(){
			if(this.c_isListUpdate && this.c_routeSave == '/vHotLine') {//当状态为true列表更新
				this.index = 1
				this.isFirstLoad = true
				this.currentPage = 1
				this.vhl_changeTypeVal(2)
				this.getDataList()
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
				'hld_showEdit',
				'c_toTop',
				'vhl_showDraft',
				'vhl_changeTypeVal',
				'wa_showActBox'
				]),
			handleSizeChange(val) {
		       console.log(`每页 ${val} 条`);
		    },
		    handleCurrentChange(val) {
		       	this.index = val
		    	this.currentPage = val
		       	this.getDataList()
		       	this.c_toTop(0)
				setTimeout(() => {
					this.c_toTop(-1)
				},100)
		    },
		    jumpTopDetail(id, isSelf) {
		        this.c_loadingShow()
		        setTimeout(() => {
		        	if(isSelf == 1) {
		        		this.hld_showEdit({id: id, isShow: true})
		        	}else {
		        		this.hld_showEdit({id: '', isShow: false})
		        	}
		        	this.$router.push({
						path: '/hotLineDetail',
						query:{
				          id: id
				        }
					})
		        }, 600);
		    },
		    applyCheck(id, status, index) {
		    	if(status == 4) {
		    		this.$confirm(`确认提交线路 ${this.dataList[index].title} 到官方`, '', {
			          confirmButtonText: '确定',
			          cancelButtonText: '取消',
			        }).then(() => {

			        	this.applyCheckMehods(id, index)

			        }).catch(() => {
			          this.$message({
			            type: 'info',
			            message: '已取消',
			            center: true
			          });          
			        });
		    	}
		    },
		    applyCheckMehods(id, index) {
		    	const $this = this
		    	this.$api.ajax({
		    		url: `${config.userApplyCheck}/${id}`,
		    		headers: {
						'Content-Type':'application/x-www-form-urlencoded',
						'API-User-Token': $this.c_userInfo.token
					},
					success: (res) => {
						if(res.code == 0) {
							this.$message({
						        type: 'success',
						        message: '提交成功',
						        center: true
						    });
							this.dataList.map((v, i) => {
								if(index == i) {
									v.status = 2
								}
							})
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
					        message: '提交失败',
					        center: true
					    });
					}
		    	})
		    },
		    editLine(id) {
		    	this.c_loadingShow()
		        setTimeout(() => {
		        	this.$router.push({
						path: '/writeLine',
						query:{
				          id: id
				        }
					})
		        }, 600);
		    },
		    deleteLine(id, index) {
		    	this.$confirm(`确认删除线路 ${this.dataList[index].title}`, '', {
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
		    	this.$api.ajax({
		    		url: `${config.userDeleteLine}/${id}`,
		    		method: "DELETE",
		    		headers: {
						'Content-Type':'application/x-www-form-urlencoded',
						'API-User-Token': $this.c_userInfo.token
					},
					success: (res) => {
						if(res.code == 0) {
							this.$message({
						        type: 'success',
						        message: '线路删除成功',
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
		    colloctLine(id, isColloct, index) {
		    	let txt = ''
		    	if(isColloct === 0) {
		    		txt = `确认收藏线路 ${this.dataList[index].title}`
		    	}else {
		    		txt = `确认取消收藏线路 ${this.dataList[index].title}`
		    	}
		    	this.$confirm(txt, '', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		        }).then(() => {
		        	let type = ''
		        	if(isColloct === 0){
		        		type = 1
		        	}else {
		        		type = 2
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
		    		url: config.userCollectLine,
		    		headers: {
						'Content-Type':'application/x-www-form-urlencoded',
						'API-User-Token': $this.c_userInfo.token
					},
					params: {
						routeId: id,
						type: type
					},
					success: (res) => {
						if(res.code == 0) {
							let txt = '线路收藏成功'
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
					        message: '收藏线路失败',
					        center: true
					    });
					}
		    	})
		    },
		    toStartAct(id) {//发起活动
				this.wa_showActBox({isShow: true, id: id})
		    },
		    getDataList() {
		    	const $this = this
		    	this.boxLoading = true
		    	this.$api.ajax({
		    		url: config.userLineList,
		    		method: "POST",
		    		headers: {
						'Content-Type':'application/x-www-form-urlencoded',
						'API-User-Token': $this.c_userInfo.token
					},
					params: {
						pn: $this.index,
						ps: $this.size,
						keyword: $this.keyword,
						type: $this.vhl_lineType,
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
					error: (err) => {
						console.log(err)
						this.$message({
					        type: 'error',
					        message: '数据请求失败',
					        center: true
					    });
					}
		    	})
			},
		},
		created() {
			this.getDataList()
		},
		mounted() {

		}
	}
</script>

<style scoped>
	.lineTable {
		margin-top: 40px;
		width: 100%;
		height: 100%;
		overflow: hidden;
		flex: 1;
		display: flex;
		flex-direction: column;
		position: relative;
	}
	.lineTableTop {
		display: flex;
		justify-content: space-between;
		font-size: 14px;
		color: #373A3E;
		font-weight: 600;
		border-bottom: 1px solid #EAEBED;
		margin-bottom: 15px;
		padding: 0 15px 15px 15px;
	}
	.lineTableTop>span {
		display: block;
	}
	.lineTableTop>span:first-child {
		width: 647px;
	}
	.lineTableTop>span:nth-child(3) {
		width: 53px;
	}
	.listContentBox {
		width: 100%;
	    height: 100%;
	    overflow: hidden;
	    position: relative;
	    background-color: #fff;
	}

	.lineTableBox {
		flex: 1;
		overflow-y: auto;
		background-color: #fff;
	}
	.itemTr {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 15px;
		background-color: #fff;
		transition: all 0.2s;
	}
	.itemTr:hover {
		background: #FFF2DD;
	}
	.itemTr:not(:last-child) {
		border-bottom: 1px solid #E6E6E6;
	}
	.lineIntro {
		display: flex;
		height: 150px;
	}
	.lineIntro:hover {
		cursor: pointer;
	}
	.lineIntroImg {
		width: 220px;
		height: 100%;
		border-radius: 8px;
		margin-right: 15px;
	}
	.lineIntroText {
		height: 100%;
		width: 412px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	.lineIntroText>h3 {
		font-size: 18px;
		color: #373A3E;
	}
	.lineIntroText>p {
		font-size: 14px;
		color: #373A3E;
		line-height: 18px;
		width: 412px;
		word-wrap:break-word;
	}
	.lineIntroInfo {
		font-size: 12px;
		color: #373A3E;
		display: flex;
	}
	.lineIntroInfo>div {
		display: flex;
		align-items: center;
		margin-right: 10px;
	}
	.lineIntroInfo>div>img{
		width: 14px;
		height: 14px;
		border-radius: 50%;
		margin-right: 5px;
	}
	.lineIntroInfo>span {
		display: block;
		margin-right: 10px;
	}
	.lineType {
		font-size: 15px;
		color: #FFB132;
	}
	.pensonalType {
		font-size: 15px;
		color: #9FA6AD;
	}
	.lineOperation {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
	}
	.lineOperation:hover {
		cursor: pointer;
	}
	.lineOperation>div {
		width: auto;
		height: 22px;
	}
	.lineOperation>div:not(:last-child) {
		margin-bottom: 10px;
	}
	.lineOperation .mineIcon {
		width: auto;
		height: auto;
	}
</style>