<template>
	<div class="noteDetailBox">
	<happy-scroll color="rgba(255,177,50,1)" size="4" resize hide-horizontal hide-vertical :scroll-top="c_backTopVal">
		<div class="noteDetail">
			<div class="detailBanner">
				<img :src="`${detailObj.coverImg}?x-oss-process=style/thumb840x340`" alt="">
			</div>
			<div class="detailBox">
				<detailTop :detailTop="detailObj"
							:shareUrl="shareUrl"></detailTop>
				<div class="noteInfo">
					<div class="itemInfoBox">
						<div class="noteDestination itemInfo">
							<b></b>
							<div><span>目的地</span> <span class="destinationTitle">{{detailObj.destination}}</span></div>
						</div>
						<div class="noteClassify itemInfo">
							<b></b>
							<div><span>分类</span> <span>{{detailObj.personType}}</span></div>
						</div>
					</div>
					<div class="itemInfoBox">
						<div class="noteTime itemInfo">
							<b></b>
							<div><span>发出时间</span> <span>{{detailObj.departTime}}</span></div>
						</div>
						<div class="noteCost itemInfo">
							<b></b>
							<div><span>人均费用</span> <span>{{detailObj.spendFee}}</span></div>
						</div>
					</div>
					<div class="itemInfoBox">
						<div class="noteDays itemInfo">
							<b></b>
							<div><span>出行天数</span> <span>{{detailObj.dayNum}}</span></div>
						</div>
					</div>
				</div>
				<div class="detailContent">
					<div v-for="(item, index) in arrObj" :key="item.id">
						<h4 v-if="item.travelType == 1">{{item.content}}</h4>
						<p v-if="item.travelType == 2" v-html="$api.textFilter(item.content)"></p>
						<img v-if="item.travelType == 3" :src="item.content">
						<div v-if="item.travelType == 4" class="videoBox">
							<video :class="'video_'+index" @click="playVideo(index)">
								<source :src="item.content" />
								<span>对不起；您的浏览器不支持HTML5视频,请更换或者升级浏览器</span>
							</video>
							<div class="videoPlay" v-if="!item.isPlay" @click.stop="playVideo(index)"><img src="../../assets/img/videoPlay.png" alt=""></div>
						</div>
					</div>
				</div>
				<div class="authorCopyright">
					<p>本线游记作权归<span>@{{detailObj.nickname}}</span>所有，任何形式转载请联系作者。</p>
				</div>
			</div>
		</div>
	</happy-scroll>
	</div>
</template>

