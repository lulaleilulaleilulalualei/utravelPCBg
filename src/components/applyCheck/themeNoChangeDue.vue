<template>
	<div class="themeNoChangeDue">
		<happy-scroll color="rgba(255,177,50,1)" size="4" hide-horizontal resize :scroll-top="c_backTopVal">
			<div class="dueShowBox">
				<h3 class="dueShowTitle">修改主体规则</h3>
				<div class="dueShowItemMoudle">
					<h4>一、可以修改主体：</h4>
					<p>
						<span>1、主体名称变更，有工商变更证明，本质上主体未发生改变。</span>
						<span>工商变更证明查询链接http://www.gsxt.gov.cn/index.html；如：原主体：广州林茨智能科技有限公司；更新后主体：广州蓝豹智能科技有限公司。</span>
					</p>
					<img src="../../assets/img/themeNoChange_1.png" alt="">
					<p>工商变更证明文件示例：</p>
					<img src="../../assets/img/themeNoChange_2.png" alt="">
					<p>
						<span>2、主体名称有错字漏字，核实工商数据后可按正确主体名称录入。 </span>
						<span>3、企业之间吸收合并：A+B=B且A企业已注销，具备工商局或政府机构合并文件核实后可支持。</span>
						<span>4、由于国家政策发生变化（如：县改为区）其执照主体名称同时发生变更，提供相应政府批文，核实后可支持则可修正为变更后主体名称。</span>
						<span>5、政府类机构撤一建一、改制、合并等情况，提供相应政府批文，核实后可支持主体修正为批文中更新的主体名称认证。</span>
					</p>
				</div>
				<div class="dueShowItemMoudle">
					<h4>二、不可修改主体：：</h4>
					<p>1、主体已注销。示例如下：</p>
					<img src="../../assets/img/themeNoChange_4.png" alt="">
					<p>2、个体户变更法人将之前主体注销重新注册，亦视为主体变更。 示例如下：</p>
					<img src="../../assets/img/themeNoChange_3.png" alt="">
					<p>3、同法人，因地域变更、或其他一些原因，注销后重新注册。示例如下：</p>
					<img src="../../assets/img/themeNoChange_5.png" alt="">
				</div>
				<p class="dueShowNotice">温馨提示：工商数据信息具体参考（http://www.gsxt.gov.cn/index.html）</p>
			</div>
		</happy-scroll>
	</div>
</template>

<script>
	import { mapGetters , mapActions } from 'vuex';
	
	export default {
		data() {
			return {

			}
		},
		computed: {
			...mapGetters([
				'c_loadingVal',
				'c_backTopVal'
				])
		},
		mounted() {
			if(this.c_loadingVal) {
				this.c_loadingVal.close()
			}
		}
	}
</script>

<style scoped>
	.themeNoChangeDue {
		width: 100%;
		height: 100%;
		background: #fff;
		padding: 10px 0;
		overflow: hidden;
	}
	.dueShowBox {
		width: 100%;
		height: 100%;
		padding: 60px 200px;
	}
	.dueShowTitle {
		font-size: 18px;
		color: #000000;
		font-weight: 600;
		margin-bottom: 30px;
	}
	.dueShowItemMoudle {
		margin-bottom: 30px;
	}
	.dueShowItemMoudle h4{
		font-weight: normal;
		font-size: 16px;
		color: #000000;
		line-height: 22px;
		margin-bottom: 10px;
	}
	.dueShowItemMoudle p {
		font-size: 14px;
		color: #000000;
		line-height: 22px;
		margin-bottom: 15px;
	}
	.dueShowItemMoudle p span {
		display: block;
	}
	.dueShowItemMoudle img {
		width: 100%;
		height: auto;
		margin-bottom: 15px;
	}
	.dueShowNotice {
		font-size: 14px;
		color: #000000;
		line-height: 22px;
	}
</style>