<template>
	<div class="planEdit">
			<div class="playMoreSpot">
				<div class="pointList">
					<div class="itemSpotName" @click="lookSpotDetail(item.id, item.type, index)" v-for="(item, index) in pointArr" :key="index">
						<span>{{item.name}}</span>
						<b @click.stop="cancelSelectSpot(index)"></b>
					</div>
				</div>
			<div class="pointSelect">
				<div class="spotSelect">
					<el-autocomplete
						class="searchPort"
						v-model.trim="portVal"
						value-key="name"
						prefix-icon="el-icon-search"
						:fetch-suggestions="querySearch"
						placeholder="请输入景点名称"
						@select="moretHandleSelect"
					>
						<template slot-scope="{ item }" v-if="isHasSearch">
							<div class="selfBox">
								暂无“{{searchText}}”相关景点信息您可以自定义添加地点
								<div class="selfBtn"><span>自定义</span></div>
							</div>
						</template>
					</el-autocomplete>
				</div>
				<div class="hotelSelect" @click.stop="joinMoreSpot(1)"><span>住宿(选填)</span></div>
				<div class="cateSelect" @click.stop="joinMoreSpot(2)">美食(选填)</div>
			</div>
				<div class="shareDaySuggest">
					<el-input
						type="textarea"
						:autosize="{ minRows: 5}"
						v-model.trim="desc"
						resize="none"
						placeholder="分享你的玩法或建议，让大家来崇拜你吧！">
					</el-input>
				</div>
				<div class="playDaySave">
					<div @click.stop="trueEditSpot">保存</div>
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
				isHasSearch: false,//是否搜素到景点值
				pointArr: [],
				searchTime: 0,
				searchText: '',//自定义搜索
				portVal: '',//搜索绑定
				desc: '',//玩法
				isEditInfo: false,
				editInfoIndex: null,
			}
		},
		props: {
			firstArr: {
				validator: (val) => {
					if(val) {
						return true
					}
				}
			},
			propSuggest: {
				type: String,
				default: ''
			}
		},
		components: {},
		computed: {
			...mapGetters([
				'wl_pointInfo',
				'wl_isShowSelf',
				'c_isShowSpotContent',
				'c_userInfo',
				'wl_addMoreInfoObj',
				'c_userVal'
				])
		},
		watch: {
			wl_pointInfo(val) {
				if(!this.$api.isEmptyObject(val)) {
					this.pointArr.push({
						name: val.name,
						desc: val.desc,
						thumb: val.thumbImg,
						address: val.address,
						lng: val.longitude,
						lat: val.latitude,
						city: val.city,
						id: val.id,
						hotelsOrfoods: []
					})
				}	
			},
			wl_addMoreInfoObj(val) {
				if(!this.$api.isEmptyObject(val.infoObj)) {
					if(val.isEdit) {
						this.pointArr.splice(this.editInfoIndex, 1, val.infoObj)
					}else {
						this.pointArr.push(val.infoObj)
					}
				}
				
			}
		},
		methods: {
			...mapActions([
				'c_showSpotContent',
				'wl_addressInfo',
				'wl_showSelfLine',
				'c_lineEditPlan',
				'wl_addMOreINfo',
				'wl_showPointInfo'
				]),
			joinMoreSpot(type) {
				if(this.pointArr.length != 0) {
					this.wl_addMOreINfo({type: type, isShow: true, infoObj: {}, isEdit: false})
				}else {
					this.$message({
					    message: '请先选择景点',
					    type: 'info',
					    center: true
					})
				}
			},
			cancelSelectSpot(index) {
				let isFirst = false
				this.pointArr.map((v, i) => {
					if(v.hasOwnProperty('hotelsOrfoods') && index == 0) {
						isFirst = true
					}
				})


				if(!isFirst) {
					this.pointArr.splice(index, 1)
					if(this.pointArr.length == 0) {
						this.$emit('showFirstInput', true)
					}
				}else {
					this.$confirm(`您正在删除第一个景点，删除后，后面的住宿或者美食就被同步删除`, null, {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				          type: 'warning',
				   	}).then(() => {
				          this.$message({
				            type: 'success',
				            message: '删除成功!',
				            center: true
				          });
				          let count = 0, index = 0
				          	this.pointArr.map((v, i) => {
				          		if(v.hasOwnProperty('hotelsOrfoods')) {
				          			count++
				          		}
				          		if(count == 2) {
				          			index = i
				          		}
				          	})
				          	if(count > 1) {
				          		this.pointArr.splice(0, index)
				          	}else {
				          		this.pointArr = []
				          		this.$emit('showFirstInput', true)
				          	}	
				    }).catch(() => {

				    });
				}				
			},
			lookSpotDetail(id, type, index) {
				if(type) {
					this.wl_addMOreINfo({type: type, isShow: true, infoObj: this.pointArr[index], isEdit: true})
					this.editInfoIndex = index
				}else {
					if(this.pointArr[index].isSelfAdd) {

					}else {
						this.c_showSpotContent({id: id, isShow: true})
					}
				}
			},
			querySearch(queryString, cb) {
				let nowTime = new Date().getTime()
				if(nowTime - this.searchTime < 500) {
					this.searchTime = nowTime
					clearTimeout(this.searchTimer)
					this.searchTimer = setTimeout(() => {
						this.loadAll(queryString, (restaurants) => {
						    let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
						    if(results.length == 0 && queryString != '') {
						       	this.isHasSearch = true
						        this.searchText = queryString
						        results = ['']
						    }else {
						       	this.isHasSearch = false
						    }
						    cb(results);
						})
					},500 - (nowTime - this.searchTime))
				}else {
					this.searchTime = nowTime
					this.loadAll(queryString, (restaurants) => {
					    let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
					    if(results.length == 0 && queryString != '') {
					       	this.isHasSearch = true
					        this.searchText = queryString
					        results = ['']
					    }else {
					       	this.isHasSearch = false
					    }
					    cb(results);
					})
				}
			},
			moretHandleSelect(item) {
			    if(this.isHasSearch) {
			        this.wl_addressInfo({})
			        this.wl_showPointInfo({})
			        this.wl_showSelfLine(true)
			    }else {
			        	// this.passPlace.push(item)
			        this.getSpotDetail(item.id)
			        this.portVal = '' 
			    }

			},
			loadAll(keyword,callback) { //搜索景点列表
		    	if(this.$api.trim(keyword) != '') {
		    		const $this = this
					this.$api.ajax({
						url: config.getAllSpot,
						method: "POST",
						headers: {
							'Content-Type':'application/x-www-form-urlencoded',
							'API-User-Token': $this.c_userInfo.token
						},
						params: {
							keyword: keyword
						},
						success: (res) => {
							if(res.code == 0) {
								typeof callback == 'function' && callback(res.data)
							}else {
								this.$message({
						          message: res.message,
						          type: 'error',
						          center: true
						        })
							}
						},
						error: (err) => {
							this.$message({
					          message: '获取景点列表失败',
					          type: 'error',
					          center: true
					        })
						}
					})
		    	}
		    },
			getSpotDetail(id) { //景点详情
				const $this = this
				this.$api.ajax({
					url: `${this.c_userVal == 'admin'? config.spotDetail: config.userSpotDetail}/${id}`,
					headers: {
						'Content-Type':'application/x-www-form-urlencoded',
						'API-User-Token': $this.c_userInfo.token
					},
					success: (res) => {
							if(res.code == 0) {
								this.pointArr.push({
									name: res.data.info.name,
									desc: res.data.info.desc,
									thumb: res.data.info.thumbImg,
									address: res.data.info.address,
									lng: res.data.info.longitude,
									lat: res.data.info.latitude,
									city: res.data.info.city,
									id: res.data.info.id,
									hotelsOrfoods: []
								})
							}else {
								this.$message({
							        type: 'error',
							        message: res.message,
							        center: true
							    });
							}
						},
					error: (err) => {
							// console.log(err)
							this.$message({
						        type: 'error',
						        message: '获取景点信息失败',
						        center: true
						    });
						}
					})
		    },
		    createFilter(queryString) {
		        return (restaurant) => {
		          return (restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) !== -1);
		        };
		    },
			trueEditSpot() {
				if(this.pointArr.length != 0) {
					let arr = [], listArr = this.pointArr
	
					for(let i=0;i<listArr.length;i++) {
						if(!listArr[i].hasOwnProperty('hotelsOrfoods')) {
							arr[arr.length-1].hotelsOrfoods.push(listArr[i])
						}else {
							arr.push(listArr[i])
						}
					}
					this.$emit('planDayInfo', {
						nodes: arr,
						desc: this.desc
					})
					this.c_lineEditPlan(false)
				}else {
					this.$message({
						type: 'error',
						message: '请添加至少一个景点',
						center: true
					});
				}
				 
			}
		},
		mounted() {
			let arr = [],
				reg = /<\/?.+?>/g
			if(this.firstArr) {
				this.firstArr.map((v, i) => {
					if(v.hotelsOrfoods.length != 0) {
						arr.push(v)
						arr.push(...v.hotelsOrfoods)
					}else {
						arr.push(v)
					}
				})
				arr.map((v, i) => {
					if(v.hasOwnProperty('hotelsOrfoods')) {
						v.hotelsOrfoods = []
					}
				})
			}
			this.pointArr = arr
			this.desc = this.propSuggest.replace(reg,"\n") || ''
		}
	}
