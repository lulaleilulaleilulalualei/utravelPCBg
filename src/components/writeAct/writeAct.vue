<template>
	<div class="writeAct" :style="{height: currentHeight}">
		<el-container  style="height: 100%;">
		  <el-header style="height: 70px;" class="actHeader">
		  	<div class="utravlLogo" @click="toHome"><img src="../../assets/img/textLogo.png" alt=""></div>
		  	<div class="topActBtnBox">
		  		<span class="topActPreview" @click="toPreviewAct">预览</span>
		  		<div class="topActBtn topAct" @click.stop="toStartAct">
		  			<div class="toActBtnTxt topAct"><span class="topAct">发起活动</span></div>
		  			<div class="toActBox" v-if="isShowToStartBox">
		  				<div class="toLineAndAct"><b></b><span>上传线路并发起活动</span></div>
		  				<div class="toStartAct"><b></b><span>发起活动</span></div>
		  			</div>
		  		</div>
		  	</div>
		  </el-header>
		  <el-main class="actWriteBox">
		  	<div class="planShowList">
		  		<div class="dayShowBox">
		  			<happy-scroll color="rgba(255,177,50,1)" size="1" resize >
						<dayLineList @getPosObj="getPosObj"
									 @colseBox="colseBox"
									 @changeDay="changeDay"
									:operateType="operateType"
									:allLineCount="allLineCount"></dayLineList>
		  			</happy-scroll>
					<div class="planOperation" v-if="isShowOperationBox" :style="posObj">
						<div class="operationBoxTop"><span>操作</span><i class="el-icon-close" @click.stop="toCloseOperationBox"></i></div>
						<div class="insertDay" @click.top="inserBeforeDay"> <b></b> <span>之前插入一天</span></div>
						<div class="insertDay" @click.top="inserAfterDay"> <b></b> <span>之后插入一天</span></div>
						<div class="deleteDay" @click.top="deleteDay"> <b></b> <span>删除该日</span></div>
					</div>
		  		</div>
			  	<div class="showPlan">
			  		<showCurrentPlan></showCurrentPlan>
			  	</div>
			  	<div class="showSopt">
			  		<planSpotList></planSpotList>
			  	</div>
		  	</div>
		  	<div class="showMap">
		  		<el-amap ref="actMap" vid="actMap" :amap-manager="amapManager" :center="center" :zoom="zoom" :plugin="plugin" :events="events">
					<el-amap-info-window
			          :position="currentWindow.position"
			          :content="currentWindow.content"
			          :visible="currentWindow.visible"
			          :events="currentWindow.events"
			          :offset="currentWindow.offset"
			          :autoMove="false">
			        </el-amap-info-window>
					<el-amap-marker 
						v-for="(marker, index) in markers" 
						:position="marker.position" 
						:events="marker.events"
						:icon="marker.icon"
						:offset="marker.offset"
						:key="index"  
						:vid="index"></el-amap-marker>
					<el-amap-polyline :path="polyline.path" :strokeColor="polyline.strokeColor"></el-amap-polyline>
	      		</el-amap>
	      		<canvas id="canvasImg" style="display: none;"></canvas>
	      		<div class="lookAllLine" title="查看所有线路" @click="lookAllLine"><span></span></div>
		  	</div>
		  </el-main>
		</el-container>
		<transition name="fade">
			<selfPoint v-if="wl_isShowSelf"></selfPoint>
		</transition>
		<transition name="fade">
			<madeCode v-if="c_isShowMadeCode"
					:previewUrl="previewUrl"></madeCode>
		</transition>
	</div>
</template>

