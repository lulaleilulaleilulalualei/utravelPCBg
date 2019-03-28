<template>
	<section id="main">
		<div class="topBg"></div>
		<el-container class="outContainer" :style="{height: pageHeight}">
		  <el-header style="height: 70px" :class="{'edit-el-header': isHideAside}">
			<div class="topBgBox">
				<div class="topLogo" @click="refreshPage">
			  		<img src="../assets/img/textLogo.png" title="优旅家">
			  	</div>
				<topHeader></topHeader>
			</div>
		  </el-header>
		  <el-container v-if="c_userVal" style="height:100%">
		  	<happy-scroll color="rgba(255,177,50,1)" size="2" resize hide-horizontal style="width: 300px;background-color: #fff;">
		    <el-aside  v-if="!isHideAside" class="homeAside">
			  	<div class="infoShow">
			  		<div class="asideNav">
				  		<div><img :src="c_userInfo.avatar" alt=""></div>
				  		<b :style="{backgroundImage: `url(${c_userVal == 'admin'? typeIcon: c_userInfo.gender == 2?femeleTypeIcon: maleTypeIcon}) `}"></b>
				  	</div>
				  	<p>Hello,</p>
				  	<span class="infoName">{{c_userInfo.nickName}}</span>
				  	<div class="infoSet" v-if="c_userVal == 'user'">
				  		<div  class="infoUserSet" @click="junptoSet">
				  			<b></b>
				  			<span>个人设置</span>
				  		</div>
				  	</div>
			  	</div>
			  	<div class="navList" v-if="c_userVal">
			  		<div
			  			:class="[{activityItem: item.isShow}, 'itemNav']" 
			  			v-for="(item, index) in navList"
			  			:key="index" 
			  			@click="cutNav(index)">
			  			<div><img :src="item.isShow? item.showIcon: item.hideIcon" alt=""></div>
			  			<span>{{item.text}}</span>
			  		</div>
			  	</div>
			  </el-aside>
			  </happy-scroll>
			  <el-container class="inContainer">
			    <el-main v-if="isRouterAlive">
			    	<keep-alive> 
			    		<router-view v-if="$route.meta.keepAlive" />
			    	</keep-alive>
			    	<router-view v-if="!$route.meta.keepAlive"></router-view>
					<editDetail> </editDetail>
					<handleNote> </handleNote>
			    </el-main>
			    <el-footer style="height: 44px;">
			    	<div><span>湖南犇车网络科技有限公司 版权所有 &copy;-2020 湘ICP备15011900号-2</span></div>
			    </el-footer>
			  </el-container>
		    <lineSave v-if="!c_isApplyCheck"></lineSave>
		    <noteOperation v-if="!c_isApplyCheck"></noteOperation>
		    <floatBtn></floatBtn>

		    <div class="checkBox" v-if="c_isApplyCheck">
				<certificateHome></certificateHome>
			</div>
			<transition name="fade">
				<startActBox v-if="wa_isShowActBox.isShow"></startActBox>
			</transition>
		  </el-container>
		</el-container>
	</section>
</template>

