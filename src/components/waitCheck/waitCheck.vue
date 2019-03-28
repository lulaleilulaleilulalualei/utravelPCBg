<template>
	<div class="waitCheck">
		<div class="checkCut">
			<div :class="[{itemActivity: item.isShow},'itemCut']" v-for="(item, index) in cutArr" :key="index" @click="checkCut(index)">
				<img :src="item.isShow? item.selectedIcon: item.defaultIcon" alt="">
				<span>{{item.txt}}</span>
			</div>
		</div>
		<lineBox v-if="showNum == 1" :signNum="showNum" key="travelNote"></lineBox>
		<lineBox v-if="showNum == 2" :signNum="showNum" key="travelLine"></lineBox>
		<videoList v-if="showNum == 3" key="travelVideo"></videoList>
		<spotList v-if="showNum == 4" :signNum="showNum" key="travelSpot"></spotList>

		<transition name="fade">
			<selfPoint v-if="wl_isShowSelf"></selfPoint>
		</transition>

		<transition name="fade">
			<rejectBox v-if="wc_isShowRejectBox.isShow"></rejectBox>
		</transition>
	</div>
</template>

<script>
	import lineBox from '../hotNotes/noteList.vue'
	import spotList from '../spotList/spotList.vue'
	import videoList from './videoList.vue'
	import selfPoint from '../writeLine/selfPoint.vue'
	import rejectBox from './rejectBox.vue'
	import { mapGetters , mapActions } from 'vuex';
	
	export default {
		data() {
			return {
				cutArr: [
					{
						defaultIcon: require('../../assets/img/my_notes_icon_2.png'),
						selectedIcon: require('../../assets/img/my_notes_icon_1.png'),
						txt: '游记',
						txtSign: 'note',
						isShow: true
					},
					{
						defaultIcon: require('../../assets/img/hot_line_icon_2.png'),
						selectedIcon: require('../../assets/img/hot_line_icon_1.png'),
						txt: '线路',
						txtSign: 'line',
						isShow: false
					},
					{
						defaultIcon: require('../../assets/img/check_video_2.png'),
						selectedIcon: require('../../assets/img/check_video_1.png'),
						txt: '视频',
						txtSign: 'video',
						isShow: false
					},
					{
						defaultIcon: require('../../assets/img/point_icon_2.png'),
						selectedIcon: require('../../assets/img/point_icon_1.png'),
						txt: '景点',
						txtSign: 'spot',
						isShow: false
					},
				],
				showNum: 1
			}
		},
		computed: {
			...mapGetters([
				'wl_isShowSelf',
				'wc_isShowRejectBox',
				'c_loadingVal'
				])
		},
		components: {lineBox, spotList, videoList, selfPoint, rejectBox},
		activated(){
			if(this.c_loadingVal) {
				this.c_loadingVal.close()
			}
		},
		methods: {
			...mapActions([
				'wc_clearSearch'
				]),
			checkCut(index) {
				this.cutArr.map((v, i) => {
					if(index == i) {
						v.isShow = true
						if(v.txtSign == 'note') {
							this.showNum = 1
						}else if(v.txtSign == 'line'){
							this.showNum = 2
						}else if(v.txtSign == 'video') {
							this.showNum = 3
						}else if(v.txtSign == 'spot') {
							this.showNum = 4
						}
						this.wc_clearSearch(true)
					}else {
						v.isShow = false
					}
				})
			}
		}
	}
</script>

<style scoped>
	.waitCheck {
		padding-top: 20px;
		position: relative;
		display: flex;
		flex-direction: column;
		height: 100%;
		overflow: hidden;
	}
	.checkCut {
		display: flex;
	}
	.itemCut {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 96px;
		height: 47px;
		border: 2px solid #DDDEE1;
		box-shadow: 0 0 14px 0 #ECEDF1;
		font-size: 15px;
		color: #A9AFB6;
		border-radius: 6px;
		transition: all 0.2s;
	}
	.itemCut:hover {
		cursor: pointer;
	}
	.itemCut>img {
		height: auto;
		width: auto;
		margin-right: 5px;
	}
	.itemCut:not(:last-child) {
		margin-right: 10px;
	}
	.itemCut.itemActivity {
		background-color: #fff;
		border-color: transparent;
		color: #373A3E;
	}

	.fade-enter-active, .fade-leave-active {
	  transition: opacity .5s;
	}
	.fade-enter, .fade-leave-to {
	  opacity: 0;
	}
</style>