<template>
	<div class="completeInfo">
		<div class="infoArea">
			<div class="infoBox">
				<h3>完善游记信息</h3>
				<p>让游记内容更丰富，吸引更多粉丝围观</p>
				<div class="tripDestination">
					<input type="text" class="shadowBox" v-model.trim="desVal" placeholder="出行目的地">
				</div>
				<div class="tripSelect">
					<el-date-picker
				      v-model.trim="timeVal"
				      format="yyyy-MM-dd"
				      value-format="yyyy-MM-dd"
				      type="date"
				      placeholder="出发时间">
				    </el-date-picker>

					<el-select v-model.trim="typeVal" placeholder="分类">
					    <el-option
					      v-for="item in typeOptions"
					      :key="item.value"
					      :label="item.label"
					      :value="item.label">
					    </el-option>
					</el-select>
				</div>
				<div class="tripInput">
					<div>
						<input type="text" class="shadowBox" placeholder="出行天数" v-model.trim="daysVal">
					</div>
					<div>
						<input type="text" class="shadowBox" placeholder="人均花费" v-model.trim="costVal">
					</div>
				</div>
				<div class="infoBoxBtn">
					<div @click="closeBox">取消</div>
					<div @click="pushNote">发表游记</div>
				</div>
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
				desVal: '',
				timeVal: '',
				typeVal: '',
				daysVal: '',
				costVal: '', 
				startDate: '', //默认日期
				typeOptions: [{
					value: 'a',
					label: '个人'
				}, {
					value: 'b',
					label: '情侣/夫妻'
				}, {
					value: 'c',
					label: '亲子'
				}, {
					value: 'd',
					label: '家庭出游'
				}, {
					value: 'e',
					label: '和朋友'
				}, {
					value: 'f',
					label: '和同事'
				}, {
					value: 'g',
					label: '其他'
				}],
			}
		},
		props:{
			contentArr: [Array],
			noteTitle: [String],
			coverImg: [String],
			defaultVal: [Object],
			noteId: [String, Number]
		},
		computed: {
			...mapGetters([
				'c_userInfo',
				'c_userVal'
				])
		},
		methods: {
			...mapActions([
				'wn_showNoteInfo',
				'c_loadingShow',
				'c_listUpdate'
				]),
			closeBox() {
				this.wn_showNoteInfo(false)
			},
			pushNote() {
				if(this.desVal != '') {
					if(this.timeVal != '') {
						if(this.typeVal != '') {
							if(this.daysVal != '') {
								if(this.costVal != '') {
									this.pushNoteMethods()
								}else {
									this.$message({
									    type: 'error',
									    message: '请输入人均花费',
									    center: true
									});
								}
							}else {
								this.$message({
								    type: 'error',
								    message: '请输入出行天数',
								    center: true
								});
							}
						}else {
							this.$message({
							    type: 'error',
							    message: '请选择游玩对象',
							    center: true
							});
						}
					}else {
						this.$message({
						    type: 'error',
						    message: '请填写出发时间',
						    center: true
						});
					}
				}else {
					this.$message({
					    type: 'error',
					    message: '请填写出行目的地',
					    center: true
					});
				}
			},
			pushNoteMethods() {
				const $this = this
				let dataObj = {
						title: $this.noteTitle,
						coverImg: $this.coverImg,
						status: this.c_userVal == 'admin'? 2: 0,
						contents: this.contentArr,
						departTime: $this.timeVal, //出发时间
						dayNum: $this.daysVal, //出行天数
						personType: $this.typeVal, //分类
						destination: $this.desVal, //目的地
						spendFee: $this.costVal, //人均花费
					}
				if(this.noteId) {
					dataObj.id = this.noteId
				}
				if(this.$route.query.type == 'edit') {
					dataObj.id = this.$route.query.id
				}
				this.$api.ajax({
		    		url: this.c_userVal == 'admin'? config.createTravelNote: config.userNoteSave,
		    		method: "POST",
		    		headers: {
						'API-User-Token': $this.c_userInfo.token
					},
					data: dataObj,
					success: (res) => {
						if(res.code == 0) {	
							let txt = '游记创建成功'
							if(this.$route.query.type == 'edit') {
								txt = '游记修改成功'
							}
							this.$message({
						        type: 'success',
						        message: txt,
						        center: true
						    });
						    this.c_loadingShow()
						    this.wn_showNoteInfo(false)
						    this.c_listUpdate(true) //通知列表更新
							setTimeout(() => {
								this.$router.push({
									path: '/hotNotes',
								})
							}, 600);
						}else {
							this.$message({
						        type: 'error',
						        message: res.message,
						        center: true
						    });
						}
					},
					error: (err) => {
						let txt = '游记创建失败'
							if(this.$route.query.type == 'edit') {
								txt = '游记修改失败'
							}
						this.$message({
					        type: 'error',
					        message: txt,
					        center: true
					    });
					}
		    	})	
			}
		},
		mounted() {
			if(!this.$api.isEmptyObject(this.defaultVal)) {
				this.timeVal = this.defaultVal.departTime || ''  //出发时间
				this.daysVal = this.defaultVal.dayNum || '' //出行天数
				this.typeVal = this.defaultVal.personType || '' //分类
				this.desVal = this.defaultVal.destination || '' //目的地
				this.costVal = this.defaultVal.spendFee|| '' //人均花费
			}
			let date = new Date()
			this.startDate = (date) => {  
			    let y = date.getFullYear();  
			    let m = date.getMonth() + 1;  
			    m = m < 10 ? '0' + m : m;  
			    let d = date.getDate();  
			    d = d < 10 ? ('0' + d) : d;  
			    return y + '-' + m + '-' + d;  
			}
		}
	}
