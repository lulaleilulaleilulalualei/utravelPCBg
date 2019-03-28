<template>
	<div class="planSpotList" :style="{height: loadStatus == 1? '100%': 'auto'}">
		<div class="selectSpot">
			<el-select v-if="!isHideCitySelect" v-model="cityName" placeholder="请选择城市" @change="selectChange">
			    <el-option
			      v-for="item in cityArr"
			      :key="item.id"
			      :label="item.shortName"
			      :value="item.shortName">
			    </el-option>
			</el-select>
			<div class="searchSpot">
				<input type="text" 
						placeholder="请输入景点名称" 
						v-model="keyword" 
						@focus="foucsSearchSpot" 
						@blur="blurSearchSpot" 
						@keyup.enter="toSearchSpot">
			</div>
		</div>
		<div class="spotShowList" v-loading="boxLoading" v-if="loadStatus == 1">
			<happy-scroll color="rgba(255,177,50,1)" size="1" resize hide-vertical >
		    	<div class="spotListBox">
					<div class="itemSpotShow" v-for="(item, index) in spotList" :key="item.id">
						<div class="itemShowSpotInto" @click="lookSpot(item.id)">
							<div><img :src="item.thumbImg" alt=""></div>
							<span>{{item.name}}</span>
						</div>
						<div class="addSpotToPlan" @click="addToPlan(index)">+添加到行程</div>
					</div>
				</div>
			</happy-scroll>
			<div class="showSpotCount">
				<div class="showSpotNum">当前共有{{totalPage}}页,当前加载到第{{index}}页</div>
				<div class="toNextPage" @click="toNextPage">下一页</div>
				<div class="toJumpPage">跳转到 <input type="text" v-model="pageVal" @keyup.enter="toJumpPage"></div>
			</div>
		</div>
		<template v-if="loadStatus != 1">
			<div class="searchBlank" v-if="loadStatus == 2">
				<p>当前没有搜索到结果～</p>
				<div>您可以 <span @click="addSelfSpot">+手动添加</span></div>
			</div>
			<div class="showBlankCity" v-if="loadStatus == 0">
				<div><img src="../../assets/img/no_city_icon.png" alt=""></div>
				<span>请选择城市</span>
			</div>
		</template>
		<transition name="fade">
			<showSpot v-if="c_isShowSpotContent.isShow"></showSpot>
		</transition>
	</div>
</template>

