<template>
	<div class="upLoadSpotImg">
		<div class="spotTopCut">
			<div class="spotCutRight">
				<div class="selectArea cityIcon" @click="selectArea">
					<span class="cityIcon">{{cityName}}</span>
					<b class="cityIcon"></b>
				</div>
			</div>
			<transition name="slideFade">
				<cityList v-if="c_cityObj.isShow"
						@getCityName="getCityName"></cityList>
			</transition>
		</div>
		<div class="showTagsType">
			<span :class="{activeTag: item.isShow}" v-for="(item,index) in typeTags" :key="item.tagId" @click="selectSpotTag(index, item.tagId)">{{item.tagName}}</span>
		</div>
		<div class="spotList">
			<div class="spotListTop">
				<span>景点列表</span>
			</div>
			<div class="showSpotList" v-loading="boxLoading">
				<happy-scroll color="rgba(255,177,50,1)" size="4" hide-horizontal resize :scroll-top="c_backTopVal" v-if="!isShowBlank">
					<div class="spotListBox">
						<div class="itemSpot" v-for="(item, index) in dataList">
							<div class="spotImg">
								<img :src="item.thumb" alt="">
							</div>
							<div class="spotInfo">
								<h4>{{item.title}}</h4>
								<div class="showIsCollect">
									<!-- <span>{{item.isCollect == 0? '未采集': '已采集'}}</span> -->
									<span>照片数: {{item.photoNum}}</span>
								</div>
								<div class="spotInfoBtn">
									<div @click.stop="lookPhoto(item.pId, index)" title="查看相册">
										<span>查看相册</span>
									</div>
									<div @click.stop="toCollect(item.pId, index)" title="采集照片">
										<span>采集照片</span>
									</div>
								</div>
							</div>
							<div :class="['showColloctIcon', {hadColloct: item.isCollect == 1}]" :title="item.isCollect == 0? '未采集':'已采集'">
								<i class="el-icon-upload"></i>
							</div>
						</div>
					</div>
				</happy-scroll>
				<listBlank v-if="isShowBlank"></listBlank>
				<!-- <div class="toNextPage" v-if="isShowNextBtn" @click="toNextPage">
					<span>下</span>
					<span>一</span>
					<span>页</span>
					<span>∨</span>
				</div> -->
			</div>
			<div class="toNextPage">
				<span>总页数为{{totalPage}}页，当前加载到第{{index}}页</span>
				<div @click="toNextPage">下一页</div>
			</div>
		</div>
		<transition name="fade">
			<lookPhoto v-if="isShowPhoto"
					   :photoId="photoId"
					   @closePhoto="closePhoto"></lookPhoto>
		</transition>
	</div>
</template>

