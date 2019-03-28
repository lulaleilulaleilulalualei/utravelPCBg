<template>
	<div class="showCurrentPlan" :style="{height: isHadLoadSpot? '100%': 'auto'}" @click="closeAddBox">
		<div class="showPlanTitle">
			<b></b>
			<span>日程安排 D{{wa_actPlanObj.index}}</span>
		</div>
		<div class="showCityBox">
			<div class="showCityList">
				<span v-for="(city, i) in wa_actPlanObj.cityArr">{{i == 0? city.shortName: '>' + city.shortName}} <b v-if="city.shortName != '暂无安排'" class="deleteCity" @click.stop="deleteCity(i)"></b></span>
				<el-autocomplete
			      v-model="cityName"
			      value-key="shortName"
			      :fetch-suggestions="querySearch"
			      placeholder="请输入城市"
			      :trigger-on-focus="false"
			      @select="handleSelect"
			    ></el-autocomplete>
			</div>
			<div class="showAddOtherBtn" @click.stop="toOpenAddBox">
				<div class="addOtherBox" v-if="isShowAddBox">
					<div class="otherBoxTitle"><span>操作</span><i class="el-icon-close" @click.stop="toOpenAddBox"></i></div>
					<div class="itemAddEvent" @click="showAddTextBox">
						<b :style="{width:'13px',backgroundImage:`url(${addText})`}"></b>
						<span>添加描述信息</span>
					</div>
					<div class="itemAddEvent" @click.stop="joinMoreSpot(1)">
						<b :style="{width:'13px',backgroundImage:`url(${addHotel})`}"></b>
						<span>添加当日住宿</span>
					</div>
					<div class="itemAddEvent" @click.stop="joinMoreSpot(2)">
						<b :style="{width:'16px',backgroundImage:`url(${addFood})`}"></b>
						<span>添加当日美食</span>
					</div>
					<!-- <div class="itemAddEvent" @click.stop="addSelfSpot">
						<b :style="{width:'14px',backgroundImage:`url(${addSpot})`}"></b>
						<span>添加当日游玩</span>
					</div> -->
					<div class="itemAddEvent" @click.stop="emptyDayPlan">
						<b :style="{width:'16px',backgroundImage:`url(${deleteAllPlan})`}"></b>
						<span>清空该日日程</span>
					</div>
				</div>
			</div>
		</div>
		<div class="showSpotPlan" v-if="isHadLoadSpot">
			<happy-scroll color="rgba(255,177,50,1)" size="1" resize hide-vertical>
			<div class="showSpotList">
				<el-input
					v-if="isAddDesText"
					class="planDesBox"
					type="textarea"
					:autosize="{ minRows: 5}"
					v-model="planDes"
					placeholder="添加行程描述信息"
					@blur="deseBlur"
					resize="none">
				</el-input>
				<div class="itemShowSpot" v-for="(item, index) in spotArr" :key="index">
					<div class="showItemSpot">
						<div class="spotIconSign"><b></b></div>
						<h3 @click="lookSpot(item.id,index,item.type)">{{item.name}}</h3>
						<span class="deleteItemSpot" @click="deleteItemSpot(index)"></span>
					</div>
					<!-- <div class="spotDistance" v-if="index != spotArr.length -1">
						<b></b>
						<span>{{$api.compareDistance(index, spotArr)}}</span>
					</div> -->
				</div>
			</div>
			</happy-scroll>
		</div>
		<div class="noSpotPlan" v-if="!isHadLoadSpot">
			<div class="noSpotPlanImg"><img src="../../assets/img/show_no_plan.png" alt=""></div>
			<span>本日还未安排行程</span>
		</div>
		<transition name="fade">
			<showSpot v-if="c_isShowSpotContent.isShow"></showSpot>
		</transition>
		<transition name="fade">
			<moreInfoSpot v-if="wl_addMoreInfoObj.isShow"></moreInfoSpot>
		</transition>
	</div>
</template>

