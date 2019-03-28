<template>
	<div class="spotLineMap">
		
	</div>
</template>

<script>
	
	export default{
		data() {
			return {
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
		        }
			}
		}
	}
</script>

<style scoped>
	
</style>