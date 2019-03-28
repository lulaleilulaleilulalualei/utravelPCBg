<template>
	<div class="rejectBox">
		<div class="boxArea">
			<div class="areaBox">
				<h4>驳回理由</h4>
				<p @click="selectReason(index)" :class="[{selectedReason: item.isShow}]" v-for="(item, index) in reasonArr">{{item.txt}}</p>
				<div class="rejectReason">
					<!-- <textarea placeholder="请输入驳回理由" ></textarea> -->
					<el-input
						  type="textarea" 
						  :autosize="{ minRows: 3}"
						  v-model.trim="rejectReason"
						  @focus="getFocus"
						  placeholder="请输入驳回理由"
						  resize="none">
					</el-input>
				</div>
				<div class="boxBtn">
					<div @click="cancelReject">取消</div>
					<div @click="sureReject">确定</div>
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
				reasonArr: [
					{
						txt: '文章内容不符合《互联网管理办法》等相关法律法规',
						isShow: false
					},
					{
						txt: '文章正文或标题含有刻意引流或广告营销倾向的内容',
						isShow: false
					}
				],
				rejectReason: '',//驳回理由
				count: 0
			}
		},
		computed: {
			...mapGetters([
				'wc_isShowRejectBox',
				'c_userInfo'
				])
		},
		methods: {
			...mapActions([
				'wc_showRejectBox',
				'c_toUpdateData'
				]),
			getFocus() {
				this.reasonArr.map((v, i) => {
					v.isShow = false
				})
			},
			selectReason(index) {
				this.reasonArr.map((v, i) => {
					if(index == i) {
						if(v.isShow) {
							v.isShow = false
						}else {
							v.isShow = true
							this.rejectReason = ''
						}
					}else {
						v.isShow = false
					}
				})
			},
			cancelReject() {
				this.wc_showRejectBox({isShow: false, type: 0})
			},
			sureReject() {
				let reasonText = ''
				if(this.rejectReason != '') {
					reasonText = this.rejectReason
				}else {
					this.reasonArr.map((v,i ) => {
						if(v.isShow) {
							reasonText = v.txt
						}
					})
				}
				if(reasonText != '') {
					if(this.wc_isShowRejectBox.type == 1) { //游记 rejectNoteOrVideo
						this.rejectMethod(config.rejectNoteOrVideo, {
							reason: reasonText,
							type: 1
						}, 1)
					}else if(this.wc_isShowRejectBox.type == 2) {//线路 rejectLine
						this.rejectMethod(config.rejectLine, {
							reason: reasonText
						}, 2)
					}else if(this.wc_isShowRejectBox.type == 3) {//视频 rejectNoteOrVideo
						this.rejectMethod(config.rejectNoteOrVideo, {
							reason: reasonText,
							type: 2
						}, 3)
					}
				}else {
					this.$message({
					    type: 'error',
					    message: '请选择驳回理由',
					    center: true
					});
				}
			},
			rejectMethod(url, dataObj, status) {
				const $this = this
		    	this.$api.ajax({
		    		url: `${url}/${this.wc_isShowRejectBox.id}`,
		    		method: "POST",
		    		headers: {
						'API-User-Token': $this.c_userInfo.token
					},
					data: dataObj,
					success: (res) => {
						if(res.code == 0) {
							this.$message({
						        type: 'success',
						        message: '操作成功',
						        center: true
						    });
						    this.wc_showRejectBox({isShow: false, type: 99, id: ''})
						    this.count++
						    if(status != 3) {
						    	this.c_toUpdateData({type: status, count: this.count})
						    }
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
					        message: '操作失败',
					        center: true
					    });
					}
		    	})
			}
		},
		mounted() {
			
		}
	}
</script>

<style scoped>
	.rejectBox {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 30;
		width: 100%;
		height: 100%;
		background-color: rgba(0,0,0,0.29);
	}
	.boxArea {
		width: 1180px;
		margin: auto;
		padding-left: 300px;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.areaBox {
		background: #FFFFFF;
		border-radius: 7px;
		padding: 30px 15px;
		width: 600px;
		height: auto;
	}
	.areaBox>h4 {
		font-size: 24px;
		color: #FFB132;
		font-weight: normal;
		margin-bottom: 15px;
	}
	.areaBox>p {
		border: 1px solid #DDDEE1;
		border-radius: 4px;
		width: 100%;
		height: 42px;
		line-height: 42px;
		padding: 0 15px;
		font-size: 16px;
		color: #9FA6AD;
		margin-bottom: 10px;
		transition: all 0.2s;
	}
	.areaBox>p:hover {
		cursor: pointer;
	}
	.areaBox>p.selectedReason {
		box-shadow: 0 0 6px 0 #FFB132;
		border-color: transparent;
		color: #373A3E;
	}
	.rejectReason {
		width: 100%;
		height: auto;
		margin-bottom: 15px;
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
		align-items: center;
		justify-content: center;
	}
	.boxBtn>div:hover {
		cursor: pointer;
	}
	.boxBtn>div:first-child {
		margin-right: 10px;
		background: #DDDEE1;
	}
	.boxBtn>div:nth-child(2) {
		background: #FFB132;
	}
</style>