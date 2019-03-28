<template>
	<div class="activityListBox">
		<cutType v-if="c_userVal == 'admin'" @actType="actType"> </cutType>
		<div class="activityTable">
			<div class="tableTop">
				<span>活动标题</span>
				<span>发起者</span>
				<span>出发时间</span>
				<span>状态</span>
				<span v-if="c_userVal == 'admin'">操作</span>
			</div>
			<div class="listContentBox"
					v-loading="boxLoading">
			<happy-scroll color="rgba(255,177,50,1)" size="4" hide-horizontal resize :scroll-top="c_backTopVal" v-if="!isShowBlank">
				<div class="tableBox" ref="tableBox">
					<div class="itemTr" v-for="(item, index) in dataList" :key="index">
						<div class="actIntro" @click="jumpToDetail(item.id)">
							<div class="actIntroImg"><img :src="`${item.coverImg}?x-oss-process=style/thumb`" alt=""></div>
							<div class="actIntroText">
								<h3 :title="item.title">{{item.title}}</h3>
								<p>发布时间：{{item.createdTime | formatTime}} &nbsp; 编号：{{item.id}}</p>
							</div>
						</div>
						<div class="actAuthor">
							<span :title="item.nickName">{{item.nickName}}</span>
							<span>{{item.tel}}</span>
						</div>
						<div class="actStartTime">{{item.beginTime}}</div>
						<div :class="item.status == 1? 'actStatus': item.status == 2? 'actingStatus': 'actedStatus'">{{item.status | formatAct}}</div>
						<div v-if="c_userVal == 'admin'" class="actOperation" @click="operatNotice(index,item.title,item.id)"><img :src="deleteIcon" alt=""></div>
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
	</div>
</template>

