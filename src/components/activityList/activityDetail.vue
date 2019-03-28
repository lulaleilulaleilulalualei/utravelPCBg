<template>
	<div class="detailContentBox">
	<happy-scroll color="rgba(255,177,50,1)" size="4" resize hide-horizontal hide-vertical :scroll-top="c_backTopVal">
	<div class="activityDetail">
		<div class="detailBanner">
			<img :src="`${detailObj.coverImg}?x-oss-process=style/thumb840x340`" alt="">
		</div>
		<div class="detailBox">
			<detailTop :detailTop = "detailObj" 
						:isActivity="isActivity"
						:shareUrl="shareUrl"></detailTop>
			<div class="detailInfo">
				<div class="infoName">
					<span>活动日期：</span>
					<span>{{detailObj.beginTime}}-{{detailObj.endTime}}</span>
				</div>
				<div class="infoName">
					<span>集合时间、地点：</span>
					<span>{{detailObj.gatherTime}} {{detailObj.gatherPlace}}</span>
				</div>
				<div class="infoData">
					<div class="infoName">
						<span>人数：</span>
						<span>{{detailObj.adultNum + detailObj.childNum}}</span>
					</div>
					<div class="infoName">
						<span>车辆：</span>
						<span>{{detailObj.carNum || 0}}</span>
					</div>
					<div class="infoNamePeople">
						<span>成人：{{(detailObj.adultFee/100).toFixed(2) || 0}}元/人 &nbsp;儿童：{{(detailObj.childFee/100).toFixed(2) || 0}}元/人</span>
					</div>
				</div>
			</div>

			<div class="detailContent">
				<p v-html="$api.textFilter(detailObj.description)"></p>
				<div class="itemDays" v-for="(item, index) in detailObj.nodes" :key="index">
					<h4 :id="`${item.title}_${index}`">{{item.title}}</h4>
					<p v-html="$api.textFilter(item.desc)"></p>
					<div class="itemSpot" v-for="(node, ind) in item.nodes" :key="ind"> 
						<img :src="node.thumb" alt="">
						<div class="pointTitle">
							<b></b>
							<h4>{{node.name}}</h4>
						</div>
						<p v-html="node.desc.length>200? node.desc.substring(0, 200) + '...': node.desc"></p>
						<div class="detailPoint" @click="lookItemSpot(node.id)">
							<div class="detailPointName">
								<b></b>
								<span>{{node.address}}</span>
							</div>
							<div class="lookPointDetail">
								<span>查看景点详情</span>
							</div>
						</div>
						<div class="mixtureOBj" v-for="(val, each) in node.hotelsOrfoods" :key="each" v-if="node.hotelsOrfoods != 0">
							<img :src="val.thumb" alt="">
							<div :class="val.type == 1? 'hotelIcon': 'foodsIcon'">
								<b></b>
								<h4>{{val.name}}</h4>
							</div>
							<div class="typeInfo">
								<div class="infoAddress"><b></b><span>{{val.address}}</span></div>
								<div class="infoNumber">
									<span>电话: {{val.tel}}</span>
									<span>{{val.type == 1? '标间消费': '美食消费'}}: {{val.cost}}</span>
								</div>
							</div>
							<p v-html="$api.textFilter(val.desc)"></p>
						</div>
					</div>
				</div>
				<div class="attentions" v-if="detailObj.attentions && detailObj.attentions != ''">
					<span>注意事项：</span>
					<p v-html="$api.textFilter(detailObj.attentions)"></p>
				</div>
				<div class="detailBottom">
					<div class="detailBottomBox">
						<span>扫二维码进入手机端报名，关注公众号发现更多好玩</span>
						<div class="detailCode">
							<div>
								<canvas id="canvasHome"></canvas>
								<span>活动报名</span>
							</div>
							<div>
								<img src="../../assets/img/qrCode.png" alt="">
								<span>公众号</span>
							</div>
						</div>
					</div>
				</div>
			</div>	
		</div>
	</div>
	</happy-scroll>
	<planDaySearch v-if="isShowDayPlan" :routeObj="detailObj.nodes"></planDaySearch>
	<transition name="fade">
			<showSpot v-if="c_isShowSpotContent.isShow"></showSpot>
		</transition>
	</div>
