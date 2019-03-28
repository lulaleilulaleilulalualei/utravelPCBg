<template>
	<div class="writeBox">
		<happy-scroll color="rgba(255,177,50,1)" size="2" hide-horizontal resize :scroll-top="c_backTopVal">
		<div class="writeLine">
			<writeTop @coverImg="coverImg" 
						@titleVal="titleVal"
						:hadCoverImg="hadCoverImg"
						:valTitle="valTitle"
						:coverType="coverType"></writeTop>
			<div class="lineContent">
				<div class="routeLineDesc">
					<el-input
						type="textarea"
						:autosize="{ minRows: 3}"
						v-model.trim="lineDescribe"
						placeholder="说说你的推荐理由..."
						resize="none">
					</el-input>
				</div>
				<div class="itemLine" v-loading="boxLoading">
					<!-- 日程大数组 -->
					<pointShow v-for="(item, index) in planRouteObj" 
								:pointInfo="item" 
								:index="index" 
								@deletePoint="deletePoint" 
								:key="item.id">
					</pointShow>
				</div>
				
				<!-- 外部编辑 -->
				<div class="addPlanDays" v-if="isShowAddPlanBox">
					<div class="dayInput">
						<input type="text" v-model.trim="planDays">
					</div>
					<div class="planEditBox" v-loading="dayPlanAddLoaing">
						<div class="planFirstSpot" v-if="isAddFirstSpot">
							<el-autocomplete
							  class="searchPort"
						      v-model.trim="portVal"
						      value-key="name"
						      prefix-icon="el-icon-search"
						      :fetch-suggestions="querySearch"
						      placeholder="请输入景点名称"
						      @select="firstHandleSelect"
						    >
						    	<template slot-scope="{ item }" v-if="isHasSearch">
						    		<div class="selfBox">
						    			暂无“{{searchText}}”相关景点信息您可以自定义添加地点
						    			<div class="selfBtn"><span>自定义</span></div>
						    		</div>
						    	</template>
						    </el-autocomplete>
						</div>
						<planEdit v-if="!isAddFirstSpot" 
									:firstArr="pointArr"
									@showFirstInput="showFirstInput"
									@planDayInfo = "planDayInfo"></planEdit>
					</div>
				</div>
				<!-- 增加行程安排 -->
				<div class="changeRoute">
					<div class="planRoute" @click="addPlan"><span>{{planText}}</span></div>
					<div class="attentionMatters" @click="addAttention"><span>注意事项</span></div>
				</div>

			</div>
			<div class="writeBottomLine">
				<div>
					<div @click="previewLine">预览</div>
					<div @click="nextLine">下一步</div>
				</div>
			</div>
		</div>
		</happy-scroll>
		
		<planDaySearch :routeObj="planRouteObj"></planDaySearch>
		
		<transition name="fade">
			<selfPoint v-if="wl_isShowSelf"></selfPoint>
		</transition>

		<transition name="fade">
			<template v-if="wl_isShowTag">
				<div class="lineTag">
					<div class="lineTagArea">
						<div class="lineTagBox">
							<div class="lineDays">
								<b>行程天数：</b>
								<div>
									<input type="text" v-model.number="allDays">天
								</div>
							</div>
							<div class="lineTags">
								<h4>添加标签</h4>
								<p>让线路信息更明确，方便更多粉丝自驾出游</p>
								<div class="tagList">
									<div :class="[{'selectedTag': item.isSelected}, 'itemTag']" v-for="(item, index) in tagList" @click="clickItemTag(index)">{{item.text}}</div>
								</div>
							</div>
							<div class="boxBtn">
								<div @click="closeTagBox">取消</div>
								<div @click="completeLine">发表</div>
							</div>
						</div>
					</div>
				</div>
			</template>
		</transition>

		<transition name="fade">
			<madeCode v-if="c_isShowMadeCode"
					:previewUrl="previewUrl"></madeCode>
		</transition>
		<transition name="fade">
			<showSpot v-if="c_isShowSpotContent.isShow"></showSpot>
		</transition>
		<transition name="fade">
			<attertionMatter v-if="wl_matterBox.isShow"></attertionMatter>
		</transition>
		<transition name="fade">
			<moreInfoSpot v-if="wl_addMoreInfoObj.isShow"></moreInfoSpot>
		</transition>
	</div>
