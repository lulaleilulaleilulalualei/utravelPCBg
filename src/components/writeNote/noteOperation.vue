<template>
	<div class="noteOperation" v-if="wn_isShowBtn">
		<div class="noteAddBtn" @click="showAddImg">
			<img src="../../assets/img/travel_img.png" alt="">
			<span>添加图片</span>
		</div>
		<div class="noteAddBtn" @click="showSectionBox">
			<img src="../../assets/img/travel_title.png" alt="">
			<span>添加标题</span>
		</div>
		<div class="noteAddBtn" @click="showVideoBox">
			<img src="../../assets/img/travel_video.png" alt="">
			<span>添加视频</span>
		</div>
		<p v-if="this.$route.query.id === undefined">{{saveTime}} 自动保存了草稿</p>
		<div class="saveDraftBtn" @click="saveDraft">
			<b></b>
			<span>保存草稿</span>
		</div>
	</div>
</template>

<script>
	import { mapGetters , mapActions } from 'vuex';
	
	export default {
		data() {
			return {
				saveTime: '00:00:00',
				timerVal: '',
				saveCount: 0
			}
		},
		computed: {
			...mapGetters([
				'wn_isShowBtn',,
				'wn_isCanTellSave'
				])
		},
		watch: {
			wn_isShowBtn() {
				if(this.$route.query.id === undefined) {
					if(!this.wn_isShowBtn) {
						clearInterval(this.timerVal);
						this.saveTime = '00:00:00'
					}else {
						this.timerVal = setInterval(() => {
							if(this.wn_isCanTellSave) {
								this.saveTime = this.$api.timeFormat()
							}else {
								this.saveTime = '00:00:00'
							}
							this.saveCount ++
							this.wn_changeCount({count: this.saveCount, saveType: 2})
						}, 60*1000)
					}
				}
			}
		},
		methods: {
			...mapActions([
				'wn_showSectionBox',
				'wn_addImg',
				'wn_addVideo',
				'wn_changeCount'
				]),
			showAddImg() {
				this.wn_addImg(true)
			},
			showSectionBox() {
				this.wn_showSectionBox(true)
			},
			showVideoBox() {
				this.wn_addVideo(true)
			},
			saveDraft() {
				this.saveCount ++
				this.wn_changeCount({count: this.saveCount, saveType: 1})
			}
		},
		mounted() {
			if(this.$route.query.id === undefined) {
				if(!this.wn_isShowBtn) {
					clearInterval(this.timerVal);
					this.saveTime = '00:00:00'
				}else {
					this.timerVal = setInterval(() => {
						if(this.wn_isCanTellSave) {
							this.saveTime = this.$api.timeFormat()
						}else {
							this.saveTime = '00:00:00'
						}
						this.saveCount ++
						this.wn_changeCount({count: this.saveCount, saveType: 2})
					}, 60*1000)
				}
			}
		}
	}
</script>

<style scoped>
	.noteOperation {
		display: flex;
		flex-direction: column;
		position: absolute;
		right: -125px;
		top: 50%;
		margin-top: -109px;
	}
	.noteAddBtn {
		display: flex;
		align-items: center;
		font-size: 18px;
		color: #9FA6AD;
		margin-bottom: 30px;
	}
	.noteAddBtn:hover {
		cursor: pointer;
	}
	.noteAddBtn>img {
		width: 24px;
		height: 24px;
		display: block;
		margin-right: 10px;
	}
	.noteOperation>p {
		font-size: 12px;
		color: #9FA6AD;
		margin-bottom: 10px;
	}
	.saveDraftBtn {
		border: 2px solid #929292;
		border-radius: 100px;
		width: 107px;
		height: 30px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.saveDraftBtn:hover {
		cursor: pointer;
	}
	.saveDraftBtn>b {
		display: block;
		width: 12px;
		height: 14px;
		background: url('../../assets/img/saveDraft.png') no-repeat center;
		background-size: 100%;
		margin-right: 5px;
	}
	.saveDraftBtn>span {
		display: block;
		font-size: 14px;
		color: #FFB132;
	}
</style>