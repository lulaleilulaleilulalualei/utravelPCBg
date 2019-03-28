<template>
	<div class="selfPoint">
		<div class="selfPointArea">
			<div class="selfPointBox">
				<transition-group :name="wl_isShowMap? 'slideFade': 'slideOut'">
					<selfPointInfo key="selfPointInfo" v-show="view === 'selfPointInfo'"></selfPointInfo>
					<mapBox key="mapBox" v-show="view === 'mapBox'"></mapBox>
				</transition-group>
			</div>
		</div>
	</div>
</template>

<script>
	import mapBox from './mapBox'
	import selfPointInfo from './selfPointInfo.vue'
	import { mapGetters , mapActions } from 'vuex';
	
	export default {
		data() {
			return {
				view: 'selfPointInfo'
			}
		},
		components: {selfPointInfo, mapBox},
		computed: {
			...mapGetters([
				'wl_isShowMap',
				'c_userVal'
				])
		},
		watch: {
			wl_isShowMap() {
				if(this.wl_isShowMap) {
					this.view = 'mapBox'
				}else {
					this.view = 'selfPointInfo'
				}
			}
		},
		methods: {

		},
		mounted() {

		}
	}
</script>

<style scoped>
	.selfPoint {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 1000;
		width: 100%;
		height: 100%;
		background-color: rgba(0,0,0,0.29);
	}
	.selfPointArea {
		width: 1180px;
		height: 100%;
		margin: 0 auto;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		padding-left: 300px;
	}
	.selfPointBox {
		background: #FFFFFF;
		border-radius: 7px;
		padding: 30px 15px;
		overflow-y: auto;
		width:610px;
		height: 780px;
		position: relative;
		overflow: hidden;
	}
	.slideFade-enter-active {
	  transition: all .5s ease;
	}
	.slideFade-enter, .slideFade-leave-to {
		transform: translateX(580px);
	}
	.slideOut-enter-active {
	  transition: all .5s ease;
	}
	.slideOut-enter, .slideFade-leave-to {
		transform: translateX(-580px);
	}

</style>