<script>
	import showSpot from '../common/showSpot.vue'
	import moreInfoSpot from '../writeLine/moreInfoSpot.vue'
	import { mapGetters , mapActions } from 'vuex';
	
	export default {
		data() {
			return {
				cityName: '', //城市搜索
				cityNameArr: [],
				spotArr: [],//景点列表
				isHadLoadSpot: false,
				addText: require('../../assets/img/add_text_icon.png'),
				addHotel: require('../../assets/img/add_hotel_icon.png'),
				addFood: require('../../assets/img/add_food_icon.png'),
				addSpot: require('../../assets/img/add_spot_icon.png'),
				deleteAllPlan: require('../../assets/img/delete_day.png'),
				isShowAddBox: false,
				planDes: '', //当然行程描述
				isAddDesText: false, //是否添加描述文本
				editInfoIndex: null, //美食，酒店下标
			}
		},
		components: {showSpot, moreInfoSpot},
		computed: {
			...mapGetters([
				'wa_actPlanArr',
				// 'c_cityName',
				'c_proCitys',
				'wa_actPlanObj',
				'wa_addSpotObj',
				'c_isShowSpotContent',
				'wl_addMoreInfoObj',
				'wl_isShowSelf'
				]),
			cityArr() {
				let arr = []
				this.c_proCitys.map((v, i) => {
					arr.push(...v.cityList)
				})
				return arr
			}
		},
		watch: {
			wa_actPlanObj(val) {
				this.cityNameArr = val.cityArr
				this.spotArr = val.spotArr
				if(val.spotArr.length == 0) {
					this.isHadLoadSpot = false
					this.isAddDesText = false
				}else {
					this.isHadLoadSpot = true
				}
				if(val.desc != '') {
					this.isAddDesText = true
					this.planDes = val.desc
				}
			},
			wa_addSpotObj(val) {
				this.isHadLoadSpot = true
				this.spotArr.push(val)
				let cityArr = this.wa_actPlanObj.cityArr
				if(cityArr.length == 1 && cityArr[0].id == 0) {
					cityArr[0] = {
						id: this.cityArr.filter(item => item.shortName == val.city.split('市')[0])[0].id,
						shortName: val.city.split('市')[0]
					}
				}else {
					let cityName = cityArr.map(v => v.shortName)
					this.spotArr.map((v, i) => {
						let shortName = v.city.split('市')[0]
						if(cityName.indexOf(shortName) == -1) {
							cityArr.push({
								id: this.cityArr.filter(item => item.shortName == shortName)[0].id,
								shortName: shortName
							})
						}
					})
				}
				this.wa_toChangeActObj({...this.wa_actPlanObj, cityArr: cityArr,spotArr: this.spotArr, chageType: 2})
			},
			wl_addMoreInfoObj(val) {
				if(!this.$api.isEmptyObject(val.infoObj)) {
					if(val.isEdit) {
						this.spotArr.splice(this.editInfoIndex, 1, val.infoObj)
					}else {
						this.spotArr.push(val.infoObj)
					}
				}
			}
		},
		methods: {
			...mapActions([
				// 'c_getCityName',
				'c_getProvinceCity',
				'wa_toChangeActObj',
				'wa_getDeleteCityIndex',
				'c_showSpotContent',
				'wa_setSpotMap',
				'wl_addMOreINfo',
				// 'wl_addressInfo',
				// 'wl_showPointInfo',
				// 'wl_showSelfLine'
				]),
			emptyDayPlan() {
				this.spotArr = []
				this.isShowAddBox = false
				this.isHadLoadSpot = false
				this.isAddDesText = false
				this.wa_setSpotMap(this.spotArr)
			},
			deseBlur() {
				this.wa_toChangeActObj({...this.wa_actPlanObj, desc: this.planDes, chageType: 2})
			},
			// addSelfSpot() {
			// 	this.isShowAddBox = false
			// 	this.wl_addressInfo({})
		 //        this.wl_showPointInfo({})
		 //        this.wl_showSelfLine(true)
			// },
			joinMoreSpot(type) {
				if(this.spotArr.length != 0) {
					this.wl_addMOreINfo({type: type, isShow: true, infoObj: {}, isEdit: false})
					this.isShowAddBox = false
				}else {
					this.$message({
					    message: '请先添加景点',
					    type: 'info',
					    center: true
					})
				}
			},
			showAddTextBox() {
				this.isAddDesText = true
				this.isHadLoadSpot = true
			},
			toOpenAddBox() {
				this.isShowAddBox = !this.isShowAddBox
			},
			closeAddBox(e) {
				if(e.target.className != 'showAddOtherBtn') {
					this.isShowAddBox = false
				}
			},
			lookSpot(id, index, type) {
				if(type) {
					this.wl_addMOreINfo({type: type, isShow: true, infoObj: this.spotArr[index], isEdit: true})
					this.editInfoIndex = index
				}else {
					this.c_showSpotContent({id: id, isShow: true})
				}
			},
			deleteItemSpot(index) {
				this.spotArr.splice(index, 1)
				this.wa_toChangeActObj({...this.wa_actPlanObj, spotArr: this.spotArr, chageType: 2})
				this.wa_setSpotMap(this.spotArr)
				if(this.spotArr.length == 0) {
					this.isHadLoadSpot = false
				}
			},
			querySearch(queryString, cb) {
		        var restaurants = this.cityArr;
		        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
		        // 调用 callback 返回建议列表的数据
		        cb(results);
		    },
		    createFilter(queryString) {
		        return (restaurant) => {
		          return (restaurant.shortName.toLowerCase().indexOf(queryString.toLowerCase()) != -1);
		       };
		    },
		    handleSelect(val) {
				// this.cityNameArr.push(val.name)
				let arr = this.wa_actPlanObj.cityArr,
					isRepeat = false
				if(arr[0].id == 0) {
					arr[0] = val
				}else {
					arr.map((v, i) => {
						if(val.shortName == v.shortName) {
							this.$message({
							    type: 'error',
							    message: '城市不能够重复输入哦~',
							   	center: true
							});
							isRepeat = true
						}
					})
					if(!isRepeat) {
						arr.push(val)
					}
				}
				if(!isRepeat) {
					let {index, isActive, spotArr, desc} = this.wa_actPlanObj
					this.wa_toChangeActObj({
						cityArr: arr,
						index,
						isActive,
						spotArr,
						desc,
						chageType: 1
					})
				}
				
				this.cityName = ''
		    },
		    deleteCity(index) {
		    	let cityName = this.wa_actPlanObj.cityArr[index].shortName,
		    		isExist = false
		    	this.spotArr.map((v, i) => {
		    		if(v.city.indexOf(cityName) != -1) {
						isExist = true
		    		}
		    	})
		    	if(!isExist) {
		    		this.wa_getDeleteCityIndex({
						to: this.wa_actPlanObj.index - 1,
						index: index,
					})
		    	}else {
					this.$message({
						type: 'info',
						message: '当前城市还有景点在列表中，请先删除景点！',
						center: true
					});
		    	}
		    }
		},
		mounted() {
			// if(this.c_cityName.length == 0) {
			// 	this.$api.cityList((arr) => {
			// 		this.c_getCityName(arr)
			// 	})
			// }
			if(this.c_proCitys.length == 0) {
				this.$api.proAndCity((citys) => {
					this.c_getProvinceCity(citys)
				})
			}
		}
	}