<script>
	import cutType from '../common/cutType.vue'
	import listBlank from '../common/list_blank.vue'
	import { mapGetters , mapActions } from 'vuex'; 
	import config from '@/config'

	export default {
		data() {
			return {
				currentPage: 1,
				dismissIcon: require('../../assets/img/dissolve_act.png'),
				deleteIcon: require('../../assets/img/delete_act.png'),
				index: 1,//默认下标
				size: 10,//默认翻页数
				keyword: '',//关键词
				total: 0,
				isShowBlank: false, //没有数据显示
				dataList: [] ,//数据数组
				boxLoading: false ,//内容加载
				isFirstLoad: true,
				actvityType: '',//活动类型
			}
		},
		components: {cutType, listBlank},
		computed:{
			...mapGetters([
				'c_backTopVal',
				'c_loadingVal', 
				'c_userVal',
				'c_userInfo',
				'c_searchText',
				'c_routeSave'
				])
		},
		watch: {
			c_searchText(val) {
				if(this.c_routeSave == '/activityList') {
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
		filters:{
		    formatAct:function(status){
		      if(status == 1) {
		      	return '招募中'
		      }else if(status == 2) {
		      	return '进行中'
		      }else if(status == 3) {
		      	return '已结束'
		      }
		    },
		    formatTime:function(time){
		    	if(time) {
		    		return time.split(' ')[0]
		    	}else {
		    		return ''
		    	}
		    }
		},
		methods: {
			...mapActions([
				'c_loadingShow',
				'c_toTop',
				'c_saveCityType'
				]),
			actType(val) {
				if(val == 0) {
					this.actvityType = ''
				}else {
					this.actvityType = val
				}
				this.index = 1
		    	this.currentPage = 1
		    	this.isFirstLoad = true
		       	this.getDataList()
		       	this.c_toTop(0)
				setTimeout(() => {
					this.c_toTop(-1)
				},100)
			},
			operatNotice(index, title, id) {
				const $this = this
				if(this.c_userVal == 'admin') {
					this.$confirm(`确认删除活动 ${title}`, '', {
			          confirmButtonText: '确定',
			          cancelButtonText: '取消',
			        }).then(() => {
			          this.$api.ajax({
			          	url: config.deleteAct,
			          	method: "DELETE",
			          	headers: {
							'Content-Type':'application/x-www-form-urlencoded',
							'API-User-Token': $this.c_userInfo.token
						},
						params: {id: id},
						success: (res) => {
							if(res.code == 0) {
								this.dataList.splice(index, 1)
								this.$message({
						            type: 'success',
						            message: '删除成功!',
						            center: true
						        });
						        if(this.dataList.length == 0) {
									this.isShowBlank = true
								}
							}
						},
						error: (err) => {
							this.$message({
					            type: 'error',
					            message: '删除失败',
					            center: true
					        });
						}
			          })
			        }).catch((err) => {
			          this.$message({
			            type: 'info',
			            message: '已取消删除',
			            center: true
			          });          
			        });
				}	
			},
			handleSizeChange(val) {
		       // console.log(`每页 ${val} 条`);
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
		    jumpToDetail(id) {
		    	this.c_loadingShow()
		        setTimeout(() => {
		        	this.$router.push({
						path: '/activityDetail',
						query:{
				          id: id
				        }
					})
		        }, 800);
		    },
		    getDataList() {
		    	const $this = this
		    	this.boxLoading = true
		    	this.$api.ajax({
		    		url: $this.c_userVal == 'admin'? config.getManagerActList: config.userActList,
		    		method: "POST",
		    		headers: {
						'Content-Type':'application/x-www-form-urlencoded',
						'API-User-Token': $this.c_userInfo.token
					},
					params: {
						pc: $this.index,
						ps: $this.size,
						type: $this.actvityType,
						keyword: $this.keyword
					},
					success: (res) => {
						if(res.code == 0) {
							this.total = res.total
							if(res.data.length != 0) {
								setTimeout(() => {
									this.boxLoading  = false
								}, 200)
								this.isShowBlank = false
								this.dataList = res.data
								this.isFirstLoad = false
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
		activated(){
			if(this.c_loadingVal) {
				this.c_loadingVal.close()
			}
		},
		created() {
			this.getDataList()
		},
		mounted() {
			if(this.c_loadingVal) {
				this.c_loadingVal.close()
			}
		}
	}
</script>

<style scoped>
	.activityListBox {
		padding-top: 20px;
		height: 100%;
		display: flex;
		flex-direction: column;
	}
	.activityTable {
		width: 100%;
		height: 100%;
		overflow: hidden;
		flex: 1;
		display: flex;
		flex-direction: column;
	}
	.tableTop {
		width: 100%;
		font-size: 14px;
		font-weight: 600;
		color: #373A3E;
		display: flex;
		justify-content: space-between;
		border-bottom: 2px solid #EAEBED;
		padding: 15px;
		margin-bottom: 15px;
	}
	.tableTop>span {
		display: block;
		text-align: left;
	}
	.tableTop>span:first-child {
		width: 352px;
	}
	.tableTop>span:nth-child(2) {
		width: 100px;
	}
	.tableTop>span:nth-child(3) {
		width: 77px;
	}
	.tableTop>span:nth-child(4) {
		width: 45px;
	}
	.tableTop>span:nth-child(5) {
		width: 53px;
	}
	.listContentBox {
		width: 100%;
	    height: 100%;
	    overflow: hidden;
	    position: relative;
	    background-color: #fff;
	}
	.tableBox{
		flex: 1;
		background-color: #fff;
		overflow-y: auto;
	}
	.itemTr {
		padding: 15px;
		border-bottom: 1px solid #E6E6E6;
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: #fff;
		transition: all 0.2s;
	}
	.itemTr:hover {
		background: #FFF2DD;
	}
	.actIntro {
		display: flex;
	}
	.actIntro:hover {
		cursor: pointer;
	}
	.actIntroImg {
		width: 100px;
		height: 100px;
		border-radius: 12px;
		margin-right: 10px;
	}
	.actIntroText {
		width: 242px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	.actIntroText>h3 {
		font-size: 15px;
		color: #373A3E;
	}
	.actIntroText>p {
		font-size: 12px;
		color: #373A3E;
	}
	.actAuthor {
		display: flex;
		flex-direction: column;
		font-size: 15px;
		color: #373A3E;
		width: 100px;
		height: auto;
	}
	.actAuthor>span {
		display: block;
		width: 100%;
		overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
	}
	.actAuthor>span:first-child {
		margin-bottom: 10px;
	}
	.actStartTime {
		font-size: 15px;
		color: #373A3E;
	}
	.actStatus {
		font-size: 15px;
		color: #FFB132;
	}
	.actingStatus {
		font-size: 15px;
		color: #ff3830;
	}
	.actedStatus {
		font-size: 15px;
		color: #9FA6AD;
	}
	.actOperation {
		width: 53px;
		height: 22px;
	}
	.actOperation:hover {
		cursor: pointer;
	}
</style>