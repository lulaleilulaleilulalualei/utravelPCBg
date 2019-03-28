<template>
	<div class="changePhone">
		<div class="phoneArea">
			<div class="transitionBox">
			<transition-group name="slideFade">
					<div class="oldPhoneBox" v-if="c_stageType == 1" key="oldPhone">
						<p>我们会通过短信的方式，将验证码发送至手机 {{starTel}} ，请注意查收。</p>
						<div class="getCode">
							<span>验证码:</span>
							<input type="text" placeholder="请输入验证码" v-model.trim="codeNum">
							<!-- <a @click="getCode" :class="isWait && 'waitCode'">{{codeText}}</a> -->
						</div>
						<div class="oldNext">
							<span @click="jumpToNext" :class="isHadCode && 'hadCode'">下一步</span>
						</div>
						<div class="closeBox" @click="closeBox"></div>
					</div>

					<div class="newPhoneBox" v-if="c_stageType == 2" key="newPhone">
						<div class="newPhone">
							<span>新号码:</span>
							<input type="text" placeholder="请输入新的手机号码" v-model.trim="newPhone">
							<a @click="getCode" :class="isNewWait && 'waitCode'">{{newCodeText}}</a>
						</div>
						<div class="newCode">
							<span>验证码:</span>
							<input type="text" placeholder="请输入验证码" v-model.trim="newCode">
							<a><b></b>不能与原号码相同</a>
						</div>
						<a class="phoneApply" @click="submitApply"><span>提交</span></a>
						<div class="closeBox" @click="closeBox"></div>
					</div>

					<div class="successBox" v-if="c_stageType == 3" key="successBox">
						<div class="successIcon">
							<img src="../../assets/img/changeSuccess.png" alt="">
						</div>
						<span>号码修改成功</span>
					</div>
			</transition-group>
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
				codeNum:'',
				codeText: '获取验证码',
				isWait: false,
				newCodeText: '获取验证码',
				isNewWait: false,
				newPhone: '',
				newCode: '',
				isHadCode: false,
				isNewPhone: false
			}
		},
		props: {
			userTel: [String, Array]
		},
		computed: {
			...mapGetters([
				'c_isShowChangePhone',
				'c_stageType',
				'c_userInfo'
				]),
			starTel() {
				return this.userTel.replace(/^(\d{3})\d{4}(\d+)/,"$1****$2")
			}
		},
		watch: {
			codeNum(val) {
				if(val.toString().length === 4) {
					this.isHadCode = true
				}else {
					this.isHadCode = false
				}
			}
		},
		methods: {
			...mapActions([
				'c_showChangePhone',
				'c_changeStage'
				]),
			testOldPhone() {
				const $this = this
				this.$api.ajax({
					url: `${config.userTestPhone}/${this.userTel}/${this.codeNum}`,
					headers: {
						'Content-Type':'application/x-www-form-urlencoded',
						'API-User-Token': $this.c_userInfo.token
					},
					success: (res) => {
						if(res.code == 0) {
							this.$message({
						        message: '验证通过',
						        type: 'success',
						        center: true
						    })
						    this.c_changeStage(2)
							this.isWait = false
							this.codeText = '获取验证码'
						}else {
							this.$message({
						        message: res.message,
						        type: 'error',
						        center: true
						    })
						}
					},
					error: () => {
						this.$message({
					        message: '验证失败',
					        type: 'error',
					        center: true
					    })
					}
				})
			},
			closeBox() {
				if(this.c_stageType == 2) {
					this.$confirm('您正在修改绑定手机号码，确认退出么？', '', {
			          confirmButtonText: '确定',
			          cancelButtonText: '取消',
			        }).then(() => {
			          this.c_showChangePhone(false)
			          this.c_changeStage(1)
			        }).catch(() => {
			                    
			        })
				}else {
					this.c_showChangePhone(false)
					this.c_changeStage(1)
				}
			},
			jumpToNext() {
				if(this.isHadCode) {
					this.testOldPhone()
				}
			},
			submitApply() {
				if(this.isNewPhone) {
					if(this.newCode.toString().length == 4) {
						this.testNewPhone()
					}else {
						this.$message ({
							message: '您输入的验证码格式不正确',
							type: 'error',
							center: true
						})
					}
				}else {
					this.$message ({
						message: '请输入正确的手机号码',
						type: 'error',
						center: true
					})
				}
			},
			testNewPhone() {
				const $this = this
				this.$api.ajax({
					url: config.userBindPhone,
					method: 'PUT',
					headers: {
						'Content-Type':'application/x-www-form-urlencoded',
						'API-User-Token': $this.c_userInfo.token
					},
					params: {
						tel: $this.newPhone,
						code: $this.newCode
					},
					success: (res) => {
						if(res.code == 0) {
						    this.c_changeStage(3)
						    this.$emit('newPhone', this.newPhone)
							setTimeout(() => {
								this.c_showChangePhone(false)
								this.c_changeStage(1)
							}, 1500)
						}else {
							this.$message({
						        message: res.message,
						        type: 'error',
						        center: true
						    })
						}
					},
					error: () => {
						this.$message({
					        message: '绑定失败',
					        type: 'error',
					        center: true
					    })
					}
				})
			},
			getCode() {
					if(this.c_stageType == 2) {
						if(/^\s*1[345678]\d{9}$/.test(this.newPhone)) {
							this.isNewPhone = true
							if(!this.isNewWait) {
								this.getCodeNum()
								this.$api.countDown((txt,status) => {
									this.newCodeText = txt
									this.isNewWait = status
								})
							}
						}else {
							this.$message ({
								message: '请输入正确的手机号码',
								type: 'error',
								center: true
							})
						}
					}else {
						if(!this.isWait) {
							this.$api.countDown((txt,status) => {
								this.codeText = txt
								this.isWait = status
							})
						}
					}
				if(this.userTel == '') {
					this.c_changeStage(2)
				}
			},
			getCodeNum() {
				const $this = this
				let times = new Date().getTime()
				this.$api.ajax({
					method: "POST",
					url: config.getCodeNum,
					headers: {
						'Content-Type':'application/x-www-form-urlencoded'
					},
					params: { 
						tel: $this.newPhone,
						timeStamp: times,
						sign: $this.$md5(`${$this.newPhone}_${times}`)
					},
					success: (res) => {
						if(res.code == 0) {
							this.$message({
								message: '已发送验证码',
								type: 'success',
								center: true
							});
						}else {
							this.$message({
								message: res.message,
								type: 'error',
								center: true
							});
						}
					},
					error: () => {
						this.$message({
							message: '获取验证码失败',
							type: 'error',
							center: true
						});
					}
				})
			},
		}
	}
