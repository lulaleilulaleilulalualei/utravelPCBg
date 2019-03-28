<template>
	<div class="infoPush">
		<happy-scroll color="rgba(255,177,50,1)" size="2" hide-horizontal  resize :scroll-top="c_backTopVal">
		<!-- <div class="contentBox"> -->
		<div class="pushType">
			<h3>推送类型</h3>
			<el-collapse v-model="typeName" accordion @change="typeChange">
			  <el-collapse-item name="1">
			  	<template slot="title">
			      <h4 class="pushHead">创建通知</h4>
			    </template>
			    <div class="pushTitle">
			    	<span>标题</span>
					<el-input v-model.trim="pushTitle" placeholder="填写推送标题"></el-input>
			    </div>
			    <div class="pushContent">
			    	<span>内容</span>
					<el-input
					  type="textarea"
					  :autosize="{ minRows: 5}"
					  placeholder="请填写推送内容"
					  v-model.trim="pushContent"
					  resize="none">
					</el-input>
			    </div>
			  </el-collapse-item>
			  <el-collapse-item name="2">
			  	<template slot="title">
			      <h4 class="pushHead">推送文章</h4>
			    </template>
			    <div class="pushSelect">
			    	<div class="selectType" >
			    		<el-radio-group v-model="typeSelect">
						   <el-radio :label="1">线路</el-radio>
						   <el-radio :label="2">活动</el-radio>
						</el-radio-group>
			    	</div>
			    	<div class="pushNum">
			    		<span>编号</span>
			    		<el-input v-model.trim="contentNum" placeholder="填写推送内容编号"></el-input>
			    	</div>
			    </div>
			    <div class="pushTitle">
			    	<span>标题</span>
					<el-input v-model="articleTitle" placeholder="填写推送标题"></el-input>
			    </div>
			  </el-collapse-item>
			</el-collapse>
		</div>
		<div class="userRange">
			<h3>用户范围</h3>
			<el-collapse v-model="rangeName" accordion @change="rangeChange">
			  <el-collapse-item name="1">
			  	<template slot="title">
			      <h4 class="pushHead">普通用户</h4>
			    </template>
			    <div class="rangeSelect">

			    	<div class="itemSelect" v-for="(item, index) in rangeUserLoad" :key="index">
			    		<div class="itemSelectRight" @click="cutUserRange(index)">
			    			<b :class="{hadSelect: item.isDefault}" ></b>
			    			<span>{{item.text}}</span>
			    		</div>
			    		<div v-if="item.type == 1" class="areaSelect">
			    			<el-autocomplete
						      class="inline-input"
						      v-model="provinceValUser"
						      value-key="shortName"
						      :fetch-suggestions="querySearchPro"
						      placeholder="请输入省份"
						      @select="handleProvinceSelect"
						      :disabled="!item.isDefault"
						      clearable
						    ></el-autocomplete>
						    <el-autocomplete
						      class="inline-input"
						      v-model="cityValUser"
						      value-key="shortName"
						      :fetch-suggestions="querySearchcity"
						      placeholder="请输入城市"
						      @select="handleCitySelect"
						      :disabled="!item.isDefault"
						      clearable
						    ></el-autocomplete>
			    		</div>
			    		<div v-if="item.type == 2" class="onlyObj">
			    			<el-autocomplete
						      class="inline-input"
						      v-model="onlyUser"
						      value-key="shortName"
						      :fetch-suggestions="querySearchUser"
						      placeholder="请输入账户名称"
						      @select="handleUserSelect"
						      :disabled="!item.isDefault"
						      clearable
						    ></el-autocomplete>
			    		</div>
			    	</div>
			    </div>
			  </el-collapse-item>
			  <el-collapse-item name="2">
			  	<template slot="title">
			      <h4 class="pushHead">自驾团用户</h4>
			    </template>
			    <div class="rangeSelect">
			    	<div class="itemSelect" v-for="(item, index) in rangeClubLoad" :key="index">
			    		<div class="itemSelectRight" @click="cutClubRange(index)">
			    			<b :class="{hadSelect: item.isDefault}"></b>
			    			<span>{{item.text}}</span>
			    		</div>
			    		<div v-if="item.type == 1" class="areaSelect">
			    			<el-autocomplete
						      class="inline-input"
						      v-model="provinceValClub"
						      value-key="shortName"
						      :fetch-suggestions="querySearchPro"
						      placeholder="请输入省份"
						      @select="handleProvinceSelect"
						      :disabled="!item.isDefault"
						      clearable
						    ></el-autocomplete>
						    <el-autocomplete
						      class="inline-input"
						      v-model="cityValClub"
						      value-key="shortName"
						      :fetch-suggestions="querySearchcity"
						      placeholder="请输入城市"
						      @select="handleCitySelect"
						      :disabled="!item.isDefault"
						      clearable
						    ></el-autocomplete>
			    		</div>
			    		<div v-if="item.type == 2" class="onlyObj">
			    			<el-autocomplete
						      class="inline-input"
						      v-model="onlyClub"
						      value-key="shortName"
						      :fetch-suggestions="querySearchClub"
						      placeholder="请输入账户名称"
						      @select="handleClubSelect"
						      :disabled="!item.isDefault"
						      clearable
						    ></el-autocomplete>
			    		</div>
			    	</div>
			    </div>
			  </el-collapse-item>
			</el-collapse>
		</div>
		<!-- </div> -->
		</happy-scroll>
		<div class="pushBtn">
			<span @click="toPushInfo">推送</span>
		</div>
	</div>