</script>

<style scoped>
	.playMoreSpot {
		width: 100%;
		height: auto;
	}
	.pointList {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
	}
	.pointList>div {
		position: relative;
		width: 104px;
		height: 57px;
		border: 1px solid #FFB132;
		border-radius: 4px;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0 10px;
		margin-bottom: 10px;
	}
	.pointList>div:hover {
		cursor: pointer;
	}
	.pointList>div:not(:last-child) {
		margin-right: 15px;
	}
	.itemSpotName>span {
		display: block;
		width: 100%;
		overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        font-size: 14px;
		color: #9FA6AD;
		text-align: center;
	}
	.itemSpotName>b {
		position: absolute;
		right: -7px;
		top: -7px;
		width: 14px;
		height: 14px;
		background: url('../../assets/img/delete_spot.png') no-repeat center;
		background-size: 100%;
	} 
	.pointSelect {
		display: flex;
		align-items: center;
		margin-bottom: 10px;
	}
	.pointSelect>div {
		border: 1px solid #E6E6E6;
		border-radius: 4px;
	}
	.pointSelect>div:not(:last-child) {
		margin-right: 10px;
	}
	.pointSelect>div:not(:first-child) {
		width: 105px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 16px;
		color: #9FA6AD;
	}
	.spotSelect {
		height: 40px;
		flex: 1;
		overflow: hidden;
	}
	.selfBox{
		width: 100%;
		font-size: 14px;
		color: #373A3E;
		text-align: center;
		overflow: hidden;
		overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
	}
	.selfBtn {
		margin-left: 20px;
	}
	.selfBtn>span {
		font-size: 12px;
		color: #fff;
		display: block;
		border-radius: 10px;
		margin-left: 10px;
		width: 50px;
		height: 20px;
		margin: 0 auto;
		text-align: center;
		line-height: 20px;
		background-color: #FFB132;
	}
	.shareDaySuggest {
		width: 100%;
		height: auto;
		/* border: 1px solid #E6E6E6; */
		border-radius: 4px;
		/* padding: 10px 15px; */
		margin-bottom: 15px;
	}
	/* .shareDaySuggest>textarea {
		font-size: 16px;
		color: #373A3E;
		width: 100%;
		height: 100%;
		resize: none;	
	}
	.shareDaySuggest>textarea::-webkit-scrollbar {
		display: none;
	} */
	.playDaySave {
		display: flex;
		justify-content: flex-end;
	}
	.playDaySave>div {
		height: 30px;
		width: 58px;
		border-radius: 14.5px;
		font-size: 14px;
		color: #FFFFFF;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #FFB132;
	}
	.playDaySave>div:hover {
		cursor: pointer;
	}
	.hotelSelect:hover,.cateSelect:hover {
		cursor: pointer;
	}
</style>