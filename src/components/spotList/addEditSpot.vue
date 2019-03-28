<template>
	<div class="editBox">
		<happy-scroll color="rgba(255,177,50,1)" size="3" hide-horizontal resize>
			<div class="editSpot">
				<writeTop @coverImg="coverImg" 
							@titleVal="titleVal"
							:hadCoverImg="hadCoverImg"
							:valTitle="valTitle"
							:coverType="coverType"
							:isEditSpot="isEditSpot"></writeTop>
				<div class="editArea">
					<div class="addPointImg">
						<el-upload
							:action= "imgUrl"
							name="files"
							:headers= "imgHeader"
							:multiple= "isMultiple"
							list-type="picture-card"
							:file-list="fileList"
							:on-preview="handlePictureCardPreview"
							:on-remove="handleRemove"
							:on-success="handSuccess"
							:on-error="handError"
							:disabled="isAddType">
							<i class="el-icon-plus"></i>
						</el-upload>
						<el-dialog :visible.sync="dialogVisible">
							<img width="100%" :src="dialogImageUrl" alt="">
						</el-dialog>
					</div>
					<div class="optionalInput">
						<div>
							<input type="text" placeholder="景点电话（选填）" :class="{disabled: isEditSpot}" :disabled="isEditSpot" v-model.trim="pointPhone" @blur="optionalBlur('phone')">
						</div>
						<div>
							<input type="text" placeholder="景点网址（选填）" :class="{disabled: isEditSpot}" :disabled="isEditSpot" v-model.trim="pointURL" @blur="optionalBlur('URL')">
						</div>
					</div>
					<div class="addPointAddress" @click="jumpToMap">
						<p :class="es_mapInfo.address && 'detailAddress'">{{es_mapInfo.address || '详细地址'}}</p>
						<div><b></b></div>
					</div>
					<div class="pointDescription">
						<span>景区概况：</span>
						<el-input
						  type="textarea"
						  :autosize="{ minRows: sizeValue}"
						  :disabled="isEditSpot"
						  v-model="pointDes"
						  resize="none">
						</el-input>
					</div>
					<div class="pointDescription">
						<span>交通提示（选填）:</span>
						<el-input
						  type="textarea" 
						  :autosize="{ minRows: sizeValue}"
						  :disabled="isEditSpot"
						  v-model="trafficNotice"
						  @blur="optionalBlur('traffice')"
						  resize="none">
						</el-input>
					</div>
					<div class="pointDescription">
						<span>门票提示（选填）:</span>
						<el-input
						  type="textarea"
						  :autosize="{ minRows: sizeValue}"
						  :disabled="isEditSpot"
						  v-model="ticketsNotice"
						  @blur="optionalBlur('tickets')"
						  resize="none">
						</el-input>
					</div>
					<div class="pointDescription">
						<span>营业时间:</span>
						<el-input
						  type="textarea"
						  :autosize="{ minRows: sizeValue}"
						  :disabled="isEditSpot"
						  v-model="businessTime"
						  resize="none">
						</el-input>
					</div>
					<div class="pointTypeSelect">
						<div class="doBusinessTime">
							<input type="text" placeholder="用时参考（选填）" :class="{disabled: isEditSpot}" :disabled="isEditSpot" v-model.trim="travelTime" @blur="optionalBlur('time')">
						</div>
						<el-select v-model="seasonVal" multiple :multiple-limit="mulLimit" clearable placeholder="最佳季节（可多选）" @change="seasonChange" :disabled="isEditSpot">
							<el-option
								v-for="item in seasonOptions"
								:key="item.value"
								:label="item.label"
								:value="item.label">
							</el-option>
						</el-select>
					</div>
					<div class="pointTypeSelect">
						<el-select v-model="gradeVal" clearable placeholder="景区星级（选填）" @change="pointGrade" :disabled="isEditSpot">
							<el-option
								v-for="item in gradeOptions"
								:key="item.value"
								:label="item.label"
								:value="item.value">
							</el-option>
						</el-select>
						<el-select v-model="tagsVal" multiple :multiple-limit="mulLimit" clearable placeholder="标签（可多选）" @change="tagsSelect" :disabled="isEditSpot">
							<el-option
								v-for="item in tagsOptions"
								:key="item.value"
								:label="item.label"
								:value="item.label">
							</el-option>
						</el-select>
					</div>
					<div class="pointTypeSelect">
						<el-input v-model.number="sortStr" clearable placeholder="排序字段（默认100）" :disabled="isEditSpot" ></el-input>
					</div>
				</div>
			</div>	
		</happy-scroll>
		<div class="editBtn">
			<span  @click="clickBtnEvent">{{btnText}}</span>
		</div>
		
		<transition name="fade">
			<mapBox v-if="es_isShowMap"></mapBox>
		</transition>
		<transition name="fade">
			<listImg v-if="c_isShowImgList" 
					:imgList="imgArr"
					:isDisabled="isEditSpot"
					@getImgList="getImgList"></listImg>
		</transition>
	</div>
