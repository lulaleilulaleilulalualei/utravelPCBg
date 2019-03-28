<template>
	<div class="selfPointBoxContent">
	<happy-scroll color="rgba(255,177,50,1)" size="4" resize hide-vertical>
		<div class="selfPointInfo">
			<div class="pointTitle">
				<input v-model.trim="pointTitle" type="text" placeholder="景点名称">
				<input v-model.trim="pointPhone" type="text" @blur="optionalBlur('phone')" placeholder="景点电话（选填）">
				<input v-model.trim="pointURL" type="text" @blur="optionalBlur('URL')" placeholder="景点网址（选填）">
			</div>
			<div class="addPointImg">
				<el-upload
					:action= "imgUrl"
					name="files"
					:headers= "imgHeader"
					:multiple= "isMultiple"
					list-type="picture-card"
					:on-preview="handlePictureCardPreview"
					:on-remove="handleRemove"
					:on-success="handSuccess"
					:on-error="handError">
					<i class="el-icon-plus"></i>
				</el-upload>
				<el-dialog :visible.sync="dialogVisible">
					<img width="100%" :src="dialogImageUrl" alt="">
				</el-dialog>
			</div>
			<div class="addPointAddress" @click="jumpToMap">
				<p :class="wl_pointAddInfo.address&&'detailAddress'" :title="wl_pointAddInfo.address || '详细地址'">{{wl_pointAddInfo.address || '详细地址'}}</p>
				<div><b></b></div>
			</div>
			<div class="pointDescription">
				<span>景区概况：</span>
				<el-input
					type="textarea"
					:autosize="{ minRows: sizeValue}"
					v-model="pointDes"
					resize="none">
				</el-input>
			</div>
			<div class="pointDescription">
				<span>交通提示（选填）：</span>
				<el-input
					type="textarea"
					:autosize="{ minRows: sizeValue}"
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
					<input type="text" v-model.trim="travelTime" placeholder="用时参考（选填）" @blur="optionalBlur('time')">
				</div>
				<el-select v-model="seasonVal" multiple :multiple-limit="mulLimit" clearable placeholder="最佳季节（可多选）" @change="seasonChange">
					<el-option
						v-for="item in seasonOptions"
						:key="item.value"
						:label="item.label"
						:value="item.label">
					</el-option>
				</el-select>
			</div>
			<div class="pointTypeSelect">
				<el-select v-model="gradeVal" clearable placeholder="景区星级（选填）" @change="pointGrade">
					<el-option
						v-for="item in gradeOptions"
						:key="item.value"
						:label="item.label"
						:value="item.value">
					</el-option>
				</el-select>
				<el-select v-model="tagsVal" multiple :multiple-limit="mulLimit" clearable placeholder="标签（可多选）" @change="tagsSelect">
					<el-option
						v-for="item in tagsOptions"
						:key="item.value"
						:label="item.label"
						:value="item.label">
					</el-option>
				</el-select>
			</div>
			<div class="pointTypeSelect" v-if="c_userVal == 'admin'">
				<el-input v-model.number="sortStr" clearable placeholder="排序字段（默认100）" ></el-input>
			</div>
		</div>
	</happy-scroll>
		<div class="pointBtn">
			<div @click="closePoint">取消</div>
			<div @click="hadPoind">保存</div>
		</div>
	</div>
</template>

