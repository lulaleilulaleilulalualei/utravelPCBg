<template>
	<div class="certificateInfo">
		<div class="checkNoticeBox">
			<div class="checkNotice">
				<div class="checkNoticeTitle">年审时间 <b></b></div>
				<div class="checkNoticeContent">优旅家认证有效期为一年，此帐号的认证会在2019年09月19日到期，需要在2019年06月21日至2019年09月19日完成年审。</div>
			</div>
			<div class="checkNotice">
				<div class="checkNoticeTitle">声明 <b></b></div>
				<div class="checkNoticeContent">在使用优旅家认证时，须遵守公众平台相关协议，包括但不限于<a @click.prevent="toJumpProtocol" href="javascript:;">《优旅家平台服务协议》</a>。</div>
			</div>
		</div>
		<div class="itemCheckInfoBox">
			<!-- 所属省份 -->
			<div class="itemCheckInfo">
				<span>所属地区</span>
				<div class="itemWriteInfo">
					<el-select v-model="provinceVal" style="width: 210px;margin-right: 6px;" clearable placeholder="请选择省份" @change="provinceSelect">
						<el-option
							v-for="item in provinceArr"
							:key="item.id"
							:label="item.name"
							:value="item.id">
						</el-option>
					</el-select>
					<el-select v-model="cityVal" style="width: 210px;" clearable placeholder="请选择城市">
						<el-option
							v-for="item in cityArr"
							:key="item.id"
							:label="item.name"
							:value="item.id">
						</el-option>
					</el-select>
					<p class="wirteTextNotice" style="margin-top: 10px">省级代理只需选省份即可，市级代理还需选择城市</p>
				</div>
			</div>
			<!-- 机构类型 -->
			<div class="itemCheckInfo">
				<span>机构类型</span>
				<div class="itemWriteInfo">
					<el-select v-model="organizationType" clearable placeholder="请选择机构类型" @change="organizationSelect">
						<el-option
							v-for="item in organizationArr"
							:key="item.id"
							:label="item.name"
							:value="item.id">
						</el-option>
					</el-select>
					<p class="wirteTextNotice" style="margin-top: 10px">请按照营业执照、法人证书、组织机构代码证等证件上类型来返回。</p>
				</div>
			</div>
			<!-- 申请公函 -->
			<div class="itemCheckInfo">
				<span>申请公函</span>
				<div class="itemWriteInfo">
					<p class="wirteTextNotice" style="margin-bottom: 10px">上传加盖公章的原件照片或扫描件，支持.jpg.jpeg.bmp.gif.png格式照片，大小不超过5M。<a href="javascript:;" @click.prevent="loadOfficialLetter">下载公函模版</a>。</p>
					<el-upload
					  action=""
					  :on-preview="handlePreview"
					  :on-remove="handleRemove"
					  type="1"
					  list-type="picture">
					  <div class="toAgainUpload">重新上传</div>
					</el-upload>
					<span class="infoImportantNotice">申请公函</span>
				</div>
			</div>
		</div>
		<div class="itemCheckInfoBox">
			<div class="itemCheckInfoTitle">企业资质信息</div>
			<!-- 企业全称 -->
			<div class="itemCheckInfo">
				<span>企业全称</span>
				<div class="itemWriteInfo">
					<el-input v-model="companyName" placeholder="请输入企业全称"></el-input>
					<p class="wirteTextNotice" style="margin-top: 10px">
						主体名称需严格按照证件返回，在注册确认后不可更改。避免付款后因主题原因<br/>
						导致认证失败，<a href="javascript:;" @click.prevent="jumpToThemeNoChange">请详细查阅主题不可更改情况</a>。
					</p>
					<p class="wirteTextNotice" style="margin-top: 10px">最多注册五个账号。</p>
				</div>
			</div>
			<!-- 工商营业执照 -->
			<div class="itemCheckInfo">
				<span>工商营业执照</span>
				<div class="itemWriteInfo">
					<p class="wirteTextNotice" style="margin-bottom: 10px">
						请上传<a href="javascript:;" @click.prevent="newBusinessPapes">最新的营业执照</a>。<br/>
						格式要求：原件照片、扫码件或者加盖公章的复印件，支持.jpg.jpeg.bmp.gif.png格式照片，大小不超过5M。
					</p>
					<el-upload
					  action=""
					  :on-preview="handlePreview"
					  :on-remove="handleRemove"
					  type="2"
					  list-type="picture">
					  <div class="toAgainUpload">上次文件</div>
					</el-upload>
					<span class="infoImportantNotice">企业工商营业执照</span>
				</div>
			</div>
			<!-- 其他证明材料 -->
			<div class="itemCheckInfo">
				<span class="otherApplyInfo">其他证明材料<br/>（选填）</span>
				<div class="itemWriteInfo">
					<p class="wirteTextNotice" style="margin-bottom: 10px">
						特殊情况可上传作为佐证，如企业工商变更证明、官方红头文件、加盖公章证明等。其他证明材料可上传最多10张
					</p>
					<el-upload
					  action=""
					  :on-preview="handlePreview"
					  :on-remove="handleRemove"
					  type="3"
					  list-type="picture">
					  <div class="toAgainUpload">上次文件</div>
					</el-upload>
				</div>
			</div>
		</div>
		<div class="itemCheckInfoBox">
			<div class="itemCheckInfoTitle">对公账户信息</div>
			<!-- 开户名称 -->
			<div class="itemCheckInfo">
				<span>开户名称</span>
				<div class="itemWriteInfo">
					<el-input v-model="companyBankName" placeholder="请输入企业全称"></el-input>
					<p class="wirteTextNotice" style="margin-top: 10px">
						对公账户需跟主题证件上的机构名称保持一致，<a href="javascript:;">对公账户填写指引</a><br/>
						企业是必须要有对公账户的，若无对公账户请先办理对公账户
					</p>
				</div>
			</div>
			<!-- 开户银行 -->
			<div class="itemCheckInfo">
				<span>开户银行</span>
				<div class="itemWriteInfo">
					<el-input v-model="bankName" placeholder="请输入开户银行"></el-input>
				</div>
			</div>
			<!-- 对公银行账号 -->
			<div class="itemCheckInfo">
				<span>对公银行账号</span>
				<div class="itemWriteInfo">
					<el-input v-model="bankAccountNumber" placeholder="请输入对公银行账号"></el-input>
					<p class="wirteTextNotice" style="margin-top: 10px">
						我们会给该账户汇入一笔非常小的金额和备注信息，后续审核人员会致电您确认。
					</p>
				</div>
			</div>
		</div>
		<div class="itemCheckInfoBox">
			<div class="itemCheckInfoTitle">认证联系人信息</div>
			<!-- 联系人姓名 -->
			<div class="itemCheckInfo">
				<span>联系人姓名</span>
				<div class="itemWriteInfo">
					<el-input v-model="linkmanName" placeholder="请输入联系人姓名"></el-input>
					<p class="wirteTextNotice" style="margin-top: 10px">
						该人员须与申请公函的联系人一致
					</p>
				</div>
			</div>
			<!-- 联系人电话 -->
			<div class="itemCheckInfo">
				<span>联系人电话</span>
				<div class="itemWriteInfo">
					<div class="getPhoneInfo">
						<el-input v-model="linkmanTel" placeholder="请输入联系人姓名"></el-input>
						<div :class="[{waitCode :isWait}, 'getCodeBtn']" @click="getNumCode"><span>{{codeText}}</span></div>
					</div>
					<p class="wirteTextNotice" style="margin-top: 10px">
						认证过程会致电该电话，认证期间请保持电话畅通。
					</p>
				</div>
			</div>
			<!-- 短袖验证码 -->
			<div class="itemCheckInfo">
				<span>短信验证码</span>
				<div class="itemWriteInfo">
					<el-input v-model="codeNum" placeholder="请输入短信验证码" @blur="getCodeBlur"></el-input>
				</div>
			</div>
			<!-- 备用联系人电话 -->
			<div class="itemCheckInfo">
				<span>备用联系人手机号</span>
				<div class="itemWriteInfo">
					<el-input v-model="backupsLinkmanTel" placeholder="请输入备用联系人手机号"></el-input>
					<p class="wirteTextNotice" style="margin-top: 10px">
						请完整地填写区号、手机号和分机号，用于手机联系不到你时备用。
					</p>
				</div>
			</div>
			<!-- 电子邮箱 -->
			<div class="itemCheckInfo">
				<span>电子邮箱</span>
				<div class="itemWriteInfo">
					<el-input v-model="emailUrl" placeholder="请输入电子邮箱"></el-input>
				</div>
			</div>
			<!-- 联系人身份证号码 -->
			<div class="itemCheckInfo">
				<span>联系人身份证号码</span>
				<div class="itemWriteInfo">
					<el-input v-model="idCardNum" placeholder="请输入身份证号码"></el-input>
				</div>
			</div>
			<!-- 身份验证 -->
			<div class="itemCheckInfo">
				<span>联系人验证</span>
				<div class="scanCodeBox">
					<div class="showCodeBox">
						<canvas id="canvasHome"></canvas>
						<div v-if="isRefreshCode" class="refreshCode" @click.stop="toRefresh"><img src="../../assets/img/refresh.png" alt=""></div>
					</div>
					<p class="wirteTextNotice">
						为了验证你的身份，请用绑定了损毁银行卡的微信扫码二维码。本验证方式不扣除任何费用。<br/>
						若微信没有绑定银行卡，请先绑定。
					</p>
				</div>
			</div>
		</div>
		<div class="toApplyCertificate"> <span @click="toApplyCheck">提交审核</span> </div>
		
		<transition name="fade">
			<div class="showBusinessPapers" v-if="isShowBusinessPapes" @click="closeBusinessPapers">
				<div>
					<img src="../../assets/img/businessPapers.png" alt="">
				</div>
			</div>
		</transition>
	</div>
