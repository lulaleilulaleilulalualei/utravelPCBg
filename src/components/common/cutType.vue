<template>
	<div class="cutType">
		<div class="toStartAct" v-if="false">
			<div class="lineCutLeft">
				<div class="writeImg" @click="toStartAct" title="发起活动">
					<img src="../../assets/img/activity_icon.png" alt="">
				</div>
				<!-- <div class="writeText">
					<h4 @click="toStartAct">发起活动</h4>
					<div>
						
					</div>
				</div> -->
			</div>
		</div>
		<div class="cutTypeBox">
			<div :class="[{typeSelected: item.isShow}, {firstSelected: selectFirst && item.text == '官方'}, {lastSelected:selectLast && item.text == '全部'}, item.className]" v-for="(item, index) in typeList" :key="index" @click="cutType(index)">
				<div><img :src="item.isShow? item.showIcon: item.hideIcon" alt=""></div>
				<span>{{item.text}}</span>
			</div>
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
						text: '用户',
						className: 'typeUser',
						isShow: false
					},
					{
						hideIcon: require('../../assets/img/official_icon_2.png'),
						showIcon: require('../../assets/img/official_icon_1.png'),
						text: '官方',
						className: 'typeOfficial',
						isShow: false
					}
				],
				selectFirst: true,
				selectLast: false
			}
		},
		methods: {
			...mapActions([
				'c_loadingShow',
				'wa_showActBox'
				]),
			cutType(index) {
				this.typeList.map((v, i) => {
					if(index == i) {
						let actType = 0
						v.isShow = true
						if(v.text == '全部') {
							actType = 0
							this.selectFirst = true
							this.selectLast = false
						}else if(v.text == '用户') {
							actType = 2
							this.selectFirst = false
							this.selectLast = false
						}else if(v.text == '官方') {
							actType = 1
							this.selectFirst = false
							this.selectLast = true
						}
						this.$emit('actType', actType)
					}else {
						v.isShow = false
					}
				})
			},
			toStartAct() {
				this.wa_showActBox({isShow: true, id: ''})
			} 
		}
	}
</script>

<style scoped>
	.cutType {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 30px;
	}
	.toStartAct {

	}
	.cutTypeBox {
		width: 285px;
		height: 47px;
		display: flex;
		box-shadow: 0 0 14px 0 #ECEDF1;
		border-radius: 4px;
		overflow: hidden;
	}
	.cutTypeBox>div {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 15px;
		color: #A9AFB6;
		border: 2px solid #DDDEE1;
		transition: all 0.2s;
	}
	.cutTypeBox>div:hover {
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
	.cutType .firstSelected{
		border-left-color: transparent;
	}
	.cutType .lastSelected{
		border-right-color: transparent;
	}
	.lineCutLeft {
		display: flex;
		align-items: center;
	}
	.writeImg {
		width: 62px;
		height: 62px;
		box-shadow: 0 0 14px 0 rgba(255,177,50,0.40);
		border-radius: 6px;
		margin-right: 25px;
		background-color: #FFB132;
		padding: 16px 14px;
	}
	.writeImg:hover {
		cursor: pointer;
	}
	.writeText>h4 {
		font-size: 18px;
		color: #373A3E;
		font-weight: 600;
		margin-bottom: 5px;
	}
	.writeText>h4:hover {
		cursor: pointer;
		text-decoration: underline;
	}
	.writeText>div {
		display: flex;
		font-size: 15px;
		color: #9FA6AD;
		align-items: center;
	}
	.writeText>div>span {
		display: block;
		padding-bottom: 3px;
		display: flex;
		align-items: center;
		border: 2px solid transparent;
	}
	.writeText>div>span.hasSelect {
		border-bottom-color: #9FA6AD;
	}
	.writeText>div>span:hover {
		cursor: pointer;
	}
</style>