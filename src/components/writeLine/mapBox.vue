<template>
	<div class="selfPointMap">
		<div class="pointTitle">
			<input type="text" id="pointInput" v-model.trim="pointTitle" placeholder="请输入景点名称" ref="pointTitle">
		</div>
		<div id="mapBox">
			<el-amap ref="map" vid="amapPoint" :amap-manager="amapManager" :center="center" :zoom="zoom" :plugin="plugin" :events="events">
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
					:key="index"  
					:vid="index"></el-amap-marker>
      		</el-amap>
		</div>
		<div class="pointBtn">
			<div @click="closeMap">取消</div>
			<div @click="selectMap">确定</div>
		</div>
	</div>
</template>

<script>
	import { mapGetters , mapActions } from 'vuex';
    import { AMapManager } from 'vue-amap'
    let amapManager = new AMapManager();


	export default {
		data() {
			let self = this;
			return {
				pointTitle:'',
				center:[116.424406, 39.904413],
				lng: 0,
          		lat: 0,
				zoom: 16,
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
		        detailAdress: {}
			}
		},
		computed: {
			...mapGetters([
				'wl_pointAddInfo',
				'c_userVal'
				])
		},
		methods: {
			...mapActions([
				'wl_showMap',
				'wl_addressInfo'
				]),
			closeMap() {
				this.wl_showMap(false)
			},
			selectMap() {
				if(!this.$api.isEmptyObject(this.detailAdress)) {
					this.wl_addressInfo(this.detailAdress)
				}else {
					this.$message({
			          message: '您还没有进行景点查询~',
			          type: 'error',
			          center: true
			        })
				}
				this.wl_showMap(false)
			},
			keySearch() {
				const $this = this
				let auto = new AMap.Autocomplete({input: 'pointInput'});
				let placeSearch = new AMap.PlaceSearch({pageSize: 1})
				AMap.event.addListener(auto, "select", (e) => {
					placeSearch.setCity(e.poi.adcode);
					const parentVal = e.poi
        			placeSearch.search(e.poi.name, (status, result) => {
        				if(status == 'complete' && result.info == 'OK') {
        					let proName = '',cityName = '',address = ''

        					$this.getAddress([parentVal.location.lng, parentVal.location.lat], (dataObj) => {
        						proName = dataObj.addressComponent.province
        						if(dataObj.addressComponent.city == '') {
        							cityName = proName
        						}else {
        							cityName = dataObj.addressComponent.city
        						}
        						address = dataObj.formattedAddress

        						$this.detailAdress = {
	        						address: address, 
	        						location: parentVal.location, 
	        						name: $this.pointTitle,
	        						province:proName,
	        						city: cityName
	        					}
	        					$this.showInfo($this.detailAdress)
        					})
        				}
        			});
				})
			},
			showInfo(poiInfo) {
				const $this = this
				this.pointTitle = poiInfo.name
				this.markers = [{
        			position: [poiInfo.location.lng, poiInfo.location.lat],
        			events: {
					    click: (e) => {
					    $this.currentWindow.visible  = false
					    $this.$nextTick(() => {
					        if(!$this.currentWindow.visible) {
						        $this.currentWindow.visible = true
						        $this.currentWindow.position = [poiInfo.location.lng, poiInfo.location.lat]
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
        		}]
        		this.center = [poiInfo.location.lng, poiInfo.location.lat]
			},
			addressLoad() {
				if(!this.$api.isEmptyObject(this.wl_pointAddInfo)) {
					this.detailAdress = this.wl_pointAddInfo
					this.showInfo(this.detailAdress)
					this.pointTitle = this.wl_pointAddInfo.name
					if(this.detailAdress.address == '') {
						this.getAddress([this.detailAdress.location.lng, this.detailAdress.location.lat], (dataObj) => {
							this.detailAdress.address = dataObj.formattedAddress
						})
					}
				}
			},
			getAddress(lnglatXY, callBack) {
				const $this = this
				let geocoder = new AMap.Geocoder({});
				geocoder.getAddress(lnglatXY, (status, result) => {
				 	if (status === 'complete' && result.info === 'OK') {
				 		typeof callBack == 'function' && callBack(result.regeocode)
				 	}else {
				 		this.$message({
					        message: '获取地址名失败',
					        type: 'error',
					        center: true
					    })
				 	}
				})
			}
		},
		mounted() {
			setTimeout(() => {
				this.keySearch()
				this.addressLoad()
			}, 500)
		}
	}
</script>

<style scoped>
	.selfPointMap {
		width: 100%;
		height: 100%;
	}
	.pointTitle {
		width: 100%;
		height: 42px;
		border: 1px solid #DDDEE1;
		margin-bottom: 15px;
	}
	.pointTitle>input {
		display: block;
		height: 100%;
		width: 100%;
		font-size: 16px;
		color: #373A3E;
		padding: 0 15px;
	}
	.pointTitle>input::-webkit-input-placeholder { /* WebKit browsers */
    	color: #9FA6AD;
	}
	.pointTitle>input:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
	    color: #9FA6AD;
	}
	.pointTitle>input::-moz-placeholder { /* Mozilla Firefox 19+ */
	    color: #9FA6AD;
	}
	.pointTitle>input:-ms-input-placeholder { /* Internet Explorer 10+ */
	    color: #9FA6AD;
	}
	#mapBox {
		width: 580px;
		height: 602px;
		position: relative;
	}
	.pointBtn {
		display: flex;
		justify-content: flex-end;
		font-size: 16px;
		color: #FFFFFF;
		margin-top: 20px;
	}
	.pointBtn>div {
		width: 112px;
		height: 42px;
		border-radius: 100px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.pointBtn>div:hover {
		cursor: pointer;
	}
	.pointBtn>div:first-child {
		background: #DDDEE1;
		margin-right: 10px;
	}
	.pointBtn>div:nth-child(2) {
		background: #FFB132;
	}
</style>