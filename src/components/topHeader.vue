<template>
	<div class="topHeader">
		<div class="contentSearch">
			<b></b>
			<input type="text" v-model.trim="searchTxt" @keyup.enter="initSearch" placeholder="输入关键字搜索">
		</div>
		<div class="leftIcon">
			<div class="applyCheck" @click="toApplyCheck">申请认证</div>
			<div class="loadApp" v-if="c_userVal == 'user'"  @mouseover="mouseoverleft" @mouseout="mouseoutleft">
				<!-- v-if="c_userVal == 'user'" -->
				<span>+ App</span>
				<transition name="scaleFade">
					<loadApp v-if="isShowLoadApp"> </loadApp>
				</transition>
			</div>
			<div class="message"  @click="lookInfo">
				<el-badge :value="infoNum" :max="99" :hidden="false" class="item">
					<img src="../assets/img/info_icon.png" alt="">
				</el-badge>
			</div>
			<div class="operation" @mouseover="mouseoverright" @mouseout="mouseoutright">
				<div class="operationImg"><img :src="c_userVal == 'admin'? officialIcon: c_userInfo.avatar" alt=""></div>
				<transition name="shortFade">
					<shortcutBox v-if="isShowShortcutBox"></shortcutBox>
				</transition>
			</div>
		</div>
	</div>
</template>



<script>
	import { mapGetters , mapActions } from 'vuex';
	import loadApp from './common/loadApp.vue'
	import shortcutBox from './common/shortcutBox.vue'
	import config from '@/config'
	
	export default {
		data() {
			return {
				officialIcon: require('../assets/img/official-headerImg.png'),
				isShowLoadApp: false,
				isShowShortcutBox: false,
				searchTxt:'',
				routeArr : ['/activityList', '/hotLine', '/vHotLine', '/hotNotes', '/spotList', '/waitCheck', '/infoList'],
				infoNum: '',
			}
		},
		components: {loadApp, shortcutBox},
		computed: {
			...mapGetters([
				'c_userVal',
				'c_routeSave',
				'wc_isClearSearch',
				'c_userInfo',
				'c_infoNumCount'
				])
		},
		watch: {
			c_routeSave(val) {
				this.routeArr.map((v, i) => {
					if(v == val) {
						this.searchTxt = ''
						// this.c_toSearch(this.searchTxt)
					}
				})
			},
			wc_isClearSearch(val) {
				if(val) {
					this.searchTxt = ''
					this.wc_clearSearch(false)
				}
			},
			c_infoNumCount(val) {
				if(val != 9999) {
					if(this.infoNum > 0) {
						this.infoNum--
					}else {
						this.infoNum = ''
					}
				}else {
					this.infoNum = ''
				}
			}
		},
		methods: {
			...mapActions([
				'c_loadingShow',
				'c_toSearch',
				'wc_clearSearch',
				'c_toApplyCheck'
				]),
			toApplyCheck() {
				// if(this.c_routeSave != '/checkProcess' 
				// 		&& this.c_routeSave != '/checkProtocal' 
				// 		&& this.c_routeSave != '/officialLetter'
				// 		&& this.c_routeSave != '/themeNoChangeDue') {
				// 		this.c_toApplyCheck(true)
				// }

				this.$message({
			        type: 'info',
			        message: '功能暂未开放！',
			        center: true
			    });
			},
			initSearch() {
				if(this.routeArr.indexOf(this.c_routeSave) != -1) {
					this.c_toSearch(this.searchTxt)
				}else {
					this.$message({
			            type: 'info',
			            message: '当前页面不支持搜索',
			            center: true
			        });
				}
			},
			mouseoverleft() {
				this.isShowLoadApp = true
			},
			mouseoutleft() {
				this.isShowLoadApp = false
			},
			mouseoverright() {
				this.isShowShortcutBox = true
			},
			mouseoutright() {
				this.isShowShortcutBox = false
			},
			lookInfo() {
				if(this.c_routeSave != '/infoList') {
					this.c_loadingShow()
					setTimeout(() => {
					       	this.$router.push({
								path: '/infoList',
							})
					}, 600);
				}else {
					let loading = this.$loading({
						lock: true,
						fullscreen: true,
						background: 'rgba(255, 255, 255, 0.7)'
					})
					setTimeout(() => {
						loading.close()
					}, 600)
				}
			},
			getInfoNum() {
				const $this = this
		    	this.$api.ajax({
		    		url: this.c_userVal == 'admin'? config.infoNum: config.userInfoNoRead,
		    		headers: {
						'Content-Type':'application/x-www-form-urlencoded',
						'API-User-Token': $this.c_userInfo.token
					},
					success: (res) => {
						if(res.code == 0) {
							if(res.data !== 0) {
								this.infoNum = res.data
								this.$notify.info({
						          title: '消息',
						          message: `您有${res.data}条未读消息`,
						          onClick: () => {
									setTimeout(() => {
									       	this.$router.push({
												path: '/infoList',
											})
									}, 600);
						          }
						        })
							}else {
								this.infoNum = ''
							}
						}else {
							this.$message({
						        type: 'error',
						        message: res.message,
						        center: true
						    });
						}
					},
					error: (err) => {
						console.log(err)
						this.$message({
					        type: 'error',
					        message: '未读消息数量获取失败',
					        center: true
					    });
					}
		    	})
			}
		},
		created() {
			
		},
		mounted() {
			setTimeout(() => {
				this.getInfoNum()	
			}, 1000)
			
		}
	}
