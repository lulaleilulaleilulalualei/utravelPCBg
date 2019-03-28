<template>
	<div class="login" :style="{height: heightVal}">
		 <div class="loginBox">
		 	<div class="loginBoxBg"><img src="../assets/img/loginBG.png" alt=""></div>
			<div class="loginContent">
				<div class="loginMain">
					<transition-group name="slideFade">
					<div class="loginCode" v-show="loginType == 1" key="codeLogin">
						<span>扫码登录</span>
						<div class="loginCodeBox">
							<div id="login_container"></div>
						</div>
						<div class="phoneIcon">
							<div>
								<img src="../assets/img/ios-icon.png" alt="">
								<span>iOS</span>
							</div>
							<div>
								<img src="../assets/img/android-icon.png" alt="">
								<span>Android</span>
							</div>
						</div>
					</div>
					<div class="loginPhoneInput" v-show="loginType == 2" key="phoneLogin">
						<span>手机号码登录：</span>
						<div class="phoneForm">
							<span>已绑定手机用户可直接使用手机号码登录</span>
							<div class="inputphone">
								<input type="text" @blur="phoneBlur" @keyup.enter="jumpToMain" class="shadowBox" v-model.trim="phoneVal" placeholder="请输入手机号码">
							</div>
							<div class="getNumCode">
								<div class="getCodeVal"><input type="text" class="shadowBox" @blur="codeBlur" @keyup.enter="jumpToMain" v-model.trim="phoneCode" placeholder="请输入验证码"></div>
								<div :class="[{waitCode :isWait}, 'getCodeBtn']" @click="getNumCode"><span>{{codeText}}</span></div>
							</div>
							<div class="loginBtn" @click="jumpToMain" ><span>登录</span></div>
						</div>
						<div class="otherLoginType">
							<span>其他登录方式：</span>
							<div class="itemLoginType" @click="appEnter">
								<img src="../assets/img/small_logo.png" alt="">
							</div>
						</div>
					</div>
					</transition-group>


					<!-- <div class="cutLoginType" >
						<div class="cutIcon">
							<div class="cutIconBg"></div>
							<div class="cutIconImg">
								<img :src="loginType == 1? phoneIcon: codeIcon" alt="">
							</div>
						</div>
						<div class="cutIconLine" :style="{transform: lineTranslate}">
							<img src="../assets/img/cutLoginType.png" alt="">
						</div>	
					</div> -->

					<div class="selectLoginType" @click="cutLoginType">
						<div class="toPhoneLogin" v-if="loginType == 1"><b></b><span>手机号</span></div>
						<div class="toCodeLogin" v-else><b></b><span>扫码</span></div>
					</div>
				</div>
			</div>
		 </div>
		
		<transition name="fade">
			<qrCode v-if="l_isCodeShow"></qrCode>
		</transition>
	</div>
</template>