</template>

<script>
	import writeTop from '../common/writeTop.vue'
	import pointShow from './pointShow.vue'
	import selfPoint from './selfPoint.vue'
	import lineTag from './lineTag.vue'
	import madeCode from '../common/madeCode.vue'
	import showSpot from '../common/showSpot.vue'
	import attertionMatter from './attentionMatter.vue'
	import planEdit from './planEdit.vue'
	import moreInfoSpot from './moreInfoSpot.vue'
	import planDaySearch from './planDaySearch.vue'
	import config from '@/config'
	import { mapGetters , mapActions } from 'vuex';
	
	export default {
		data() {
			return {
				planText: '安排行程',
				reasonVal: '',//
				searchTime: 0,//搜索关键词
				portVal: '',//搜索景点绑定值
				lineDescribe: '',//描述
				isHasSearch: false,//是否搜素到景点值
				searchText: '',//自定义搜索
				hadCoverImg: '',//封面图
				valTitle: '',//标题
				pointArr: [],//景点数组
				coverType: 'line',//封面类型
				boxLoading: false,//加载数组loading效果
				searchTimer: '',//定时索引
				// itemSpotId: '',
				tagList: [],
				planDays: '',
				days: 1,
				isShowAddPlanBox: false,
				isAddFirstSpot: true,
				dayPlanAddLoaing: false,
				planRouteObj: [] ,//行程大数组
				allDays: '', //默认
				isEditLine: false, //是否编辑线路
				previewUrl: '',//预览地址
				isShowPreview: false,//是否预览
				isSaveDraft: false,//是否保存草稿
				draftId: '',//草稿id
			}
		},
		components: {writeTop, pointShow, selfPoint, lineTag, madeCode, showSpot, attertionMatter, planEdit, moreInfoSpot, planDaySearch},
		watch: {
			wl_pointInfo(val) {
				if(this.isAddFirstSpot && !this.$api.isEmptyObject(val)) {
					this.isAddFirstSpot = false
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
					this.dayPlanAddLoaing = true
			        setTimeout(() => {
			        	this.dayPlanAddLoaing = false
			        }, 200)
				}	
			},
			wl_saveCount(val) {
				if(val.saveType == 1) {
					if(this.allDays === '') {
						this.allDays = 0
					}
					this.isSaveDraft = true
					this.testData()
				}else if(val.saveType == 2) {
					if(this.$route.query.id === undefined) {
						if(this.hadCoverImg !='' && 
							this.valTitle != '' && 
							this.$api.trim(this.lineDescribe) != '' && 
							this.planRouteObj.length != 0) {
							if(this.allDays === '') {
								this.allDays = 0
							}
							this.wl_canTellSave(true)
							this.isSaveDraft = true
							this.testData()
						}
					}
				}
			},
			wl_planSaveObj(val) {//日程编辑
				let index = val.index
				delete val.index
				this.planRouteObj.splice(index, 1, val)
				this.boxLoading = true
				setTimeout(() => {
					this.pointArr = []
					this.boxLoading = false
				}, 200)
			},
			c_isShowMadeCode(val) {
				if(!val) {
					this.isShowPreview = false
				}
			}
		},
		computed: {
			...mapGetters([
				'wl_isShowSelf',
				'wl_isShowTag',
				'wl_pointInfo',
				'c_backTopVal',
				'c_loadingVal',
				'wl_saveCount',
				'c_isShowMadeCode',
				'c_userInfo',
				'c_userVal',
				'c_isShowSpotContent',
				'wl_matterBox',
				'c_isEditPlaning',
				'wl_planSaveObj',
				'wl_addMoreInfoObj',
				'wl_isShowPlanList'
				])
		},
		methods: {
			...mapActions([
				'wl_showSelfLine',
				'wl_showTag',
				'wl_addressInfo',
				'c_showMadeCode',
				'wl_showSaveBtn',
				'c_loadingShow',
				'wl_lineMatter',
				'c_showSpotContent',
				'c_lineEditPlan',
				'wl_showPointInfo',
				'c_listUpdate',
				'wl_canTellSave',
				'vhl_changeTypeVal'
				]),
			showFirstInput(val) {//展示第一景点输入框
				this.isAddFirstSpot = val
				this.pointArr = []
			},
			planDayInfo(val) {//确认添加或者编辑
				this.planRouteObj.push({
					title: this.planDays,
					...val
				})
				this.boxLoading = true
				setTimeout(() => {
					this.days++
					this.isShowAddPlanBox = false
					this.isAddFirstSpot = true
					this.planDays = ''
					this.pointArr = []
					this.boxLoading = false
					this.planText = '增加行程'
				}, 200)
			},
			addPlan() {//增加行程
				if(!this.isShowAddPlanBox) {
					if(!this.c_isEditPlaning) {
						this.planDays = 'DAY ' + this.days
						this.isShowAddPlanBox = true
						this.c_lineEditPlan(true)
						this.planText = '取消当前行程'
					}else {
						this.$message({
				            type: 'info',
				            message: '您有正在编辑的日程安排!',
				            center: true
				          });
					}
				}else {
					this.c_lineEditPlan(false)
					this.isShowAddPlanBox = false
					this.isAddFirstSpot = true
					this.pointArr = []
					if(this.days == 1) {
			          	this.planText = '安排行程'
			        }else {
			        	this.planText = '增加行程'
			        }
				}	
			},
			addAttention() {//注意事项
				this.wl_lineMatter({isShow: true, text: this.wl_matterBox.text})
			},
			completeLine() {//创建线路
				if(this.$api.trim(String(this.allDays)) != '') {
					this.createLine()
					setTimeout(() => {
						this.wl_showTag(false)
					}, 300)
				}else {
					this.$message({
				        type: 'error',
				        message: '请输入行程天数',
				        center: true
				    });
				}
				
			},
			closeTagBox() {//取消发表
				this.wl_showTag(false)
			},
			clickItemTag(index) {//选择线路标签
				this.tagList.map((v, i) => {
					if(index == i) {
						v.isSelected? (v.isSelected = false) : (v.isSelected = true)
					}
				})
			},
			deletePoint(index) {//删除日程安排
				this.$confirm(`您将要删除 ${this.planRouteObj[index].title}的行程`, null, {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning',
		        }).then(() => {
		          this.$message({
		            type: 'success',
		            message: '删除成功!',
		            center: true
		          });
		          this.days--
		          if(this.days == 1 && !this.isShowAddPlanBox) {
		          	this.planText = '安排行程'
		          } 
		          this.planRouteObj.splice(index, 1)
		        }).catch(() => {
		          this.$message({
		            type: 'info',
		            message: '已取消删除',
		            center: true
		          });
		        });
			},
			coverImg(val) {//封面图
				this.hadCoverImg = val
			},
			titleVal(val) {//线路标题
				this.valTitle = val
			},
			previewLine() {//预览
				if(this.allDays === '') {
					this.allDays = 0
				}
				this.isShowPreview = true
				this.testData()
			},
			nextLine() {
				this.testData()
			},
			testData() {//下一步
				if(this.hadCoverImg) {
					if(this.valTitle != '') {
						if(this.$api.trim(this.lineDescribe) != '') {
							if(this.planRouteObj.length != 0) {
								if(this.isShowPreview || this.isSaveDraft) {
									this.createLine()
								}else {
									this.wl_showTag(true)
								}
							}else {
								this.$message({
						          message: '请添加至少一个行程',
						          type: 'error',
						          center: true
						        })
							}
						}else {
							this.$message({
					          message: '推荐理由不能为空哦~',
					          type: 'error',
					          center: true
					        })
						}
					}else {
						this.$message({
				          message: '请输入标题~',
				          type: 'error',
				          center: true
				        })
					}
				}else {
					this.$message({
			          message: '请选择封面图~',
			          type: 'error',
			          center: true
			        })
				}
			},
			querySearch(queryString, cb) {//景点检索
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
		    createFilter(queryString) {
		        return (restaurant) => {
		          return (restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) !== -1);
		        };
		    },
		    firstHandleSelect(item) {//第一景点输入框
		    	if(this.isHasSearch) {
		        	this.wl_addressInfo({})
		        	this.wl_showPointInfo({})
		        	this.wl_showSelfLine(true)
		        }else {
		        	this.getSpotDetail(item.id)
		        	this.portVal = ''
		        	this.dayPlanAddLoaing = true
		        	setTimeout(() => {
		        		this.dayPlanAddLoaing = false
		        	}, 200)
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
		    getLineTags() { //获取标签
		    	this.$api.getTags((data) => {
		    		let tags = data.split(',')
					tags.map((v, i) => {
						this.tagList.push({
							text: v,
							isSelected: false
						})
					})
		    	})
		    },
		    createLine() { //创建线路
		    	const $this = this
		    	let dataObj = {},citys = [], tags = [], url = '', 
		    		status = (this.c_userVal == 'admin')? 0: 4
		    	this.planRouteObj.map((v, i) => {
		    		v.nodes.map((item, j) => {
		    			citys.push(item.city)
		    		})
		    	})
		    	this.tagList.map((v, i) => {
		    		if(v.isSelected) {
		    			tags.push(v.text)
		    		}
		    	})
		    	if(!this.isEditLine) {
		    		url = (this.c_userVal == 'admin')? config.createLine: config.userCreateLine
		    	}else {
		    		url = (this.c_userVal == 'admin')? config.editLine: config.userEditLine
		    	}
		    	if(this.isSaveDraft || this.isShowPreview) {
		    		status = 1
		    	}
		    	dataObj = {
					title: $this.valTitle,
					coverImg: $this.hadCoverImg,
					backdropImg: $this.hadCoverImg,
					description: $this.lineDescribe,
					passPlace: JSON.stringify($this.planRouteObj),
					lng: $this.planRouteObj[0].nodes[0].lng,
					lat: $this.planRouteObj[0].nodes[0].lat,
					tags: tags.join(','),
					citys: citys.join(','),
					status: status,
					attentions: $this.wl_matterBox.text,
					dayNum: $this.allDays
				}
				// if(this.isSaveDraft || this.isShowPreview) {
				// 	dataObj.id = this.draftId
				// }
				if(this.draftId) {
					dataObj.id = this.draftId
				}
				if(this.isEditLine) {
					dataObj.id = this.draftId = Number(this.$route.query.id)
				}
		    	this.$api.ajax({
		    		url: url,
		    		method: "POST",
		    		headers: {
						'API-User-Token': $this.c_userInfo.token
					},
					data: dataObj,
					success: (res) => {
						if(res.code == 0) {
							if(!this.isShowPreview && !this.isSaveDraft) {
								this.c_listUpdate(true) //通知列表更新
								this.c_loadingShow()
								setTimeout(() => {
									if(this.c_userVal == 'admin') {
										this.$router.push({
											path: '/vHotLine',
										})
									}else {
										this.$router.push({
											path: '/hotLine',
										})
										this.vhl_changeTypeVal(4)
									}	
								}, 600);
								this.$message({
							        type: 'success',
							        message: !this.isEditLine? '线路创建成功': '线路修改成功',
							        center: true
							    });
							}else {
								if(this.isShowPreview) {
									this.getShareUrl(res.data)
									this.isShowPreview = false
								}
								if(this.isSaveDraft) {
									if(this.wl_saveCount.saveType == 1) {
										this.$message({
								          message: '草稿保存成功',
								          type: 'success',
								          center: true
								        })
									}
							        this.isSaveDraft = false
								}
								this.draftId = res.data
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
						// console.log(err)
						this.$message({
					        type: 'error',
					        message: '操作失败',
					        center: true
					    });
					}
		    	})
		    },
		    getShareUrl(id) { //获取预览地址
		    	 const $this = this
		        this.$api.ajax({
		        	url: `${config.shareUrl}/route`,
		        	headers: {
						'Content-Type':'application/x-www-form-urlencoded',
						'API-User-Token': $this.c_userInfo.token
					},
					success: (res) => {
						if(res.code == 0) {
							let time = new Date().getTime()
							this.previewUrl = `${res.data.split('?')[0]}?id=${id}&time=${time}`
							this.c_showMadeCode(true)
						}else {
							this.$message({
						        type: 'error',
						        message: res.message,
						        center: true
						    });
						}
					},
					error: () => {
						this.$message({
					        type: 'error',
					        message: '预览链接加载失败',
					        center: true
					    });
					}
		        })
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
							let reg = /<\/?.+?>/g
							this.pointArr.push({
								name: res.data.info.name,
								desc: res.data.info.desc.replace(reg,"\n"),
								thumb: res.data.info.thumbImg,
								address: res.data.info.address,
								lng: res.data.info.longitude,
								lat: res.data.info.latitude,
								city: res.data.info.city,
								id: res.data.info.id,
								hotelsOrfoods: []
							})
							this.isAddFirstSpot = false
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
			getDetailContent() {//获取详情，编辑使用
				const $this = this
				this.$api.ajax({
					url: `${this.c_userVal == 'admin'? config.lineDetail: config.userLineDetail}/${this.$route.query.id}`,
					headers: {
						'Content-Type':'application/x-www-form-urlencoded',
						'API-User-Token': $this.c_userInfo.token
					},
					success: (res) => {
						if(res.code == 0) {
							let reg = /<\/?.+?>/g
							this.valTitle = res.data.title
							this.hadCoverImg = res.data.coverImg
							this.lineDescribe = res.data.description
							this.planRouteObj = res.data.nodes
							this.wl_lineMatter({isShow: false, text: res.data.attentions.replace(reg,"\n")})
							this.allDays = res.data.dayNum
							this.tagList.map((v,i) => {
								res.data.tags.split(',').map((val, ind) => {
									if(v.text == val) {
										v.isSelected = true
									}
								})
							})
							this.days = res.data.nodes.length + 1
							this.planText = '增加行程'
							if(this.c_loadingVal) {
								this.c_loadingVal.close()
							}
						}else {
							this.$message({
						        type: 'error',
						        message: res.message,
						        center: true
						    });
						    if(this.c_loadingVal) {
								this.c_loadingVal.close()
							}
						}
					},
					error: (err) => {
						this.$message({
					        type: 'error',
					        message: '数据加载失败,可直接编辑覆盖',
					        center: true
					    });
					    if(this.c_loadingVal) {
							this.c_loadingVal.close()
						}
					}
				})
			},
		},
		mounted() {
			this.getLineTags() //标签加载
			this.wl_showSaveBtn(true) //保存草稿按钮显示
			this.c_lineEditPlan(false) //无论在何种情况下推出编辑页，默认重新进入，都是可编辑状态
			this.wl_canTellSave(false) //默认不可通知保存计时
			if(this.$route.query.id !== undefined) {
				this.getDetailContent()
				this.isEditLine = true
				this.draftId = this.$route.query.id
			}else {
				if(this.c_loadingVal) {
					this.c_loadingVal.close()
				}
				let defaultTxt = '1、检查户外装备是否齐全。遇旅途中出现意外事故，承办方有义务和责任为客人协助解决相关问题，但不负事故责任和经济赔偿，如产生赔偿将按保险公司规定赔偿。如遇人力不可抗拒因素所产生的费用由客人自理，如塌方、自然灾害等。\n2、车友必须身体健康，游程中应遵守纪律，发扬团结互助的精神，必须听从领队劝说不可擅自行动，否则后果自负。\n3、请配合领队及工作人员的安排，如由于车友自身原因放弃用餐及游览，并提前结束行程，所有费用不予退还。\n4、自驾车请保持在高速路上的车距，行驶中望车主自觉遵守相关交通规则，不随意超车，严禁在弯道处停车、听从领队安排协调。\n5、长时间在户外活动，请戴上太阳镜，涂抹防晒霜以护肤；爱护环境，安全第一，全部垃圾带出景区；'
				this.wl_lineMatter({isShow: false, text: defaultTxt})
			}
		}
	}
</script>

<style scoped>
	.writeBox {
		background-color: #fff;
		width: 100%;
		height: 100%;
		/* padding-bottom: 60px; */
		position: relative;
	}
	.writeLine {
		height: 100%;
		width: 100%;
		overflow-y: auto;
		position: relative;
	}
	.lineContent {
		padding: 15px 100px;
		min-height: 472px;
		width: 100%;
	}
	.itemLine {
		margin-top: 30px;
	}
	.addPlanDays {
		width: 100%;
		min-height: 273px;
		background: #FFFFFF;
		box-shadow: 0 0 14px 0 #ECEDF1;
		border-radius: 4px;
		margin-bottom: 20px;
	}
	.dayInput {
		width: 100%;
		height: 48px;
		border-bottom:1px solid #E6E6E6;
	}
	.dayInput>input {
		width: 100%;
		height: 100%;
		text-align: center;
		font-size: 20px;
		color: #9FA6AD;
	}
	.planEditBox {
		padding: 15px;
		height: auto;
		width: 100%;
	}
	.planFirstSpot {
		width: 100%;
		height: 40px;
		border: 1px solid #E6E6E6;
		border-radius: 4px;
		overflow: hidden;
	}

	.changeRoute {
		width: 100%;
		height: auto;
		margin-top: 30px;
	}
	.changeRoute>div {
		background: #FFFFFF;
		box-shadow: 0 0 14px 0 #ECEDF1;
		border-radius: 4px;
		height: 45px;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 16px;
		color: #373A3E;
	}
	.changeRoute>div:hover {
		cursor: pointer;
	}
	.changeRoute>div:first-child {
		margin-bottom: 15px;
	}
	.writeBottomLine {
		/* position: absolute; */
		/* bottom: 0; */
		/* left: 0; */
		width: 100%;
		padding: 0 20px;
	}
	.writeBottomLine>div {
		display: flex;
		justify-content: center;
		background-color: #fff;
		height: 60px;
		width: 100%;
		padding-top: 10px;
	}
	.writeBottomLine>div>div {
		width: 112px;
		height: 40px;
		border-radius: 100px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 16px;
	}
	.writeBottomLine>div>div:hover {
		cursor: pointer;
	}
	.writeBottomLine>div>div:first-child {
		background: #FFFFFF;
		box-shadow: 0 0 14px 0 #ECEDF1;
		color: #FFB132;
		margin-right: 60px;
	}
	.writeBottomLine>div>div:nth-child(2) {
		background: #FFB132;
		box-shadow: 0 0 14px 0 rgba(255,177,50,0.40);
		color: #fff;
	}

	.selfBox{
		font-size: 14px;
		color: #373A3E;
		text-align: center;
		width: 100%;
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

	.lineTag {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 50;
		width: 100%;
		height: 100%;
		background-color: rgba(0,0,0,0.29);
	}
	.lineTagArea {
		width: 1180px;
		height: 100%;
		padding-left: 300px;
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
		margin: 0 auto;
	}
	.lineTagBox {
		background-color: #fff;
		padding: 30px 15px 15px;
		border: 1px solid #DDDEE1;
		border-radius: 4px;
		width: 600px;
		height:  auto;
	}
	.lineDays {
		display: flex;
		align-items: center;
		margin-bottom: 15px;
	}
	.lineDays>b {
		font-size: 24px;
		color: #FFB132;
	}
	.lineDays>div {
		font-size: 16px;
		color: #9FA6AD;
		display: flex;
		align-items: center;
	}
	.lineDays>div>input {
		display: block;
		width: 80px;
		height: 32px;
		border-bottom: 1px solid #E6E6E6;
		text-align: center;
		font-size: 16px;
		color: #373A3E;
	}
	.lineTags>h4 {
		font-size: 24px;
		color: #FFB132;
		margin-bottom: 5px;
	}
	.lineTags>p {
		font-size: 14px;
		color: #929292;
		margin-bottom: 15px;
	}
	.tagList {
		display: flex;
		flex-wrap: wrap;
		margin-bottom: 20px;
	}
	.itemTag {
		padding: 10px 15px;
		border: 1px solid #DDDEE1;
		border-radius: 4px;
		font-size: 16px;
		color: #9FA6AD;
		margin-bottom: 10px;
		transition: all 0.2s;
	}
	.itemTag.selectedTag {
		background: #FFB132;
		border-color: transparent;
		color: #fff;
	}
	.itemTag:hover {
		cursor: pointer;
	}
	.itemTag:not(:first-child) {
		margin-left: 10px;
	}
	.boxBtn {
		display: flex;
		justify-content: flex-end;
	}
	.boxBtn>div {
		border-radius: 100px;
		width: 112px;
		height: 42px;
		font-size: 16px;
		color: #FFFFFF;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.boxBtn>div:hover {
		cursor: pointer;
	}
	.boxBtn>div:first-child {
		background: #DDDEE1;
		margin-right: 10px;
	}
	.boxBtn>div:nth-child(2) {
		background: #FFB132;
	}
</style>