</template>

<script>
	import { mapGetters , mapActions } from 'vuex';
	import config from '@/config'
	
	export default {
		data() {
			return {
				typeName: '1',//通知类型
				rangeName: '1',//普通用户范围
				pushTitle: '', //推动标题 //通知
				pushContent: '',//推送内容 //通知
				contentNum: '',// 推动内容编号 //文章
				articleTitle: '',// 推动标题 //文章
				typeSelect: 1, //推送文章类型选择
				// userRange: 0,//普通用户范围
				provinceValUser: '',//省份搜索
				cityValUser: '', //城市搜索
				provinceValClub: '',//省份搜索
				cityValClub: '', //城市搜索
				onlyUser: '', //单独给某人
				onlyClub: '', //单独给某个自驾团
				userArr: [], //用户数组
				searchTime: 0,
				rangeUserLoad: [
					{
						text: '所有用户',
						isDefault: true,
						type: 0
					},
					{
						text: '地区',
						isDefault: false,
						type: 1
					},
					{
						text: '单个账号',
						isDefault: false,
						type: 2
					},
				],
				userType: 0,
				rangeClubLoad: [
					{
						text: '所有自驾团',
						isDefault: true,
						type: 0
					},
					{
						text: '地区',
						isDefault: false,
						type: 1
					},
					{
						text: '单个自驾团',
						isDefault: false,
						type: 2
					}
				],
				clubType: 0,
				areaId: '',
				userObjId: '',
				cityArr: [], //城市列表
				provinceId: ''
			}
		},
		computed: {
			...mapGetters([
				'c_loadingVal',
				'c_cityName',
				'c_provinceArr',
				'c_backTopVal',
				'c_userInfo',
				'c_proCitys'
				]),
			// cityArr() {
			// 	let arr = []
			// 	this.c_cityName.map((v, i) => {
			// 		v.citys.map((val) => {
			// 			arr.push(val)
			// 		})
			// 	})
			// 	return arr
			// }
		},
		watch: {
			provinceValUser(val) {
				if(val == '') {
					this.areaId = ''
					this.cityValUser = ''
					this.provinceId = ''
					this.cityArr = []
				}
			},
			cityValUser(val) {
				if(val == '') {
					this.areaId = this.provinceId
				}
			},
			provinceValClub(val) {
				if(val == '') {
					this.areaId = ''
					this.cityValClub = ''
					this.provinceId = ''
					this.cityArr = []
				}
			},
			cityValClub(val) {
				if(val == '') {
					this.areaId = this.provinceId
				}
			}
		},
		methods: {
			...mapActions([
				'c_getCityName',
				'c_getProvinceArr',
				'c_getProvinceCity'
				]),
			cutUserRange(index) {
				this.rangeUserLoad.map((v, i) => {
					if(index == i) {
						v.isDefault = true
						this.userType = v.type
						if(v.type != 1) {
							this.provinceValUser = ''
							this.cityValUser = ''
						}
						if(v.type != 2) {
							this.onlyUser = ''
						}
					}else {
						v.isDefault = false
					}
				})
			},
			cutClubRange(index) {
				this.rangeClubLoad.map((v, i) => {
					if(index == i) {
						v.isDefault = true
						this.clubType = v.type
						if(v.type != 1) {
							this.provinceValClub = ''
							this.cityValClub = ''
						}
						if(v.type != 2) {
							this.onlyClub = ''
						}
					}else {
						v.isDefault = false
					}
				})
			},
			// provinceFocus() {
			// 	if(this.rangeName == '1') {
			// 		this.cityValUser = ''
		 //    	}else if(this.rangeName == '2') {
		 //    		this.cityValClub = ''
		 //    	}
			// },
			// cityFocus() {
			// 	if(this.rangeName == '1') {
			// 		this.provinceValUser = ''
		 //    	}else if(this.rangeName == '2') {
		 //    		this.provinceValClub = ''
		 //    	}
			// },
			typeChange(val) {//推送类型切换
				if(val == '1' && this.rangeName == '2') {
					this.rangeName = '1'
				}

			},
			rangeChange(val) { //用户范围切换
				if(val == '2' && this.typeName == '1') {
					this.typeName = '2'
				}
			},
			querySearchClub(queryString, cb) { //自驾团搜索
				if(this.$api.trim(queryString) != '') {
					let nowTime = new Date().getTime()
					if(nowTime - this.searchTime < 500) {
						this.searchTime = nowTime
						clearTimeout(this.searchTimer)
						this.searchTimer = setTimeout(() => {
							this.seachGetData(queryString,(restaurants) => {
							    let results = restaurants.filter(this.createFilter(queryString));
							    cb(results);
							}, 1)
						},500 - (nowTime - this.searchTime))
					}else {
						this.searchTime = nowTime
						this.seachGetData(queryString,(restaurants) => {
							let results = restaurants.filter(this.createFilter(queryString));
							cb(results);
						}, 1)
					}
				}	
		    },
			querySearchPro(queryString, cb) { //省份搜索
		        var restaurants = this.c_proCitys;
		        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
		        cb(results);
		    },
		    querySearchUser(queryString, cb) { //账号搜索
		    	if(this.$api.trim(queryString) != '') {
		    		let nowTime = new Date().getTime()
					if(nowTime - this.searchTime < 500) {
						this.searchTime = nowTime
						clearTimeout(this.searchTimer)
						this.searchTimer = setTimeout(() => {
							this.seachGetData(queryString,(restaurants) => {
							    let results = restaurants.filter(this.createFilter(queryString));
							    cb(results);
							}, 2)
						},500 - (nowTime - this.searchTime))
					}else {
						this.searchTime = nowTime
						this.seachGetData(queryString,(restaurants) => {
							let results = restaurants.filter(this.createFilter(queryString));
							cb(results);
						}, 2)
					}
		    	} 
		    },
		    querySearchcity(queryString, cb) { //城市搜索
		        var restaurants = this.cityArr;
		        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
		        cb(results);
		    },
		    createFilter(queryString) {
		        return (restaurant) => {
		          return (restaurant.shortName.toLowerCase().indexOf(queryString.toLowerCase()) !== -1);
		        };
		    },
		    handleProvinceSelect(val) { //省份选择
		    	this.areaId = ''
		    	this.areaId = val.pId
		    	this.provinceId = val.pId
		    	this.cityArr = val.cityList
		    	// console.log(this.areaId)
		    	if(this.rangeName == '1') {
					this.cityValUser = ''
		    	}else if(this.rangeName == '2') {
		    		this.cityValClub = ''
		    	}
				
		    },
		    handleCitySelect(val) {//城市选择
		    	this.areaId = ''
		    	this.areaId = val.id
		    	// console.log(this.areaId)
		    },
		    handleUserSelect(val) {//用户选择
		    	this.userObjId = ''
		    	this.userObjId = val.id
		    },
		    handleClubSelect(val) {//自驾团选择
		    	this.userObjId = ''
		    	this.userObjId = val.id
		    },
		    seachGetData(keyword,callback, type) { //获取用户
		    	let url = '',params = {}
		    	if(type == 1) {
		    		url = config.getAllClub
		    		params = {
						keyword: keyword
					}
		    	}else if(type == 2) {
		    		url = config.getUserList
		    		params = {
						nickname: keyword
					}
		    	}
		    	const $this = this
		    	this.$api.ajax({
		    		url: url,
		    		method: "POST",
		    		headers: {
						'Content-Type':'application/x-www-form-urlencoded',
						'API-User-Token': $this.c_userInfo.token
					},
					params: params,
					success: (res) => {
						if(res.code == 0) {
							if(res.data.length != 0) {
								let arr = []
								if(type == 1) {
									res.data.map((v,i) => {
										arr.push({
											shortName: v.clubName,
											id: v.clubId
										})
									})
								}else {
									res.data.map((v,i) => {
										arr.push({
											shortName: v.nickName,
											id: v.uid
										})
									})
								}
								typeof callback == 'function' && callback(arr)
							}else {
								let txt = ''
								if(type == 1) {
									txt = '未获取到相关自驾团'
								}else {
									txt = '未获取到相关用户'
								}
								this.$message({
							        type: 'info',
							        message: txt,
							        center: true
							    });
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
						let txt = ''
						if(type == 1) {
							txt = '自驾团获取失败'
						}else {
							txt = '用户获取失败'		
						}
						this.$message({
					        type: 'error',
					        message: txt,
					        center: true
					    });
					}
		    	})
		    },
		    toPushInfo() { //推送消息
		    	// console.log(this.areaId)
		    	if(this.areaId == "000000") {
		    		this.$message({
						type: 'info',
						message: '请选择相关直辖市',
						center: true
					});
					return
		    	}
		    	if(this.typeName == '1') {
		    		if(this.rangeName == '1') { //文本消息只推送普通用户
		    			if(this.pushTitle != '') {
		    				if(this.pushContent != '') {
		    						if(this.userType == 1) {
		    							if(this.areaId != '') {
		    								this.pushInfoMethod(config.pushText, 1)
		    							}else {
		    								this.$message({
										        type: 'error',
										        message: '请选择省或者城市',
										        center: true
										    });
		    							}
		    						}else if(this.userType == 2) {
		    							if(this.userObjId != '') {
		    								this.pushInfoMethod(config.pushText, 1)
		    							}else {
		    								this.$message({
										        type: 'error',
										        message: '请选择用户对象',
										        center: true
										    });
		    							}
		    						}else {
		    							this.pushInfoMethod(config.pushText, 1)
		    						}
		    				}else {
		    					this.$message({
							        type: 'error',
							        message: '推送内容不能为空',
							        center: true
							    });
		    				}
		    			}else {
		    				this.$message({
						        type: 'error',
						        message: '推送标题不能为空',
						        center: true
						    });
		    			}
		    		}else {
		    			this.$message({
						    type: 'error',
						    message: '请选择推送的用户类型',
						    center: true
						});
		    		}
		    	}else if(this.typeName == '2'){
		    		if(this.articleTitle != '') {
		    			if(this.contentNum != '') {
		    				if(this.rangeName != '') {
		    					if(this.rangeName == '1') {
		    						if(this.userType == 1) {
		    							if(this.areaId != '') {
		    								this.pushInfoMethod(config.pushArticle, 2 , 1)
		    							}else {
		    								this.$message({
										        type: 'error',
										        message: '请选择省或者城市',
										        center: true
										    });
		    							}
		    						}else if(this.userType == 2) {
		    							if(this.userObjId != '') {
		    								this.pushInfoMethod(config.pushArticle, 2 , 1)
		    							}else {
		    								this.$message({
										        type: 'error',
										        message: '请选择用户对象',
										        center: true
										    });
		    							}
		    						}else {
		    							this.pushInfoMethod(config.pushArticle, 2 , 1)
		    						}
					    			
					    		}else if(this.rangeName == '2') {
					    			if(this.clubType == 1) {
		    							if(this.areaId != '') {
		    								this.pushInfoMethod(config.pushArticle, 2, 2)
		    							}else {
		    								this.$message({
										        type: 'error',
										        message: '请选择省或者城市',
										        center: true
										    });
		    							}
		    						}else if(this.clubType == 2) {
		    							if(this.userObjId != '') {
		    								this.pushInfoMethod(config.pushArticle, 2, 2)
		    							}else {
		    								this.$message({
										        type: 'error',
										        message: '请选择用户对象',
										        center: true
										    });
		    							}
		    						}else {
		    							this.pushInfoMethod(config.pushArticle, 2, 2)
		    						}
					    		}
		    				}else {
		    					this.$message({
							        type: 'error',
							        message: '请选择推送的用户类型',
							        center: true
							    });
		    				}
		    			}else {
		    				this.$message({
							    type: 'error',
							    message: '内容编号不能为空',
							    center: true
							});
		    			}
		    		}else {
		    			this.$message({
						    type: 'error',
						    message: '推送标题不能为空',
						    center: true
						});
		    		}
		    	}
		    },
		    pushInfoMethod(url, type, rangeType) {
		    	const $this = this
		    	let dataObj = {}
		    	if(type == 1) { //推送文本到普通用户
		    		dataObj = {
		    			title: this.pushTitle,
		    			msg: this.pushContent,
		    			formType: 1,
		    			type: this.userType,
		    		}
		    		if(this.userType == 0) {
		    			dataObj.id = 0
		    		}else if(this.userType == 1) {
		    			dataObj.id = this.areaId
		    		}else if(this.userType == 2) {
		    			dataObj.id = this.userObjId
		    		}
		    	}else {
		    		if(rangeType == 1) {//推送文章到普通用户
		    			dataObj = {
		    				title: this.articleTitle,
		    				bizType: this.typeSelect,
		    				bizId: this.contentNum,
		    				formType: 1,
		    				type: this.userType,
		    			}
		    			if(this.userType == 0) {
			    			dataObj.id = 0
			    		}else if(this.userType == 1) {
			    			dataObj.id = this.areaId
			    		}else if(this.userType == 2) {
			    			dataObj.id = this.userObjId
			    		}
		    		}else {
		    			dataObj = {//推送文章自驾团
		    				title: this.articleTitle,
		    				bizType: this.typeSelect,
		    				bizId: this.contentNum,
		    				formType: 2,
		    				type: this.clubType,
		    			}
		    			if(this.clubType == 0) {
			    			dataObj.id = 0
			    		}else if(this.clubType == 1) {
			    			dataObj.id = this.areaId
			    		}else if(this.clubType == 2) {
			    			dataObj.id = this.userObjId
			    		}
		    		}
		    	}
		    	// console.log(dataObj)
				this.$api.ajax({
					url: url,
					method: 'POST',
					headers: {
						'API-User-Token': $this.c_userInfo.token
					},
					data: dataObj,
					success: (res) => {
						if(res.code == 0) {
						    this.pushTitle = '' //推动标题 //通知
							this.pushContent = ''//推送内容 //通知
							this.contentNum = ''// 推动内容编号 //文章
							this.articleTitle = ''// 推动标题 //文章
							this.typeSelect = 1 //推送文章类型选择
							this.provinceValUser = ''//省份搜索
							this.cityValUser = '', //城市搜索
							this.provinceValClub = ''//省份搜索
							this.cityValClub = '' //城市搜索
							this.onlyUser = '' //单独给某人
							this.onlyClub = '' //单独给某个自驾团
							this.$message({
						        type: 'success',
						        message: '推送成功',
						        center: true
						    });
						}else {
							this.$message({
						        type: 'error',
						        message: res.message,
						        center: true
						    });
						}
					},
					error: (err) => {
						this.$message({
					        type: 'error',
					        message: '推送失败',
					        center: true
					    });
					}
				})
		    }
		},
		mounted() {
			if(this.c_loadingVal) {
				this.c_loadingVal.close()
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
			if(this.c_proCitys.length == 0) {
				this.$api.proAndCity((citys) => {
					this.c_getProvinceCity(citys)
				})
			}
		}
	}
</script>

<style scoped>
	.infoPush {
		width: 100%;
		height: 100%;
		flex: 1;
		background-color: #fff;
		padding: 30px 30px 50px;
		position: relative;
	}
	.contentBox {
		height: auto;
		width: 780px;
		overflow-x: hidden;
		overflow-y: auto;
	}
	.pushType {
		margin-bottom: 30px;
	}
	.pushType>h3, .userRange>h3 {
		font-size: 18px;
		color: #373A3E;
		margin-bottom: 10px;
		display: flex;
		align-items: center;
	}
	.pushType>h3::before, .userRange>h3::before {
		content: '';
		display: block;
		width: 4px;
		height: 20px;
		background-color: #FFB132;
		margin-right: 10px;
	}
	.pushHead {
		font-size: 16px;
		color: #FFB132;
		margin-bottom: 15px;
	}
	.pushTitle, .pushContent, .pushNum {
		display: flex;
	}
	.pushTitle>span, .pushContent>span, .pushNum>span {
		display: block;
		width: 50px;
		font-size: 16px;
		color: #373A3E;
		font-weight: 600;
	}
	.pushTitle {
		margin-bottom: 10px;
		align-items: center;
	}
	.pushContent>span{
		position: relative;
		top: 8px;
	}
	.pushSelect {
		display: flex;
		align-items: center;
		margin-bottom: 10px;
	}
	.selectType {
		margin-right: 50px;
	}
	.pushNum {
		flex: 1;
		align-items: center;
	}
 	.rangeSelect {

 	}
 	.itemSelect {
 		display: flex;
 		align-items: center;
 		margin-bottom: 10px;
 	}
 	.itemSelectRight {
 		display: flex;
 		align-items: center;
 		margin-right: 15px;
 		width: 105px;
 	}
 	.itemSelectRight>b {
 		display: block;
 		width: 10px;
 		height: 10px;
 		border-radius: 50%;
 		border: 1px solid #DDDEE1;
 		margin-right: 15px;
 		transition: all 0.2s;
 	}
 	.itemSelectRight:hover{
 		cursor: pointer;
 	}
	.itemSelectRight>b.hadSelect {
		border-color: transparent;
		background-color: #FFB132;
	}
	.itemSelectRight>span {
		font-size: 16px;
		color: #373A3E;
	}
	.areaSelect>div {
		margin-right: 15px;
	}
	.userName {
		color: #606266;
    	font-size: 14px;
	}
	.userId {
		color: #9FA6AD;
		font-size: 12px;
	}
	.pushBtn {
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 50px;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #fff;
	}
	.pushBtn>span {
		display: block;
		padding: 10px 40px;
		background: #FFB132;
		border-radius: 100px;
		font-size: 16px;
		color: #FFFFFF;
	}
	.pushBtn>span:hover {
		cursor: pointer;
	}
	.el-collapse {
		padding-left: 10px;
	}
</style>