<script>
	import listBlank from '../common/list_blank.vue'
	import cityList from '../common/cityList.vue'
	import lookPhoto from './lookPhoto.vue'
	import { mapGetters , mapActions } from 'vuex';
	import config from '@/config'
	
	export default {
		data() {
			return {
				cityName: '选择区域',
				dataList: [],
				isFirstLoad: true,
				isShowBlank: false,
				boxLoading: false,
				index: 1,
				mId: null,
				isShowPhoto: false, //是否显示相册
				photoId: {},
				isShowNextBtn: false,
				typeTags: [], //城市类型
				tagNum: 0,
				totalPage: 0
			}
		},
		components: {cityList, listBlank, lookPhoto},
		computed: {
			...mapGetters([
				'c_loadingVal',
				'c_backTopVal',
				'c_cityObj'
				])
		},
		methods: {
			...mapActions([
				'c_loadingShow',
				'c_saveCityType'
				]),
			getCityName(val) {
				this.cityName = val.name
				this.mId = val.mId
				let tags = val.tags
				tags.map((v, i) => {
					if(v.tagId == '0') {
						v.isShow = true
					}else {
						v.isShow = false
					}
				})
				this.typeTags = tags
				this.index = 1
				this.dataList = []
				this.getListData()
				this.isShowNextBtn = true
			},
			selectArea() {
				if(this.c_cityObj.isShow) {
					this.c_saveCityType({isShow: false})
				}else {
					this.c_saveCityType({isShow: true})
				}
			},
			getListData() {
				const $this = this
		    	this.boxLoading = true
		    	this.$api.ajax({
		    		url: `http://${config.collectApi}/api/select/point/${$this.mId}`,
		    		headers: {
						'Content-Type':'application/x-www-form-urlencoded',
						// 'API-User-Token': $this.c_userInfo.token
					},
					params: {
						page: $this.index,
						tag: $this.tagNum
					},
					success: (res) => {
						if(res.code == 0) {
							if(res.data.length != 0) {
								setTimeout(() => {
									this.boxLoading  = false
								}, 200)
								this.dataList.push(...res.data)
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
							this.totalPage = res.total
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
			lookPhoto(id) {
				this.isShowPhoto = true
				this.pageType = 1
				this.photoId = {
					id: id,
					type: 1
				}
			},
			toCollect(id) {
				this.isShowPhoto = true
				this.photoId = {
					id: id,
					type: 2
				}
			},
			closePhoto(val) {
				this.isShowPhoto = val.isShow
				this.photoId = ''
				if(val.isChange) {
					this.dataList = []
					this.index = 1
					this.getListData()
				}
			},
			toNextPage() {
				if(this.mId) {
					if(!this.boxLoading) {
						this.index++
						this.getListData()
					}else {
						this.$message({
						    type: 'info',
						    message: '等待页面加载完成',
						    center: true
						});
					}
				}else {
					this.$message({
					    type: 'info',
					    message: '请先选择地区',
					    center: true
					});	
				}	
			},
			selectSpotTag(index, id) {
				if(!this.boxLoading) {
					this.typeTags.map((v, i) => {
						if(index == i) {
							v.isShow = true
							this.tagNum = id
							this.dataList = []
							this.index = 1
							this.getListData()
						}else {
							v.isShow = false
						}
					})
				}else {
					this.$message({
					    type: 'info',
					    message: '等待页面加载完成',
					    center: true
					});
				}
			}
		},
		created() {
			if(this.mId) {
				this.getListData()
			}else {
				this.isShowBlank = true
				setTimeout(() => {
					this.boxLoading  = false
				}, 200)
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
	.upLoadSpotImg {
		height: 100%;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}
	.spotTopCut {
		padding-top: 20px;
		display: flex;
		justify-content: flex-end;
		align-items: flex-end;
		position: relative;
	}
	.spotCutRight {
		display: flex;
		align-items: flex-end;
	}
	.spotCutRight>div:first-child {
		margin-right: 20px;
	}
	.selectArea  {
		padding: 14px 20px;
		box-shadow: 0 0 14px 0 #ECEDF1;
		background-color: #fff;
		border-radius: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 15px;
		color: #373A3E;
	}
	.selectArea:hover {
		cursor: pointer;
	}
	.selectArea>span {
		display: block;
		margin-right: 5px;
	}
	.selectArea>b {
		display: block;
		border: 3px solid #373A3E;
		border-top-color: transparent;
		border-left-color: transparent;
		transform: rotate(45deg);
	}
	.slideFade-enter-active, .slideFade-leave-active {
	  transition: all .3s ease;
	  opacity: 1;
	}
	.slideFade-enter, .slideFade-leave-to {
		transform: translateX(250px);
	  	opacity: 0;
	}
	.showTagsType {
		width: 100%;
		height: 30px;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		padding-right: 20px;
	}
	.showTagsType>span {
		display: block;
		color: #373A3E;
		font-size: 12px;
		padding: 4px 10px;
		background-color: #fff;
		border-radius: 12px;
		transition: all 0.2s;
	}
	.showTagsType>span:not(:last-child) {
		margin-right: 5px;
	}
	.showTagsType>span:hover {
		cursor: pointer;
		text-decoration: underline;
	}
	.showTagsType .activeTag {
		color: #fff;
		background-color: #FFB132;
		text-decoration: underline;
	}
	.spotList {
		/* margin-top: 30px; */
		width: 100%;
		height: auto;
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
	.showSpotList {
		flex: 1;
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
		position: relative;
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
	.showIsCollect {
		font-size: 12px;
		color: #9FA6AD;
	}
	.showIsCollect>span {
		display: block;
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
		width: 60px;
		height: 20px;
		background-color: #FFB132;
		color: #fff;
		font-size: 12px;
		border-radius: 10px;
		line-height: 20px;
		text-align: center;
	}
	.spotInfoBtn>div:first-child {
		margin-right: 10px;
	}
	.spotInfoBtn>div:hover {
		cursor: pointer;
	}
	.toNextPage {
		width: 100%;
		height: 30px;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #fff;
	}
	.toNextPage>span {
		display: block;
		font-size: 14px;
		color: #9FA6AD;
		margin-right: 20px;
	}
	.toNextPage>div {
		padding: 2px 16px;
		color: #fff;
		font-size: 14px;
		border-radius: 12px;
		background-color: #FFB132;
	}
	.toNextPage>div:hover {
		cursor: pointer;
	}
	.showColloctIcon {
		position: absolute;
		top: 5px;
		right: 5px;
		font-size: 24px;
		color: #9FA6AD;
	}
	.showColloctIcon.hadColloct {
		color: #FFB132;
	}
</style>