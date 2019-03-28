<template>
	<div class="cutType">
		<div :class="[{typeSelected: item.isShow}, item.className]" v-for="(item, index) in typeList" :key="index" @click="cutType(index)">
			<div><img :src="item.isShow? item.showIcon: item.hideIcon" alt=""></div>
			<span>{{item.text}}</span>
		</div>
	</div>
</template>

<script>
	import { mapGetters , mapActions } from 'vuex';
	
	export default {
		data() {
			return {
				typeList: [
					{
						hideIcon: require('../../assets/img/hide_all.png'),
						showIcon: require('../../assets/img/show_all.png'),
						text: '全部',
						className: 'typeUser',
						isShow: true
					},
					{
						hideIcon: require('../../assets/img/user_icon_2.png'),
						showIcon: require('../../assets/img/user_icon_1.png'),
						text: '我的',
						className: 'typeOfficial',
						isShow: false
					}
				]
			}
		},
		computed: {
			...mapGetters([
				'wn_noteType'
				])
		},
		watch: {
			wn_noteType(val) {
				if(val == 1) {
					this.typeList.map((v, i) => {
						v.isShow = false
					})
				}
			}
		},
		methods: {
			...mapActions([
				'wn_changeNoteType'
				]),
			cutType(index) {
				this.typeList.map((v, i) => {
					if(index == i) {
						v.isShow = true
						if(v.text == '全部') {
							this.wn_changeNoteType(2)
						}else if(v.text == '我的') {
							this.wn_changeNoteType(3)
						}
					}else {
						v.isShow = false
					}
				})
			}
		},
		mounted() {
			if(this.wn_noteType == 1) {
				this.typeList.map((v, i) => {
					v.isShow = false
				})
			}
		}
	}
</script>

<style scoped>
	.cutType {
		width: 190px;
		height: 47px;
		display: flex;
		box-shadow: 0 0 14px 0 #ECEDF1;
		border-radius: 4px;
		overflow: hidden;
	}
	.cutType>div {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 15px;
		color: #A9AFB6;
		border: 2px solid #DDDEE1;
		transition: all 0.2s;
	}
	.cutType>div:hover {
		cursor: pointer;
	}
	.typeUser>div {
		width: 20px;
		height: 20px;
		margin-right: 5px;
	}
	.typeOfficial>div {
		width: 20px;
		height: 20px;
		margin-right: 5px;
	}
	.cutType .typeSelected {
		border-color: transparent;
		color: #373A3E;
		background-color: #fff;
	}
</style>