<template>
	<div class="addSectionTitle">
		<div class="titleArea">
			<div class="titleBox">
				<div class="titleBoxInput">
					<input type="text" v-model.trim="titleVal" autofocus="true" maxlength="10" placeholder="请输入段落标题" @keyup.enter="submitTitle">
					<span>{{titleVal.length}}/10</span>
				</div>
				<div class="titleBoxBtn" @click="submitTitle"><span>确定</span></div>
				<div class="closeBox" @click="closeBox"></div>
			</div>
		</div>
	</div>
</template>

<script>
	import { mapGetters , mapActions } from 'vuex';
	
	export default {
		data() {
			return {
				titleVal: '',
				countArr: []
			}
		},
		computed: {},
		methods: {
			...mapActions([
				'wn_showSectionBox',
				]),
			getNumber() {
				let random = this.$api.randomNum(0, 199)
				if(this.countArr.length > 0) {
					this.countArr.map((v, i) => {
						if(v == random) {
							this.getNumber()
						}else {
							this.countArr.push(random)
							return
						}
					})
				}else {
					this.countArr.push(random)
					return
				}
			},
			submitTitle() {

				// await this.getNumber()
				// let len = this.countArr.length -1

				if(this.titleVal != '') {
					this.$emit('getSectionTitle', {content: this.titleVal ,travelType: 1, placeTxt:'',isShowDelete: false, isPlay: false})
					this.wn_showSectionBox(false)
					this.titleVal = ''
				}else {
					this.$message({
			          message: '请输入段落标题',
			          type: 'error',
			          center: true
			        })
				}
			},
			closeBox() {
				this.wn_showSectionBox(false)
				this.titleVal = ''
			}
		}
	}
</script>

<style scoped>
	.addSectionTitle{
		position: fixed;
		top: 0;
		left: 0;
		z-index: 30;
		width: 100%;
		height: 100%;
		background-color: rgba(0,0,0, 0.29);
	}
	.titleArea {
		width: 1180px;
		height: 100%;
		margin: 0 auto;
		padding-left: 300px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.titleBox {
		background: #FFFFFF;
		border-radius: 7px;
		position: relative;
		width: 600px;
		height: 270px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.titleBoxInput {
		border: 1px solid #DDDEE1;
		border-radius: 100px;
		height: 60px;
		width: 460px;
		padding: 0 20px;
		display: flex;
		align-items: center;
		margin-bottom: 60px;
		overflow: hidden;
	}
	.titleBoxInput>input {
		height: 100%;
		flex: 1;
		font-size: 18px;
		color: #373A3E;
	}
	.titleBoxInput>input::-webkit-input-placeholder { /* WebKit browsers */
    	color: #9FA6AD;
	}
	.titleBoxInput>input:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
	    color: #9FA6AD;
	}
	.titleBoxInput>input::-moz-placeholder { /* Mozilla Firefox 19+ */
	    color: #9FA6AD;
	}
	.titleBoxInput>input:-ms-input-placeholder { /* Internet Explorer 10+ */
	    color: #9FA6AD;
	}
	.titleBoxInput>span {
		font-size: 14px;
		color: #9FA6AD;
		display: block;
		padding-left: 15px;
	}
	.titleBoxBtn {
		background-image: linear-gradient(129deg, #FFCA59 0%, #FF840F 100%);
		border-radius: 100px;
		font-size: 18px;
		color: #FFFFFF;
		width: 130px;
		height: 60px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.titleBoxBtn:hover {
		cursor: pointer;
	}
	.closeBox {
		position: absolute;
		top: 10px;
		right: 10px;
		width: 24px;
		height: 24px;
		background: url('../../assets/img/close.png') no-repeat center;
		background-size: 100%;
	}
	.closeBox:hover {
		cursor: pointer;
	}
</style>