<script>
	import dayLineList from './dayLineList.vue'
	import showCurrentPlan from './showCurrentPlan.vue'
	import planSpotList from './planSpotList.vue'
	import selfPoint from '../writeLine/selfPoint.vue'
	import madeCode from '../common/madeCode.vue'
	import { mapGetters , mapActions } from 'vuex';
	import { AMapManager } from 'vue-amap'
    let amapManager = new AMapManager();
	
	export default {
		data() {
			let self = this;
			return {
				isShowOperationBox: false,
				posObj: {
					top:0,
					left:0
				}, //定位样式
				operateType: null,
				dayIndex: null,
				previewUrl: 'https://www.baidu.com',
				isShowToStartBox: false,
				
				//地图值
				center:[0, 0], //默认值
				lng: 0,
          		lat: 0,
				zoom: 14,
				cityCode: '010',
				amapManager,
				events: {
		            init(map) {
		            }
		        },
				plugin: [{
		            pName: 'Geolocation',
		            events: {
		              init(o) {
		                // o 是高德地图定位插件实例
		                (function(){o.getCurrentPosition((status, result) => {
		                  if (result && result.position) {
		                    self.lng = result.position.lng;
		                    self.lat = result.position.lat;
		                    self.center = [self.lng, self.lat];
		                    self.cityCode = result.citycode
		                    self.wa_getMapFirstPos(true) //地图首次定位完成
		                    self.$nextTick();
		                  }
		                })})()
		              }
		            }
		        },
		        {
		        	pName: 'ToolBar'
		        }],
		        markers: [],
		        polyline: {
		        	path: [],
		        	strokeColor: "#FF0000",
		        	visible: true
		        },
		        currentWindow: {
		            position: [0, 0],
		            content: '',
		            events: {
		            	close: () => {
		            		this.position = [0, 0]
		            		this.content = ''
		            	}
		            },
		            offset: [0, -20],
		            visible: false
		        },
		        mapIndex: null,
		        isRereshMap: false,
		        allLineCount: 0
			}
		},
		components: {dayLineList, showCurrentPlan, planSpotList, selfPoint, madeCode},
		computed: {
			...mapGetters([
				'c_loadingVal',
				'c_userInfo',
				'wa_spotArr',
				'wl_isShowSelf',
				'c_isShowMadeCode'
				]),
			currentHeight() {
				return window.innerHeight + 'px'
			}
		},
		watch: {
			wa_spotArr(val) {
				if(val.length != 0) {
					this.markers = []
					this.polyline.path = []
					let arr = [], count = 0
					val.map((v, i) => {
						if(!v.type) {
							count++
							this.showInfo(v, count)
							arr.push(v)
						}
					})
					
					if(arr.length > 1) {
						let startSpot = arr[0],
							endSpot = arr[arr.length-1]
						
						let distance = new AMap.LngLat(startSpot.longitude, startSpot.latitude).distance([endSpot.longitude, endSpot.latitude])
						this.zoom = this.scale2Zoom(distance)
					}
				}else {
					this.markers = []
					this.polyline.path = []
				}
			}
		},
		methods: {
			...mapActions([
				'c_loadingShow',
				'c_getUserInfo',
				'wa_getMapFirstPos',
				'c_showMadeCode'
				]),
			clickBody() {
		    	let body = document.getElementsByTagName('body')[0] ||document.body
		    	const $this = this
		    	body.removeEventListener('click', $this.bindEvent.bind($this),false);
		    	body.addEventListener('click', $this.bindEvent.bind($this),false)
		    },
		    bindEvent(e) {
		    	if(e.target.className != 'topAct') {
		    		this.isShowToStartBox = false
		    	}
		    	this.isShowOperationBox = false
		    },
			toStartAct() {
				this.isShowToStartBox = !this.isShowToStartBox
			},
			toPreviewAct() {
				this.c_showMadeCode(true)
			},
			lookAllLine() {
				this.allLineCount++
			},
			changeDay(index) {
				if(this.mapIndex != index) {
					this.isRereshMap = true
					this.markers = []
					this.polyline.path = []
					setTimeout(() => {
						this.isRereshMap = false
					}, 100)
				}
			},
			scale2Zoom(scale) {
		        if (scale <= 10) return 19;
			        else if (scale <= 100) return 18;
			        else if (scale <= 300) return 17;
			        else if (scale <= 800) return 16;
			        else if (scale <= 1600) return 15;
			        else if (scale <= 3000) return 14;
			        else if (scale <= 5000) return 13;
			        else if (scale <= 10000) return 12;
			        else if (scale <= 20000) return 11;
			        else if (scale <= 30000) return 10;
			        else if (scale <= 50000) return 9;
			        else if (scale <= 80000) return 8;
			        else if (scale <= 100000) return 7;
			        else if (scale <= 200000) return 6;
			        else if (scale <= 400000) return 5;
			        else if (scale <= 700000) return 4;
			        else if (scale <= 1000000) return 3;
			        else if (scale > 1000000) return 2;
		        return 20;
		    },
		    imgDraw(index, callBack) {
				let c=document.createElement('canvas'),
					ctx=c.getContext('2d')
					c.width=28
    				c.height=34
    			ctx.rect(0,0,c.width,c.height)
    			ctx.fillStyle='transparent'
    			ctx.fill()
				
				let madeImg = new Image()
				madeImg.src = "/static/map_icon.png"
				madeImg.onload = function() {
					ctx.drawImage(madeImg,0,0,28,34)
					ctx.beginPath();
					ctx.arc(14,14,10,0,2*Math.PI);
					ctx.fillStyle = "#fff"
					ctx.fill()
					
					ctx.font="14px Arial"
					ctx.fillStyle="#000"
					ctx.fillText(index, 10, 19)
					
					typeof callBack == 'function' && callBack(c.toDataURL("image/png"))
				}
		    },
			showInfo(poiInfo, index) {
				this.imgDraw(index, (url) => {
				const $this = this
				 var icon = new AMap.Icon({
			        size: new AMap.Size(28, 34),
			        image: url,
			        imageSize: new AMap.Size(28, 34),
			    });
				this.markers.push({
        			position: [poiInfo.longitude, poiInfo.latitude],
        			icon: icon,
        			offset: [-10, -28],
        			events: {
					    click: (e) => {
					    $this.currentWindow.visible  = false
					    $this.$nextTick(() => {
					        if(!$this.currentWindow.visible) {
						        $this.currentWindow.visible = true
						        $this.currentWindow.position = [poiInfo.longitude, poiInfo.latitude]
						        $this.currentWindow.content = [
						            '<div style="padding: 5px;">',
						               	'<h3 style="font-size:14px;color: #373A3E;padding:3px 0;border-bottom:1px solid #DDDEE1;">'+ poiInfo.name +'</h3>',
						                '<p style="padding:3px 0;font-size:12px;color:#9FA6AD;">地址：',
						                  poiInfo.address,
						                '</p>',
						            '</div>'
						        ].join('')
						    }
					    })
					   	}
              		}
        		})
        		this.polyline.path.push([poiInfo.longitude, poiInfo.latitude])
        		this.center = [poiInfo.longitude, poiInfo.latitude]
        		})
			},
			toHome() {
				this.c_loadingShow()
				setTimeout(() => {
					this.$router.push({
						path: '/activityList',
					})
				}, 600);
			},
			getPosObj({index, pageX, pageY}) {
				this.isShowOperationBox = true
				this.posObj = {
					top: `${pageY}px`,
					left: `${pageX}px`
				}
				this.dayIndex = index
			},
			toCloseOperationBox() {
				this.isShowOperationBox = false
			},
			inserBeforeDay() {
				this.operateType = {
					type: 1,
					index: this.dayIndex
				}
				this.isShowOperationBox = false
				setTimeout(() => {
					this.operateType = {}
				}, 100)
			},
			inserAfterDay() {
				this.operateType = {
					type: 2,
					index: this.dayIndex
				}
				this.isShowOperationBox = false
				setTimeout(() => {
					this.operateType = {}
				}, 100)
			},
			deleteDay() {
				this.operateType = {
					type: 3,
					index: this.dayIndex
				}
				this.isShowOperationBox = false
				setTimeout(() => {
					this.operateType = {}
				}, 100)
			},
			colseBox(e) {
				this.isShowOperationBox = false
			}
		},
		created() {
			if(!this.c_userInfo.token) {
				let userInfo = JSON.parse(localStorage.getItem('userInfo'))
				this.c_getUserInfo(userInfo)
			}
		},
		mounted() {
			this.clickBody()
			if(this.c_loadingVal) {
				this.c_loadingVal.close()
			}
		}
	}
