<template>
	<div class="hadRcm delRcmBox">
		<happy-scroll color="rgba(255,177,50,1)" size="2" resize hide-vertical v-if="clubList.length != 0">
		<ul class="delRcmBox">
			<li class="itemHadRcm delRcmBox" v-for="(item, index) in clubList" @click="deleteHadRcm(item)">
				<b class="delRcmBox"></b>
				<span class="delRcmBox">{{item.name}}</span>
			</li>
		</ul>
		</happy-scroll>
		<div class="noLinkClub" v-else>
			<div>
				<img src="../../assets/img/listBlank.png" alt="">
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
				clubList: [''],
				lineId: ''
			}
		},
		computed: {
			...mapGetters([
				'vhl_isShowBox',
				'c_userInfo'
				])
		},
		watch: {

		},
		methods: {
			...mapActions([
				'vhl_showBox'
				]),
			deleteHadRcm(data) {
				this.$confirm(`<p>取消线路 <b>${this.vhl_isShowBox.lineName}</b> 到 <b>${data.name}</b> 的推荐</p>` , '' , {
		        	dangerouslyUseHTMLString: true,
		          	confirmButtonText: '确定',
		          	cancelButtonText: '取消'
		        }).then(() => {

		          this.cancelLink(data)

		        }).catch(() => {
		          this.$message({
		            type: 'info',
		            message: '已取消删除',
		            center: true
		          });
		        });
			},
			clickBody() {
		    	let body = document.getElementsByTagName('body')[0] ||document.body
		    	const $this = this
		    	body.removeEventListener('click', $this.bindEvent.bind($this),false);
		    	body.addEventListener('click', $this.bindEvent.bind($this),false)
		    },
		    bindEvent(evt) {
		    	if(this.vhl_isShowBox.isShow) {
		    		if(evt.target.className.indexOf('delRcmBox') < 0) {
						this.vhl_showBox({isShow: false, id: ''})
			    	}
		    	}
		    },
		    getLineClub() {
		    	const $this = this
		    	this.lineId = this.vhl_isShowBox.id
		    	this.$api.ajax({
		    		url: `${config.linkClubGroup}/${this.vhl_isShowBox.id}`,
		    		headers: {
						'Content-Type':'application/x-www-form-urlencoded',
						'API-User-Token': $this.c_userInfo.token
					},
					success: (res) => {
						if(res.code == 0) {
							this.clubList = res.data
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
					        message: '获取关联自驾团失败',
					        center: true
					    });
					}
		    	})
		    },
		    cancelLink(obj) {
		    	const $this = this
		    	this.$api.ajax({
		    		url: config.cancelClubLink,
		    		headers: {
						'Content-Type':'application/x-www-form-urlencoded',
						'API-User-Token': $this.c_userInfo.token
					},
					params: {
						routeId: $this.lineId,
						bizid: obj.id,
						type: obj.type
					},
					success: (res) => {
						if(res.code == 0) {
							this.$message({
					            type: 'success',
					            message: '成功取消推荐',
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
					        message: '取消推荐失败',
					        center: true
					    });
					}
		    	})
		    }
		},
		mounted() {
			this.clickBody()
			if(this.vhl_isShowBox.id) {
				this.getLineClub()
			}
		}
	}
</script>

<style scoped>
	.hadRcm {
		position: absolute;
		top: 50%;
		right: 0px;
		z-index: 50;
		background-color: #fff;
		height: 300px;
		width: 180px;
		margin-top: -150px;
		padding: 15px 10px;
		overflow: hidden;
		border: 1px solid #FFB132;
		border-radius: 8px;
		transition-duration: 300ms;
		box-shadow: 0 0 6px 0 #FFB132;
	}
	.hadRcm>ul {
		overflow-y: auto;
	}
	.itemHadRcm {
		display: flex;
		align-items: center;
		padding: 10px 0;
		border-radius: 6px;
		transition: all 0.2s;
	}
	.itemHadRcm:hover {
		cursor: pointer;
		background-color: #FFF2DD;
	}
	.itemHadRcm>b {
		display: block;
		width: 12px;
		height: 12px;
		background: url('../../assets/img/delete_club.png') no-repeat center;
		background-size: 100%;
		margin-right: 10px;
	}
	.itemHadRcm>span {
		display: block;
		font-size: 14px;
		color: #3F4044;
		flex: 1;
		overflow: hidden;
		text-overflow:ellipsis;
		white-space: nowrap;
	}
	.noLinkClub {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.noLinkClub>div {
		width: 100%;
		height: 140px;
	}
</style>