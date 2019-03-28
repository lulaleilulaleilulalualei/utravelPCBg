<template>
	<div class="putOpinion">
		<div class="opinionArea">
			<div class="opinionBox">
				<h3>意见反馈</h3>
				<span>我们将为您不断改进</span>
				<div class="textBox">
					<el-input
						type="textarea"
						:autosize="{ minRows: 6}"
						v-model.trim="opinionTxt"
						resize="none"
						placeholder="请详细描述您的问题和建议，抱歉我们无法逐一回复，但我们会认真阅读并改进，对于您给予的帮助和支持，深表感谢(300字以内)"
						:max="300">
					</el-input>
				</div>
				<div class="boxBtn">
					<div @click="closeBox">取消</div>
					<div @click="submitInfo">提交</div>
				</div>
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
				opinionTxt: ''
			}
		},
		computed: {
			...mapGetters([
				'c_userInfo'
				])
		},
		methods: {
			...mapActions([
				'c_opinionBox'
				]),
			closeBox() {
				this.c_opinionBox(false)
			},
			submitInfo() {
				if(this.opinionTxt != '') {
					this.toApplyOfficial()
				}else {
					this.$message({
					    type: 'error',
					    message: '意见不能为空',
					    center: true
					});
				}
				
			},
			toApplyOfficial() {
				const $this = this
		    	this.$api.ajax({
		    		url: config.userInfoApply,
		    		method: "POST",
		    		headers: {
						'API-User-Token': $this.c_userInfo.token
					},
					data: {
						msg: $this.opinionTxt
					},
					success: (res) => {
						if(res.code == 0) {
							this.$message({
						        type: 'success',
						        message: '提交成功',
						        center: true
						    });
						    this.c_opinionBox(false)
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
					        message: '提交失败',
					        center: true
					    });
					}
		    	})
			}
		}
	}
</script>

<style scoped>
	.putOpinion {
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		z-index: 50;
		background-color: rgba(0,0,0,0.29);
	}
	.opinionArea {
		width: 1180px;
		height: 100%;
		padding-left: 300px;
		margin: 0 auto;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.opinionBox {
		background: #FFFFFF;
		border-radius: 7px;
		width: 600px;
		height: auto;
		padding: 30px 15px;
	}
	.opinionBox>h3 {
		font-size: 24px;
		color: #FFB132;
		margin-bottom: 5px;
	}
	.opinionBox>span {
		display: block;
		font-size: 14px;
		color: #929292;
		margin-bottom: 15px;
	}
	.textBox {
		width: 100%;
		height: auto;
		margin-bottom: 15px;
	}
	.textBox>textarea {
		font-size: 16px;
		color: #373A3E;
		padding: 10px 15px;
		width: 100%;
		height: 100%;
		resize: none;
		border: 1px solid #DDDEE1;
		border-radius: 4px;
		font-weight: 500;
	}
	.textBox>textarea::-webkit-scrollbar {
		display: none;
	}
	.boxBtn {
		width: 100%;
		height: auto;
		display: flex;
		justify-content: flex-end;
	}
	.boxBtn>div {
		border-radius: 100px;
		padding: 10px 40px;
		font-size: 16px;
		color: #FFFFFF;
	}
	.boxBtn>div:hover {
		cursor: pointer;
	}
	.boxBtn>div:first-child {
		background: #DDDEE1;
		margin-right: 10px;
	}
	.boxBtn>div {
		background: #FFB132;
	}
</style>