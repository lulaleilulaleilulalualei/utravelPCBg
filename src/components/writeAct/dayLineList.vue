<template>
	<div class="dayLineList" @click="colseBox">
		<div class="dayLineTitle">
		  	<b></b>
		  	<span>行程路线</span>
		</div>

		<div class="lineList">
			<div :class="['itemDayList', {showCurrent: item.isActive}]" v-for="(item, index) in dayList" :key="index" @click="cutDays(index)">
				<div class="itemDayTop">
					<span>D{{index+1}}</span>
					<b class="showPlanOperation" :data-index="index" @click.stop="showPlanOperation"></b>
				</div>
				<div class="itemDayBottom">
					<span v-for="(city, i) in item.cityArr">{{i == 0? city.shortName: '>' + city.shortName}}</span>
				</div>
			</div>
		</div>
		
		<div class="addPlanDay" @click="toAddDay">
			<b></b>
			<span>增加一天</span>
		</div>
	</div>
</template>

<script>
	import { mapGetters , mapActions } from 'vuex';
	
	export default {
		data() {
			return {
				dayList: []
			}
		},
		props: {
			operateType: Object,
			allLineCount: Number
		},
		computed: {
			...mapGetters([
				'wa_actPlanObj',
				'wa_toDeleteCity',
				'wa_actInfo',
				'wa_mapFirstPos'
				]),
		},
		watch: {
			allLineCount(val) {
				let arr = []
				this.dayList.map((v, i) => {
					arr.push(...v.spotArr)
				})
				this.wa_setSpotMap(arr)
			},
			wa_actPlanObj(val) {
				this.dayList.splice(val.index-1, 1, val)
			},
			wa_toDeleteCity(val) {
				let arr = this.dayList
				arr[val.to].cityArr.splice(val.index, 1)
				this.dayList = arr
				if(this.dayList[val.to].cityArr.length == 0) {
					this.wa_toChangeActObj({
						cityArr: [{shortName: '暂无安排', id: 0}],
						spotArr: [],
						desc: '',
						isActive: true,
						index: 1,
						chageType: 1
					})
				}else {
					this.wa_toChangeActObj(this.dayList[val.to])
				}
			},
			operateType(val) {
				if(!this.$api.isEmptyObject(val)) {
					let arr = this.dayList
					if(val.type == 1) {//往前插
						if(val.index > 0) {
							[arr[val.index], arr[Number(val.index-1)]] = [arr[Number(val.index-1)], arr[val.index]]
						}else {
							this.$message({
							    type: 'info',
							    message: '已经是第一个了~',
							   	center: true
							});
						}
					}else
					if(val.type == 2) {//往后插
						if(val.index < Number(this.dayList.length - 1)) {
							[arr[val.index], arr[Number(val.index)+1]] = [arr[Number(val.index)+1], arr[val.index]]
						}else {
							this.$message({
							    type: 'info',
							    message: '已经是最后一个了~',
							   	center: true
							});
						}
					}else
					if(val.type == 3) {//删除
						arr.splice(val.index, 1)
						let isHadActive = false
						arr.map((v, i) => {
							if(v.isActive) {
								isHadActive = true
							}
							v.index = Number(i+1)
						})
						if(!isHadActive) {
							arr.map((v, i) => {
								if(val.index == i) {
									v.isActive = true
									this.wa_toChangeActObj(v)
									this.wa_setSpotMap(v.spotArr)
								}else {
									if(val.index > i) {
										arr[arr.length-1].isActive = true
										this.wa_toChangeActObj(v)
										this.wa_setSpotMap(v.spotArr)
									}
								}
							})
						}
					}

					arr.map((v, i) => {
						v.index = Number(i)+1
					})
					this.dayList = [...arr]
				}
			},
			wa_mapFirstPos(val) {
				if(val) {
					this.dataDefault()
				}
			}
		},
		methods: {
			...mapActions([
				'wa_toChangeActObj',
				'wa_setSpotMap'
				]),
			cutDays(index) {
				this.dayList.map((v, i) => {
					if(index == i) {
						if(!v.isActive) {
							v.isActive = true
							v.chageType = 1
							this.wa_toChangeActObj(v)
							this.$emit('changeDay', index)
							this.wa_setSpotMap(v.spotArr)
						}
					}else {
						v.isActive = false
					}
				})
			},
			toAddDay() {
				let len = Number(this.dayList.length)+1
				this.dayList.map(item => item.isActive = false)
				this.dayList.push({
					cityArr: [{shortName: '暂无安排', id: 0}],
					spotArr: [],
					desc: '',
					isActive: true,
					index: len,
					chageType: 1
				})
				let newDay = this.dayList[this.dayList.length-1]
				this.wa_toChangeActObj(newDay)
				this.wa_setSpotMap(newDay.spotArr)
			},
			showPlanOperation(e) {
				let index = e.target.dataset.index,
					pageX = e.pageX,
					pageY = e.pageY
				this.$emit('getPosObj', {index, pageX, pageY})
			},
			colseBox(e) {
				if(e.target.className != 'showPlanOperation') {
					this.$emit('colseBox', false)
				}
			},
			dataDefault() {
				if(!this.$api.isEmptyObject(this.wa_actInfo.lineInfo)) {
					let nodes = this.wa_actInfo.lineInfo.nodes
					nodes.map((v, i) => {
						this.dayList.push({
							cityArr: (() => {
								let arr = []
								v.nodes.map((val, ind) => {
									let shortName = val.city.split('市')[0],
										nameArr = arr.map(item => item.shortName)
									if(nameArr.indexOf(shortName) == -1) {
										arr.push({
											shortName: shortName,
											id: val.id
										})
									}
								})
								return arr
							})(),
							spotArr: (() => {
								let arr = []
								v.nodes.map((val, ind) => {
									if(!this.$api.isEmptyObject(val.hotelsOrfoods)) {
										arr.push({
											name: val.name,
											id: val.id,
											longitude: val.lng,
											latitude: val.lat
										})
										arr.push(...val.hotelsOrfoods)
									}else {
										arr.push({...val,longitude: val.lng,latitude: val.lat})
									}
								})
								return arr
							})(),
							desc: v.desc,
							isActive: i == 0? true: false,
							index: i+1,
							chageType: 1
						})
					})
					this.wa_toChangeActObj(this.dayList[0])
					this.wa_setSpotMap(this.dayList[0].spotArr)
				}else {
					this.dayList.push(this.wa_actPlanObj)
				}
			}
		},
		created() {
			
		},
		mounted() {
			
		} 
	}