</script>

<style scoped>
	.showCurrentPlan {
		min-width: 300px;
		background: #FFFFFF;
		box-shadow: 4px 0 14px 0 #ECEDF1;
		border-radius: 4px;
		display: flex;
		flex-direction: column;
	}
	.showPlanTitle {
		width: 100%;
		min-height: 80px;
		box-shadow: 0 4px 10px 0 #ECEDF1;
		padding-left: 20px;
		display: flex;
		align-items: center;
	}
	.showPlanTitle>b {
		display: block;
		width: 30px;
		height: 30px;
		background:  url('../../assets/img/dayPlan_icon.png') no-repeat center;
		background-size: 100%;
		margin-right: 10px;
	}
	.showPlanTitle>span {
		font-size: 26px;
		color: #000000;
		font-weight: 600;
	}
	.showCityBox {
		width: 100%;
		padding: 30px 20px;
		border-bottom:1px solid #E3E3E3;
	}
	.showAddOtherBtn {
		display: block;
		width: 50px;
		height: 50px;
		border-radius: 4px;
		background: url('../../assets/img/addPlanCity.png') no-repeat center;
		background-size: 100%;
		position: relative;
	}
	.showAddOtherBtn:hover {
		cursor: pointer;
	}
	.addOtherBox {
		position: absolute;
		top: 60px;
		left: 0;
		z-index: 200;
		background: #FFFFFF;
		box-shadow: 0 0 9px 0 rgba(0,0,0,0.19);
		border-radius: 6px;
		overflow: hidden;
		width: 200px;
	}
	.otherBoxTitle {
		width: 100%;
		height: 50px;
		padding: 0 20px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1px solid #D2D2D2;
		font-size: 18px;
		color: #000000;
	}
	.itemAddEvent {
		width: 100%;
		padding: 10px 20px;
		display: flex;
		align-items: center;
		transition: all 0.2s;
	}
	.itemAddEvent>b {
		display: block;
		height: 16px;
		margin-right: 20px;
		background-repeat: no-repeat;
		background-position: center;
		background-size: 100%;
	}
	.itemAddEvent>span {
		font-size: 18px;
		color: #000000;
	}
	.itemAddEvent:hover {
		background-color: #FFF2DD;
	}

	.showCityList {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		margin-bottom: 15px;
	}
	.showCityList>span {
		display: block;
		font-size: 20px;
		color: #000000;
		position: relative;
	}
	.deleteCity {
		display: block;
		width: 16px;
		height: 16px;
		background: url('../../assets/img/delete_city_icon.png') no-repeat center;
		background-size: 100%;
		position: absolute;
		top: -8px;
		right: -8px;
		z-index: 10;
	}
	.deleteCity:hover {
		cursor: pointer;
	}
	.showCityList>div {
		flex: 1;
		min-width: 120px;
	}
	.showSpotPlan {
		flex: 1;
		width: 100%;
	}
	.noSpotPlan {
		width: 100%;
		height: 300px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.noSpotPlan>div {
		width: 38px;
		height: 40px;
		margin-bottom: 5px;
	}
	.noSpotPlan>span {
		display: block;
		font-size: 14px;
		color: #DCDBDC;
	}
	.showSpotList {
		height: auto;
		width: 100%;
	}
	.itemShowSpot {
		height: auto;
		width: 100%;
	}
	.showItemSpot {
		display: flex;
		align-items: center;
		padding: 10px 20px;
		transition: all 0.2s;
		position: relative;
	}
	.showItemSpot:hover {
		cursor: pointer;
		background: #FFF2DD;
	}
	.showItemSpot h3 {
		width: 250px;
		font-size: 20px;
		color: #000000;
		font-weight: normal;
		overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
	}
	.itemShowSpot:not(:last-child) {
		border-bottom: 1px solid #E3E3E3;
	}
	.deleteItemSpot {
		position: absolute;
		top: 45px;
		right: 20px;
		display: block;
		width: 17px;
		height: 18px;
		background: url('../../assets/img/delete_itemSpot_1.png') no-repeat center;
		background-size: 100%;
	}
	.deleteItemSpot:hover {
		background-image: url('../../assets/img/delete_itemSpot_2.png');
	}
	.spotIconSign {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-right: 15px;
	}
	.spotIconSign::before, .spotIconSign::after {
		content: '';
		display: block;
		width: 6px;
		height: 17px;
		background: url('../../assets/img/spotDistance_icon.png') no-repeat center;
		background-size: 100%;
	}
	.spotIconSign>b {
		display: block;
		width: 40px;
		height: 48px;
		background: url('../../assets/img/act_spot_icon.png') no-repeat center;
		background-size: 100%;
		margin: 5px 0;
	}
	.spotDistance {
		width: 100%;
		height: 30px;
		background: #FBFBFB;
		padding-left: 30px;
		display: flex;
		align-items: center;
	}
	.spotDistance>b {
		display: block;
		width: 18px;
		height: 14px;
		background: url('../../assets/img/car_icon.png') no-repeat center;
		background-size: 100%;
		margin-right: 20px;
	}
	.spotDistance>span {
		font-size: 12px;
		color: #A8A8A8;
	}
</style>	