<script>
	import showSpot from '../common/showSpot.vue'
	import { mapGetters , mapActions } from 'vuex';
	import config from '@/config'
	
	export default {
		data() {
			return {
				cityName: '',
				cityArr: [],
				index: 1,
				size: 10,
				totalPage: 0,
				boxLoading: false,
				spotList: [],
				isFirstLoad: true,
				// isShowBlank: false,
				// isHadLoadSpot: false,
				loadStatus: 0, //1加载成功， 0还未加载 2第一次加载为空
				pageVal: '',
				isHideCitySelect: false,
				keyword: ''
			}
		},
		components: {showSpot},
		computed: {
			...mapGetters([
				'wa_actPlanObj',
				'c_userInfo',
				'c_isShowSpotContent',
				'wa_toDeleteCity',
				'wl_isShowSelf',
				'wl_pointInfo',
				'wa_spotArr'
				])
		},
		watch: {
			wa_actPlanObj(val) {
				this.cityArr = val.cityArr
				this.cityName = val.cityArr[val.cityArr.length-1].shortName
				if(val.chageType == 1) {
					if(val.cityArr[0].id == 0) {
						this.isFirstLoad = true
						this.index = 1
						this.keyword = ''
						this.cityName = ''
						this.spotList = []
						this.loadStatus = 0
					}else {
						this.isFirstLoad = true
						this.keyword = ''
						this.index = 1
						this.spotList = []
						this.getSpotList()
					}
				}
			},
			wa_toDeleteCity() {
				let arr = this.wa_actPlanObj.cityArr
				this.cityArr = arr
				if(arr[0].id == 0) {
					this.cityName = ''
				}else {
					if(this.cityName != arr[arr.length-1].shortName) {
						this.cityName = arr[arr.length-1].shortName
						this.keyword = ''
						this.index = 1
						this.spotList = []
						this.getSpotList()
					}
				}
			},
			wl_pointInfo(val) {
				if(!this.$api.isEmptyObject(val)) {
					this.loadStatus = 1
					this.isFirstLoad = true
					this.index = 1
					this.spotList = []
					this.cityName = ''
					this.spotList.push(val)
					this.keyword = ''
				}	
			},
		},
		methods: {
			...mapActions([
				'c_showSpotContent',
				'wa_addToSpot',
				'wl_addressInfo',
				'wl_showPointInfo',
				'wl_showSelfLine',
				'wa_setSpotMap'
				]),
			lookSpot(id) {
				this.c_showSpotContent({id: id, isShow: true})
			},
			foucsSearchSpot() {
				this.isHideCitySelect = true
			},
			blurSearchSpot() {
				setTimeout(() => {
					this.isHideCitySelect = false
				}, 300)
			},
			toSearchSpot() { //spotName+
				this.isFirstLoad = true
				this.index = 1
				this.spotList = []
				this.cityName = ''
				this.getSpotList()
			},
			selectChange() {
				this.isFirstLoad = true
				this.keyword = ''
				this.index = 1
				this.spotList = []
				this.getSpotList()
			},
			addToPlan(index) {
				let arr = [...this.wa_spotArr]
				arr.push(this.spotList[index])
				this.wa_setSpotMap(arr)
				this.wa_addToSpot(this.spotList[index])
			},
			addSelfSpot() {
				this.wl_addressInfo({})
		        this.wl_showPointInfo({})
		        this.wl_showSelfLine(true)
			},
		    toNextPage() {
		    	if(this.spotList.length != 0) {
		    		this.index++
		    		if(this.index <= this.totalPage) {
						this.getSpotList()
		    		}else {
		    			this.index = this.totalPage
						this.$message({
						    type: 'error',
						    message: '已经是最后一页了~',
						   	center: true
						});
		    		}
		    	}else {
					this.$message({
					    type: 'error',
					    message: '请先选择城市',
					   	center: true
					});
		    	}
		    },
		    toJumpPage() {
		    	if(this.spotList.length != 0) {
		    		this.index = this.pageVal
		    		if(this.index <= this.totalPage) {
		    			this.spotList = []
						this.getSpotList()
		    		}else {
		    			this.index = this.totalPage
						this.$message({
						    type: 'error',
						    message: '已经超过最后一页了~',
						   	center: true
						});
		    		}
		    		this.pageVal = ''
		    	}else {
					this.$message({
					    type: 'error',
					    message: '请先选择城市',
					   	center: true
					})
					this.pageVal = ''
		    	}	
		    },
		    getSpotList() {
				const $this = this
		    	this.boxLoading = true
		    	this.$api.ajax({
		    		url: config.getManagerSpotList,
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
							if(res.data.length != 0) {
								setTimeout(() => {
									this.boxLoading  = false
								}, 200)
								this.spotList.push(...res.data)
								// this.isHadLoadSpot = true
								this.isFirstLoad = false
								// this.isShowBlank = false
								this.loadStatus = 1
							}else {
								if(this.isFirstLoad) {
									// this.isShowBlank = true
									this.loadStatus = 2
								}
								setTimeout(() => {
									this.boxLoading  = false
								}, 200)
							}
							this.totalPage = res.pages
						}else {
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
		}
	}
</script>

<style scoped>
	.planSpotList {
		width: 100%;
		background: #FFFFFF;
		box-shadow: 4px 0 14px 0 #ECEDF1;
		border-radius: 4px;
		display: flex;
		flex-direction: column;
	}
	.selectSpot {
		height: 80px;
		padding:0 20px;
		width: 100%;
		display: flex;
		align-items: center;
		box-shadow: 0 4px 10px 0 #ECEDF1;
	}
	.selectSpot>div:first-child {
		width: 40%;
		margin-right: 10px;
	}
	.selectSpot .searchSpot{
		flex: 1;
	}
	.searchSpot>input {
		display: block;
		width: 100%;
		border: 1px solid #dcdfe6;
		color: #606266;
		height: 40px;
    	line-height: 40px;
    	padding: 0 15px;
    	border-radius: 4px;
    	font-size: 16px;
	}
	.spotShowList {
		flex: 1;
		overflow: hidden;
		position: relative;
		display: flex;
		flex-direction: column;
	}
	.showBlankCity {
		width: 100%;
		height: 466px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.showBlankCity>div {
		width: 41px;
		height: 36px;
		margin-bottom: 5px;
	}
	.showBlankCity>span {
		display: block;
		font-size: 14px;
		color: #DCDBDC;
	}
	.searchBlank {
		width: 100%;
		height: 466px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-size: 20px;
		color: #C8CED9;
	}
	.searchBlank span {
		color: #FFDC56;
	}
	.searchBlank span:hover {
		cursor: pointer;
	}
	.spotListBox {
		padding: 20px;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		overflow-y: auto;
		padding-bottom: 10px;

	}
	.itemSpotShow {
		width: 48%;
		height: auto;
		border: 1px solid #A7A9B0;
	}
	.itemSpotShow {
		margin-bottom: 15px;
	}
	.itemSpotShow:hover {
		cursor: pointer;
	}
	.itemShowSpotInto {
		width: 100%;
		border-bottom: 1px solid #A7A9B0;
	}
	.itemShowSpotInto>div {
		width: 100%;
		height: 140px;
		background-color: #eee;
	}
	.itemShowSpotInto>span {
		display: block;
		padding: 15px;
		font-size: 14px;
		color: #000000;
		overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
	}
	.addSpotToPlan {
		height: 42px;
		line-height: 42px;
		text-align: center;
		font-size: 18px;
		color: #929292;
	}
	.showSpotCount {
		width: 100%;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.showSpotNum {
		color: #9FA6AD;
		font-size: 14px;
		margin-right: 10px;
	}
	.toNextPage {
		padding: 2px 10px;
		border-radius: 15px;
		font-size: 14px;
		color: #fff;
		margin-right: 10px;
		background-color: #FFB132;
		color: #fff;
	}
	.toNextPage:hover {
		cursor: pointer;
	}
	.toJumpPage {
		color: #9FA6AD;
		font-size: 14px;
	}
	.toJumpPage>input {
		width: 30px;
		height: 20px;
		padding: 0 3px;
		border: 1px solid #ccc;
		border-radius: 2px;
	}
</style>