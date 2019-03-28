<template>
	<div class="officialLetterLoad">
		<happy-scroll color="rgba(255,177,50,1)" size="4" hide-horizontal resize :scroll-top="c_backTopVal">
			<div class="letterContent">
				<div class="letterNotice">
					请认真核对公函，打印、签字、加盖公章后上传。若信息有误，请返回注册或认证流程修改资料。<br/>
					如果无法使用打印本页按钮，请使用Ctrl+快捷键或者在空白处点击右键打印。<br/>
					若主体名称有误，<a href="javascrip:;" @click.prevent="backCheckPage">请点击这里</a>
					<b></b>
				</div>
				<div id="officialLetterBox" :style="moudleStyle.officialLetterBox">
					<h3 class="letterTitle" :style="moudleStyle.letterTitle">优旅家认证申请公函</h3>
					<div class="letterWriteTable" :style="moudleStyle.letterWriteTable">
						<div class="itemWriteInfo" :style="[moudleStyle.itemWriteInfo, {borderBottom: '1px solid #CBCBCB'}]">
							<span :style="moudleStyle.itemWriteInfoSpan">申请主体全称</span>
							<div class="itemWriteMore" :style="moudleStyle.itemWriteMore"></div>
						</div>
						<div class="itemWriteInfo" :style="moudleStyle.itemWriteInfo">
							<span :style="moudleStyle.itemWriteInfoSpan">账号联系人姓名</span>
							<div class="itemWriteMore" :style="moudleStyle.itemWriteMore">
								<span :style="moudleStyle.itemWriteMoreSpan">电子邮箱</span>
							</div>
						</div>
					</div>
					<div class="letterContentText" :style="moudleStyle.letterContentText">
						<p style="margin-bottom: 40px;">申请主体&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;同意授权委托指定人员 ______________（身份证号码：________________________）作为帐号联系人，以申请主体名义不可撤销地申请优旅家（平台）区域代理帐号（原始ID） &#12288;&#12288;&#12288;&#12288;&#12288;认证服务，并授权其负责该帐号的内容维护、数据维护及运营管理。 </p>
						<p style="margin-bottom: 40px;">1. 申请主体及初始申请注册主体同意：申请主体帐号在进行认证服务时，若提交的主体信息与初始申请注册主体信息不一致，应当填写初始申请注册主体姓名并在本公函落款处签章确认，在帐号资质审核成功之后，申请主体帐号的使用权属于通过资质审核的申请主体，该帐号自注册时其产生的一切权利义务均由该主体承担，该帐号所获得的所有收益、权限均归认证后的主体享有，且所有运营活动都必须以该主体对外开展；</p>
						<p style="margin-bottom: 40px;">2. 申请主体承诺：提交给优旅家的认证资料真实无误，并不可撤销地授权优旅家及其委托的第三方审核机构对提交的资料进行甄别核实，申请主体理解并同意，一经申请即产生优旅家及其委托的第三方审核机构的审核成本，故所交纳的认证审核服务费用将不因认证结果、申请主体是否提出撤回申请等因素而退回。同时，帐号内容维护、数据维护及运营管理遵守国家法律法规、政策及《优旅家平台服务协议》的相关规定。如违反上述承诺，责任自行承担；</p>
						<p style="margin-bottom: 40px;">3. 申请主体清楚知悉并同意，本认证服务仅对该帐号所提交的认证资料的真实性、合法性进行书面甄别核实，其功能、权限是否开通、帐号能否发布等均需遵守对应业务平台为此所制定的专项规则，而不与认证审核结果存在直接关联。</p>
						<p style="margin-bottom: 40px;">申请主体对以上认证申请信息表填写信息及申请公函内容确认无异议。 </p>
						<p style="marginTop:'60px'">帐号联系人签字:</p>
						<p style="marginTop:'60px'">申请主体加盖公章:<br/>
						<span style="color: #9C9B9B;">需加盖与主体一致的单位公章。无公章的个体工商户可加盖法人私章或法人签字。</span></p>
						<span :style="moudleStyle.letterContentTextSpan">年___月___日</span>
					</div>
				</div>
				<div class="printBtn">
					<span @click="toPrintPage">打印本页</span>
				</div>
				<p class="printNotice">没有打印机，可“点击打印本页—目标打印机—另存为PDF”。或直接整体截图。</p>
			</div>
		</happy-scroll>
	</div>
