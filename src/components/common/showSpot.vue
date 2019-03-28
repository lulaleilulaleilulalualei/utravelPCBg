<template>
	<div class="showSpot" @click="colseSpot">
		<div class="spotArea">
			<div class="spotBox" v-loading="boxLoading">
				<happy-scroll color="rgba(255,177,50,1)" size="2" resize>
				<div class="largeShow">
					<img :src="showImg" alt="">
					<div class="toMoreImg" v-if="isHadMoreImg" @click="moreImg">
						<span>查</span>
						<span>看</span>
						<span>更</span>
						<span>多</span>
						<span>图</span>
						<span>片</span>
					</div>
				</div>
				<div class="smallListBox">
					<!-- <div class="toLeftBtn" @click="toLeft"><b></b></div> -->
					<div class="smallList">
						<div class="listScrollBox" ref="scrollBox" :style="{transform: moveVal}">
							<div :class="['itemSmallImg', {selectImg: imgIndex == index}]" v-for="(item, index) in imgArr" :key="index" @click="selectShowImg(index)">
								<img :src="item.url" alt="">
								<b></b>
							</div>
						</div>
					</div>
					<!-- <div class="toRightBtn" @click="toRight"><b></b></div> -->
				</div>
				<div class="spotNameInfo">
					<h4>{{spotObj.name}}</h4>
					<span>{{spotObj.address}}</span>
					<div class="spotLink">
						<div><span>景点电话：</span><p><span v-for="item in telArr">{{item}}</span></p></div>
						<div><span>景点网址：</span><p><span v-for="item in siteArr">{{item}}</span></p></div>
					</div>
				</div>
				<div class="spotDescription" v-html="$api.textFilter(spotDesc)"></div>
				<div class="spotStatus">
					<div class="spotStatusBox">
						<div class="itemSpotInfo">
							<b>交通提示</b>
							<p v-html="$api.textFilter(spotObj.trafficText)"></p>
						</div>
						<div class="itemSpotInfo">
							<b>用时参考</b>
							<p v-html="spotObj.useTime"></p>
						</div>
						<div class="itemSpotInfo">
							<b>最佳季节</b>
							<p v-html="spotObj.bestSeason"></p>
						</div>
						<div class="itemSpotInfo">
							<b>营业时间</b>
							<p v-html="$api.textFilter(spotObj.openTime)"></p>
						</div>
						<div class="itemSpotInfo">
							<b>门票提示</b>
							<p v-html="$api.textFilter(spotObj.ticketText)"></p>
						</div>
						<div class="itemSpotInfo">
							<b>景区星级</b>
							<span>{{spotObj.starLevel? `${spotObj.starLevel}A景区`: ''}}</span>
						</div>
						<div class="itemSpotInfo">
							<b>标签</b>
							<span>{{spotObj.tags}}</span>
						</div>
					</div>
				</div>
				</happy-scroll>
			</div>
		</div>
		<transition name="fade">
			<listImg v-if="c_isShowImgList" 
					:imgList="imgList"
					:isDisabled="true"></listImg>
		</transition>
	</div>
</template>

<script>
	import { mapGetters , mapActions } from 'vuex';
	import listImg from '../spotList/listImg.vue'
	import config from '@/config'
	
	export default {
		data() {
			return {
				imgArr:[],
				spotObj: {},
				showImg: '',
				moveVal: 'translate3d(0,0,0)',
				moveIndex: 1,
				paginOver: 0,
				len: 0,
				imgIndex: 0,
				boxLoading: true,
				imgList: [],//大图片列表
				isHadMoreImg: false
			}
		},
		components: {listImg},
		computed: {
			...mapGetters([
				'c_isShowSpotContent',
				'c_userInfo',
				'c_isShowImgList',
				'c_userVal'
				]),
			telArr() {
				if(this.spotObj.tel) {
					return this.spotObj.tel.split(';')
				}
				
			},
			siteArr() {
				if(this.spotObj.site) {
					return this.spotObj.site.split(';')
				}
			},
			spotDesc() {
				let text = this.spotObj.desc
				if(text) {
					text = text.replace(/\n/g,'<br/>')
				}
				return text
			}
		},
		methods: {
			...mapActions([
				'c_showSpotContent',
				'c_showImgList'
				]),
			moreImg() {
				this.c_showImgList(true)
			},
			scrollWidth() {
				this.$refs.scrollBox.style.width = this.len*68 + (this.len - 1)*10 + 'px'
			},
			selectShowImg(index) {
				this.imgIndex = index
				this.showImg = this.imgArr[index].url
				if(index == 6) {
					this.isHadMoreImg = true
				}else {
					this.isHadMoreImg = false
				}
			},
			getSpotDetail() {
				const $this = this
				this.$api.ajax({
					url: `${this.c_userVal == 'admin'? config.spotDetail: config.userSpotDetail}/${this.c_isShowSpotContent.id}`,
					headers: {
						'API-User-Token': $this.c_userInfo.token
					},
					success: (res) => {
						if(res.code == 0) {
							this.spotObj = res.data.info
							res.data.pics.map((v, i) => {
								this.imgList.push({
									url: v.url,
									id: v.id
								})
							})
							if(res.data.pics.length >= 7) {
								this.imgArr = res.data.pics.splice(0, 7)
							}else if(res.data.pics.length == 0){
								this.imgArr.push({
									url: res.data.info.thumbImg
								})
							}else {
								this.imgArr  = res.data.pics
							}
							this.showImg = this.imgArr[0].url
							setTimeout(() => {
								this.boxLoading = false
							}, 200)
						}else {
							this.$message({
						        type: 'error',
						        message: res.message,
						        center: true
						    });
						}
					},
					error: (err) => {
						console.log(err)
						this.$message({
					        type: 'error',
					        message: '景点加载失败',
					        center: true
					    });
					}
				})
			},
			colseSpot(e) {
				if(e.target.className == 'showSpot' || e.target.className == 'spotArea') {
					this.c_showSpotContent({id:'', isShow: false})
				}
			}
		},
		mounted() {
			this.len = this.imgArr.length
			this.paginOver = Math.ceil(this.len / 7)
			this.scrollWidth()
			this.getSpotDetail()
		}
	}
