<template>
	<div class="shortcutBox">
		<div @click="jumpWriteNote">写游记</div>
		<div @click="jumpWriteLine">制作线路</div>
		<div @click="quitHome">退出</div>
	</div>
</template>

<script>
	import { mapGetters , mapActions } from 'vuex';
	
	export default {
		data() {
			return {

			}
		},
		methods: {
			...mapActions([
				'c_loadingShow'
				]),
			jumpWriteNote() {
				this.c_loadingShow()
				setTimeout(() => {
				    this.$router.push({
						path: '/writeNote',
						query: {
							type: 'add'
						}
					})
				}, 600);
			},
			jumpWriteLine() {
				this.c_loadingShow()
				setTimeout(() => {
				    this.$router.push({
						path: '/writeLine'
					})
				}, 600);
			},
			quitHome() {
				 this.$confirm('您将要退出登录, 是否继续?', '', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		        }).then(() => {
		          this.$message({
		            type: 'success',
		            message: '退出成功!',
		            center: true
		          });
		          setTimeout(() => {
		          	this.$router.push({
						path: '/login'
					})
		          	localStorage.removeItem('userGrade')
		          	localStorage.removeItem('userInfo')
		          }, 600) 
		        }).catch(() => {
		          this.$message({
		            type: 'info',
		            message: '已取消退出',
		            center: true
		          });          
		        });
			}
		}
	}
</script>

<style scoped>
	.shortcutBox {
		position: absolute;
		top: 70px;
		right: 0;
		z-index: 200;
		width: 140px;
		height: auto;
		background: #373A3E;
		border-radius: 4px;
		padding: 15px 0;
		font-size: 14px;
		color: #FFFFFF;
	}
	.shortcutBox::before {
		content: '';
		display: block;
		position: absolute;
		top: -8px;
		right: 30px;
		width: 16px;
		height: 16px;
		transform: rotate(45deg);
		background: #373A3E;
	}
	.shortcutBox>div {
		width: 100%;
		height: 34px;
		line-height: 34px;
		padding: 0 15px;
		transition: all 0.2s;
	}
	.shortcutBox>div:hover {
		background: #000000;
		cursor: pointer;
	}
</style>