</template>

<script>
	import { mapGetters , mapActions } from 'vuex';
	import QRCode from 'qrcode'
	import config from '@/config'

	export default {
		data() {
			return {
				provinceVal: '',//省份值
				cityVal: '',//城市值
				cityArr: [
					{
						name: '长沙市',
						id: '001'
					},
					{
						name: '株洲市',
						id: '002'
					},
					{
						name: '湘潭市',
						id: '003'
					},
					{
						name: '岳阳市',
						id: '004'
					},
					{
						name: '常德市',
						id: '005'
					},
					{
						name: '衡阳市',
						id: '007'
					},
					{
						name: '娄底市',
						id: '008'
					},
					{
						name: '郴州市',
						id: '009'
					}	
				],
				organizationType: '',//机构类型
				organizationArr: [
					{
						name: '有机关（非）法人',
						id: '0001'
					},
					{
						name: '企业（非）法人',
						id: '0002'
					},
					{
						name: '社团法人',
						id: '0003'
					},
					{
						name: '事业法人',
						id: '0004'
					},
					{
						name: '个体工商户',
						id: '0005'
					},
					{
						name: '民办非企业',
						id: '0006'
					},
					{
						name: '其他',
						id: '0007'
					},
				],
				officialLetter: '',//上传的公函图片
				companyName: '',//企业全称
				businessPapers: '',//工商营业执照图片
				otherApplyInfo: '',//其他申请材料
				companyBankName: '',//企业开户名称
				bankName: '', //请输入银行名称
				bankAccountNumber: '',//银行对公账号
				linkmanName: '',//联系人姓名
				linkmanTel: '',//联系人电话
				isWait: false, //获取验证码是否需要等待
				codeText: '获取验证码',
				codeNum: '',//验证码数字
				backupsLinkmanTel: '',//备用联系人手机号
				emailUrl: '',//电子邮箱
				idCardNum: '',//联系人身份证号码
				scanCodeUrl: 'https://www.baidu.com',//扫码验证
				isRefreshCode: false, //是否需要重新加载二维码
				isShowBusinessPapes: false,
				isPassOk: true, //填写内容是否有问题
			}
		},
		computed: {
			...mapGetters([
				'c_provinceArr',
				]),
			provinceArr() {
				this.c_provinceArr.splice(0, 1)
				return this.c_provinceArr
			}
		},
		methods: {
			...mapActions([
				'c_loadingShow',
				'c_changeCheckStatus'
				]),
			provinceSelect(val) {
				
			},
			organizationSelect(val) {

			},
			handleRemove(file, fileList) {
        		console.log(file, fileList);
      		},
      		handlePreview(file) {
        		console.log(file);
      		},
      		getNumCode() {
      			let phoneReg = /^\s*1[345678]\d{9}$/
      			if(phoneReg.test(this.linkmanTel)) {
					if(!this.isWait) {
						this.$api.countDown((txt, status) => {
							this.codeText = txt
							this.isWait = status
						})
						const $this = this
						let times = new Date().getTime()
						this.$api.ajax({
							method: "POST",
							url: config.getCodeNum,
							headers: {
						  		'Content-Type':'application/x-www-form-urlencoded'
							},
							params: { 
								tel: $this.linkmanTel,
								timeStamp: times,
								sign: $this.$md5(`${$this.phoneVal}_${times}`)
							},
							success: (res) => {
								if(res.code == 0) {
									this.$message({
										message: '已发送验证码',
										type: 'success',
										center: true
									});
								}else {
									this.$message({
										message: res.message,
										type: 'error',
										center: true
									});
								}
							},
							error: () => {
								this.$message({
									message: '获取验证码失败',
									type: 'error',
									center: true
								});
							}
						})
					}
				}else {
					this.$message({
						message: '请输入正确的手机号码',
						type: 'error',
						center: true
					});
				}
      		},
      		getCodeBlur() {
      			let codeReg = /^\d{4}$/
      			if(!codeReg.test(this.codeNum)) {
      				this.$message({
						message: '验证码应为4位数字',
						type: 'error',
						center: true
					});
      			}
      		},
      		useqrcode(){
				const $this = this
		        let canvas = document.getElementById('canvasHome')
				QRCode.toCanvas(canvas, this.scanCodeUrl, function (error) {
					if (error) {
						$this.$message({
							type: 'error',
							message: '获取验证二维码失败',
							center: true
						});
					}
				})
		    },
		    toRefresh() {
				this.isRefreshCode = false
				this.useqrcode()
			},
			toApplyCheck() { //提交审核
				let telReg = /^\s*1[345678]\d{9}$/,
					codeReg = /^\d{4}$/,
					emailReg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/,
					cardReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
				let checkArr = [
					[() => this.provinceVal != '' , '请选择所属省份或城市'],
					[() => this.organizationType != '', '请选择机构类型'],
					[() => this.officialLetter != '', '您还有申请公函没有上传'],
					[() => this.companyName !='', '请输入企业全称'],
					[() => this.businessPapers != '', '您还有工商营业执照没有上传'],
					[() => this.companyBankName != '', '请输入开户名称'],
					[() => this.bankName != '', '请输入开户银行'],
					[() => this.bankAccountNumber != '', '请输入对公银行账号'],
					[() => this.linkmanName != '', '请输入联系人姓名'],
					[() => this.linkmanTel != '', '请输入联系人电话'],
					[() => telReg.test(this.linkmanTel) , '请输入正确的联系人电话'],
					[() => this.codeNum != '', '请输入短信验证码'],
					[() => codeReg.test(this.codeNum), '请输入正确的短信验证码位数'],
					[() => this.backupsLinkmanTel != '', '请输入备用联系人手机号'],
					[() => this.emailUrl != '', '请输入电子邮箱'],
					[() => emailReg.test(this.emailUrl), '请输入正确的电子邮箱'],
					[() => this.idCardNum != '', '请输入联系人身份证号码'],
					[() => cardReg.test(this.idCardNum), '请输入正确的身份证号码']
				]

				for(let i=0;i<checkArr.length;i++) {
					if(!checkArr[i][0]()) {
						this.$message({
							type: 'error',
							message: checkArr[i][1],
							center: true
						});
						this.isPassOk = false
						break
					}else {
						this.isPassOk = true
					}
				}
				
				if(this.isPassOk) { //通过之后调用认证接口
					this.c_changeCheckStatus(1)
				}
			},
			toJumpProtocol() {
				this.c_loadingShow()
				setTimeout(() => {
					this.$router.push({
						path: '/checkProtocal',
					})
				}, 600);
			},
			loadOfficialLetter() {
				this.c_loadingShow()
				setTimeout(() => {
					this.$router.push({
						path: '/officialLetter',
					})
				}, 600);
			},
			jumpToThemeNoChange() {
				this.c_loadingShow()
				setTimeout(() => {
					this.$router.push({
						path: '/themeNoChangeDue',
					})
				}, 600);
			},
			newBusinessPapes() {
				this.isShowBusinessPapes = true
			},
			closeBusinessPapers(e) {
				if(e.target.className == 'showBusinessPapers') {
					this.isShowBusinessPapes = false
				}
			}
		},
		mounted() {
			this.useqrcode() //微信验二维码
		}
	}
