<template>
	<div class="hotNotes">
		<div class="noteTopCut">
			<div class="noteCutLeft">
				<div class="writeImg" @click="writeLine">
					<img src="../../assets/img/writeLine.png" alt="">
				</div>
				<div class="writeText">
					<h4 @click="writeLine">书写游记</h4>
					<div>
						<span :class="wn_noteType == 1 && 'hasSelect'" @click.stop="loadDraft">草稿箱</span>
					</div>
				</div>
			</div>
			<div class="noteCutRight">
				<div class="selectArea cityIcon" @click="selectArea">
					<span class="cityIcon">{{cityName}}</span>
					<b class="cityIcon"></b>
				</div>
				<noteCutType></noteCutType>
			</div>
			<transition name="slideFade">
				<cityList v-if="c_cityObj.isShow"
						@getCityName="getCityName"></cityList>
			</transition>
		</div>

		<noteList v-if="wn_noteType != 1"
				:cityVal="cityName"></noteList>
		<draftBox v-else :draftType="draftType"></draftBox>
	</div>
</template>

<script>
	import draftBox from '../common/draftBox.vue'
	import cityList from '../common/cityList.vue'
	import noteCutType from '../common/noteCutType.vue'
	import noteList from './noteList.vue'
	import { mapGetters , mapActions } from 'vuex';
	
	export default {
		data() {
			return {
				isShowCity: false,
				cityName: '选择地区',
				draftType: 'note'
			}
		},
		components: {draftBox, cityList, noteList, noteCutType},
		computed: {
			...mapGetters([
				'c_loadingVal',
				'c_cityObj',
				'wn_noteType',
				// 'c_isListUpdate'
				])
		},
		methods: {
			...mapActions([
				'c_loadingShow',
				'c_saveCityType',
				'wn_changeNoteType',
				// 'c_listUpdate'
				]),
			getCityName(val) {
				this.cityName = val
			},
			selectArea() {
				if(this.wn_noteType != 1) {
					if(this.c_cityObj.isShow) {
						this.c_saveCityType({isShow: false})
					}else {
						this.c_saveCityType({isShow: true})
					}
				}	
			},
		    loadDraft() {
		    	this.wn_changeNoteType(1)
		    },
		    writeLine() {
				this.c_loadingShow()
				setTimeout(() => {
				    this.$router.push({
						path: '/writeNote',
						query: {
							type: 'add'
						}
					})
				}, 600);
			}
		},
		activated(){
			if(this.c_loadingVal) {
				this.c_loadingVal.close()
			}
		},
		mounted() {
			this.c_saveCityType({name: '选择区域',isShow: false, isChange: false}) //默认值
		}
	}
</script>

<style scoped>
	.hotNotes {
		height: 100%;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}
	.noteTopCut {
		padding-top: 20px;
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		position: relative;
	}
	.noteCutLeft {
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
		border: 2px solid transparent;
	}
	.writeText>div>span.hasSelect {
		border-bottom-color: #9FA6AD;
	}
	.writeText>div>span:hover {
		cursor: pointer;
	}
	.writeText>div>b {
		display: block;
		height: 15px;
		width: 2px;
		background-color: #9FA6AD;
		margin: 0 5px;
	}
	.noteCutRight {
		display: flex;
		align-items: flex-end;
	}
	.noteCutRight>div:first-child {
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