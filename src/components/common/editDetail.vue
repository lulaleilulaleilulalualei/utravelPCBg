<!-- 从详情页进入编辑页 -->
<template>
	<div class="edilDetal" v-if="hld_isShowEdit.isShow" @click="jumpToEdit">
		<img src="../../assets/img/edit_act.png" alt="">
	</div>
</template>

<script>
	import { mapGetters , mapActions } from 'vuex';

	export default {
		data() {
			return {

			}
		},
		computed: {
			...mapGetters([
				'hld_isShowEdit'
				])
		},
		methods: {
			...mapActions([
				'c_loadingShow'
				]),
			jumpToEdit() {
				this.c_loadingShow()
				setTimeout(() => {
				    this.$router.push({
						path: '/writeLine',
						query:{
				          id: this.hld_isShowEdit.id
				        }
					})
				}, 600);
			}
		}
	}
</script>

<style scoped>
	.edilDetal {
		position: absolute;
		bottom: 20px;
		right: 20px;
		width: 53px;
		height: 22px;
	}
	.edilDetal:hover {
		cursor: pointer;
	}
</style>