</template>

<script>
	import { mapGetters , mapActions } from 'vuex';

	export default {
		data() {
			return {
				moudleStyle: {
					officialLetterBox: {
						border: '1px solid #DDE2E6',
						padding: '30px 30px 90px'
					},
					letterTitle: {
						fontSsize: '18px',
						color: '#000000',
						textAlign: 'center',
						marginBottom: '30px',
						fontWeight: '600'
					},
					letterWriteTable: {
						width: '100%',
						height: 'auto',
						border: '1px solid #979797',
						marginBottom: '70px'
					},
					itemWriteInfo: {
						display: 'flex',
						height: '32px'
					},
					itemWriteInfoSpan: {
						display: 'block',
						borderRight: '1px solid #CBCBCB',
						fontSize: '14px',
						lineHeight: '32px',
						color: '#000000',
						width: '163px',
						paddingLeft: '13px'
					},
					itemWriteMore: {
						flex: 1,
						fontSize: '14px',
						color: '#000000',
						paddingLeft: '13px',
						lineHeight: '32px',
						display: 'flex',
						justifyContent: 'space-around'
					},
					itemWriteMoreSpan: {
						display: 'block',
						fontSize: '14px',
						color: '#000000',
						lineHeight: '32px',
						padding: '0 13px',
						borderLeft: '1px solid #CBCBCB',
						borderRight: '1px solid #CBCBCB'
					},
					letterContentText: {
						fontSize: '14px',
						color: '#000000',
						lineHeight: '22px'
					},
					letterContentTextSpan: {
						display: 'flex',
						justifyContent: 'flex-end',
						marginTop: '60px'
					}
				}
			}
		},
		computed: {
			...mapGetters([
				'c_loadingVal',
				'c_backTopVal'
				])
		},
		methods: {
			toPrintPage() {
				let oWin=window.open("","_blank");
				oWin.document.write(document.getElementById('officialLetterBox').innerHTML);
				oWin.focus();
				oWin.document.close();
				oWin.print()
				oWin.close()
			},
			backCheckPage() {
				this.$router.go(-1)
			}
		},
		mounted() {
			if(this.c_loadingVal) {
				this.c_loadingVal.close()
			}
		}
	}
</script>

<style scoped>
	.officialLetterLoad {
		width: 100%;
		height: 100%;
		background: #fff;
		padding: 10px 0;
		overflow: hidden;
	}
	.letterContent {
		width: 100%;
		height: 100%;
		padding: 50px 20px;
	}
	.letterNotice {
		font-size: 14px;
		color: #000000;
		line-height: 22px;
		position: relative;
		margin-left: 20px;
		margin-bottom: 40px;
	}
	.letterNotice>b {
		position: absolute;
		width: 16px;
		height: 16px;
		top: 3px;
		left: -21px;
		background:  url('../../assets/img/notice_icon_2.png') no-repeat center;
		background-size: 100%;
	}
	.letterNotice a {
		color: #6B7DA3;
	}
	
	.printBtn {
		width: 100%;
		margin-top: 60px;
		display: flex;
		justify-content: center;
	}
	.printBtn>span {
		display: block;
		width: 100px;
		height: 36px;
		background: #F5A623;
		border-radius: 4px;
		line-height: 36px;
		text-align: center;
		font-size: 14px;
		color: #FFFFFF;
	}
	.printBtn>span:hover {
		cursor: pointer;
	}
	.printNotice {
		margin-top: 45px;
		text-align: center;
		font-size: 14px;
		color: #999898;
	}
</style>