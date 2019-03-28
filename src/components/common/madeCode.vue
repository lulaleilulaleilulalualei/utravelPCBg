<template>
	<div class="madeCode" @click="colseCode">
		<div class="madeCodeArea">
			<div class="madeBox">
				<canvas id="canvas"></canvas>
				<span>请在手机上预览</span>
			</div>
		</div>
	</div>
</template>

<script>
	import QRCode from 'qrcode'
	import { mapGetters , mapActions } from 'vuex';
	
	export default {
		data() {
			return {

			}
		},
		props: {
			previewUrl: {
				type: String,
				default: ''
			}
		},
		methods: {
			...mapActions([
				'c_showMadeCode'
				]),
			useqrcode(){ 
		      	//生成的二维码内容，可以添加变量
				//this.QueryDetail='http://www.kspxzx.com/#/guard'+"?unique_code="+this.QueryDetail;
				const $this = this
				let canvas = document.getElementById('canvas')
		        QRCode.toCanvas(canvas, this.previewUrl, function (error) {
			        if (error) {
			        	$this.$message({
							message: '二维码生成失败，请稍后再试',
							type: 'error',
							center: true
						})
						return
			        }
		        })
		    },
		    colseCode(e) {
		    	if(e.target.className == 'madeCode' || e.target.className == 'madeCodeArea') {
		    		this.c_showMadeCode(false)
		    	}
		    }
		},
		mounted() {
			this.useqrcode()
		}
	}
</script>

<style scoped>
	.madeCode {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 1000;
		width: 100%;
		height: 100%;
		background-color: rgba(0,0,0,0.29);
	}
	.madeCodeArea {
		width: 1180px;
		height: 100%;
		padding-left: 300px;
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.madeBox {
		background: #FFFFFF;
		border-radius: 7px;
		overflow: hidden;
		padding-bottom: 15px;
		height: auto;
		width: auto;
	}
	.madeBox>span{
		display: block;
		text-align: center;
		font-size: 16px;
		color: #373A3E;
	}
	#canvas {
		width: 200px!important;
		height: 200px!important;
	}
</style>