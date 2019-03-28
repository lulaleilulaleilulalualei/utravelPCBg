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
						hideIcon: require('../../assets/img/official_icon_2.png'),
						showIcon: require('../../assets/img/official_icon_1.png'),
						text: '官方',
						className: 'typeOfficial',
						isShow: false
					}
				]
			}
		},
		computed: {
			...mapGetters([
				'vhl_lineType'
				])
		},
		watch: {
			vhl_lineType(val) {
				if(val == 1 || val == 4) {
					this.typeList.map((v, i) => {
						v.isShow = false
					})
				}
			}
		},
		methods: {
			...mapActions([
				'vhl_changeTypeVal'
				]),
			cutType(index) {
				this.typeList.map((v, i) => {
					if(index == i) {
						v.isShow = true
						if(v.text == '全部') {
							this.vhl_changeTypeVal(2)
						}else {
							this.vhl_changeTypeVal(3)
						}
					}else {
						v.isShow = false
					}
				})
			}
		},
		mounted() {
			if(this.vhl_lineType == 1 || this.vhl_lineType == 4) {
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
		position: relative;
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
		width: 27px;
		height: 22px;
		margin-right: 5px;
	}
	.cutType .typeSelected {
		border-color: transparent;
		color: #373A3E;
		background-color: #fff;
	}
	.cutType>div:first-child {
		border-right: none;
		z-index: 2;
	}
	.cutType>div:first-child::after {
		content: '';
		display: block;
		width: 2px;
		height: 47px;
		background-color: #DDDEE1;
		position: absolute;
		right: 0;
		z-index: 10;
	}
	.cutType>div:nth-child(2) {
		border-left: none;
		z-index: 1;
	}
</style>