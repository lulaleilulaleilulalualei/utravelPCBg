<template>
	<div :id="`${pointInfo.title}_${index}`" class="pointShow" :key="pointInfo.id" >
		<template v-if="!isEdit">
			<h4>{{pointInfo.title}}</h4>
			<p v-html="$api.textFilter(pointInfo.desc)"></p>
			<div class="dayPointShow" v-for="(item, index) in pointInfo.nodes">
				<img :src="item.thumb" alt="">
				<div class="pointTitle">
					<b></b>
					<h4>{{item.name}}</h4>
				</div>
				<p v-html="item.desc.length>200? item.desc.substring(0, 200) + '...': item.desc"></p>
				<div class="detailPoint" @click="jumpToPointDetail(item.id)">
					<div class="detailPointName">
						<b></b>
						<span>{{item.address}}</span>
					</div>
					<div class="lookPointDetail">
						<span>查看景点详情</span>
					</div>
				</div>
				<div class="mixtureOBj" v-for="(node, ind) in item.hotelsOrfoods" v-if="node.hotelsOrfoods != 0">
					<!-- <img :src="node.thumb" alt=""> -->
					<div class="moreImgShow">
						<img v-if="$api.returnImgArr(node.pictures).length == 1" :src="node.pictures" alt="">
						<swiper v-else :options="swiperOption" ref="mySwiper">
							<swiper-slide v-for="(img, inImg) in $api.returnImgArr(node.pictures)" :key="inImg">
								<img :src="img" alt="">
							</swiper-slide>
							<div class="swiper-pagination" slot="pagination"></div>
						</swiper>
					</div>
					<div :class="node.type == 1? 'hotelIcon': 'foodsIcon'">
						<b></b>
						<h4>{{node.name}}</h4>
					</div>
					<div class="typeInfo">
						<div class="infoAddress"><b></b><span>{{node.address}}</span></div>
						<div class="infoNumber">
							<span>电话: {{node.tel}}</span>
							<span>{{node.type == 1? '标间消费': '美食消费'}}: {{node.cost}}</span>
						</div>
					</div>
					<p v-html="$api.textFilter(node.desc)"></p>
				</div>
			</div>
			<div class="planDayEdit">
				<div class="editPlan" @click.stop="aditPlanDay"><span>编辑</span></div>
				<div class="closePoint" title="删除景点" @click.stop="deletePoint"></div>
			</div>
		</template>
		<template v-if="isEdit">
			<div class="dayInput">
				<input type="text" v-model.trim="planDay">
			</div>
				<div class="planEditBox" v-loading="dayPlanAddLoaing">
					<planEdit :firstArr="pointInfo.nodes"
							:propSuggest="pointInfo.desc"
							@planDayInfo="planDayInfo"></planEdit>
				</div>
		</template>
	</div>
</template>

<script>
	import { mapGetters , mapActions } from 'vuex';
	import planEdit from './planEdit.vue'
	import { swiper, swiperSlide } from 'vue-awesome-swiper'
	
	export default {
		data() {
			return {
				isEdit: false,
				planDay: '',
				dayPlanAddLoaing: false,
				swiperOption: {
		          pagination: {
		            el: '.swiper-pagination'
		          },
		          autoplay: {
		          	disableOnInteraction: false
		          },
		          autoplayDisableOnInteraction: false,
		          loop: true
		        },
			}
		},
		props: {
			pointInfo: {
				type: Object,
				default: () => ({
					name: '',
					dec: '',
					address: '',
					img: ''
				})
			},
			index: Number
		},
		components: {planEdit, swiper, swiperSlide},
		computed: {
			...mapGetters([
				'c_isEditPlaning'
				])
		},
		watch: {
			c_isEditPlaning(val) {
				if(!val) {
					this.isEdit = false
				}
			}
		},
		methods: {
			...mapActions([
				'c_showSpotContent',
				'c_lineEditPlan',
				'wl_savePlanInfo'
				]),
			planDayInfo(val) {
				this.wl_savePlanInfo({
					index: this.index,
					title: this.planDay,
					...val
				})
			},
			aditPlanDay() {
				if(!this.c_isEditPlaning) {
					this.planDay = this.pointInfo.title
					this.dayPlanAddLoaing = true
					this.isEdit = true
					this.c_lineEditPlan(true)
					setTimeout(() => {
						this.dayPlanAddLoaing = false
					}, 200)
				}else {
					this.isEdit = false
			        this.$message({
			            type: 'info',
			            message: '您有正在编辑的日程安排!',
			            center: true
			          });
				}
			},
			deletePoint() {
				this.$emit('deletePoint', this.index)
			},
			jumpToPointDetail(id) {
				this.c_showSpotContent({id: id, isShow: true})
			}
		},
		mounted() {
			
		}
	}