<script>
	import { mapGetters , mapActions } from 'vuex';
	import qrCode from './login/qrCode'
	import config from '@/config'

	export default {
		data() {
			return {
				heightVal: '',
				phoneVal: '',
				phoneCode: '',
				codeText: '获取验证码',
				isWait: false,
				loginType: 1, 
				lineTranslate: 'translate3d(0,0,0)',
				phoneIcon: require('../assets/img/small_phone_icon.png'),
				codeIcon: require('../assets/img/small_code_cut.png')
			}
		},
		components:{qrCode},
		computed: {
			...mapGetters([
				'l_isPhoneTest',
				'l_isCodeTest',
				'l_isCodeShow'
			])
		},
		methods: {
			...mapActions([
				'l_phoneTest',
				'l_codeTest',
				'l_codeShow',
				'c_loadingShow',
				'c_userGrade',
				]),
			cutLoginType() {
				if(this.loginType == 1) {
					this.loginType = 2
				}else {
					this.loginType = 1
				}
				// this.lineTranslate = 'translate3d(0,10px,0)'
				// setTimeout(() => {
				// 	this.lineTranslate = 'translate3d(0,0,0)'
				// }, 200)
			},
			appEnter() {
				this.l_codeShow(true)
			},
			phoneBlur() {
				this.l_phoneTest(this.phoneVal)
				if(this.phoneVal != '') {
					if(!this.l_isPhoneTest) {
						this.$message ({
							message: '请输入正确的手机号码',
							type: 'error',
							center: true
						});
					}
				}	
			},
			codeBlur() {
				this.l_codeTest(this.phoneCode)
				if(this.phoneCode != '') {
					if(!this.l_isCodeTest) {
						this.$message({
							message: '验证码格式不正确',
							type: 'error',
							center: true
						});
					}
				}
				
 			},
			getNumCode() {
				if(this.l_isPhoneTest) {
					if(!this.isWait) {
						this.$api.countDown((txt, status) => {
							this.codeText = txt
							this.isWait = status
						})
						const $this = this
						let times = new Date().getTime()
						this.$api.ajax({
							method: "POST",
							url: config.getCodeNum,
							headers: {
						  		'Content-Type':'application/x-www-form-urlencoded'
							},
							params: { 
								tel: $this.phoneVal,
								timeStamp: times,
								sign: $this.$md5(`${$this.phoneVal}_${times}`)
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
					}
				}else {
					this.$message({
						message: '请输入正确的手机号码',
						type: 'error',
						center: true
					});
				}
			},
			jumpToMain() {
				this.l_phoneTest(this.phoneVal)
				this.l_codeTest(this.phoneCode)
				if(this.l_isPhoneTest && this.l_isCodeTest) {
					const $this = this
					this.$api.ajax({
						method: "POST",
						url: config.phoneLogin,
						headers: {
						  	'Content-Type':'application/x-www-form-urlencoded'
						},
						params: {phone: $this.phoneVal, code: $this.phoneCode},
						success:(res) => {
							if(res.code == 0) {
								this.$message({
						          message: '登录成功',
						          type: 'success',
						          center: true
						        });
								 this.c_loadingShow()
								 let times = new Date().getTime()
								 if(res.data.role == '1') {
								 	localStorage.setItem('userGrade', JSON.stringify({times: times, userVal: 'admin'}))
								 	this.c_userGrade('admin')
								 }else if(res.data.role == '2') {
								 	localStorage.setItem('userGrade', JSON.stringify({times: times, userVal: 'user'}))
								 	this.c_userGrade('user')
								 }
								 localStorage.setItem('userInfo', JSON.stringify(res.data))
								 localStorage.setItem('loginType', 1)
								 setTimeout(() => {
								 	this.$router.push({
										path: '/activityList',
									})
								 }, 600)
							}else {
								this.$message({
									message: res.message,
									type: 'error',
									center: true
								});
							}
						},
						error: (err) => {
							// console.log(err)
							this.$message({
								message: '登录失败',
								type: 'error',
								center: true
							});
						}
					})

				}else {
					this.$message({
						message: '您输入的手机号码或者验证码错误',
						type: 'error',
						center: true
					});
				}
			},
			wxLogin() {
				let state = 'utravel_pc_user_' + new Date().getTime()
				sessionStorage.setItem('stateVal', state)
				localStorage.setItem('loginType', 0)
				let obj = new WxLogin({
                        id: "login_container",    //div的id
                        appid: "wx10f142ec42892bd6", //wx0663342ad6cf85ad 测试的appid  正式的appid wx10f142ec42892bd6
                        scope: "snsapi_login",
                        redirect_uri: 'http%3a%2f%2fapi.ulvjia.com%2fadmin%2fweb%2fwxLogin', //回调地址
                        state: state,
                        style: "white",
                        href: "https://pc.ulvjia.com/static/css/weixin.css",
                });
			}
		},
		created: function() {
			this.heightVal = `${window.innerHeight}px`
		},
		mounted: function() {
			setTimeout(() => {
				this.wxLogin()
				let loginType = localStorage.getItem('loginType'),
		  		state = sessionStorage.getItem('stateVal')
			}, 500)
		}
	}
</script>

<style scoped>
	.login {
		width: 100%;
		background: url('../assets/img/logo_bg.png') no-repeat center;
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.loginBox {
		width: 400px;
		height: 400px;
		background: rgba(255,255,255,0.10);
		position: relative;
		border-radius: 6px;
		overflow: hidden;
	}
	.loginBoxBg {
		width: 100%;
		height: 100%;
		position: absolute;
		z-index: 1;
		background-color: rgba(255,255,255,0.9);
	}
	.loginContent {
		position: absolute;
		z-index: 10;
		width: 100%;
		height: 100%;
	}
	.loginMain {
		height: 100%;
		width: 100%;
		display: flex;
		overflow: hidden;
		position: relative; 
	}
	.loginCode {
		width: 400px;
		height: 100%;
		padding: 20px 30px 30px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		position: relative;
		overflow: hidden;
	}
	.loginCode>span {
		display: block;
		font-size: 18px;
		color: #FFFFFF;
	}
	.loginCodeBox {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.loginCodeBox>span {
		font-size: 14px;
		color: #FFFFFF;
	}
	#login_container {
		overflow: hidden;
		width: 100%;
		height: 240px;
		display: flex;
		justify-content: center;
	}
	.phoneIcon {
		font-size: 14px;
		color: #FFFFFF;
		display: flex;
		align-items: center; 
		justify-content: flex-end;
	}
	.phoneIcon>div {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.phoneIcon>div:first-child {
		margin-right: 30px;
	}
	.phoneIcon>div:first-child>img {
		display: block;
		width: 18px;
		height: 20px;
		margin-right: 15px;
	}
	.phoneIcon>div:nth-child(2)>img{
		display: block;
		width: 16px;
		height: 18px;
		margin-right: 10px;
	}
	.cutLoginType {
		position: absolute;
		top: 0;
		right: 30px;
		height: auto;
		width: auto;
	}
	.cutLoginType:hover {
		cursor: pointer;
	}
	.cutIcon {
		position: relative;
	}
	.cutIconBg {
		position: relative;
		top: -18px;
		z-index: 10;
		width: 36px;
		height: 36px;
		background-color: #fff;
		transform: rotate(45deg);
	}
	.cutIconImg {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 20;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: flex-start;
		justify-content: center;
	}
	.cutIconImg>img {
		width: auto;
		height: auto;
		position: relative;
		top: 3px;
	}
	.cutIconLine {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: flex-start;
		justify-content: center;
		transition-duration: 200ms;
	}
	.cutIconLine>img {
		width: auto;
		height: auto;
	}
	.loginPhoneInput {
		color: #fff;
		width: 400px;
		height: 100%;
		overflow: hidden;
		padding: 20px 30px 30px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	.loginPhoneInput>span {
		display: block;
		font-size: 18px;
	}
	.phoneForm {
		font-size: 16px;
		color: #fff;
	}
	.phoneForm>span {
		display: block;
		font-size: 14px;
		margin-bottom: 20px;
	}
	.inputphone {
		width: 100%;
		height: 42px;
		border: 1px solid #FFFFFF;
		border-radius: 4px;
		margin-bottom: 20px;
	}
	.getNumCode {
		display: flex;
		justify-content: space-between;
		margin-bottom: 20px;
	}
	.getCodeVal {
		width: 204px;
		height: 42px;
		border: 1px solid #FFFFFF;
		border-radius: 4px;
	}
	.getCodeBtn {
		width: 126px;
		height: 42px;
		background-color: #FFB132;
		border-radius: 4px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.getCodeBtn:hover {
		cursor: pointer;
	}
	.getCodeBtn.waitCode {
		background-color: #DDDEE1;
	}
	.phoneForm input {
		background-color: transparent;
		display: block;
		width: 100%;
		height: 100%;
		padding: 0 15px;
		font-size: 16px;
		color: #fff;
	}
	.phoneForm input::-webkit-input-placeholder { /* WebKit browsers */
    	color: #fff;
	}
	.phoneForm input:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
	    color: #fff;
	}
	.phoneForm input::-moz-placeholder { /* Mozilla Firefox 19+ */
	    color: #fff;
	}
	.phoneForm input:-ms-input-placeholder { /* Internet Explorer 10+ */
	    color: #fff;
	}
	.loginBtn {
		width: 100%;
		height: 42px;
		font-size: 18px;
		background-color: #FFB132;
		border-radius: 4px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.loginBtn:hover {
		cursor: pointer;
	}

	.otherLoginType {
		display: flex;
		align-items: center;
	}
	.otherLoginType>span {
		font-size: 14px;
		color: #DDDEE1;
		display: block;
		margin-right: 5px;
	}
	.itemLoginType {
		width: 22px;
		height: 22px;
	}
	.itemLoginType:hover {
		cursor: pointer;
	}

	.selectLoginType {
		position: absolute;
		top: 20px;
		right: 0;
		width: 76px;
		height: 30px;
		padding-left: 15px;
		border-top-left-radius: 15px;
		border-bottom-left-radius: 15px;
		overflow: hidden;
		background-color: #fff;
	}
	.selectLoginType:hover {
		cursor: pointer;
	}
	.selectLoginType>div {
		height: 100%;
		display: flex;
		align-items: center;
		font-size: 12px;
		color: #A2A6A9;
	}
	.toPhoneLogin>b {
		display: block;
		width: 12px;
		height: 18px;
		background: url('../assets/img/phone_icon.png') no-repeat center;
		background-size: 100%;
		margin-right: 5px;
	}
	.toCodeLogin>b {
		width: 20px;
		height: 16px;
		background: url('../assets/img/wx-icon.png') no-repeat center;
		background-size: 100%;
		margin-right: 5px;
	}

	.slideFade-enter-active {
	  transition: all .3s ease-out;
	}
	.slideFade-enter,.slideFade-leave-to {
		transform: translateY(400px);
	}
</style>