</script>

<style scoped>
	.changePhone {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 30;
		background-color: rgba(0,0,0,0.29);
	}
	.phoneArea {
		width: 1180px;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0 auto;
		padding-left: 300px;
		overflow: hidden;
	}
	.transitionBox {
		width: 600px;
		height: 280px;
		overflow: hidden;
	}
	.oldPhoneBox {
		width: 600px;
		height: 280px;
		position: relative;
		padding: 60px 54px 0;
		background: #FFFFFF;
		border-radius: 7px;
	}
	.oldPhoneBox>p {
		font-size: 18px;
		color: #373A3E;
		margin-bottom: 30px;
	}
	.getCode {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.getCode>span, .newPhoneBox>div>span {
		display: block;
		margin-right: 10px;	
		font-size: 18px;
		color: #9FA6AD;
	}
	.getCode>input, .newPhoneBox>div>input {
		display: block;
		margin-right: 10px;
		border: 1px solid #DDDEE1;
		border-radius: 4px;
		width: 280px;
		height: 42px;
		font-size: 18px;
		color: #373A3E;
		padding: 0 15px;
	}
	.getCode>a, .newPhone>a {
		display: block;
		width: 120px;
		height: 42px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #FFB132;
		border-radius: 4px;
		font-size: 16px;
		color: #FFFFFF;
		transition: all 0.2s;
	}
	.getCode>.waitCode, .newPhone>.waitCode {
		background-color: #DDDEE1;
	}
	.getCode>a:hover, .newPhone>a {
		cursor: pointer;
	}
	.oldNext {
		width: 100%;
		height: auto;
		display: flex;
		justify-content: center;
		margin-top: 30px;
	}
	.oldNext>span {
		width: 112px;
		height: 42px;
		background: #DDDEE1;
		border-radius: 100px;
		font-size: 16px;
		color: #FFFFFF;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.oldNext>span.hadCode {
		background-color: #FFB132;
	}
	.oldNext>span.hadCode:hover {
		cursor: pointer;
	}
	.newPhoneBox {
		position: relative;
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
	.newPhoneBox {
		width: 600px;
		height: 250px;
		background: #FFFFFF;
		border-radius: 7px;
		padding: 60px 60px 0;
	}
	.newPhoneBox>div {
		display: flex;
		align-items: center;
	}
	.newPhone {
		margin-bottom: 10px;
	}
	.newCode>a {
		display: flex;
		align-items: center;
		font-size: 12px;
		color: #FF3B30;
	}
	.newCode>a>b {
		display: block;
		width: 14px;
		height: 14px;
		background: url('../../assets/img/notice_icon.png') no-repeat center;
		background-size: 100%;
		margin-right: 5px;
	}
	.phoneApply {
		display: block;
		width: 100%;
		height: auto;
		margin-top: 30px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 16px;
		color: #FFFFFF;
	}
	.phoneApply:hover {
		cursor: pointer;
	}
	.phoneApply>span {
		background: #FFB132;
		border-radius: 100px;
		width: 112px;
		height: 42px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.successBox {
		width: 600px;
		height: 250px;
		background: #FFFFFF;
		border-radius: 7px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-size: 18px;
		color: #373A3E;
		position: relative;
	}
	.successIcon {
		width: 70px;
		height: 70px;
		margin-bottom: 30px;
	}

	.slideFade-enter-active,.fade-leave-active {
	  transition: all .5s ease;
	}
	.slideFade-enter, .slideFade-leave-to {
		transform: translateX(600px);
	}
</style>