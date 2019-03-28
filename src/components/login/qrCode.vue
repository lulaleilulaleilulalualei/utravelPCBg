<template>
	<div class="codeBox" @click="fadeOutCode">
		<div class="codeBoxContent">
			<div class="codeShowBox">
				<span>{{codeObj.title}}</span>
				<div class="showCode">
					<canvas id="appCanvas"></canvas>
					<div v-if="isRefreshCode" @click.stop="toRefresh" class="refreshCanvas"><img src="../../assets/img/refresh.png" alt=""></div>
				</div>
				<div class="differType">
					<span>{{codeObj.text_1}}</span>
					<span>{{codeObj.text_2}}</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { mapGetters , mapActions } from 'vuex';
	import QRCode from 'qrcode'
	import config from '@/config'

	export default {
		data() {
			return {
				phoneVal: '',
				phoneCode: '',
				isWait: false,
				codeObj: {
						title: 'App登录',
						codeSrc: require('../../assets/img/qrCode.png'),
						text_1: '请使用微信扫描二维码登录',
						text_2: '“优旅家”'
					},
				websock: null,
				key: '',
				isRefreshCode: false,
			}
		},
		computed: {
			...mapGetters([
				'l_isCodeShow',
				'l_isBindPhone',
				'l_isBindCode',
			])
		},
		methods: {
			...mapActions([
				'l_phoneTest',
				'l_codeTest',
				'l_codeShow',
				'c_loadingShow'
				]),
			fadeOutCode(e) {
				if(e.target.className == 'codeBox') {
					this.l_codeShow(false)
					this.websock.onclose()
				}
			},
			initWebSocket(){ //初始化weosocket 
				const wsuri = `${config.wsLoginUrl}/${this.key}`;//ws地址
				// const wsuri = 'ws://121.40.165.18:8800'
			  if('WebSocket' in window) {
					this.websock = new window.WebSocket(wsuri);
			  }else if('MozWebSocket' in window) {
					this.websock = new window.WebSocket(wsuri);
			  }else {
			  	this.$message({
					message: '您当前的浏览器不支持app登录',
					type: 'error',
					center: true
				});
				return
			  }
			  	this.websock.onopen = this.websocketonopen;
				this.websock.onerror = this.websocketonerror;
				this.websock.onmessage = this.websocketonmessage; 
				this.websock.onclose = this.websocketclose;
				setTimeout(() => {
					this.websock.onclose()
				}, 59*1000)
　　　　   },
		   	websocketonopen() {
				// console.log("WebSocket连接成功");
			},
			websocketonerror(e) { //错误
				console.log("WebSocket连接发生错误");
			},
		   	websocketonmessage(e){ //数据接收 
				const redata = JSON.parse(e.data);
				if(redata.code == 0) {
					sessionStorage.setItem('stateVal', this.key)
					localStorage.setItem('loginType', 0)
					this.c_loadingShow()
					this.l_codeShow(false)
					this.websock.onclose()
					setTimeout(() => {
						if(redata.data == 1) {
							this.$router.push({
								path: '/activityList',
							})
						}else if(redata.data == 2) {
							this.$router.push({
								path: '/writeNote',
								query: {
									type: 'add'
								}
							})
						}
					}, 600)
				}else {
					this.$message({
						message: 'app扫码失败',
						type: 'error',
						center: true
					})
				}
			},
		   	websocketsend(agentData){//数据发送 点击事件触发
				this.websock.send(agentData);
			},
		   	websocketclose(e){//关闭
		   		if(e) {
		   			if(this.l_isCodeShow) {
		   				this.$message({
							message: '二维码已失效',
							type: 'info',
							center: true
						})
						this.isRefreshCode = true
			   			console.log("connection closed (" + e.code + ")");
		   			}
		   		}
			},
			toRefresh() {
				this.key = 'utravel_app_user_' + new Date().getTime()
				this.isRefreshCode = false
				this.initWebSocket()
				this.useqrcode()
			},
			useqrcode(){ 
		      	//生成的二维码内容，可以添加变量
				//this.QueryDetail='http://www.kspxzx.com/#/guard'+"?unique_code="+this.QueryDetail;
				const $this = this
				let canvas = document.getElementById('appCanvas')
		        QRCode.toCanvas(canvas, `${config.appLogin}/${$this.key}`, function (error) {
			        if (error) {
			        	$this.$message({
							message: '二维码生成失败，请稍后再试',
							type: 'error',
							center: true
						})
						return
			        }
		        })
		    }
		},
		created() {
			this.key = 'utravel_app_user_' + new Date().getTime()
			//页面刚进入时开启长连接
            this.initWebSocket()
		},
		destroyed: function() { 
　　　　  	//页面销毁时关闭长连接
　　　　　　this.websock.onclose()
　　　　},
		mounted() {
			this.useqrcode()
		}
	}
</script>

<style scoped>
	.codeBox {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 50;
		width: 100%;
		height: 100%;
		background-color: rgba(0,0,0,0.4);
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.codeBoxContent {
		width: 700px;
		height: 520px;
		overflow: hidden;
	}
	.codeShowBox {
		width: 700px;
		height: 520px;
		background-color: #333;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.codeShowBox>span {
		font-size: 22px;
		color: #FFFFFF;
		margin-bottom: 15px;
	}
	.showCode {
		width: auto;
		height: auto;
		margin-bottom: 20px;
		position: relative;
	}
	.refreshCanvas {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(255,255,255,1);
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.refreshCanvas:hover {
		cursor: pointer;
	}
	.refreshCanvas>img {
		width: 80px;
		height: 80px;
	}
	.differType {
		width: 284px;
		height: 54px;
		background: #232323;
		border-radius: 100px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-size: 14px;
		color: #FFFFFF;
	}
	.differType>span {
		display: block;
	}
	#appCanvas {
		width: 284px!important;
		height: 284px!important;
	}
</style>