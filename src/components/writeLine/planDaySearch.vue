<template>
	<div class="rightAside">
		<div class="listIcon" @click="showList" v-if="!isShowList">
			<img src="../../assets/img/daysList.png" alt="">
		</div>
		<transition name="fade" >
			<div class="daySearchBox" v-if="isShowList" @click="clickClose">
					<div class="daysListBox" :style="{transition: transformPlan}">
						<happy-scroll color="rgba(255,177,50,1)" size="2" resize hide-vertical v-if="routeObj.length != 0">
							<div class="daysList">
								<a :href="`#${item.title}_${index}`" v-for="(item, index) in routeObj" :key="index">
									<h4 class="dayRouteTitle">{{item.title}}</h4>
									<div class="dayRouteLine">
										{{item.nodes| lineFilter}}
									</div>
								</a>
							</div>
						</happy-scroll>
						<div class="listBlank" v-else>
							<div>
								<img src="../../assets/img/listBlank.png" alt="">
							</div>
						</div>
					</div>
			</div>
		</transition>
	</div>
</template>

<script>
	
	export default {
		data() {
			return {
				transformPlan: 'translateX(250px)',
				isShowList: false
			}
		},
		props: {
			routeObj: {
				type:Array,
				default: {}
			}
		},
		computed: {

		},
		filters:{
		    lineFilter(node){
		    	let text = ''
		    	node.map((v, i) => {
		    		if(i == 0) {
		    			text += v.name
		    		}else {
		    			text += `——${v.name}`
		    		}
		    		v.hotelsOrfoods.map((item, ind) => {
		    			text += `——${item.name}`
		    		})
		    	})
		    	return text
		    }
		},
		methods: {
			showList() {
				this.isShowList = true
				setTimeout(() => {
					this.transformPlan = 'translateX(0px)'
				}, 500)
			},
			clickClose(evt) {
				if(evt.target.className.indexOf('daySearchBox') > -1) {
					this.isShowList = false
					this.transformPlan = 'translateX(250px)'
				}
			}
		},
		mounted() {
			
		}
	}
</script>

<style scoped>
	.daySearchBox {
		position: absolute;
		left: 0;
		top: 0;
		z-index: 50;
		width: 100%;
		height: 100%;
		background-color: rgba(0,0,0,0.29);
	}
	.listIcon {
		position: absolute;
		top: 50%;
		right: 0;
		margin-top: 10px;
		width: 24px;
		height: 20px;
		background-color: #fff;
		border-radius: 2px;
		overflow: hidden;
	}
	.listIcon:hover {
		cursor: pointer;
	}
	.daysListBox {
		position: absolute;
		right: 0;
		top: 0;
		height: 100%;
		width: 250px;
		border: 1px solid #dcdfe6;
		background-color: #fff;
		overflow: hidden;
		padding: 10px 0;
	}
	.daysList {
		width: 100%;
		height: auto;
		overflow-y: auto;
	}
	.daysList>a {
		display: block;
		width: 100%;
		padding: 15px;
		background-color: #fff;
		transition: all 0.2s;
	}
	.daysList>a:not(:last-child) {
		border-bottom: 1px solid #ddd;
	}
	.daysList>a:hover {
		background-color: #FFF2DD;
		cursor: pointer;
	}
	.listBlank {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.listBlank>div {
		width: 100%;
		height: 300px;
	}
	.dayRouteTitle {
		font-size: 20px;
		color: #373A3E;
		margin-bottom: 10px;
	}
	.dayRouteLine {
		display: flex;
		font-size: 14px;
		color: #373A3E;
		line-height: 20px;
	}
</style>