</script>

<style scoped>
	.pointShow {
		background: #FFFFFF;
		box-shadow: 0 0 14px 0 #ECEDF1;
		border-radius: 4px;
		padding: 15px;
		position: relative;
	}
	.pointShow>h4 {
		font-size: 18px;
		color: #373A3E;
		margin-bottom: 10px;
		line-height: 24px;
	}
	.pointShow P {
		font-size: 16px;
		color: #373A3E;
		margin-bottom: 10px;
		line-height: 24px;
	}
	.pointShow img {
		border-radius: 6px;
	}
	.detailPoint {
		width: 100%;
		height: 40px;
		margin-top: 10px;
		background: #FFFFFF;
		box-shadow: 0 0 4px 0 #DCDCDC;
		border-radius: 4px;
		padding: 0 10px;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.detailPoint:hover {
		cursor: pointer;
	}
	.detailPointName {
		display: flex;
		align-items: center;
		font-size: 12px;
		color: #373A3E;
	}
	.detailPointName>b {
		display: block;
		width: 10px;
		height: 12px;
		background: url('../../assets/img/position_icon.png') no-repeat center;
		background-size: 100%;
		margin-right: 5px;
	}
	.detailPointName>span {
		display: block;
	}
	.lookPointDetail {
		font-size: 14px;
		color: #373A3E;
		display: flex;
		align-items: center;
	}
	.lookPointDetail>span {
		display: block;
		margin-right: 5px;
	}
	.lookPointDetail::after {
		content: '';
		display: block;
		width: 8px;
		height: 8px;
		border: 1px solid #414141;
		border-left: none;
		border-top: none;
		transform: rotate(-45deg);
	}

	.planDayEdit {
		position: absolute;
		right: 15px;
		top: 15px;
		display: flex;
		align-items: center;
	}
	.editPlan {
		display: flex;
		align-items: center;
		justify-content: center;
		background: #DDDEE1;
		border-radius: 2px;
		font-size: 14px;
		color: #FFFFFF;
		margin-right: 10px;
		height: 24px;
		width: 50px;
	}
	.editPlan:hover {
		cursor: pointer;
	}
	.closePoint {
		display: block;
		width: 24px;
		height: 24px;
		background: url('../../assets/img/close.png') no-repeat center;
		background-size: 100%;
	}
	.closePoint:hover {
		cursor: pointer;
	}

	.dayPointShow:not(:last-child) {
		margin-bottom: 20px;
	}
	.mixtureOBj {
		margin-top: 20px;
	}
	.pointTitle, .hotelIcon, .foodsIcon {
		font-size: 20px;
		color: #FFB132;
		display: flex;
		align-items: center;
		padding: 10px 0;
	}
	.pointTitle>b, .hotelIcon>b, .foodsIcon>b  {
		display: block;
		width: 28px;
		height: 28px;
		margin-right: 10px;
	}
	.pointTitle>b {
		background: url('../../assets/img/spot_icon.png') no-repeat center;
		background-size: 100%;
	}
	.hotelIcon>b {
		background: url('../../assets/img/hotel_icon.png') no-repeat center;
		background-size: 100%;
	}
	.foodsIcon>b {
		background: url('../../assets/img/cate_icon.png') no-repeat center;
		background-size: 100%;
	}
	.dayInput {
		width: 100%;
		height: 48px;
		border-bottom:1px solid #E6E6E6;
	}
	.dayInput>input {
		width: 100%;
		height: 100%;
		text-align: center;
		font-size: 20px;
		color: #9FA6AD;
	}
	.planEditBox {
		padding: 15px;
		height: auto;
		width: 100%;
	}
	.typeInfo {
		font-size: 16px;
		color: #373A3E;
		margin-bottom: 10px;
	}
	.infoAddress {
		display: flex;
		align-items: center;
		margin-bottom: 10px;
	}
	.infoAddress>b {
		display: block;
		width: 12px;
		height: 14px;
		margin-right: 5px;
		background: url('../../assets/img/position_icon.png') no-repeat center;
		background-size: 100%;
	}
	.infoNumber {
		display: flex;
		align-items: center;
		margin-bottom: 10px;
	}
	.infoNumber>span{
		flex: 1;
		display: flex;
		align-items: center;
	}
	.moreImgShow {
		width: 100%;
		height: 360px;
		overflow: hidden;
	}
	.swiper-container {
		height: 100%;
	}
</style>