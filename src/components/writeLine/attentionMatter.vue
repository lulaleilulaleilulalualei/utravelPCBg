<template>
	<div class="attentionMatter">
		<div class="textContent">
			<div class="textBox">
				<div class="textArea">
					<textarea autofocus="true" placeholder="告诉一下小伙伴旅途之中的注意事项吧～" v-model.trim="matterText"></textarea>
				</div>
				<div class="bottomBtn">
					<div @click="cancelBox">取消</div>
					<div @click="sureAddMatter">确定</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { mapGetters , mapActions } from 'vuex';
	
	export default {
		data() {
			return {
				matterText: '',
			}
		},
		computed: {
			...mapGetters([
				'wl_matterBox'
				])
		},
		watch: {

		},
		methods: {
			...mapActions([
				'wl_lineMatter'
				]),
			cancelBox() {
				this.wl_lineMatter({isShow: false, text: this.wl_matterBox.text})
			},
			sureAddMatter() {
				if(this.matterText != '') {
					this.wl_lineMatter({isShow: false, text: this.matterText})
				}else {
					this.$message({
			          message: '填写不能为空哦',
			          type: 'error',
			          center: true
			        })
				}
				
			}
		},
		mounted() {
			if(this.wl_matterBox.isShow) {
				let reg = /<\/?.+?>/g
				this.matterText = this.wl_matterBox.text.replace(reg,"\n")
			}
		}
	}
</script>

<style scoped>
	.attentionMatter {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0,0,0,0.29);
		z-index: 50;
	}
	.textContent {
		width: 1180px;
		height: 100%;
		padding-left: 300px;
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.textBox {
		width: 600px;
		height: auto;
		background: #FFFFFF;
		border-radius: 7px;
		padding: 15px;
	}
	.textArea {
		width: 100%;
		height: 350px;
		border: 1px solid #DDDEE1;
		border-radius: 4px;
		margin-bottom: 30px;
		padding: 15px;
	}
	.textArea>textarea {
		width: 100%;
		height: 100%;
		font-size: 16px;
		color: #373A3E;
		resize: none;
	}
	.textArea>textarea::-webkit-scrollbar {
		display: none;
	}
	.bottomBtn {
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}
	.bottomBtn>div {
		height: 42px;
		width: 112px;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 16px;
		color: #FFFFFF;
		border-radius: 100px;
	}
	.bottomBtn>div:hover {
		cursor: pointer;
	}
	.bottomBtn>div:first-child {
		background: #DDDEE1;
		margin-right: 10px;
	}
	.bottomBtn>div:nth-child(2) {
		background: #FFB132;
	}
</style>