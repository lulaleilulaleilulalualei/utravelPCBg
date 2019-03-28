<template>
	<div class="toStartActBox" @click="colseBox">
		<div class="contentBox">
			<div class="contentBoxTop">
				<h3 class="contentTitle"><b></b>发起活动</h3>
				<div class="itemActInfo">
					<span class="itemInfoName">活动名称</span>
					<input class="itemInfoInp_1" type="text" v-model="actName">
				</div>
				<div class="itemActInfo">
					<span class="itemInfoName">活动时间</span>
					<p class="itemInfoSelectTxt">{{actTime.join(' - ')}}</p>
					<div class="dateSelectIcon">
						<el-date-picker
						  :style="{opacity: 0}"
					      v-model="actTime"
					      type="daterange"
					      value-format="yyyy/MM/dd"
					      :picker-options="pickerOptions">
					    </el-date-picker>
					</div>
				</div>
				<div class="itemActInfo">
					<span class="itemInfoName">集合地点</span>
					<input class="itemInfoInp_1" type="text" v-model="gatherPoint">
				</div>
				<div class="itemActInfo">
					<span class="itemInfoName">集合时间</span>
					<p class="itemInfoSelectTxt">{{gatherTime}}</p>
					<div class="dateSelectIcon">
						<el-date-picker
						  :style="{opacity: 0}"
					      v-model="gatherTime"
					      type="datetime"
					      value-format="yyyy/MM/dd HH:mm"
					      :picker-options="pickerOptions">
					    </el-date-picker>
					</div>
				</div>
				<div class="itemActInfo">
					<div class="itemMoreInfo">
						<span class="itemInfoName">出发城市</span>
						<input class="itemInfoInp_2" type="text" v-model="startCity">
					</div>
					<div class="itemMoreInfo">
						<span class="itemInfoName">返回城市</span>
						<input class="itemInfoInp_2" type="text" v-model="endCity">
					</div>
				</div>
				<div class="itemActInfo">
					<div class="itemMoreInfo">
						<span class="itemInfoName">人数上限</span>
						<input class="itemInfoInp_2" type="text" v-model="peopleMax">
					</div>
					<div class="itemMoreInfo">
						<span class="itemInfoName">车辆上限</span>
						<input class="itemInfoInp_2" type="text" v-model="carMax">
					</div>
				</div>
				<div class="itemActInfo">
					<span class="itemInfoName">预收费用</span>
					<div class="actCostShow">
						<div>成人<input type="text" v-model="adultPrice">元 /人</div>
						<div>儿童<input type="text" v-model="childPrice">元 /人</div>
					</div>
				</div>
				<div class="showActTags">
					<span class="itemInfoName">活动标签</span>
					<div class="showTatList">
						<span :class="['itemShowTag', {selectTag: item.isSelected}]" @click="selectTag(index)" v-for="(item, index) in tagList">{{item.text}}</span>
					</div>
				</div>
			</div>
			<div class="contentBoxBottom">
				<div @click="toStartAct">新建活动</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { mapGetters , mapActions } from 'vuex';
	import config from '@/config'
	
	export default {
		data() {
			return {
				actName: '', //活动名称
				actTime: [], //活动时间
				gatherPoint: '', //集合地点
				gatherTime: '', //集合时间
				startCity: '', //出发城市
				endCity: '',//返回城市
				peopleMax: '', //人数上限
				carMax: '', //车辆上限
				adultPrice: '', //成人价格
				childPrice: '', //儿童价格
				tagList: [],//标签列表
				isPassOk: true, //是否都填写了
				lineInfo: {}, //线路信息
				pickerOptions: {
					disabledDate(time) {
						return time.getTime() + 24*60*60*1000 < Date.now();
					}
				}
			}
		},
		computed: {
			...mapGetters([
				'wa_isShowActBox',
				'c_userVal',
				'c_userInfo'
				])
		},
		methods: {
			...mapActions([
				'wa_showActBox',
				'c_loadingShow',
				'wa_toChangeActObj',
				'wa_setSpotMap',
				'wa_getActInfo'
				]),
			getLineTags() { //获取标签
		    	this.$api.getTags((data) => {
		    		let tags = data.split(',')
					tags.map((v, i) => {
						this.tagList.push({
							text: v,
							isSelected: false
						})
					})
		    	})
		    },
		    selectTag(index) {
		    	this.tagList.map((v, i) => {
		    		if(index == i) {
		    			v.isSelected = !v.isSelected
		    		}
		    	})
		    },
		    colseBox(e) {
				if(e.target.className == 'toStartActBox') {
					this.wa_showActBox({isShow: false, id: ''})
				}
		    },
		    toStartAct() {
				let infoArr = [
					[() => this.actName != '', '活动名称不能为空'],
					[() => this.actTime.length != 0, '请选择活动时间'],
					[() => this.gatherPoint != '', '请填写集合地点'],
					[() => this.gatherTime != '', '请选择集合时间'],
					[() => this.startCity != '', '请填写出发城市'],
					[() => this.endCity != '', '请填写返回城市'],
					[() => !isNaN(Number(this.peopleMax)) && typeof Number(this.peopleMax) == 'number', '请填写正确的人数上限'],
					[() => !isNaN(Number(this.carMax)) && typeof Number(this.carMax) == 'number', '请填写正确的车辆上限'],
					[() => !isNaN(Number(this.adultPrice)) && typeof Number(this.adultPrice) == 'number', '请填写正确的成人价格'],
					[() => !isNaN(Number(this.childPrice)) && typeof Number(this.childPrice) == 'number', '请填写正确的儿童价格'],
					[() => {
						let isOK = false //默认没有标签有标签
						this.tagList.map((v, i) => {
							if(v.isSelected) {
								isOK = true
							}
						})
						return isOK
					}, '请选择标签']
				]
				// for(let i=0;i<infoArr.length;i++) {
				// 	if(!infoArr[i][0]()) {
				// 		this.$message({
				// 			type: 'error',
				// 			message: infoArr[i][1],
				// 			center: true
				// 		});
				// 		this.isPassOk = false
				// 		break
				// 	}else {
				// 		this.isPassOk = true
				// 	}
				// }
				
				if(this.isPassOk) {
					this.c_loadingShow()
					this.wa_showActBox({isShow: false, id: ''})
					this.wa_toChangeActObj({
						cityArr: [{shortName: '暂无安排', id: 0}],
						spotArr: [],
						isActive: true,
						index: 1,
						chageType: 1
					})
					this.wa_setSpotMap([])
					let tags = []
					this.tagList.map(item => item.isSelect && tags.push(item.text))
					this.wa_getActInfo({
						actInfo: {
							actName: this.actName,
							actTime: this.actTime,
							gatherPoint: this.gatherPoint,
							gatherTime: this.gatherTime,
							startCity: this.startCity,
							endCity: this.endCity,
							peopleMax: this.peopleMax || '不限',
							carMax: this.carMax || '不限',
							adultPrice: this.adultPrice || 0,
							childPrice: this.childPrice || 0,
							tags: tags.join(',')
						},
						lineInfo: this.lineInfo
					})
					setTimeout(() => {
						this.$router.push({
							path: '/openAct'
						})
					}, 600);
				}
			},
			getLineInfo() {
				const $this = this
				this.$api.ajax({
					url: `${this.c_userVal == 'admin'? config.lineDetail: config.userLineDetail}/${this.wa_isShowActBox.id}`,
					headers: {
						'Content-Type':'application/x-www-form-urlencoded',
						'API-User-Token': $this.c_userInfo.token
					},
					success: (res) => {
						if(res.code == 0) {
							this.lineInfo = res.data
							this.actName = res.data.title
							let tags = res.data.tags.split(',')
							this.tagList.map((v, i) => {
								tags.map((val, ind) => {
									if(v.text == val) {
										v.isSelected = true
									}
								})
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
					        message: '线路信息获取失败',
					        center: true
					    });
					}
				})
			}
		},
		created() {
			if(this.wa_isShowActBox.id != '') {
				this.getLineInfo()
			}
		},
		mounted() {
			this.getLineTags()
		}
	}
</script>

<style scoped>
	.toStartActBox {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 1000;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: rgba(0,0,0,0.29);
	}
	.contentBox {
		width: 700px;
		height:  auto;
		border-radius: 6px;
		overflow: hidden;
	} 
	.contentBoxTop {
		width: 100%;
		height:  auto;
		background: #FFDA4C;
		padding: 30px 80px 20px;
	}
	.contentTitle {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 30px;
		font-size: 32px;
		color: #FFFFFF;
		font-weight: 500;
	}
	.contentTitle>b {
		display: block;
		width: 40px;
		height: 35px;
		background: url('../../assets/img/activity_icon.png') no-repeat center;
		background-size: 100%;
		margin-right: 20px;
	}
	.contentTitle>span {
		font-size: 32px;
		color: #FFFFFF;
	}
	.itemActInfo {
		width: 100%;
		font-size: 20px;
		color: #FFFFFF;
		padding: 12px 0 15px;
		border-bottom: 1px solid #fff;
		display: flex;
		align-items: center;
	}
	.itemInfoName {
		display: block;
		margin-right: 20px;
		width: 80px;
		font-size: 20px;
		color: #FFFFFF;
	}
	.itemInfoInp_1 {
		flex: 1;
		display: block;
		font-size: 20px;
		color: #FFFFFF;
		background: #FFDA4C;
	}
	.itemInfoSelectTxt {
		flex: 1;
	}
	.dateSelectIcon {
		display: block;
		width: 25px;
		height: 25px;
		background: url('../../assets/img/date_select_icon.png') no-repeat center;
		background-size: 100%;
		overflow: hidden;
	}
	.dateSelectIcon:hover {
		cursor: pointer;
	}
	.itemMoreInfo {
		width: 270px;
		height: 100%;
		display: flex;
		align-items: center;
	}
	.itemMoreInfo:first-child {
		padding-right: 15px;
		border-right: 1px solid #fff;
	}
	.itemMoreInfo:nth-child(2) {
		padding-left: 15px;
	}
	.itemInfoInp_2 {
		font-size: 20px;
		color: #FFFFFF;
		background: #FFDA4C;
		width: 150px;
	}
	.actCostShow {
		display: flex;
	}
	.actCostShow>div {
		display: block;
		margin-right: 25px;
		display: flex;
	}
	.actCostShow>div input {
		display: inline-block;
		width: 80px;
		font-size: 20px;
		color: #FFFFFF;
		background: #FFDA4C;
		padding: 0 10px;
	}
	.showTatList {
		margin-top: 15px;
		display: flex;
		flex-wrap: wrap;
	}
	.itemShowTag {
		padding: 1px 19px;
		border: 1px solid #FFFFFF;
		border-radius: 12.5px;
		font-size: 16px;
		color: #FFFFFF;
		margin-bottom: 10px;
		transition: all 0.2s;
	}
	.itemShowTag:hover {
		cursor: pointer;
	}
	.itemShowTag:not(:last-child) {
		margin-right: 10px;
	}
	.itemShowTag.selectTag {
		background-color: #fff;
		color: #FFDA4C;
	}
	.contentBoxBottom {
		height: 100px;
		width: 100%;
		display: flex;
		background-color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.contentBoxBottom>div {
		font-size: 18px;
		color: #FFFFFF;
		padding: 10px 60px;
		background: #FFDA4C;
		border-radius: 4px;
	}
	.contentBoxBottom>div:hover {
		cursor: pointer;
	}
</style>