<script>
	import topHeader from './topHeader.vue'
	import editDetail from  './common/editDetail.vue'
	import handleNote from './common/handleNote.vue'
	import lineSave from './writeLine/lineSave.vue'
	import noteOperation from './writeNote/noteOperation.vue'
	import floatBtn from './common/floatBtn.vue'
	import certificateHome from './applyCheck/certificateHome.vue'
	import startActBox from './writeAct/toStartActBox.vue'
	import { mapGetters , mapActions } from 'vuex';
	import config from '@/config'

	export default {
		data() {
			return {
				typeIcon: require('../assets/img/official-icon.png'),
				maleTypeIcon: require('../assets/img/male_2.png'),
				femeleTypeIcon: require('../assets/img/female_2.png'),
				// officialHead: require('../assets/img/utravelImg.png'),
				userHead: require('../assets/img/user_test_1.png'),//测试照片
				// userName: '优旅家',//测试数据
				navList: [],
				isRouterAlive: true,
				isHideAside: false, //是否隐藏导航栏
			}
		},
		components:{topHeader, editDetail, lineSave, handleNote, noteOperation, floatBtn, certificateHome, startActBox},
		computed: {
			...mapGetters([
				'c_routeSave',
				'c_loadingVal',
				'c_userVal',
				'c_userInfo',
				'c_cityName',
				'c_provinceArr',
				'c_isApplyCheck',
				'c_proCitys',
				'wa_isShowActBox',
				'c_isChangePensonalInfo'
				]),
			pageHeight() {
				return `${window.innerHeight}px`
			}
		},
		watch:{
			c_routeSave(val) {
				this.navStatusSave()
				if(this.c_proCitys != 0) {
					this.c_proCitys.map((v, i) => {
						if(i == 0) {
							v.isShow = true
						}else {
							v.isShow = false
						}
					})
					this.c_getProvinceCity(this.c_proCitys)
				}
			},
			c_isChangePensonalInfo(val) {
				if(val) {
					let userInfo = JSON.parse(localStorage.getItem('userInfo'))
					if(userInfo){
						this.c_getUserInfo(userInfo)
					}
					this.c_changePensonalINfo(false)
				}
			}
		},
		methods: {
			...mapActions([
				'c_loadingShow',
				'c_getUserInfo',
				'c_getCityName',
				'c_getProvinceArr',
				'vhl_changeTypeVal',
				'c_saveCityType',
				'c_userGrade',
				'c_toApplyCheck',
				'c_getProvinceCity',
				'wa_getMapFirstPos',
				'c_changePensonalINfo'
				]),
			refreshPage() {
				if(this.c_routeSave == '/activityList') {
					this.isRouterAlive = false
					this.$nextTick(() => {
						this.isRouterAlive = true
						this.c_loadingShow()
						setTimeout(() => {
							this.$router.push({
								path: '/activityList',
							})
						}, 600);
					})
				}else {
					this.c_loadingShow()
					setTimeout(() => {
					    this.$router.push({
							path: '/activityList',
						})
					}, 600);
				}
				this.c_toApplyCheck(false)
			},
			cutNav(index) {
				const $this = this
				this.navList.map((v, i) => {
					if(index == i) {
						v.isShow = true
						if(this.c_routeSave == v.path) {
							this.isRouterAlive = false
							this.$nextTick(() => {
								this.isRouterAlive = true
								this.c_loadingShow()
							    setTimeout(() => {
							        this.$router.push({
										path: v.path,
									})
							    }, 300);
							})
						}else {
							this.c_loadingShow()
						    setTimeout(() => {
						        this.$router.push({
									path: v.path,
								})
						    }, 300);
						}
					}else {
						v.isShow = false
					}
				})
			},
			junptoSet() {
				if(this.c_routeSave == '/personSet') {
					this.isRouterAlive = false
					this.$nextTick(() => {
						this.isRouterAlive = true
						this.c_loadingShow()
						setTimeout(() => {
							this.$router.push({
								path: '/personSet',
							})
						}, 600);
					})
				}else {
					this.c_loadingShow()
				    setTimeout(() => {
				       	this.$router.push({
							path: '/personSet',
						})
				    }, 600);
				}
			},
			navStatusSave() {
				this.navList.map((v, i) => {
					if(this.c_routeSave == '/infoList' || this.c_routeSave == '/personSet') {
						v.isShow = false
					}
					if(this.c_routeSave == '/checkProcess' 
						|| this.c_routeSave == '/checkProtocal' 
						|| this.c_routeSave == '/officialLetter'
						|| this.c_routeSave == '/themeNoChangeDue') {
						this.isHideAside = true
					}else {
						this.isHideAside = false
					}
					let pathArr = ['/activityList', '/hotLine','/vHotLine', '/hotNotes', '/spotList', '/infoPush', '/waitCheck', '/uploadSpotImg']

					if(pathArr.indexOf(this.c_routeSave) != -1) {
						if(v.path == this.c_routeSave) {
							v.isShow = true
						}else  {
							v.isShow = false
						}
					}else {
						if(['/hotLineDetail', '/writeLine'].indexOf(this.c_routeSave) != -1) {
							if(v.path == '/vHotLine' || v.path == '/hotLine') {
								v.isShow = true
							}else {
								v.isShow = false
							}
						}

						if(['/noteDetail', '/writeNote'].indexOf(this.c_routeSave) != -1) {
							if(v.path == '/hotNotes') {
								v.isShow = true
							}else {
								v.isShow = false
							}
						}

						if(['/addEditSpot'].indexOf(this.c_routeSave) != -1) {
							if(v.path == '/spotList') {
								v.isShow = true
							}else {
								v.isShow = false
							}
						}
					}
				})
			},
			userNav() {
				this.navList = [
					{
						hideIcon: require('../assets/img/act_list_icon_2.png'),
						showIcon: require('../assets/img/act_list_icon_1.png'),
						text: '活动列表',
						path: '/activityList',
						isShow: true
					},
					{
						hideIcon: require('../assets/img/hot_line_icon_2.png'),
						showIcon: require('../assets/img/hot_line_icon_1.png'),
						text: '推荐线路',
						path: '/hotLine',
						isShow: false
					},
					{
						hideIcon: require('../assets/img/my_notes_icon_2.png'),
						showIcon: require('../assets/img/my_notes_icon_1.png'),
						text: '热门游记',
						path: '/hotNotes',
						isShow: false
					}
				]
					
			},
			managerNav() {
				this.navList = [
					{
						hideIcon: require('../assets/img/act_list_icon_2.png'),
						showIcon: require('../assets/img/act_list_icon_1.png'),
						text: '活动列表',
						path: '/activityList',
						isShow: true
					},
					{
						hideIcon: require('../assets/img/hot_line_icon_2.png'),
						showIcon: require('../assets/img/hot_line_icon_1.png'),
						text: '推荐线路',
						path: '/vHotLine',
						isShow: false
					},
					{
						hideIcon: require('../assets/img/my_notes_icon_2.png'),
						showIcon: require('../assets/img/my_notes_icon_1.png'),
						text: '热门游记',
						path: '/hotNotes',
						isShow: false
					},
					{
						hideIcon: require('../assets/img/point_icon_2.png'),
						showIcon: require('../assets/img/point_icon_1.png'),
						text: '景点编辑',
						path: '/spotList',
						isShow: false
					},
					{
						hideIcon: require('../assets/img/info_push_2.png'),
						showIcon: require('../assets/img/info_push_1.png'),
						text: '消息推送',
						path: '/infoPush',
						isShow: false
					},
					{
						hideIcon: require('../assets/img/wait_audit_icon_2.png'),
						showIcon: require('../assets/img/wait_audit_icon_1.png'),
						text: '待审核',
						path: '/waitCheck',
						isShow: false
					},
					{
						hideIcon: require('../assets/img/imgLoad_icon_2.png'),
						showIcon: require('../assets/img/imgLoad_icon_1.png'),
						text: '上传图片',
						path: '/uploadSpotImg',
						isShow: false
					}
				]
			},
			codeLogin(state) {//扫码登录获取用户信息
				const $this = this
				this.$api.ajax({
					url: `${config.codegetData}/${state}`,
					headers: {
						'Content-Type':'application/x-www-form-urlencoded'
					},
					success:(res) => {
						if(res.code == 0) {
							this.$message({
							    message: '登录成功',
							    type: 'success',
							    center: true
							});
							localStorage.setItem('userInfo', JSON.stringify(res.data))
							this.c_getUserInfo(res.data)
							let times = new Date().getTime()
							if(res.data.role == '1') {
								localStorage.setItem('userGrade', JSON.stringify({times: times, userVal: 'admin'}))
								this.c_userGrade('admin')
								this.managerNav()
							}else if(res.data.role == '2') {
								localStorage.setItem('userGrade', JSON.stringify({times: times, userVal: 'user'}))
								this.c_userGrade('user')
								this.userNav()
							}
							sessionStorage.removeItem('stateVal')
						}else {
							this.$message({
								message: res.message,
								type: 'error',
								center: true
							});
							this.$router.push({
								path: '/login',
							})
						}
					},
					error: (err) => {
						// console.log(err)
						this.$message({
							message: '登录失败',
							type: 'error',
							center: true
						})
						this.$router.push({
							path: '/login',
						})
					}
				})
			}
		},
		created() {

			let userInfo = JSON.parse(localStorage.getItem('userInfo')),
				loginType = String(localStorage.getItem('loginType'))

			if(this.c_userVal == 'user' && userInfo) {
				this.userNav()
			}else if(this.c_userVal == 'admin' && userInfo){
				this.managerNav()
			}

			if(loginType == '1') { //手机号码登录
				if(userInfo){
					this.c_getUserInfo(userInfo)
				}else {
					this.$router.push({
						path: '/login',
					})
				}
			}else {
				if(userInfo){
					this.c_getUserInfo(userInfo)
				}else {
					let state = sessionStorage.getItem('stateVal')
					if(state) {
						this.codeLogin(state)
					}else {
						this.$router.push({
							path: '/login',
						})
					}
				}
			}
			
			if(this.navList.length != 0) {
				this.navStatusSave()
			}
		},
		mounted() {
			this.wa_getMapFirstPos(false) //发起活动首次定位默认false
			if(this.c_loadingVal) {
				this.c_loadingVal.close()
			}
			if(this.c_routeSave == '/') {
				this.$router.push({
					path: '/activityList',
				})
			}

			setTimeout(() => {
				if(this.c_proCitys.length == 0) {
					this.$api.proAndCity((citys) => {
						this.c_getProvinceCity(citys)
					})
				}
				// if(this.c_cityName.length == 0) {
				// 	this.$api.cityList((arr) => {
				// 		this.c_getCityName(arr)
				// 	})
				// }
				if(this.c_provinceArr.length == 0) {
					this.$api.provinceList((data) => {
						this.c_getProvinceArr(data)
					})
				}
			}, 1000)
		}
	}