</script>

<style scoped>
	.writeAct {
		width: 100%;
		height: 100%;
		background-color: #efefef;
		min-width: 1440px;
	}
	.el-main {
		padding: 15px;
	}
	.actHeader {
		background-image: linear-gradient(0deg, #FFCD20 0%, #FFDA4C 100%);
		padding: 0 20px 0 77px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.utravlLogo {
		width: 145px;
		height: 50px;
	}
	.utravlLogo {
		cursor: pointer;
	}
	.topActBtnBox {
		display: flex;
		align-items: center;
	}
	.topActPreview {
		display: block;
		font-size: 16px;
		color: #FFFFFF;
		margin-right: 30px;
	}
	.topActPreview:hover {
		cursor: pointer;
	}
	.topActBtn {
		background: #FFFFFF;
		border-radius: 4px;
		width: 112px;
		height: 40px;
		padding: 9px 14px;
		position: relative;
	}
	.topActBtn:hover {
		cursor: pointer;
	}
	.toActBtnTxt {
		font-size: 16px;
		color: #FFDA4C;
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		height: 100%;
	}
	.toActBtnTxt::after {
		content: '';
		display: block;
		border: 3px solid #FFDA4C;
		transform: rotate(45deg);
		border-top-color: transparent;
		border-left-color: transparent;
		position: relative;
		top: -2px;
	}
	.actWriteBox {
		width: 100%;
		height: 100%;
		display: flex;
	}
	.planShowList {
		width: 65%;
		height: 100%;
		display: flex;
		justify-content: space-between;
	}
	.dayShowBox {
		width: 200px;
		max-height: 100%;
		position: relative;
		overflow: hidden;
	}
	.showPlan {
		width: 36%;
		max-height: 100%;
		overflow: hidden;
	}
	.showSopt {
		width: 42%;
		max-height: 100%;
		overflow: hidden;
	}
	.showMap {
		flex: 1;
		height: 100%;
		overflow: hidden;
		position: relative;
	}

	.planOperation {
		position: fixed;
		z-index: 200;
		background: #FFFFFF;
		box-shadow: 0 0 9px 0 rgba(0,0,0,0.19);
		border-radius: 6px;
		width: 200px;
		height: auto;
		overflow: hidden;
	}
	.operationBoxTop {
		width: 200px;
		height: 50px;
		padding: 0 15px 0 20px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1px solid #D2D2D2;
	}
	.operationBoxTop>span {
		display: block;
		font-size: 18px;
		color: #000000;
	}
	.operationBoxTop i {
		font-size: 14px;
		color: #000;
	}
	.operationBoxTop i:hover {
		cursor: pointer;
	}
	.insertDay, .deleteDay {
		padding: 10px 20px;
		display: flex;
		align-items: center;
		font-size: 18px;
		color: #000000;
		transition: all 0.2s;
	}
	.insertDay:hover, .deleteDay:hover {
		cursor: pointer;
		background-color: #FFF2DD;
	}
	.insertDay>b {
		display: block;
		width: 16px;
		height: 16px;
		background: url('../../assets/img/insert_day.png') no-repeat center;
		background-size: 100%;
		margin-right: 15px;
	}
	.deleteDay>b{
		display: block;
		width: 18px;
		height: 18px;
		background: url('../../assets/img/delete_day.png') no-repeat center;
		background-size: 100%;
		margin-right: 13px;
	}
	.lookAllLine {
		position: absolute;
		z-index: 888;
		width: 35px;
		height: 35px;
		left: 10px;
		bottom: 60px;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #fff;
		border-radius: 4px;
		border: 1px solid #ccc;
	}
	.lookAllLine:hover {
		cursor: pointer;
	}
	.lookAllLine>span {
		display: block;
		width: 20px;
		height: 25px;
		background: url('../../assets/img/line_icon.png') no-repeat center;
		background-size: 100%;
	}

	.toActBox {
		position: absolute;
		top: 45px;
		right: 0;
		z-index: 888;
		width: 240px;
		background: #FFFFFF;
		box-shadow: 0 0 9px 0 rgba(0,0,0,0.19);
		border-radius: 6px;
		overflow: hidden;
	}
	.toActBox>div {
		padding: 11px 20px;
		display: flex;
		align-items: center;
		transition: all 0.2s;
	}
	.toActBox>div:hover {
		cursor: pointer;
		background-color: #FFF2DD;
	}
	.toActBox>div>b {
		display: block;
		width: 16px;
		margin-right: 15px;
	}
	.toActBox>div>span {
		display: block;
		font-size: 18px;
		color: #000000;
	}
	div.toLineAndAct>b{
		height: 12px;
		background: url('../../assets/img/toLineAndAct.png') no-repeat center;
		background-size: 100%;
	}
	div.toStartAct>b {
		height: 14px;
		background: url('../../assets/img/toStartAct.png') no-repeat center;
		background-size: 100%;
	}
</style>