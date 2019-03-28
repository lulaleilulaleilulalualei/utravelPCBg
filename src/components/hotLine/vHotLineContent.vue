<template>
	<div class="lineTable">
		<div class="lineTableTop">
			<span>线路标题</span>
			<span>推荐自驾团</span>
			<span>类型</span>
			<span>操作</span>
		</div>
		<div class="listContentBox" v-loading="boxLoading">
		<happy-scroll color="rgba(255,177,50,1)" size="4" hide-horizontal resize :scroll-top="c_backTopVal" v-if="!isShowBlank">
			<div class="lineTableBox" >
				<div :class="[{itemRcmSelected: vhl_isShowBox.isShow && vhl_isShowBox.rcmIndex == index}, 'itemTr']" v-for="(item, index) in dataList" :key="item.id">
					<div class="lineIntro" @click="jumpTopDetail(item.id, item.selfFlag)">
						<div class="lineIntroImg"><img :src="`${item.coverImg}?x-oss-process=style/thumb`" alt=""></div>
						<div class="lineIntroText">
							<h3>{{item.title}}</h3>
							<div class="lineIntroInfo">
								<span>发布时间：{{item.updatedTime}}</span>
								<span>编号：{{item.id}}</span>
							</div>
						</div>
					</div>
					<clubRcm :index="index" :clubObj="item"></clubRcm>
					<div :class="item.type == 1? 'lineType': 'pensonalType'">{{item.type == 1? '官方': '个人'}}</div>
					<div class="lineOperation">
						<div @click="deleteLine(item.id, index)"><img :src="deleteIcon" alt=""></div>
						<div @click="editLine(item.id)" v-if="item.selfFlag == 1? true: item.type == 1? true:false"><img :src="editIcon" alt=""></div>
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

		<transition name="slideFade">
			<hadRcm v-if="vhl_isShowBox.isShow"></hadRcm>
		</transition>
	</div>
</template>

<script>
	import clubRcm from './clubRcm.vue'
	import hadRcm from './hadRcm.vue'
	import listBlank from '../common/list_blank.vue'
	import { mapGetters , mapActions } from 'vuex';
	import config from '@/config'

	export default {
		data() {
			return {
				currentPage: 1,
				deleteIcon: require('../../assets/img/delete_act.png'),
				editIcon: require('../../assets/img/edit_act.png'),
				startAct: require('../../assets/img/startAct.png'),
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
		components: {clubRcm, hadRcm, listBlank},
		props: {
			cityVal: {
				type: String,
				default: ''
			}
		},
		computed: {
			...mapGetters([
				'vhl_isShowBox',
				'c_backTopVal',
				'c_userInfo',
				'vhl_lineType',
				'c_cityObj',
				'c_isListUpdate',
				'c_searchText',
				'c_routeSave',
				'c_updateStatus',
				])
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
				if(this.c_routeSave == '/vHotLine') {
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
			},
			c_updateStatus(val) {
				if(val.type == 2 && this.c_routeSave == '/vHotLine') {//当状态为true列表更新
					this.index = 1
					this.isFirstLoad = true
					this.currentPage = 1
					this.vhl_changeTypeVal(2)
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
				'vhl_showBox',
				'c_loadingShow',
				'vhl_showDraft',
				'c_saveCityType',
				'c_toTop',
				'hld_showEdit',
				'c_listUpdate',
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
		    		url: `${config.managerDeleteLine}/${id}`,
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
		    toStartAct(id) {//发起活动
		    	this.wa_showActBox({isShow: true, id: id})
		    },
		    getDataList() {
		    	const $this = this
		    	this.boxLoading = true
		    	this.$api.ajax({
		    		url: config.managerLineList,
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
					error: () => {
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
		width: 385px;
	}
	.lineTableTop>span:nth-child(2) {
		width: 212px;
	}
	.lineTableTop>span:nth-child(4) {
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
	.itemRcmSelected {
		background: #FFF2DD;
	}
	.lineIntro {
		display: flex;
		height: 100px;
	}
	.lineIntro:hover {
		cursor: pointer;
	}
	.lineIntroImg {
		width: 100px;
		height: 100%;
		border-radius: 8px;
		margin-right: 15px;
	}
	.lineIntroText {
		height: 100%;
		width: 275px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	.lineIntroText>h3 {
		font-size: 15px;
		color: #373A3E;
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
		display: 
	}
	.lineOperation>div img {
		width: auto;
		height: 100%;
	}
	.lineOperation>div:not(:last-child) {
		margin-bottom: 10px;
	}
	.slideFade-enter-active, .slideFade-leave-active {
	  transition: all .3s ease;
	  opacity: 1;
	}
	.slideFade-enter, .slideFade-leave-to {
		transform: translateX(180px);
	  	opacity: 0;
	}
</style>