</script>

<style scoped>
	.el-container {
		position: relative;
	}
	#main {
		background-color: #F6F7FB;
		display: flex;
		flex-direction: column;
	}
	.inContainer {
		
	}
	.topBg {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		background-color: #FFFFFF;
		/* box-shadow: 0 4px 14px 0 #ECEDF1; */
		height: 70px;
	}
	.el-header {
		width: 1180px;
	}
	.edit-el-header {
	    padding: 0 20px;
	}
	.topBgBox {
		height: 100%;
		margin: 0 auto;
		display: flex;
	}
	.outContainer {
		flex: 1;
		width: 1180px;
		margin: 0 auto;
		position: relative;
		z-index: 10;
		/* padding-top: 70px; */
	}
	.el-aside {
		background-color: #fff;
	}
	.el-main {
		height: 100%;
		position: relative;
		overflow: hidden;
	}
	.topLogo {
		height: 70px;
		width: 300px;
		background-color: #FFB132;
		padding: 10px 77px;
	}
	.topLogo:hover {
		cursor: pointer;
	}
	.infoShow {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 25px 0 60px 0;
	}
	.asideNav{
		position: relative;
		width: 118px;
		height: 118px;
		margin-bottom: 15px;
	}
	.asideNav>div{
		width: 100%;
		height: 100%;
		border-radius: 50%;
		overflow: hidden;
		border: 1px solid #eee;
	}
	.asideNav>b {
		position: absolute;
		bottom: 6px;
		right: 10px;
		width: 20px;
		height: 20px;
		background-repeat: no-repeat;
		background-position: center;
		background-size: 100%;
	}
	.infoShow>p {
		display: block;
		font-size: 18px;
		color: #9FA6AD;
	}
	.infoName {
		display: block;
		font-size: 22px;
		color: #373A3E;
		margin-bottom: 10px;
	}
	.infoSet {
		width: 169px;
		height: 39px;
		border-radius: 6px;
	}
	.infoUserSet {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color:  #FFB132;
		font-size: 16px;
		color: #FFFFFF
	}
	.infoUserSet:hover {
		cursor: pointer;
		opacity: 0.8;
	}
	.infoUserSet>b {
		display: block;
		width: 18px;
		height: 18px;
		margin-right: 15px;
		background: url('../assets/img/set-icon.png') no-repeat center;
		background-size: 100%;
	}
	.infoUserSet>span {
		display: block;
	}
	.navList {
		width: 100%;
		height: auto;
		font-size: 18px;
		color: #9FA6AD;
	}
	.itemNav {
		width: 100%;
		height: 50px;
		display: flex;
		align-items: center;
		padding-left: 58px;
		position: relative;
		margin-bottom: 20px;
		transition: all 0.2s;
	}
	.itemNav:hover {
		cursor: pointer
	}
	.itemNav.activityItem {
		background-color: #FFF2DD;
		color: #FFB132;
	}
	.itemNav.activityItem::before {
		content: '';
		display: block;
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		width: 2px;
		background-color: #FFB642;
	}
	.itemNav>div {
		width: 18px;
		height: auto;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 15px;
	}
	.itemNav>div>img{
		width: auto;
		max-height: 23px;
	}
	.el-footer>div {
		width: 100%;
		height: 100%;
		font-size: 14px;
		color: #373A3E;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #fff;
	}

</style>