</script>

<style scoped>
	.topHeader {
		flex: 1;
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 100%;
		padding-left: 40px;
		position: relative;
	}
	.contentSearch {
		display: flex;
		width: 420px;
		height: 100%;
		align-items: center;
	}
	.contentSearch>input {
		display: block;
		flex: 1;
		height: 100%;
		font-size: 18px;
		color: #373A3E;
		letter-spacing: 1px;
	}
	.contentSearch>input::-webkit-input-placeholder { /* WebKit browsers */
    	color: #E6E6E6;
	}
	.contentSearch>input:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
	    color: #E6E6E6;
	}
	.contentSearch>input::-moz-placeholder { /* Mozilla Firefox 19+ */
	    color: #E6E6E6;
	}
	.contentSearch>input:-ms-input-placeholder { /* Internet Explorer 10+ */
	    color: #E6E6E6;
	}
	.contentSearch b {
		display: block;
		width: 22px;
		height: 22px;
		background: url('../assets/img/content-search.png') no-repeat center;
		background-size: 100%;
		margin-right: 15px;
	}
	.leftIcon {
		display: flex;
		align-items: center;
		height: 100%;
	}
	.leftIcon>div:not(.applyCheck) {
		height: 100%;
		display: flex;
		align-items: center;
		padding: 0 10px;
		background-color: #fff;
		transition: all 0.2s;
	}
	.leftIcon>div:not(.applyCheck):hover {
		cursor: pointer;
		background-color: #FFF2DD;
	}
	.applyCheck {
		width: 106px;
		height: 32px;
		line-height: 32px;
		text-align: center;
		background: #FFB132;
		border-radius: 2px;
		font-size: 16px;
		color: #FFFFFF;
		margin-right: 30px;
	}
	.applyCheck:hover {
		cursor: pointer;
	}
	.loadApp {
		font-size: 16px;
		color: #373A3E;
		margin-right: 18px;
		font-weight: 500;
		position: relative;
	}
	.message {
		width: 42px;
		height: 17px;
		margin-right: 22px;
	}
	.operation {
		display: flex;
		align-items: center;
		position: relative;
	}
	.operationImg {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		overflow: hidden;
		border: 1px solid #eee;
	}
	.operation::after {
		content: '';
		display: block;
		border: 3px solid #373A3E;
		border-right-color: transparent;
		border-bottom-color: transparent;
		transform: rotate(45deg);
		margin-left: 5px;
	}

	.scaleFade-enter-active, .scaleFade-leave-active {
	  transition: all .3s ease;
	  transform-origin:  center top 0;
	}
	.scaleFade-enter, .scaleFade-leave-to {
	  transform:scale(0,0); 
	}

	.shortFade-enter-active, .shortFade-leave-active {
	  transition: all .3s ease;
	  transform-origin: right top 0;
	}
	.shortFade-enter, .shortFade-leave-to {
	  transform:scale(0,0); 
	}
</style>