</script>

<style scoped>
	.showSpot {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 1000;
		background-color: rgba(0,0,0,0.29);
	}
	.spotArea {
		width: 1180px;
		height: 100%;
		margin: 0 auto; 
		padding-left: 300px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.spotBox {
		width: 600px;
		max-height: 800px;
		min-height: 600px;
		background: #FFFFFF;
		border-radius: 7px;
		overflow-y: auto;
	}
	.spotBox::-webkit-scrollbar {
		display: none;
	}
	.largeShow {
		width: 100%;
		height: 260px;
		margin-bottom: 15px;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: rgba(0,0,0,0.1);
		position: relative;
	}
	.largeShow>img{
		height: 100%;
		width: auto;
	}
	.toMoreImg {
		position: absolute;
		top: 0;
		right: 0;
		height: 100%;
		font-size: 14px;
		color: #373A3E;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding:0 10px;
	}
	.toMoreImg:hover {
		cursor: pointer;
	}
	.toMoreImg>span {
		display: block;
		margin-bottom: 2px;
	}
	.smallListBox {
		width: 100%;
		height: 68px;
		display: flex;
		align-items: center;
		margin-bottom: 15px;
	}
	.toLeftBtn, .toRightBtn {
		height: 100%;
		width: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.toLeftBtn:hover, .toRightBtn:hover {
		cursor: pointer;
	}
	.toLeftBtn>b, .toRightBtn>b{
		display: block;
		width: 15px;
		height: 23px;
	}
	.toLeftBtn>b {
		background: url('../../assets/img/toLeftBtn.png') no-repeat center;
		background-size: 100%;
	}
	.toRightBtn>b {
		background: url('../../assets/img/toRightBtn.png') no-repeat center;
		background-size: 100%;
	}
	.smallList {
		flex: 1;
		overflow: hidden;
		height: 100%;
		display: flex;
		padding-left: 25px;
	}
	.listScrollBox {
		width: auto;
		height: 100%;
		display: flex;
		align-items: center;
		transition-duration: 300ms;
	}
	.itemSmallImg {
		width: 70px;
		height: 70px;
		position: relative;
		border-radius: 2px;
		overflow: hidden;
	}
	.itemSmallImg:hover {
		cursor: pointer;
	}
	.itemSmallImg>b {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0,0,0,0.4);
		transition: all 0.2s;
	}
	.selectImg>b {
		background-color: transparent;
	}
	.itemSmallImg:not(:nth-child(7n)) {
		margin-right: 10px;
	}
	.spotNameInfo {
		padding: 15px;
		border-bottom: 1px solid #E6E6E6;
	}
	.spotNameInfo>h4 {
		font-size: 18px;
		color: #FFB132;
		margin-bottom: 5px;
	}
	.spotNameInfo>span {
		display: block;
		font-size: 16px;
		color: #373A3E;
		margin-bottom: 5px;
	}
	.spotLink {
		font-size: 16px;
		color: #373A3E;
		display: flex;
	}
	.spotLink>div {
		display: flex;
		align-items: flex-start;
	}
	.spotLink>div:first-child {
		margin-right: 40px;
	}
	.spotLink>div>p {
		display: flex;
		flex-direction: column;
	}
	.spotLink>div>p>span {
		display: block;
	}
	.spotDescription {
		padding: 15px;
		border-bottom: 1px solid #E6E6E6;
		font-size: 16px;
		color: #373A3E;
		line-height: 24px;
	}
	.spotStatus {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		padding: 15px 15px 30px;
	}
	.spotStatusBox {
		display: flex;
		flex-direction: column;
	}
	.spotStatusBox>div:not(:last-child) {
		margin-bottom: 10px;
	}
	.itemSpotInfo {
		display: flex;
	}
	.itemSpotInfo>b {
		display: block;
		margin-right: 10px;
		width: 64px;
	}
	.itemSpotInfo>p, .itemSpotInfo>span {
		flex: 1;
		display: block;
	}
</style>