</script>

<style scoped>
	.completeInfo {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 30;
		background-color: rgba(0,0,0,0.29);
	}
	.infoArea {
		width: 1180px;
		height: 100%;
		margin: 0 auto;
		padding-left: 300px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.infoBox {
		width: 600px;
		height: 340px;
		background-color: #fff;
		border-radius: 7px;
		padding: 30px 15px;
	}
	.infoBox>h3 {
		font-size: 24px;
		color: #FFB132;
		margin-bottom: 5px;
		font-weight: normal;
	}
	.infoBox>p {
		font-size: 14px;
		color: #929292;
		margin-bottom: 15px;
	}
	.tripDestination {
		width: 100%;
		height: 42px;
		margin-bottom: 10px;
		border-radius: 4px;
	}
	.tripDestination>input {
		display: block;
		width: 100%;
		height: 100%;
		border: 1px solid #DDDEE1;
		padding: 0 15px;
		font-size: 16px;
		color: #373A3E;
	}
	.tripDestination>input:focus {
		border-color: #FFB132;
	}
	.tripSelect {
		display: flex;
		justify-content: space-between;
		margin-bottom: 10px;
	}
	.tripInput {
		display: flex;
		justify-content: space-between;
		margin-bottom: 20px;
	}
	.tripInput>div {
		width: 280px;
		height: 42px;
	}
	.tripInput>div>input {
		display: block;
		width: 100%;
		height: 100%;
		border: 1px solid #DDDEE1;
		padding: 0 15px;
		font-size: 16px;
		color: #373A3E;
		border-radius: 4px;
	}
	.tripInput>div>input:focus {
		border-color: #FFB132;
	}
	.infoBoxBtn {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		font-size: 16px;
		color: #FFFFFF;
	}
	.infoBoxBtn>div{
		border-radius: 100px;
		padding: 10px 40px;
	}
	.infoBoxBtn>div:hover {
		cursor: pointer;
	}
	.infoBoxBtn>div:first-child {
		background: #DDDEE1;
		margin-right: 10px;
	}
	.infoBoxBtn>div:nth-child(2) {
		background: #FFB132;
	}
</style>