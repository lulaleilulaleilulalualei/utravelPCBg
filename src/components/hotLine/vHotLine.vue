<template>
	<div class="hotLine">
		<div class="lineTopCut">
			<div class="lineCutLeft">
				<div class="writeImg" @click="writeLine">
					<img src="../../assets/img/writeLine.png" alt="">
				</div>
				<div class="writeText">
					<h4 @click="writeLine">制作线路</h4>
					<div>
						<span :class="[{hasSelect: vhl_lineType == 1}]" @click.stop="loadDraft">草稿箱</span>
					</div>
				</div>
			</div>
			<div class="lineCutRight">
				<div class="selectArea cityIcon" @click="selectArea">
					<span class="cityIcon">{{cityName}}</span>
					<b class="cityIcon"></b>
				</div>
				<lineCutType></lineCutType>
			</div>
			<transition name="slideFade">
				<cityList v-if="c_cityObj.isShow"
						@getCityName="getCityName"></cityList>
			</transition>
		</div>

		<vHotLineContent v-if="vhl_lineType !== 1"
						:cityVal="cityName"></vHotLineContent>
		<draftBox v-else :draftType="draftType"></draftBox>
		
	</div>
</template>

<script>
	import draftBox from '../common/draftBox.vue'
	import lineCutType from '../common/lineCutType.vue'
	import vHotLineContent from './vHotLineContent.vue'
	import cityList from '../common/cityList.vue'
	import { mapGetters , mapActions } from 'vuex';

	export default {
		data() {
			return {
				draftType: 'line',
				cityName: '选择区域'
			}
		},
		components: {draftBox, lineCutType, vHotLineContent, cityList},
		computed: {
			...mapGetters([
				'c_loadingVal',
				'c_userVal',
				'c_cityObj',
				'vhl_lineType'
				])
		},
		watch: {
			vhl_lineType(val) {
				if(val == 1) {
					this.c_saveCityType({isShow: false})
					this.cityName = '选择区域'
				}
			}
		},
		methods: {
			...mapActions([
				'vhl_showDraft',
				'c_loadingShow',
				'c_saveCityType',
				'vhl_changeTypeVal'
				]),
			getCityName(val) {
				this.cityName = val
			},
			selectArea() {
				if(this.vhl_lineType != 1) {
					if(this.c_cityObj.isShow) {
						this.c_saveCityType({isShow: false})
					}else {
						this.c_saveCityType({isShow: true})
					}
				}	
			},
			loadDraft() {
				// this.vhl_showDraft(true)
				this.vhl_changeTypeVal(1)
			},
			writeLine() {
				this.c_loadingShow()
				setTimeout(() => {
				    this.$router.push({
						path: '/writeLine'
					})
				}, 800);
			},
		},
		activated(){
			if(this.c_loadingVal) {
				this.c_loadingVal.close()
			}
		},
		created() {
			
		},
		mounted() {
			if(this.c_loadingVal) {
				this.c_loadingVal.close()
			}
		}
	}
</script>

<style scoped>
	.hotLine {
		height: 100%;
		display: flex;
		flex-direction: column;
	}
	.lineTopCut {
		padding-top: 20px;
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		position: relative;
	}
	.lineCutLeft {
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
	.writeText>div {
		display: flex;
		font-size: 15px;
		color: #9FA6AD;
		align-items: center;
	}
	.writeText>div>span {
		display: block;
		padding-bottom: 3px;
		display: flex;
		align-items: center;
		border: 2px solid transparent;
	}
	.writeText>div>span.hasSelect {
		border-bottom-color: #9FA6AD;
	}
	.writeText>div>span:hover {
		cursor: pointer;
	}
	.lineCutRight {
		display: flex;
		align-items: flex-end;
	}
	.lineCutRight>div:first-child {
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
		position: relative;
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