<template>
	<happy-scroll color="rgba(255,177,50,1)" size="2" resize style="background-color:#fff">
	<div class="personSet">
		<div class="infoChange">
			<span>头像</span>
			<div class="infoHead">
				<div><img :src="headImg" alt=""></div>
				<el-upload
				  :action= "imgUrl"
				  :headers= "imgHeader"
				  name="files"
				  :on-success="handSuccess"
				  :on-error="handError">
					<a>修改</a>
				</el-upload>
			</div>
		</div>
		<div class="infoChange">
			<span>昵称</span>
			<div class="changeName">
				<input type="text" v-model.trim="userName" placeholder="请输入您的昵称">
			</div>
		</div>
		<div class="infoChange">
			<span>性别</span>
			<div class="sexChange">
				<div class="itemSex" v-for="(item, index) in sexArr" :key="index" @click="seleceSex(index)">
					<img :src="item.isShow? item.selectedIcon: item.defaultIcon" :title="item.txt">
				</div>
			</div>
		</div>
		<div class="infoChange">
			<span>绑定手机</span>
			<div class="changePhone">
				<div class="phoneBox">
					<span v-if="starTel != ''">{{starTel}}</span>
					<span>{{starTel != ''? '已绑定': '未绑定'}}</span>
				</div>
				<a @click="changePhone">修改</a>
			</div>
		</div>
		<div class="infoChange">
			<span>出生日期</span>
			<div class="dateChange">
				<el-date-picker
			      v-model.trim="dateVal"
			      format="yyyy-MM-dd"
			      value-format="yyyy-MM-dd"
			      type="date"
			      placeholder="选择出生日期">
			    </el-date-picker>
			</div>
		</div>
		<div class="infoChange">
			<span>签名</span>
			<div class="changeSign">
				<textarea placeholder="请输入您的签名(50字以内)" maxlength="50" v-model.trim="signText"></textarea>
			</div>
		</div>
		<div class="infoChange setBottom">
			<span></span>
			<div class="setBtnBox">
				<div @click="saveUserTest">保存</div>
			</div>
		</div>
		
		<transition name="fade">
			<phoneBox v-if="c_isShowChangePhone"
					@newPhone="newPhone"
					:userTel="userTel"></phoneBox>
		</transition>
	</div>
	</happy-scroll>
</template>