<script>
	import { mapGetters , mapActions } from 'vuex';
	import config from '@/config'
	
	export default {
		data() {
			return {
				sizeValue: 3,//文本框大小
				pointTitle:'',//景点名称
				pointPhone: '',//景点电话
				pointURL: '',//景点网址
				pointDes: '',//景点概括
				trafficNotice: '',//交通提示
				travelTime:'',//用时参考
				ticketsNotice: '',//门票提示
				businessTime: '',//营业时间
				dialogImageUrl: '',
        		dialogVisible: false,
        		isMultiple: true,
        		mulLimit: 3,
        		seasonVal: [],//最佳季节
		        gradeVal: '',//景区星级
		        tagsVal: [],//标签
		        sortStr: 100,//排序字段
		       	imgFileList: [],
		       	isSpotPhone: true,//选填电话
		       	isSpotURL: true,//选填网址
		       	isTrafficNotice: true,//选填交通提示
		       	isTravelTime: true,//选填用时参考
		       	isTicketsNotice: true,//选填门票提示
		       	imgUrl: '',
		       	imgHeader: {},
		       	isEditSpot: false,
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
		computed: {
			...mapGetters([
				'wl_pointAddInfo',
				'c_userVal',
				'c_userInfo'
				])
		},
		watch: {
			
		},
		methods: {
			...mapActions([
				'wl_showMap',
				'wl_showSelfLine',
				'wl_showPointInfo',
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
			closePoint() {
				this.wl_showSelfLine(false)
			},
			hadPoind() {
				const $this = this
				if(this.pointTitle != '') {
					if(this.imgFileList.length != 0) {
						if(this.wl_pointAddInfo.address) {
							if(this.pointDes != '') {
									// if(this.gradeVal != '') {
										if(this.businessTime != '') {
												if(this.isSpotPhone && this.isSpotURL && this.isTrafficNotice && this.isTravelTime && this.isTicketsNotice) {
													if(this.c_userVal == 'admin') {
														if(String(this.sortStr) != '') {
															this.saveSpot()
														}else {
															this.$message({
													          message: '请输入排序字段',
													          type: 'error',
													          center: true
													        })
														}
													}else {
														this.$confirm(`确认添加景点 ${this.pointTitle}, 添加后将不可更改`, '', {
												          confirmButtonText: '确定',
												          cancelButtonText: '取消',
												        }).then(() => {

												        	this.saveSpot()

												        }).catch(() => {
												                  
												        });
													}
												}else {
													if(!this.isSpotPhone) {
														this.$message({
												          message: '请输入正确的景区电话(数字)',
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
						          message: '景点描述不能为空',
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
				          message: '请添加至少一张图片',
				          type: 'error',
				          center: true
				        })
					}
				}else {
					this.$message({
			          message: '景点名称不能为空',
			          type: 'error',
			          center: true
			        })
				}
			},
			handleRemove(file) {
		    	this.imgFileList.map((v, i) => {
		        	if(file.hasOwnProperty('response')) {
		        		if(file.response.code == 0) {
		        			if(v == file.response.data[0]) {
		        				this.imgFileList.splice(i, 1)
		        			}
		        		}else {
		        			this.$message({
						       	message: res.message,
						        type: 'error',
						        center: true
						   	})
		        		}
		        	}else {
		        		if(v == file.url) {
		        			this.imgFileList.splice(i, 1)
		        		}
		        	}
		        	
		        })
		    },
		    handlePictureCardPreview(file) {
		      	this.dialogImageUrl = file.url;
		      	this.dialogVisible = true;
		    },
		    handSuccess(response, file, fileList) {
		    	// fileList.map((v, i) => {
					if(response.code == 0) {
						this.imgFileList.push(response.data[0])
					}else {
						this.$message({
					        message: response.message,
					        type: 'error',
					        center: true
					    })
					}
				// })
		    },
		    handError(err, file, fileList) {
		    	this.$message({
			        message: '图片上传失败',
			        type: 'error',
			        center: true
			    })
		    },
		    jumpToMap() {
		    	this.wl_showMap(true)
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
			saveSpot() {
				const $this = this
				let dataObj = {
						name: $this.pointTitle,
						thumbImg: $this.imgFileList[0],
						desc: $this.pointDes,
						longitude: $this.wl_pointAddInfo.location.lng,
						latitude: $this.wl_pointAddInfo.location.lat,
						province: $this.wl_pointAddInfo.province,
						city: $this.wl_pointAddInfo.city,
						address: $this.wl_pointAddInfo.address,
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
						pictures: $this.imgFileList.join(','),
					}
				this.$api.ajax({
		    		url: this.c_userVal == 'admin'? config.adminAddSpot: config.userSpotAdd,
		    		method: "POST",
		    		headers: {
						'API-User-Token': $this.c_userInfo.token
					},
					data: dataObj,
					success: (res) => {
						if(res.code == 0) {
							this.$message({
						        type: 'success',
						        message: '景点创建成功',
						        center: true
						    });
						    if(!this.isEditSpot) {
						    	dataObj.id = res.data
						    }
							this.wl_showSelfLine(false)
							this.wl_showPointInfo(dataObj)
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
					        message: '景点创建失败',
					        center: true
					    });
					}
		    	})
			}
		},
		mounted() {
			this.imgDir()
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
	.selfPointBoxContent {
		width: 100%;
		height: 720px;
		overflow: hidden;
		/* padding-bottom: 50px; */
		position: relative;
	}
	.selfPointInfo {
		height: auto;
		width: 100%;
		overflow-y: auto;
		padding-bottom: 50px;
	}
	.selfPointInfo textarea::-webkit-scrollbar {
		display: none;
	}
	.pointTitle {
		width: 100%;
		height: auto;
		margin-bottom: 10px;
		display: flex;
		justify-content: space-between;
	}
	.pointTitle>input {
		display: block;
		border: 1px solid #DDDEE1;
		border-radius: 4px;
		padding: 0 15px;
		height: 42px;
		width: 186px;
		font-size: 16px;
		color: #373A3E;
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
		width: 100%;
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
	.pointDescription {
		margin-bottom: 10px;
		height: auto;
		width: 100%;
	}
	 .middeleBox {
	 	height:  90px;
	 }

	.pointInfoNotice {
		width: 100%;
		height: auto;
		display: flex;
		justify-content: space-between;
		margin-bottom: 10px;
	}
	.itemPointInfo {
		width: 285px;
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
		flex: 1;
		padding: 0 10px;
		height: 100%;
		font-size: 16px;
		color: #373A3E;
		text-align: right;
	}
	.pointTypeSelect {
		width: 100%;
		display: flex;
		justify-content: space-between;
		margin-bottom: 10px;
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
		position: absolute;
		bottom: 0;
		right: 0;
		background: #fff;
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