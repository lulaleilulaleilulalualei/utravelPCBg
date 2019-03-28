<template>
	<div class="infoReply">
		<div class="replayArea">
			<div class="replayBox">
				<div class="userInfo">
					<div class="userInfoLeft">
						<img :src="c_isShowReplyBox.data.avatar"alt="">
					</div>
					<div class="userInfoRight">
						<h4>{{c_isShowReplyBox.data.nickName}}</h4>
						<p>{{c_isShowReplyBox.data.msg}}</p>
					</div>
				</div>
				<div class="replyTextBox">
					<el-input
						  type="textarea" 
						  :autosize="{ minRows: 4}"
						  v-model.trim="replayTxt"
						  :autofocus="true"
						  placeholder="请输入回复信息"
						  resize="none">
					</el-input>
				</div>
				<div class="replyBottomBtn">
					<div @click="closeBox">取消</div>
					<div @click="replySure">回复</div>
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
				replayTxt: ''
			}
		},
		computed: {
			...mapGetters([
				'c_userInfo',
				'c_isShowReplyBox'
				])
		},
		methods: {
			...mapActions([
				'c_showReplyBox'
				]),
			closeBox() {
				this.c_showReplyBox({data: '', isShow: false})
			},
			replySure() {
				if(this.replayTxt != '') {
					this.replyInfo()
				}else {
					this.$message({
					    type: 'error',
					    message: '请输入回复内容',
					    center: true
					});
				}
			},
			replyInfo() {
				const $this = this
		    	this.$api.ajax({
		    		url: config.replyInfo,
		    		method: 'POST',
		    		headers: {
						// 'Content-Type':'application/x-www-form-urlencoded',
						'API-User-Token': $this.c_userInfo.token
					},
					data: {
						msg: $this.replayTxt,
						touid: $this.c_isShowReplyBox.data.uid,
					},
					success: (res) => {
						if(res.code == 0) {
							this.$message({
						        type: 'success',
						        message: '回复成功',
						        center: true
						    });
						   	this.c_showReplyBox({data: '', isShow: false})
						}else {
							this.$message({
						        type: 'error',
						        message: res.message,
						        center: true
						    });
						}
					},
					error: () => {
						this.$message({
					        type: 'error',
					        message: '回复失败',
					        center: true
					    });
					}
		    	})
			}
		}
	}
</script>

<style scoped>
	.infoReply {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 30;
		background: rgba(0, 0, 0, 0.29);
	}
	.replayArea {
		width: 1180px;
		height: 100%;
		margin: 0 auto;
		padding-left: 300px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.replayBox {
		width: 600px;
		height: auto;
		background: #FFFFFF;
		border-radius: 7px;
		padding: 30px 15px; 
	}
	.userInfo {
		display: flex;
		margin-bottom: 15px;
	}
	.userInfoLeft {
		width: 48px;
		height: 48px;
		border-radius: 50%;
		border: 1px solid #efefef;
		overflow: hidden;
		margin-right: 15px;
	}
	.userInfoRight {
		flex: 1;
	}
	.userInfoRight>h4 {
		font-size: 14px;
		color: #373A3E;
		font-weight: normal;
		margin-bottom: 5px;
	}
	.userInfoRight>p {
		font-size: 14px;
		color: #9FA6AD;
	}
	.replyTextBox {
		margin-bottom: 15px;
		width: 100%;
		height: auto;
	}
	.replyBottomBtn {
		width: 100%;
		height: auto;
		display: flex;
		justify-content: flex-end;
	}
	.replyBottomBtn>div {
		border-radius: 100px;
		padding: 10px 40px;
		font-size: 16px;
		color: #FFFFFF;
	}
	.replyBottomBtn>div:hover {
		cursor: pointer;
	}
	.replyBottomBtn>div:first-child {
		background: #DDDEE1;
		margin-right: 10px;
	}
	.replyBottomBtn>div {
		background: #FFB132;
	}
</style>