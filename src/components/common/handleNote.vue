<template>
	<div class="handleNote" v-if="nd_isShowHandleBtn.isShow">
		<div @click="deleteNote">
			<img src="../../assets/img/delete_act.png" alt="删除游记">
		</div>
		<div @click="editNote">
			<img src="../../assets/img/edit_act.png" alt="编辑游记">
		</div>
	</div>
</template>

<script>
	import { mapGetters , mapActions } from 'vuex';
	import config from '@/config'
	
	export default {
		data() {
			return {

			}
		},
		computed: {
			...mapGetters([
				'nd_isShowHandleBtn',
				'c_userInfo'
				])
		},
		methods: {
			...mapActions([
				'c_loadingShow',
				'c_listUpdate'
				]),
			deleteNote() {
				this.$confirm('确认删除游记?', '', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		        }).then(() => {

		          	this.deleteNoteMethods()

		        }).catch(() => {
		          this.$message({
		            type: 'info',
		            message: '已取消删除',
		            center: true
		          });          
		        });
			},
			deleteNoteMethods() {
				const $this = this
		    	this.$api.ajax({
		    		url: `${config.deleteNote}/${this.nd_isShowHandleBtn.id}`,
		    		method: "DELETE",
		    		headers: {
						'Content-Type':'application/x-www-form-urlencoded',
						'API-User-Token': $this.c_userInfo.token
					},
					success: (res) => {
						if(res.code == 0) {
							this.$message({
						        type: 'success',
						        message: '游记删除成功',
						        center: true
						    });
							this.c_loadingShow()
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
						this.$message({
					        type: 'error',
					        message: '删除游记失败',
					        center: true
					    });
					}
		    	})
			},
			editNote() {
				this.c_loadingShow()
				setTimeout(() => {
				    this.$router.push({
						path: '/writeNote',
						query:{
				          id: this.nd_isShowHandleBtn.id,
				          type: 'edit'
				        }
					})
				}, 600);
			}
		}
	}
</script>

<style scoped>
	.handleNote {
		position: absolute;
		bottom: 20px;
		right: 20px;
	}
	.handleNote>div {
		width: 53px;
		height: 22px;
	}
	.handleNote>div:hover {
		cursor: pointer;
	}
	.handleNote>div:first-child {
		margin-bottom: 10px;
	}
</style>