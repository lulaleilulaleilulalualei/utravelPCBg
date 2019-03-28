<template>
	<div class="cityListBox cityIcon">
		<div class="provinceList cityIcon">
			<div class="proSearch cityIcon">
				<input class="cityIcon" @keyup.enter="searchPro" v-model="searchVal" type="text" placeholder="请输入以下省份">
			</div>
			<happy-scroll color="rgba(255,177,50,1)" hide-vertical size="2" resize :scroll-top="proScrollTop">
			
				<!-- <div class="cancelSelect cityIcon" @click="cancalSelect">取消选择</div>
				<div class="areaCity cityIcon" v-for="(item, index) in c_cityName" :key="index">
					<span class="tagNav cityIcon" :id="item.letter">{{item.letter}}</span>
					<div class="itemCity cityIcon" v-for="city in item.citys" :key="city.id" @click.stop="selectCity(city.name)">{{city.name}}</div>
				</div> -->
				<div class="provinceListBox cityIcon">
					<div :id="'s_'+index" :class="['itemShowProvince', 'cityIcon', {currentShow: item.isShow}]" v-for="(item, index) in c_proCitys" :key="index" @click="cutProvince(index)">
						<span class="cityIcon">{{item.shortName}}</span>
					</div>
				</div>
			</happy-scroll>
		</div>
		<div class="showCityBox cityIcon">
			<div class="itemShowCity left cityIcon" v-for="(item,index) in cityArr" :key="item.id" @click.stop="selectCity(item.shortName, item.mId ,item.tags)">
				<div class="cityIcon"><img class='cityIcon' :src="item.icon" alt=""></div>
				<span class="cityIcon">{{item.shortName}}</span>
			</div>
		</div>
	</div>
</template>

<script>
	import { mapGetters , mapActions } from 'vuex';
	
	export default {
		data() {
			return {
				cityArr: [],
				searchVal: '',
				proScrollTop: 0
			}
		},
		computed: {
			...mapGetters([
				'c_cityName',
				'c_cityObj',
				'vhl_lineType',
				'c_proCitys',
				'c_routeSave'
				])
		},
		methods: {
			...mapActions([
				'c_saveCityType',
				'vhl_changeTypeVal',
				'c_getCityName',
				'c_getProvinceCity'
				]),
			searchPro() {
				let proArr = this.c_proCitys.map((item) => item.shortName)
				if(proArr.indexOf(this.searchVal) != -1) {
					this.c_proCitys.map((v ,i) => {
						if(v.shortName == this.searchVal) {
							v.isShow = true
							this.cityArr = this.c_proCitys[i].cityList
							this.proScrollTop = this.$el.querySelector(`#s_${i}`).offsetTop
							this.searchVal = ''
						}else {
							v.isShow = false
						}
					})
				}else {
					this.$message({
					    type: 'info',
					    message: '需完全匹配列表中的省份名称！',
					    center: true
					});
				}
			},
			cutProvince(index) {
				this.c_proCitys.map((v, i) => {
					if(index == i) {
						v.isShow = true
						this.cityArr = this.c_proCitys[i].cityList
					}else {
						v.isShow = false
					}
				})
			},
			selectCity(name, mId, tags) {
				this.c_saveCityType({isShow: false})
				if(this.c_routeSave == '/uploadSpotImg') {
					this.$emit('getCityName', {name: name, mId: mId, tags: tags})
				}else {
					this.$emit('getCityName', name)
				}
			},
			clickBody() {
		    	let body = document.getElementsByTagName('body')[0] ||document.body
		    	const $this = this
		    	body.removeEventListener('click', $this.bindEvent.bind($this),false);
		    	body.addEventListener('click', $this.bindEvent.bind($this),false)
		    },
		    bindEvent(evt) {
		    	if(evt.target.className.indexOf('cityIcon') == -1) {
		    		this.c_saveCityType({isShow: false})
		    	}
		    },
		    cancalSelect() {
		    	this.c_saveCityType({isShow: false})
		    	this.$emit('getCityName', '选择区域')
		    }
		},
		mounted() {
			this.clickBody()
			// if(this.c_cityName.length == 0) {
			// 	this.$api.cityList((arr) => {
			// 		this.c_getCityName(arr)
			// 	})
			// }
			if(this.c_proCitys.length == 0) {
				this.$api.proAndCity((citys) => {
					this.cityArr = citys[0].cityList
					this.c_getProvinceCity(citys)
				})
			}else {
				this.c_proCitys.map((v, i) => {
					if(v.isShow) {
						this.cityArr = v.cityList
					}
				})
			}
		}
	}
</script>

<style scoped>
	.cityListBox {
		position: absolute;
		top:90px;
		right: 0;
		z-index: 30;
		height: 660px;
		width: 520px;
		overflow-y: auto;
		background-color: #fff;
		box-shadow: 0 0 6px 0 #FFB132;
		display: flex;
	}
	.provinceList {
		width: 160px;
		height: 100%;
		padding-top: 50px;
	}
	.proSearch {
		position: absolute;
		top: 0;
		left: 0;
		height: 50px;
		width: 160px;
		padding-top: 10px;
	}
	.proSearch>input {
		display: block;
		width: 90%;
		height: 30px;
		margin: 0 auto;
		background-color: #efefef;
		padding: 0 10px;
		border-radius: 15px;
		font-size: 14px;
	}
	.provinceListBox {
		width: 100%;
		height: 100%;
		overflow-y: auto;
	}
	.itemShowProvince {
		padding: 10px 10px 10px 20px;
		font-size: 16px;
		color: #9FA6AD;
		display: flex;
		align-items: center;
		background-color: #efefef;
	}
	.itemShowProvince:hover {
		cursor: pointer;
	}
	.currentShow {
		background-color: #fff;
	}
	.itemShowProvince.currentShow::before {
		position: absolute;
		left: 0;
		content: '';
		display: block;
		width: 3px;
		height: 20px;
		background-color: #FFB132;
	}

	.showCityBox {
		flex: 1;
		padding: 10px;
	}
	.itemShowCity {
		width: 78px;
		height: 100px;
		margin-bottom: 8px;
	}
	.itemShowCity:hover {
		cursor: pointer;
	}
	.itemShowCity:not(:nth-child(4n)) {
		margin-right: 8px;
	}
	.itemShowCity>div {
		width: 78px;
		height: 78px;
		background-color: #eee;
		margin-bottom: 5px;
		overflow: hidden;
		border-radius: 6px;
	}
	.itemShowCity>span {
		display: block;
		font-size: 14px;
		color: #373A3E;
		text-align: center;
		width: 100%;
		overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
	}
</style>