<script>
	import phoneBox from './changePhone.vue'
	import { mapGetters , mapActions } from 'vuex';
	import config from '@/config'
	
	export default {
		data() {
			return {
				sexArr: [
					{
						selectedIcon: require('../../assets/img/male_2.png'),
						defaultIcon: require('../../assets/img/male_1.png'),
						txt: '男性',
						isShow: false
					},
					{
						selectedIcon: require('../../assets/img/female_2.png'),
						defaultIcon: require('../../assets/img/female_1.png'),
						txt: '女性',
						isShow: false
					}
				],
				imgUrl:'',
				imgHeader: {},
				dateVal:'',
				headImg: '',
				userName: '',
				signText: '',
				userTel: '',
				useGender: 2, //用户性别
			}
		},
		components: {phoneBox},
		computed: {
			...mapGetters([
				'c_isShowChangePhone',
				'c_loadingVal',
				'c_userInfo'
				]),
			starTel() {
				return this.userTel.replace(/^(\d{3})\d{4}(\d+)/,"$1****$2")
			}
		},
		methods: {
			...mapActions([
				'c_showChangePhone',
				'c_changeStage',
				'c_changePensonalINfo'
				]),
			seleceSex(index) {
				this.sexArr.map((v, i) => {
					if(index == i) {
						v.isShow = true
						if(v.txt == '男性') {
							this.useGender = 1
						}else if(v.txt == '女性') {
							this.useGender = 0
						}
					}else {
						v.isShow = false
					}
				})
			},
			newPhone(val) {
				this.userTel = val
				let userInfo = JSON.parse(localStorage.getItem('userInfo'))
				userInfo.tel = val
				localStorage.setItem('userInfo', JSON.stringify(userInfo))
			},
			changePhone() {
				this.c_showChangePhone(true)
				if(this.userTel != '') {
					this.getCodeNum()
				}else {
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
						tel: $this.userTel,
						timeStamp: times,
						sign: $this.$md5(`${$this.userTel}_${times}`)
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
			handSuccess(response, file, fileList) {
				if(response.code == 0) {
					this.headImg = response.data[0]
				}else {
					this.$message({
					    message: response.message,
					    type: 'error',
					    center: true
					})
				}
			},
			handError() {
				this.$message({
				    message: '头像上传失败',
				    type: 'error',
				    center: true
				})
			},
			imgDir() {
				this.imgHeader = {
					'API-User-Token': this.c_userInfo.token
				}
				this.imgUrl = `${config.uploadImg}?dir=user/header`
			},
			saveUserTest() {
				if(this.headImg != '') {
					if(this.userName != '') {
						if(this.useGender !== 2) {
							if(this.userTel != '') {
								this.saveUserInfo()
							}else {
								this.$message({
						          message: '请绑定手机号码',
						          type: 'error',
						          center: true
						        })
							}
						}else {
							this.$message({
					          message: '请选择性别',
					          type: 'error',
					          center: true
					        })
						}
					}else {
						this.$message({
				          message: '请输入昵称',
				          type: 'error',
				          center: true
				        })
					}
				}else {
					this.$message({
			          message: '请添加头像',
			          type: 'error',
			          center: true
			        })
				}
			},
			saveUserInfo() {
				const $this = this
				this.$api.ajax({
					url: config.userChangeInfo,
					method: 'PUT',
					headers: {
						'API-User-Token': $this.c_userInfo.token
					},
					data: {
						avatar: $this.headImg,
						backdrop:'',
						nickName: $this.userName,
						gender: $this.useGender,
						tel: $this.userTel,
						carNum: $this.c_userInfo.carNum,
						birthday: $this.dateVal,
						sign: $this.signText
					},
					success: (res) => {
						if(res.code == 0) {
							this.$message({
						        message: '修改成功',
						        type: 'success',
						        center: true
						    })
						    let userInfo = JSON.parse(localStorage.getItem('userInfo'))
							userInfo.avatar = this.headImg
							userInfo.nickName = this.userName
							userInfo.gender = this.useGender
							userInfo.birthday = this.dateVal
							userInfo.sign = this.signText
							localStorage.setItem('userInfo', JSON.stringify(userInfo))
							this.c_changePensonalINfo(true)
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
					        message: '修改失败',
					        type: 'error',
					        center: true
					    })
					}
				})
			}
		},
		mounted() {
			if(this.c_loadingVal) {
				this.c_loadingVal.close()
			}
			this.imgDir()
			if(!this.$api.isEmptyObject(this.c_userInfo)) {
				this.headImg = this.c_userInfo.avatar
				this.userName = this.c_userInfo.nickName
				this.sexArr.map((v, i) => {
					if(this.c_userInfo.gender == 1) {
						v.txt == '男性'? (v.isShow = true): v.isShow = false
						this.useGender = 1
					}else if(this.c_userInfo.gender === 0){
						v.txt == '女性'? (v.isShow = true): v.isShow = false
						this.useGender = 0
					}else {
						 v.isShow = false
						this.useGender = 2
					}
				})
				this.userTel = this.c_userInfo.tel
				this.dateVal = this.c_userInfo.birthday
				this.signText = this.c_userInfo.sign
			}
		}
	}
</script>

<style scoped>
	.personSet {
		padding: 30px 0 0 130px;
		height: 100%;
		flex: 1;
		background-color: #fff;
	}
	.infoChange {
		display: flex;
		align-items: center;
	}
	.infoChange:not(:last-child) {
		margin-bottom: 30px;
	}
	.infoChange>span {
		display: block;
		width: 64px;
		height: auto;
		font-size: 16px;
		color: #373A3E;
		margin-right: 60px;
	}
	.infoHead {
		display: flex;
		align-items: center;
	}
	.infoHead>div:first-child {
		width: 80px;
		height: 80px;
		margin-right: 15px;
		border-radius: 50%;
		border:1px solid #eee;
		overflow: hidden;
	}
	.infoHead a {
		display: block;
		font-size: 14px;
		color: #FFFFFF;
		padding: 4px 14px;
		background: #FFB132;
		border-radius: 100px;
	}
	.infoHead a:hover {
		cursor: pointer;
	}
	.changeName {
		width: 316px;
		height: 42px;
	}
	.changeName>input {
		width: 100%;
		height: 100%;
		border-radius: 4px;
		font-size: 16px;
		color: #373A3E;
		background: #F5F8F9;
		padding: 0 15px;
	}
	.sexChange {
		display: flex;
	}
	.itemSex {
		width: 45px;
		height: 45px;
	}
	.itemSex:hover {
		cursor: pointer;
	}
	.itemSex:not(:last-child) {
		margin-right: 20px;
	}
	.changePhone {
		display: flex;
		align-items: center;
	}
	.changePhone>a {
		display: block;
		font-size: 14px;
		color: #FFFFFF;
		padding: 4px 14px;
		background: #FFB132;
		border-radius: 100px;
	}
	.changePhone>a:hover {
		cursor: pointer;
	}
	.phoneBox {
		display: flex;
		justify-content: space-between;
		font-size: 16px;
		color: #9FA6AD;
		padding: 10px 15px;
		width: 245px;
		margin-right: 15px;
		background: #F5F8F9;
	}
	.phoneBox>span {
		display: block;
	}
	.changeSign {
		width: 460px;
		height: 140px;
		background: #F5F8F9;
		padding: 10px 15px;
	}
	.changeSign>textarea {
		width: 100%;
		height: 100%;
		font-size: 16px;
		color: #373A3E;
		resize: none;
		background: #F5F8F9;
		line-height: 24px;
	}
	.changeSign>textarea::-webkit-scrollbar {
		display: none;
	}
	.setBottom {
		margin-top: 60px;
	}
	.setBtnBox {
		width: 460px;
		display: flex;
		padding-bottom: 30px;
		justify-content: center;
	}
	.setBtnBox>div{
		width: 112px;
		height: 42px;
		border-radius: 100px;
		font-size: 16px;
		color: #FFFFFF;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.setBtnBox>div:hover {
		cursor: pointer;
	}
	.setBtnBox>div {
		background: #FFB132;
	}
	.fade-enter-active, .fade-leave-active {
	  transition: opacity .5s;
	}
	.fade-enter, .fade-leave-to {
	  opacity: 0;
	}
</style>
