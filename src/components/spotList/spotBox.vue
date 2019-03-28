<template>
	<div class="spotBox">
		<div class="spotTopCut">
			<div class="spotCutLeft">
				<div class="writeImg" @click="addSpot">
					<img src="../../assets/img/writeLine.png" alt="">
				</div>
				<div class="writeText">
					<h4 @click="addSpot">新增景点</h4>
				</div>
			</div>
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
		<spotList :cityVal="cityName"></spotList>
	</div>
</template>

<script>
	import cityList from '../common/cityList.vue'
	import spotList from './spotList.vue'
	import { mapGetters , mapActions } from 'vuex';
	import config from '@/config'

	export default {
		data() {
			return {
				cityName: '选择区域'
			}
		},
		components: {cityList, spotList},
		computed: {
			...mapGetters([
				'c_loadingVal',
				'c_cityObj'
				])
		},
		methods: {
			...mapActions([
				'c_loadingShow',
				'c_saveCityType'
				]),
			getCityName(val) {
				this.cityName = val
			},
			addSpot() {
				this.c_loadingShow()
				setTimeout(() => {
				    this.$router.push({
						path: '/addEditSpot',
						query: {
							type: 'add'
						}
					})
				}, 600);
			},
			selectArea() {
				if(this.c_cityObj.isShow) {
					this.c_saveCityType({isShow: false})
				}else {
					this.c_saveCityType({isShow: true})
				}
			}
		},
		activated(){
			if(this.c_loadingVal) {
				this.c_loadingVal.close()
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
	.spotBox {
		height: 100%;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}
	.spotTopCut {
		padding-top: 20px;
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		position: relative;
	}
	.spotCutLeft {
		display: flex;
		align-items: center;
	}
	.writeImg {
		width: 62px;
		height: 62px;
		box-shadow: 0 0 14px 0 rgba(255,177,50,0.40);
		border-radius: 6px;
		margin-right: 25px;
	}
	.writeImg:hover {
		cursor: pointer;
	}
	.writeText>h4 {
		font-size: 18px;
		color: #373A3E;
		font-weight: 600;
		margin-bottom: 5px;
	}
	.writeText>h4:hover {
		cursor: pointer;
		text-decoration: underline;
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
</style>