</template>

<script>
	import detailTop from '../common/detailTop.vue'
	import showSpot from '../common/showSpot.vue'
	import planDaySearch from '../writeLine/planDaySearch.vue'
	import { mapGetters , mapActions } from 'vuex';
	import QRCode from 'qrcode'
	import config from '@/config'

	export default {
		data() {
			return {
				isActivity: true,
				detailObj: {},
				shareUrl: '',
				isShowDayPlan: false
			}
		},
		computed:{
			...mapGetters([
				'c_backTopVal',
				'c_loadingVal',
				'c_userVal',
				'c_userInfo',
				'c_isShowSpotContent'
				])
		},
		components: {detailTop, showSpot, planDaySearch},
		methods: {
			...mapActions([
				'c_showSpotContent',
				]),
			lookItemSpot(id) {
				this.c_showSpotContent({id: id, isShow: true})
			},
			getDetail() {
				const $this = this
				this.$api.ajax({
					url: `${this.c_userVal == 'admin'? config.getActDetail: config.userActDetail}/${this.$route.query.id}`,
					headers: {
						'Content-Type':'application/x-www-form-urlencoded',
						'API-User-Token': $this.c_userInfo.token
					},
					success: (res) => {
						if(res.code == 0) {
							this.detailObj = res.data
							this.shareUrl = res.data.shareUrl
							this.isShowDayPlan = true
							if(this.c_loadingVal) {
								this.c_loadingVal.close()
							}
							this.useqrcode()
						}else {
							this.$message({
						        type: 'error',
						        message: res.message,
						        center: true
						    });
						    if(this.c_loadingVal) {
								this.c_loadingVal.close()
							}
						}
					},
					error: (err) => {
						console.log(err)
						this.$message({
					        type: 'error',
					        message: '数据加载失败',
					        center: true
					    });
					    if(this.c_loadingVal) {
							this.c_loadingVal.close()
						}
					}
				})
			},
			useqrcode(){
				const $this = this
		        let canvas = document.getElementById('canvasHome')
				QRCode.toCanvas(canvas, this.shareUrl, function (error) {
					if (error) {
						$this.$message({
							type: 'error',
							message: '分享链接加载失败',
							center: true
						});
					}
				})
		    }
		},
		created() {
			this.getDetail()
		},
		mounted() {
			
		}
	}
</script>

