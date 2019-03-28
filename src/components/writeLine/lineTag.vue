<template>
	<div class="lineTag">
		<div class="lineTagArea">
			<div class="lineTagBox">
				<h4>添加标签</h4>
				<p>让线路信息更明确，方便更多粉丝自驾出游</p>
				<div class="tagList">
					<div :class="[{'selectedTag': item.isSelected}, 'itemTag']" v-for="(item, index) in tagList" @click="clickItemTag(index)">{{item.text}}</div>
				</div>
				<div class="boxBtn">
					<div @click="closeTagBox">取消</div>
					<div @click="completeLine">发表</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { mapGetters , mapActions } from 'vuex';
	
	export default {
		data() {
			return {
				tagList: [
					{
						text: '盘山',
						isSelected: false
					},
					{
						text: '休闲',
						isSelected: false
					},
					{
						text: '自助自驾',
						isSelected: false
					}
				]
			}
		},
		methods: {
			...mapActions([
				'wl_showTag'
				]),
			completeLine() {
				this.wl_showTag(false)
			},
			closeTagBox() {
				this.wl_showTag(false)
			},
			clickItemTag(index) {
				this.tagList.map((v, i) => {
					if(index == i) {
						v.isSelected? (v.isSelected = false) : (v.isSelected = true)
					}
				})
			}
		}
	}
</script>

<style scoped>
	.lineTag {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 50;
		width: 100%;
		height: 100%;
		background-color: rgba(0,0,0,0.29);
	}
	.lineTagArea {
		width: 1180px;
		height: 100%;
		padding-left: 300px;
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
		margin: 0 auto;
	}
	.lineTagBox {
		background-color: #fff;
		padding: 30px 15px 15px;
		border: 1px solid #DDDEE1;
		border-radius: 4px;
		width: 600px;
		height:  auto;
	}
	.lineTagBox>h4 {
		font-size: 24px;
		color: #FFB132;
		margin-bottom: 5px;
	}
	.lineTagBox>p {
		font-size: 14px;
		color: #929292;
		margin-bottom: 15px;
	}
	.tagList {
		display: flex;
		flex-wrap: wrap;
		margin-bottom: 20px;
	}
	.itemTag {
		padding: 10px 15px;
		border: 1px solid #DDDEE1;
		border-radius: 4px;
		font-size: 16px;
		color: #9FA6AD;
		margin-bottom: 10px;
		transition: all 0.2s;
	}
	.itemTag.selectedTag {
		background: #FFB132;
		border-color: transparent;
		color: #fff;
	}
	.itemTag:hover {
		cursor: pointer;
	}
	.itemTag:not(:first-child) {
		margin-left: 10px;
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
		justify-content: center;
		align-items: center;
	}
	.boxBtn>div:hover {
		cursor: pointer;
	}
	.boxBtn>div:first-child {
		background: #DDDEE1;
		margin-right: 10px;
	}
	.boxBtn>div:nth-child(2) {
		background: #FFB132;
	}
</style>