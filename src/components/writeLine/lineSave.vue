<template>
	<div class="rightAside" v-if="wl_isShowSaveBtn">
		<span v-if="this.$route.query.id === undefined">{{saveTime}} 自动保存了草稿</span>
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
				'wl_isShowSaveBtn',
				'wl_isCanTellSave'
				])
		},
		watch: {
			wl_isShowSaveBtn() {
				if(this.$route.query.id === undefined) {
					if(!this.wl_isShowSaveBtn) {
						clearInterval(this.timerVal);
						this.saveTime = '00:00:00'
					}else {
						this.timerVal = setInterval(() => {
							if(this.wl_isCanTellSave) {
								this.saveTime = this.$api.timeFormat()
							}else {
								this.saveTime = '00:00:00'
							}
							this.saveCount++
							this.wl_saveCountMehod({count: this.saveCount, saveType: 2})
						}, 60*1000)
					}
				}
			}
		},
		methods: {
			...mapActions([
				'wl_saveCountMehod'
				]),
			saveDraft() {
				this.saveCount++
				this.wl_saveCountMehod({count: this.saveCount, saveType: 1})
			}
		},
		mounted() {
			if(this.$route.query.id === undefined) {
				if(!this.wl_isShowSaveBtn) {
					clearInterval(this.timerVal);
					this.saveTime = '00:00:00'
				}else {
					this.timerVal = setInterval(() => {
						if(this.wl_isCanTellSave) {
							this.saveTime = this.$api.timeFormat()
						}else {
							this.saveTime = '00:00:00'
						}
						this.saveCount++
						this.wl_saveCountMehod({count: this.saveCount, saveType: 2})
					}, 60*1000)
				}
			}
		}
	}
</script>

<style scoped>
	.rightAside {
		position: absolute;
		top: 0;
		right: -135px;
		width: 140px;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	@media screen and (max-width: 1440px) {
	    .rightAside {
	    	right: -115px;
	    }
	}
	@media screen and (max-width: 1400px) {
	    .rightAside {
	    	right: -100px;
	    }
	}
	.rightAside>span {
		display: block;
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