</script>

<style scoped>
	.certificateInfo {
		padding: 65px 70px 0;
	}
	.checkNoticeBox {
		margin-bottom: 40px;
	}
	.checkNotice {
		font-size: 14px;
		color: #000000;
		line-height: 22px;
		margin-bottom: 10px;
	}
	.checkNoticeTitle {
		position: relative;
	}
	.checkNoticeTitle>b {
		position: absolute;
		width: 16px;
		height: 16px;
		top: 3px;
		left: -21px;
		background:  url('../../assets/img/notice_icon_2.png') no-repeat center;
		background-size: 100%;
	}
	.checkNoticeContent a {
		color: #6B7DA3;
	}
	.itemCheckInfoBox {
		position: relative;
	}
	.itemCheckInfo {
		display: flex;
		margin-bottom: 30px;
	}
	.itemCheckInfo>span{
		display: block;
		width: 140px;
		font-size: 14px;
		color: #000000;
	}
	.itemCheckInfo>span:not(.otherApplyInfo) {
		line-height: 40px;
	}
	.itemCheckInfo .otherApplyInfo {
		margin-top: 10px;
	}
	.itemCheckInfo>div {
		flex: 1;
	}
	.itemWriteInfo .el-select {
		width: 428px;
	}
	.itemWriteInfo .el-input {
		width: 500px;
	}
	.wirteTextNotice {
		font-size: 14px;
		color: #999898;
	}
	.wirteTextNotice a {
		color: #6B7DA3;
	}
	.toAgainUpload {
		width: 100px;
		height: 36px;
		border: 1px solid #D5DBDE;
		border-radius: 2px;
		font-size: 14px;
		color: #000000;
		line-height: 36px;
		text-align: center;
	}
	.itemCheckInfoTitle {
		margin-top: 60px;
		padding-bottom: 6px;
		font-size: 16px;
		color: #000000;
		border-bottom: 1px solid #DDE2E6;
		margin-bottom: 25px;
	}
	.getPhoneInfo {
		width: 500px;
		border: 1px solid #D5DBDE;
		border-radius: 2px;
		display: flex;
	}
	.getPhoneInfo>div {
		width: 116px;
		height: 40px;
		line-height: 40px;
		text-align: center;
		font-size: 14px;
		color: #000000;
		background: #FBFBFB;
	}
	.getPhoneInfo .getCodeBtn {
		border-left: 1px solid #D5DBDE;
	}
	.getPhoneInfo .waitCode {
		background-color: #DDDEE1;
	}
	.getPhoneInfo>div:hover {
		cursor: pointer;
	}
	.getPhoneInfo .el-input {
		flex: 1;
	}
	.scanCodeBox {
		background: #F6F8F9;
		border-radius: 4px;
		padding: 19px;
		display: flex;
		align-items: center;
	}
	.showCodeBox {
		position: relative;
		width: 126px;
		height: 126px;
		margin-right: 18px;
	}
	#canvasHome {
		width: 126px!important;
		height: 126px!important;
	}
	.refreshCode {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(255,255,255,1);
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.refreshCode:hover {
		cursor: pointer;
	}
	.refreshCode>img {
		width: 60px;
		height: 60px;
	}

	.toApplyCertificate {
		width: 100%;
		display: flex;
		justify-content: center;
		margin-top: 80px;
		margin-bottom: 45px;
	}
	.toApplyCertificate>span {
		display: block;
		background: #F5A623;
		border-radius: 4px;
		width: 100px;
		height: 36px;
		line-height: 36px;
		text-align: center;
		font-size: 14px;
		color: #FFFFFF;
	}
	.toApplyCertificate>span:hover {
		cursor: pointer;
	}
	.infoImportantNotice {
		display: block;
		font-size: 14px;
		color: #000000;
		margin-top: 15px;
	}

	.showBusinessPapers {
		position: fixed;
		left: 0;
		top: 0;
		z-index: 300;
		width: 100%;
		height: 100%;
		background-color: rgba(0,0,0,0.9);
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.showBusinessPapers>div {
		width: 1180px;
		height:  auto;
	}
</style>