</script>

<style scoped>
	.dayLineList {
		width: 100%;
		height: 100%;
		overflow-y: auto;
		background-color: #fff;
		box-shadow: 4px 0 14px 0 #ECEDF1;
		border-radius: 4px;
		display: flex;
		flex-direction: column;
		position: relative;
	}
	.dayLineTitle {
		width: 100%;
		height: 80px;
		display: flex;
		align-items: center;
		padding-left: 20px;
	}
	.dayLineTitle>b {
		display: block;
		width: 25px;
		height: 32px;
		background: url('../../assets/img/line_icon.png') no-repeat center;
		background-size: 100%;
		margin-right: 10px;
	}
	.dayLineTitle>span {
		display: block;
		font-size: 26px;
		color: #000000;
		font-weight: 600;
	}
	.lineList {
		flex: 1;
	}
	.itemDayList {
		width: 100%;
		min-height: 150px;
		padding: 30px 20px;
		transition: all 0.2s;
	}
	.itemDayList:hover {
		cursor: pointer;
	}
	.addPlanDay {
		width: 100%;
		height: 100px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.addPlanDay:hover {
		cursor: pointer;
	}
	.addPlanDay>b {
		display: block;
		width: 44px;
		height: 44px;
		background: url('../../assets/img/addOneDay.png') no-repeat center;
		background-size: 100%;
		margin-right: 10px;
	}
	.addPlanDay>span {
		display: block;
		font-size: 20px;
		color: #000000;
	}
	.itemDayList.showCurrent {
		background-color: #FFF2DD;
	}
	.itemDayTop {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 15px;
		position: relative;
	}
	.itemDayTop>span {
		width: 50px;
		height: 50px;
		border-radius: 50%;
		background-image: linear-gradient(0deg, #FFCD20 0%, #FFCA20 99%);
		box-shadow: 0 6px 8px 0 #FFEAA1;
		font-size: 20px;
		color: #FFFFFF;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.itemDayTop>b {
		display: block;
		width: 18px;
		height: 15px;
		background: url('../../assets/img/more_icon.png') no-repeat center;
		background-size: 100%;
	}
	.itemDayTop>b:hover {
		background-image: url('../../assets/img/more_icon_2.png');
	}
	.itemDayBottom {
		font-size: 20px;
		color: #000000;
	}
</style>