<style scoped>
	.detailContentBox{
		height: 100%;
		width: 100%;
		display: flex;
	}
	.activityDetail {
		position: relative;
		top: -5px;
		overflow-y: auto;
	}
	.detailBanner {
		width: 100%;
		height: 340px;
	}
	.detailBox {
		width: 100%;
		padding: 0 100px 10px;
		position: relative;
		background-color: #fff;
	}
	.detailInfo {
		border: 1px dashed #9FA6AD;
		padding: 20px 30px;
		font-size: 14px;
		color: #373A3E;
		position: relative;
		top: -40px;
	}
	.detailInfo>div:not(:last-child) {
		margin-bottom: 15px;
	}
	.infoName {
		display: flex;
		align-items: center;
	}
	.infoName::before, .infoNamePeople::before {
		content: '';
		display: block;
		height: 18px;
		width: 3px;
		background-image: linear-gradient(-180deg, #FFCA59 0%, #FF840F 100%);
		border-radius: 8px;
		margin-right: 8px;
	}
	.infoData {
		display: flex;
		align-items: center;
	}
	.infoData>div:not(:last-child) {
		margin-right: 30px;
	}
	.infoNamePeople {
		display: flex;
		align-items: center;
	}
	
	/* 详情内容展示区域 */
	.detailContent {
		width: 100%;
	}
	.detailContent h4 {
		font-size: 18px;
		color: #373A3E;
	}
	.detailContent P {
		font-size: 16px;
		color: #373A3E;
		margin-bottom: 10px;
		line-height: 24px;
	}
	.detailContent>p {
		margin-bottom: 20px;
	}
	.detailContent img {
		border-radius: 6px;
	}
	.itemDays {
		width: 100%;
	}
	.itemDays:not(:last-child) {
		margin-bottom: 40px;
	}
	.itemSpot {
		width: 100%;
	}
	.itemSpot:not(:last-child) {
		margin-bottom: 20px;
	}
	.itemDays>h4 {
		margin-bottom: 15px;
	}
	.itemSpot>h4 {
		font-size: 18px;
		color: #373A3E;
		font-weight: 600;
		padding: 15px 0;
	}
	.itemSpot>img {
		border-radius: 6px;
	}
	.detailPoint {
		width: 100%;
		height: 40px;
		margin-top: 10px;
		background: #FFFFFF;
		box-shadow: 0 0 4px 0 #DCDCDC;
		border-radius: 4px;
		padding: 0 10px;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.detailPoint:hover {
		cursor: pointer;
	}
	.detailPointName {
		display: flex;
		align-items: center;
		font-size: 12px;
		color: #373A3E;
	}
	.detailPointName>b {
		display: block;
		width: 10px;
		height: 12px;
		background: url('../../assets/img/position_icon.png') no-repeat center;
		background-size: 100%;
		margin-right: 5px;
	}
	.detailPointName>span {
		display: block;
	}
	.lookPointDetail {
		font-size: 14px;
		color: #373A3E;
		display: flex;
		align-items: center;
	}
	.lookPointDetail>span {
		display: block;
		margin-right: 5px;
	}
	.lookPointDetail::after {
		content: '';
		display: block;
		width: 8px;
		height: 8px;
		border: 1px solid #414141;
		border-left: none;
		border-top: none;
		transform: rotate(-45deg);
	}
	.mixtureOBj {
		margin-top: 20px;
	}
	.pointTitle, .hotelIcon, .foodsIcon {
		display: flex;
		align-items: center;
		padding: 10px 0;
	}
	.pointTitle>h4, .hotelIcon>h4, .foodsIcon>h4 {
		font-size: 20px;
		color: #FFB132;
	}
	.pointTitle>b, .hotelIcon>b, .foodsIcon>b  {
		display: block;
		width: 28px;
		height: 28px;
		margin-right: 10px;
	}
	.pointTitle>b {
		background: url('../../assets/img/spot_icon.png') no-repeat center;
		background-size: 100%;
	}
	.hotelIcon>b {
		background: url('../../assets/img/hotel_icon.png') no-repeat center;
		background-size: 100%;
	}
	.foodsIcon>b {
		background: url('../../assets/img/cate_icon.png') no-repeat center;
		background-size: 100%;
	}
	.typeInfo {
		font-size: 16px;
		color: #373A3E;
		margin-bottom: 10px;
	}
	.infoAddress {
		display: flex;
		align-items: center;
		margin-bottom: 10px;
	}
	.infoAddress>b {
		display: block;
		width: 12px;
		height: 14px;
		margin-right: 5px;
		background: url('../../assets/img/position_icon.png') no-repeat center;
		background-size: 100%;
	}
	.infoNumber {
		display: flex;
		align-items: center;
		margin-bottom: 10px;
	}
	.infoNumber>span{
		flex: 1;
		display: flex;
		align-items: center;
	}
	.attentions {
		width: 100%;
	}
	.attentions>span {
		display: block;
		font-size: 18px;
		font-weight: 600;
		color: #373A3E;
		margin-bottom: 10px;
	}
	.detailBottom {
		margin-top: 20px;
		padding-top: 30px;
		border-top:1px solid #E6E6E6;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.detailBottomBox {
		width: 282px;
		height: auto;
	}
	.detailBottomBox>span {
		display: block;
		font-size: 18px;
		color: #929292;
		letter-spacing: 0.75px;
		margin-bottom: 30px;
		text-align: center;
	}
	.detailCode {
		width: 100%;
		display: flex;
		justify-content: center;
		font-size: 12px;
		color: #9FA6AD;
	}
	.detailCode>div:first-child {
		margin-right: 40px;
	}
	.detailCode>div>img {
		width: 100px;
		height: 100px;
		padding: 5px;
	}
	#canvasHome {
		width: 100px!important;
		height: 100px!important;
	}
	.detailCode>div>span {
		display: block;
		text-align: center;
		margin-top: 5px;
	}
</style>