</template>

<script>
	import writeTop from '../common/writeTop.vue'
	import mapBox from './showMap.vue'
	import listImg from './listImg.vue'
	import { mapGetters , mapActions } from 'vuex';
	import config from '@/config'

	export default {
		data() {
			return {
				sizeValue: 3,//文本框大小
				hadCoverImg: '',
				valTitle: '',//景点标题
				coverType: 'spot',
				dialogImageUrl: '',
        		dialogVisible: false,
        		seasonVal: [],//最佳季节
        		pointDes: '',//景区概括
        		pointPhone: '',//景点电话
        		pointURL: '',//景点网址
        		trafficNotice: '',//交通提示
        		travelTime:'',//用时参考
				ticketsNotice: '',//门票提示
				sortStr: 100,//排序字段
				gradeVal: '',//景区星级
				businessTime: '',//营业时间
				tagsVal: [],//标签
		        isMultiple: true,
		        mulLimit: 3,
		       	imgFileList: [], //创建景点数组
		       	fileList:[], //默认图片展示列表
		       	isSpotPhone: true,
		       	isSpotURL: true,
		       	isTrafficNotice: true,
		       	isTravelTime: true,
		       	isTicketsNotice: true,
		       	imgUrl:'',//图片请求链接
		       	imgHeader: {},//请求头
		       	isEditSpot: false, //是否可编辑添加
		       	btnText: '发布景点', //按钮文字
		       	isShowTextArea: false,
		       	isAddType: false,//是否为新建景点状态 false表示可操作，true表示禁用
		       	imgArr: [],//图片数组，查看景点数组，
		       	seasonOptions: [{
		        	value: '0',
		        	label: '春季'
		        }, {
		        	value: '1',
		        	label: '夏季'
		        }, {
		        	value: '2',
		        	label: '秋季'
		        }, {
		        	value: '3',
		        	label: '冬季'
		        }, {
		        	value: '4',
		        	label: '全季'
		        }],
		        gradeOptions: [{
		        	value: '1',
		        	label: '1星'
		        }, {
		        	value: '2',
		        	label: '2星'
		        }, {
		        	value: '3',
		        	label: '3星'
		        }, {
		        	value: '4',
		        	label: '4星'
		        }, {
		        	value: '5',
		        	label: '5星'
		        }],
		        tagsOptions: [],
			}
		},
		components: {writeTop, mapBox, listImg},
		computed: {
			...mapGetters([
				'es_isShowMap',
				'es_mapInfo',
				'c_loadingVal',
				'c_userInfo',
				'c_isShowImgList'
				])
		},
		methods: {
			...mapActions([
				'es_showMap',
				'es_mapInfoObj',
				'c_loadingShow',
				'c_showImgList',
				'c_listUpdate'
				]),
			optionalBlur(type) {
				if(type == 'phone') {
					if(this.pointPhone && !Number(this.pointPhone)) {
						this.isSpotPhone = false
					}else {
						this.isSpotPhone = true
					}
				}
			},
			getImgList(val) {
				this.fileList = []
				this.imgArr = []
				val.map((v, i) => {
					this.imgArr.push({
						url: v.url,
						id: v.id
					})
					this.imgFileList.push(v.url)
				})
				val.splice(0,7).map((v, i) => {
					this.fileList.push({url: v.url})
				})
			},
			coverImg(val) {
				this.hadCoverImg = val
			},
			titleVal(val) {
				this.valTitle = val
			},
			clickBtnEvent() {
				if(this.isEditSpot) {
					this.isEditSpot = false
					this.btnText = '确认修改'
				}else {
					this.pushSpot()
				}
			},
			pushSpot() {
				if(this.hadCoverImg) { //封面图
					if(this.valTitle != '') { //标题
						if(this.imgFileList.length > 0) { //添加景点时的图片数组
							if(this.es_mapInfo.address != '') { //景点地址
								if(this.pointDes != "") { //景点描述
									// if(this.gradeVal != '') { //景区星级
										if(this.businessTime != '') { //营业时间
												if(this.isSpotPhone && this.isSpotURL && this.isTrafficNotice && this.isTravelTime && this.isTicketsNotice) {
													if(String(this.sortStr) != '') {
														let txt = `您将要发布景点 ${this.valTitle}`
														if(this.$route.query.type == 'read' || this.$route.query.type == 'edit') {
															txt = `您将要修改景点 ${this.valTitle}`
														}
														this.$confirm(txt, '', {
													        confirmButtonText: '确定',
													        cancelButtonText: '取消',
													    }).then(() => {

													        this.saveSpot() //景点发布

													    }).catch(() => {
													          this.$message({
													            type: 'info',
													            message: '已取消操作',
													            center: true
													          });          
													    });
													}else {
															this.$message({
														        message: '请输入 排序字段',
														        type: 'error',
														        center: true
														    })
														}
												}else {
														if(!this.isSpotPhone) {
															this.$message({
													          message: '请输入正确的景区电话',
													          type: 'error',
													          center: true
													        })
														}
													}
											}else {
												this.$message({
										          message: '请填写营业时间',
										          type: 'error',
										          center: true
										        })
											}
										// }else {
										// 	this.$message({
									 //          message: '请选择景区星级',
									 //          type: 'error',
									 //          center: true
									 //        })
										// }
								}else {
									this.$message({
							          message: '请输入景区描述',
							          type: 'error',
							          center: true
							        })
								}
							}else {
								this.$message({
						          message: '请选择景点地址',
						          type: 'error',
						          center: true
						        })
							}
						}else {
							this.$message({
					          message: '请选择至少一张景点图片',
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
			handleRemove(file) {
		      	let response = file.response
		      	if(response.code == 0) {
		    		for(let i=0; i< this.imgFileList.length; i++) {
		    			if(this.imgFileList[i] === response.data[0]) {
		    				this.imgFileList.splice(i, 1)
		    			}
		    		}
		    	}else {
		    		this.$message({
			        message: response.message,
				        type: 'error',
				        center: true
				    })
		    	}
		    },
		    handlePictureCardPreview(file) {
		      	this.dialogImageUrl = file.url;
		      	this.dialogVisible = true;
		      	setTimeout(() => {
		      		let model = document.querySelector('.v-modal')
		      		model.style.display = 'none'
		      	}, 10)
		      	
		    },
		    handSuccess(response, file, fileList) {
		    	if(response.code == 0) {
		    		this.imgFileList.push(response.data[0])
		    	}else {
		    		this.$message({
			        message: response.message,
				        type: 'error',
				        center: true
				    })
		    	}
		    },
		    handError(err, file, fileList) {
		    	this.$message({
			        message: '图片上传失败',
			        type: 'error',
			        center: true
			    })
		    },
		    jumpToMap() {
		    	if(!this.isEditSpot) {
		    		this.es_showMap(true)
		    	}
		    },
		    seasonChange(val) {
		    	
		    },
		    pointGrade(val) {
		    	
		    },
		     tagsSelect(val) {
		    	
		    },
		    imgDir() {
				this.imgHeader = {
					'API-User-Token': this.c_userInfo.token
				}
				this.imgUrl = `${config.uploadImg}?dir=node/images`
			},
			getSpotDetail() { //景点详情
				const $this = this
				this.$api.ajax({
					url: `${config.spotDetail}/${this.$route.query.id}`,
					headers: {
						'Content-Type':'application/x-www-form-urlencoded',
						'API-User-Token': $this.c_userInfo.token
					},
					success: (res) => {
						if(res.code == 0) {
							let data = res.data,
								reg = /<\/?.+?>/g
							this.valTitle = data.info.name
							this.hadCoverImg =  data.info.thumbImg
							this.pointDes =	data.info.desc.replace(reg,"\n") || ''
							this.es_mapInfoObj({
								location: {
									lng: data.info.longitude,
									lat: data.info.latitude,
								},
								name: data.info.name || '',
								province: data.info.province || '',
								city: data.info.city || '',
								address: data.info.address || ''
							})
							this.gradeVal =	(data.info.starLevel? data.info.starLevel + '星': '')
							this.businessTime =	data.info.openTime.replace(reg,"\n") || ''
							this.sortStr =	data.info.sort
							this.pointPhone = data.info.tel.replace(reg,"\n") || ''
							this.pointURL = data.info.site.replace(reg,"\n") || ''
							this.trafficNotice = data.info.trafficText.replace(reg,"\n") || ''
							this.ticketsNotice = data.info.ticketText.replace(reg,"\n") || ''
							this.travelTime = data.info.useTime.replace(reg,"\n") || ''
							this.seasonVal = data.info.bestSeason != ''? data.info.bestSeason.split(','): []
							this.tagsVal =	data.info.tags != ''?data.info.tags.split(','): []
							
							if(data.pics.length != 0) {
								data.pics.map((v,i) => {
									this.imgArr.push({
										url: v.url,
										id: v.id
									})
									this.imgFileList.push(v)
								})

								data.pics.splice(0, 7).map((v, i) => {
									this.fileList.push({url: v.url})
								})
							}
							
							if(this.c_loadingVal) {
								this.c_loadingVal.close()
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
					        message: '获取景点信息失败',
					        center: true
					    });
					}
				})
			},
			saveSpot() {
				const $this = this
				let dataObj = {
						name: $this.valTitle,
						thumbImg: $this.hadCoverImg,
						desc: $this.pointDes,
						longitude: $this.es_mapInfo.location.lng,
						latitude: $this.es_mapInfo.location.lat,
						province: $this.es_mapInfo.province,
						city: $this.es_mapInfo.city,
						address: $this.es_mapInfo.address,
						starLevel: parseInt($this.gradeVal),
						openTime: $this.businessTime,
						sort: parseInt($this.sortStr),
						tel: $this.pointPhone,
						site: $this.pointURL,
						trafficText: $this.trafficNotice,
						ticketText: $this.ticketsNotice,
						useTime: $this.travelTime,
						bestSeason: $this.seasonVal.join(','),
						tags: $this.tagsVal.join(','),
					}
				if(this.$route.query.type == 'add') {
					dataObj.pictures = this.imgFileList.join(',')
				}
				if(this.$route.query.type == 'read' || this.$route.query.type == 'edit') {
					dataObj.id = this.$route.query.id
				}
				this.$api.ajax({
		    		url: config.adminAddSpot,
		    		method: "POST",
		    		headers: {
						'API-User-Token': $this.c_userInfo.token
					},
					data: dataObj,
					success: (res) => {
						if(res.code == 0) {
							let message = '景点创建成功'
							if(this.$route.query.type == 'read' || this.$route.query.type == 'edit') {
								message = '景点修改成功'
							}
							this.$message({
						        type: 'success',
						        message: message,
						        center: true
						    });
						    this.c_loadingShow()
						    this.c_listUpdate(true) //通知列表更新
						    if(this.$route.query.from) {
								setTimeout(() => {
									this.$router.push({
										path: '/waitCheck',
									})
								}, 600);
						    }else {
						    	setTimeout(() => {
									this.$router.push({
										path: '/spotList',
									})
								}, 600);
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
					        message: '操作失败',
					        center: true
					    });
					}
		    	})
			},
			domChange() {
				if(this.$route.query.type == 'read' || this.$route.query.type == 'edit') {
					this.isAddType = true
					let	box = document.querySelector('.el-upload--picture-card'),
						icon = box.getElementsByTagName('i')[0],
						count = 0

					this.$api.removeClass(icon, 'el-icon-plus')
					this.$api.addClass(icon, 'el-icon-more')
					const $this = this
					box.removeEventListener('click', bindEvent.bind($this), false);
					box.addEventListener('click', bindEvent.bind($this), false)
					function bindEvent(evt) {
						count++
						evt.stopPropagation()
						evt.preventDefault()
						if(count == 1) {
							this.c_showImgList(true)
							setTimeout(() => {
								count = 0
							}, 100)
						}
					}
				}
			}
		},
		created() {
			if(this.$route.query.type == 'read') {
				this.isEditSpot = true
				this.getSpotDetail()
				this.btnText = '编辑景点'
			}else if(this.$route.query.type == 'edit'){
				this.getSpotDetail()
				this.btnText = '确认修改'
			}
		},
		mounted() {
			this.imgDir() //图片头部
			this.es_mapInfoObj({}) //默认清空地址栏
			this.domChange() //图片dom元素改变
			if(this.$route.query.type == 'add') {
				if(this.c_loadingVal) {
					this.c_loadingVal.close()
				}
			}
			this.$api.getTags((data) => {
				let tags = data.split(',')
				tags.map((v, i) => {
					this.tagsOptions.push({
						value: i,
						label: v
					})
				})
			})
		}
	}
</script>

<style scoped>
	.editBox {
		position: relative;
		background-color: #fff;
		flex: 1;
		height: 100%;
		width: 100%;
		padding-bottom: 55px;
		overflow: hidden;
	}
	.editSpot {
		width: 100%;
		height: 100%;
		overflow-y: auto;
	}
	.editArea {
		padding: 20px 80px 0;
	}
	.editArea textarea::-webkit-scrollbar {
		display: none;
	}
	.addPointImg {
		margin-bottom: 10px;
	}
	.addPointAddress {
		border: 1px solid #DDDEE1;
		border-radius: 4px;
		padding: 0 15px;
		display: flex;
		align-items: center;
		margin-bottom: 10px;
		height: 42px;
		width: 100%;
	}
	.addPointAddress>p {
		display: block;
		height: 100%;
		flex: 1;
		font-size: 16px;
		color: #9FA6AD;
		line-height: 40px;
		overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
	}
	.addPointAddress>p.detailAddress {
		color: #373A3E;
	}
	.addPointAddress:hover {
		cursor: pointer;
	}
	.addPointAddress>div {
		height: 100%;
		padding-left: 15px;
		display: flex;
		align-items: center;
	}
	.addPointAddress>div>b {
		display: block;
		width: 20px;
		height: 20px;
		background: url('../../assets/img/pointPosition.png') no-repeat center;
		background-size: 100%;
	}
	.optionalInput {
		width: 100%;
		display: flex;
		justify-content: space-between;
		margin-bottom: 10px;
	}
	.optionalInput>div {
		width: 334px;
		height: 42px;
		border: 1px solid #DDDEE1;
		border-radius: 4px;
		padding: 0 15px;
	}
	.optionalInput>div>input {
		display: block;
		width: 100%;
		height: 100%;
		font-size: 16px;
		color: #373A3E;
	}
	.pointDescription {
		margin-bottom: 10px;
		width: 100%;
		height: auto;
	}
	.noticeBox {
		height: 90px;
	}
	.pointTypeSelect {
		width: 100%;
		display: flex;
		justify-content: space-between;
		margin-bottom: 10px;
	}
	.pointTypeSelect>div {
		width: 334px;
	}
	.trafficNotice {
		width: 100%;
		height: 42px;
		border: 1px solid #DDDEE1;
		border-radius: 4px;
		padding:0 15px;
		margin-bottom: 10px;
	}
	.trafficNotice>input {
		display: block;
		width:100%;
		height: 100%;
		font-size: 16px;
		color: #373A3E;
	}
	.pointInfoNotice {
		width: 100%;
		height: auto;
		display: flex;
		justify-content: space-between;
		margin-bottom: 10px;
	}
	.itemPointInfo {
		width: 334px;
		height: 42px;
		border: 1px solid #DDDEE1;
		border-radius: 4px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 15px;
	}
	.itemPointInfo>span {
		display: block;
		font-size: 16px;
		color: #9FA6AD;
	}
	.itemPointInfo>input {
		display: block;
		width: 140px;
		padding: 0 10px;
		height: 100%;
		font-size: 16px;
		color: #373A3E;
		text-align: right;
	}
	.doBusinessTime {
		border: 1px solid #DDDEE1;
		border-radius: 4px;
		padding: 0 15px;
	}
	.doBusinessTime>input {
		display: block;
		height:100%;
		width: 100%;
		font-size: 16px;
		color: #373A3E;
	}
	.pointBtn {
		display: flex;
		justify-content: flex-end;
		font-size: 16px;
		color: #FFFFFF;
		margin-top: 30px;
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
	.editBtn {
		position: absolute;
		left: 0;
		bottom: 0;
		z-index: 20;
		width: 100%;
		height: 55px;
		background-color: #fff;
		display: flex;
		justify-content: center;
		align-items: center;
		border-top: 1px solid #efefef;
	}
	.editBtn>span {
		display: block;
		height: 40px;
		width: 144px;
		background: #FFB132;
		box-shadow: 0 0 14px 0 rgba(255,177,50,0.40);
		border-radius: 100px;
		font-size: 16px;
		color: #FFFFFF;
		text-align: center;
		line-height: 40px;
	}
	.editBtn>span:hover {
		cursor: pointer;
	}
	.fade-enter-active, .fade-leave-active {
	  transition: opacity .5s;
	}
	.fade-enter, .fade-leave-to {
	  opacity: 0;
	}
</style>