<template>
	<div class="videoList">
		<div class="videoListTop">
			<span>景点列表</span>
		</div>
		<div class="listContentBox" v-loading="boxLoading">
		<happy-scroll color="rgba(255,177,50,1)" size="4" resize :scroll-top="c_backTopVal" v-if="!isShowBlank">
			<div class="videoListBox">
				<div class="itemVideo" v-for="(item, index) in dataList" :key="item.id">
					<div class="videoCoverImg" @click="playVideo(item.files[0].fileUrl)">
						<img :src="item.files[0].fileUrl | getCoverImg" alt="">
						<b></b>
					</div>
					<div class="videoInfo">
						<h3>{{item.title}}</h3>
						<div class="infoContent">
							<span>发布时间：{{item.updatedTime | formatTime}}</span>
							<span>作者：{{item.nickname}} </span>
							<span>编号：{{item.id}}</span>
						</div>
						<div class="operationBtn">
							<div @click="deleteVideo(item.id, index)">
								<img src="../../assets/img/reject_small.png" alt="">
							</div>
							<div @click.stop="passBtn(item.id, index)">
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
			<videoPlayBox v-if="wc_isShowVideo"
						:videoUrl="videoUrl"></videoPlayBox>
		</transition>
	</div>
</template>

<script>
	import { mapGetters , mapActions } from 'vuex';
	import videoPlayBox from './videoPlayBox.vue'
	import listBlank from '../common/list_blank.vue'
	import config from '@/config'
	
	export default {
		data() {
			return {
				currentPage: 1,
				index: 1,
				size: 12,
				total: 0,
				dataList: [],
				keyword: '',
				isFirstLoad: true,
				isShowBlank: false,
				boxLoading: false,
				videoUrl: '',//视频地址
				rejectInd: '', //驳回索引
			}
		},
		props: {
			signNum: {
				type: Number,
				default: 0
			}
		},
		computed: {
			...mapGetters([
				'wc_isShowVideo',
				'c_backTopVal',
				'c_loadingVal',
				'c_userInfo',
				'wc_isShowRejectBox',
				'c_searchText',
				'c_routeSave'
				])
		},
		watch: {
			wc_isShowRejectBox(val) {
				if(val.type == 99) {
					this.dataList.splice(this.rejectInd, 1)
				}
			},
			c_searchText(val) {
				if(this.c_routeSave == '/waitCheck') {
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
		    getCoverImg:function(data){
		    	return JSON.parse(data).thumbUrl
		    },
		    formatTime:function(time){
		    	if(time) {
		    		return time.split(' ')[0]
		    	}else {
		    		return ''
		    	}
		    }
		},
		components: {videoPlayBox, listBlank},
		methods: {
			...mapActions([
				'wc_showVideo',
				'wc_showRejectBox',
				'c_toTop'
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
		    deleteVideo(id, index) {//驳回
		    	this.wc_showRejectBox({isShow: true, type: 3, id: id})
		    	this.rejectInd = index
		    },
		    passBtn(id, index) {//通过
		    	this.$confirm(`确认通过视频 ${this.dataList[index].title}`, '', {
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
		    		url: `${config.noteOrVideoPass}/${id}`,
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
		    playVideo(videoObj) {//播放
		    	this.videoUrl = JSON.parse(videoObj).videoUrl
		    	this.wc_showVideo(true)
		    },
		    getDataList() {
		    	const $this = this
		    	this.boxLoading = true
		    	this.$api.ajax({
		    		url: config.checkVideo,
		    		method: "POST",
		    		headers: {
						'Content-Type':'application/x-www-form-urlencoded',
						'API-User-Token': $this.c_userInfo.token
					},
					params: {
						pn: $this.index,
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
			this.getDataList()
		},
		mounted() {

		}
	}
</script>

<style scoped>
	.videoList {
		margin-top: 40px;
		width: 100%;
		height: auto;
		overflow: hidden;
		flex: 1;
		display: flex;
		flex-direction: column;
		position: relative;
	}
	.videoListTop {
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
	.videoListBox {
		flex: 1;
		overflow-y: auto;
		background-color: #fff;
		display: flex;
		flex-wrap: wrap;
	}
	.itemVideo {
		width: 274px;
		height: 240px;
		padding: 15px 10px;
		display: flex;
		border-bottom: 1px solid  #E6E6E6;
	}
	.videoCoverImg {
		position: relative;
		height: 210px;
		width: 120px;
		margin-right: 10px;
		border-radius: 10%;
	}
	.videoCoverImg:hover {
		cursor: pointer;
	}
	.videoCoverImg>b {
		display: block;
		width: 40px;
		height: 40px;
		background: url('../../assets/img/videoPlay.png') no-repeat center;
		background-size: 100%;
		position: absolute;
		top: 50%;
		left: 50%;
		margin-top: -20px;
		margin-left: -20px;
	}
	.videoInfo {
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
	}
	.videoInfo>h3 {
		font-size: 18px;
		color: #373A3E;
		width: 130px;
		overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        margin-bottom: 10px;
	}
	.infoContent {
		display: flex;
		flex-direction: column;
		font-size: 12px;
		color: #373A3E;
		margin-bottom: 10px;
	}
	.infoContent>span {
		display: block;
		width: 130px;
		overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
	}
	.operationBtn {
		display: flex;
	}
	.operationBtn>div {
		width: 53px;
		height: 22px;
	}
	.operationBtn>div:hover {
		cursor: pointer;
	}
	.operationBtn>div:first-child {
		margin-right: 10px;
	}
	.fade-enter-active, .fade-leave-active {
	  transition: opacity .5s;
	}
	.fade-enter, .fade-leave-to {
	  opacity: 0;
	}
</style>