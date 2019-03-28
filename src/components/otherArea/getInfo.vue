<template>
	<div class="getInfo">
		<div class="infoTop">
			<div><img src="../../assets/img/system-message.png" alt=""></div>
			<span>{{infoTitle}}</span>
		</div>
		<div class="infoBox" v-loading="boxLoading">
			<happy-scroll color="rgba(255,177,50,1)" size="4" resize :scroll-top="c_backTopVal" v-if="!isShowBlank">
			<div class="scrollBox">
				<div class="itemInfo" v-for="(item, index) in dataList" :key="item.id">
					<div class="userHead">
						<div><img :src="item.avatar" alt=""></div>
						<!-- <div><img src="../../assets/img/user_test_1.png" alt=""></div> -->
						<b v-if="item.status === 0"></b>
					</div>
					<div class="applyInfo">
						<div class="itemHeadInfo">
							<h4>{{item.nickName}}</h4>
							<!-- <h4>大美女</h4> -->
							<span>{{item.createdTime | formatTime}}</span>
							<!-- <span>2018-10-10</span> -->
						</div>
						<p class="itemInfoTxt">{{item.msg}}</p>
						<!-- <p class="itemInfoTxt">就是无聊，想找人聊天</p> -->
						<a class="replyInfo" v-if="c_userVal == 'admin'" @click="replayInfo(item, index)">回复消息>>> </a>
						<!-- <a class="replyInfo" v-if="c_userVal == 'admin'" @click="replayInfo">回复消息>>> </a> -->
					</div>
<!-- 					<div class="itemDelete" @click="deleteItem(item.id, index)"></div> -->
				</div>
			</div>
			</happy-scroll>
			<noInfo v-if="isShowBlank"></noInfo>
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
			<infoReply v-if="c_isShowReplyBox.isShow"></infoReply>
		</transition>
	</div>
</template>

<script>
	import infoReply from './infoReply.vue'
	import noInfo from '../common/noInfo.vue'
	import { mapGetters , mapActions } from 'vuex'; 
	import config from '@/config'
	
	export default {
		data() {
			return {
				infoTitle: '系统消息',
				currentPage: 1,
				index: 1,
				size: 10,
				keyword: '',
				total: 0,
				isFirstLoad: true,
				isShowBlank: false,
				boxLoading: false,
				dataList: [],
				changeNum: 0, //消息数量变动
			}
		},
		components: {infoReply, noInfo},
		computed: {
			...mapGetters([
				'c_isShowReplyBox',
				'c_userVal',
				'c_backTopVal',
				'c_loadingVal',
				'c_userInfo',
				'c_searchText',
				'c_routeSave'
				])
		},
		watch: {
			c_searchText(val) {
				if(this.c_routeSave == '/infoList') {
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
		filters:{
		    formatTime:function(time){
		    	if(time) {
		    		return time.split(' ')[0]
		    	}else {
		    		return ''
		    	}
		    }
		},
		beforeRouteLeave(to, from, next) {
			if(!this.isShowBlank) {
				this.changeHadRead('')
				this.c_changeInfoNum(9999)
			}
			next()
		},
		methods: {
			...mapActions([
				'c_showReplyBox',
				'c_toTop',
				'c_changeInfoNum'
				]),
			replayInfo(data, index) {
				if(this.c_userVal == 'admin') {
					this.c_showReplyBox({data: data, isShow: true})
					this.dataList.map((v, i) => {
						if(index == i) {
							v.status = 1 //修改为已读
							this.changeHadRead(data.id)
							this.changeNum++
							this.c_changeInfoNum(this.changeNum)
						}
					})
				}
			},
			changeHadRead(id) {
				const $this = this
		    	this.$api.ajax({
		    		url: this.c_userVal == 'admin'? config.changeInfoType: config.userInfoChangeRead,
		    		method: 'PUT',
		    		headers: {
						'Content-Type':'application/x-www-form-urlencoded',
						'API-User-Token': $this.c_userInfo.token
					},
					params: {id: id},
					success: (res) => {
						if(res.code == 0) {
							
						}else {
							this.$message({
						        type: 'error',
						        message: res.message,
						        center: true
						    });
						}
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
			getListData() { //列表
				const $this = this
		    	this.boxLoading = true
		    	this.$api.ajax({
		    		url: this.c_userVal == 'admin'? config.infoList: config.userInfoList,
		    		method: "POST",
		    		headers: {
						'Content-Type':'application/x-www-form-urlencoded',
						'API-User-Token': $this.c_userInfo.token
					},
					params: {
						pc: $this.index,
						ps: $this.size,
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
			if(this.c_userVal == 'admin') {
				this.infoTitle = '反馈消息'
			}else if(this.c_userVal == 'user') {
				this.infoTitle = '系统消息'
			}
			this.getListData()
		},
		mounted() {
			if(this.c_loadingVal) {
				this.c_loadingVal.close()
			}
		}
	}
</script>

<style scoped>
	.getInfo {
		height: 100%;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}
	.infoTop {
		margin: 20px 0 40px 0;
		display: flex;
		align-items: center;
		height: auto;
		width: 100%;
	}
	.infoTop>div {
		width: 62px;
		height: 62px;
		margin-right: 25px;
	}
	.infoTop>span {
		display: block;
		font-size: 18px;
		color: #373A3E;
		font-weight: 600;
	}
	.infoBox {
		flex: 1;
		width: 100%;
		background-color: #fff;
		padding: 30px;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}
	.scrollBox {
		height: 100%;
		width: 100%;
		overflow-y: auto;
		position: relative;
	}
	.itemInfo {
		padding-right: 30px;
		position: relative;
		display: flex;
		height: auto;
		width: 100%;
	}
	.itemInfo:not(:last-child) {
		margin-bottom: 20px;
	}
	.userHead {
		position: relative;
		margin-right: 15px;
	}
	.userHead>div {
		width: 48px;
		height: 48px;
		border-radius: 50%;
		overflow: hidden;
	}
	.userHead>b {
		position: absolute;
		top: 1px;
		right: 1px;
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background-color: red;
	}
	.applyInfo {
		flex: 1;
	}
	.itemHeadInfo {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		margin-bottom: 10px;
	}
	.itemHeadInfo>h4 {
		font-size: 14px;
		color: #373A3E;
		font-weight: normal;
	}
	.itemHeadInfo>span {
		font-size: 14px;
		color: #373A3E;
	}
	.itemInfoTxt {
		font-size: 14px;
		color: #9FA6AD;
		line-height: 28px;
		margin-bottom: 10px;
	}
	.replyInfo {
		font-size: 14px;
		color: #FFB132;
	}
	.replyInfo:hover {
		cursor: pointer;
	}
	.itemDelete {
		position: absolute;
		top: 5px;
		right: 5px;
		width: 10px;
		height: 10px;
		background: url('../../assets/img/item_delete.png') no-repeat center;
		background-size: 100%;
	}
	.itemDelete:hover {
		cursor: pointer;
	}
	.fade-enter-active, .fade-leave-active {
	  transition: opacity .5s;
	}
	.fade-enter, .fade-leave-to {
	  opacity: 0;
	}
</style>