<script>
	import detailTop from '../common/detailTop.vue'
	import { mapGetters , mapActions } from 'vuex';
	import config from '@/config'
	
	export default {
		data() {
			return {
				detailObj: {},
				shareUrl: '',
				arrObj: [], //列表数据
			}
		},
		components: {detailTop},
		computed:{
			...mapGetters([
				'c_backTopVal',
				'c_loadingVal',
				'c_userInfo',
				'c_userVal'
				])
		},
		methods: {
			...mapActions([
				'c_loadingShow',
				'nd_showHandleBtn'
				]),
			playVideo(index) {
				let tags = document.getElementsByTagName("video")
				let video = 'video_'+index
				for(let i=0;i<tags.length;i++) {
					if(tags[i].className.indexOf(video) != -1) {
						if(tags[i].paused) {
							tags[i].play()
							this.arrObj[index].isPlay = true
						}else {
							tags[i].pause()
							this.arrObj[index].isPlay = false
						}
					}else {
						tags[i].pause()
						let cName = tags[i].className,
							index = cName.split('_')[1]
						this.arrObj[index].isPlay = false
					}
				}
				
			},
			getDetail() {
				const $this = this
				this.$api.ajax({
					url: `${this.c_userVal == 'admin'? config.noteDetail: config.userNoteDetail}/${this.$route.query.id}`,
					headers: {
						'Content-Type':'application/x-www-form-urlencoded',
						'API-User-Token': $this.c_userInfo.token
					},
					success: (res) => {
						if(res.code == 0) {
							let dataObj = res.data.details
							dataObj.map((v, i) => {
								if(v.travelType == 4) {
									v.isPlay = false
								}
							})
							this.arrObj = dataObj
							this.detailObj = res.data
							this.shareUrl = res.data.shareUrl
							if(this.c_loadingVal) {
								this.c_loadingVal.close()
							}
							if(this.detailObj.selfFlag == 1) {
								this.nd_showHandleBtn({id: this.$route.query.id, isShow: true})
							}
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
		},
		created() {
			this.getDetail()
		},
		mounted() {
			
		}
	}
</script>

<style scoped>
	.noteDetailBox {
		width: 100%;
		height: 100%;
		flex: 1;
	}
	.noteDetail {
		position: relative;
	}
	.detailBanner {
		width: 100%;
		height: 340px;
	}
	.detailBox {
		width: 100%;
		padding: 0 100px;
		position: relative;
		background-color: #fff;
	}
	.noteInfo {
		padding: 20px;
		display: flex;
		justify-content: space-around;
		font-size: 14px;
    	color: #373A3E;
    	border: 1px dashed #9FA6AD;
    	position: relative;
    	top: -30px;
	}
	.itemInfoBox:first-child {
		max-width: 350px;
	}
	.itemInfoBox>div {
		display: flex;
		align-items: center;
	}
	.itemInfoBox>div:first-child {
		margin-bottom: 15px;
	}
	.itemInfoBox>div>b {
		display: block;
		width: 22px;
		height: 22px;
		margin-right: 5px;
	}
	.itemInfo>div {
		display: flex;
		align-items: center;
	}
	.itemInfo>div>span:first-child {
		margin-right: 5px;
	}
	.itemInfo>div>span:nth-child(2) {
		flex: 1;
	}
	.itemInfoBox span {
		display: block;
	}
	.destinationTitle {
		color: #FFB132;
	}
	.noteDestination>b{
		background: url('../../assets/img/note_destination.png') no-repeat center;
		background-size: 100%;
	}
	.noteClassify>b {
		background: url('../../assets/img/note_classify.png') no-repeat center;
		background-size: 100%;
	}
	.noteTime>b {
		background: url('../../assets/img/note_time.png') no-repeat center;
		background-size: 100%;
	}
	.noteCost>b {
		background: url('../../assets/img/note_cost.png') no-repeat center;
		background-size: 100%;
	}
	.noteDays>b {
		background: url('../../assets/img/note_days.png') no-repeat center;
		background-size: 100%;
	}
	.detailContent {
		padding-bottom: 1px;
	}
	.detailContent h4 {
		font-size: 18px;
		color: #373A3E;
		margin-bottom: 15px;
	}
	.detailContent .videoBox {
		margin-bottom: 15px;
	}
	.detailContent p {
		font-size: 16px;
		color: #373A3E;
		margin-bottom: 15px;
		line-height: 28px;
		letter-spacing: 1px;
	}
	.detailContent img {
		margin-bottom: 15px;
	}
	.authorCopyright {
		width: 100%;
		height: 80px;
		padding-top: 20px;
		display: flex;
		align-items: center;
		background-color: #fff;
	}
	.authorCopyright>p {
		flex: 1;
		display: block;
		text-align: center;
		font-size: 14px;
		color: #929292;
	}
	.authorCopyright span {
		color: #FFB132;
	}

	.videoBox {
		width: 640px;	
		height: 360px;
		position: relative;
		overflow: hidden;
	}
	.videoBox>video{
		height: 100%;
		width: auto;
		margin: 0 auto;
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
	}
	.videoPlay {
		width: 40px;
		height: 40px;
		position: absolute;
		top: 50%;
		left: 50%;
		margin-top: -20px;
		margin-left: -20px;
	}
	.videoPlay:hover {
		cursor: pointer;
	}
</style>