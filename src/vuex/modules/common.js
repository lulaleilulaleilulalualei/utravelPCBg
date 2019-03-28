import *as types from '../types';
import { Loading } from 'element-ui';

 const state = {
 	routeSave: '',
 	isShowChangePhone: false,
 	stageType: 1,
 	isShowReplyBox: {data: '',isShow: false},
 	isShowOfficialCode: false,
 	backTopVal: -1,
 	loadingVal: '',
 	userVal: null,//测试默认为admin，管理员，user为普通用户
 	isShowOpinionBox: false,
 	isShowSpotContent: {id: '', isShow: false},
 	isShowMadeCode: false,
 	userInfo: {},
 	cityName:[],
 	provinceArr: [],
 	cityObj: {
 		name: '选择区域',
 		isShow: false,
 		isChange: false
 	},
 	isEditPlaning: false,
 	isShowImgList: false,
 	isListUpdate: false ,//列表是否需要更新
 	searchText: '', //搜索文本
 	infoNumCount: 0 ,//消息数量计数
 	updateStatus: 999,
 	fromRoute: '', //来时的路由
 	isApplyCheck: false, //是否开启认证
 	checkStatus: 0, //认证状态 0代表认证资料状态 1代表代表审核中 2代表审核成功 3代表审核失败 4代表进入微信绑定
 	proCitys: [], //省份城市数组

 	// isOpenAct: false, //是否开启活动
 	isChangePensonalInfo: false, //修改个人用户信息
 }

 const getters = {
 	c_routeSave: state => state.routeSave,
 	c_isShowChangePhone: state => state.isShowChangePhone,
 	c_stageType: state => state.stageType,
 	c_isShowReplyBox: state => state.isShowReplyBox,
 	c_isShowOfficialCode: state => state.isShowOfficialCode,
 	c_backTopVal: state => state.backTopVal,
 	c_loadingVal: state => state.loadingVal,
 	c_userVal: state => state.userVal,
 	c_isShowOpinionBox: state => state.isShowOpinionBox,
 	c_isShowSpotContent: state => state.isShowSpotContent,
 	c_isShowMadeCode: state => state.isShowMadeCode,
 	c_userInfo: state => state.userInfo,
 	c_cityName: state => state.cityName,
 	c_cityObj: state => state.cityObj,
 	c_provinceArr: state => state.provinceArr,
 	c_isEditPlaning: state => state.isEditPlaning,
 	c_isShowImgList: state => state.isShowImgList,
 	c_isListUpdate: state => state.isListUpdate,
 	c_searchText: state => state.searchText,
 	c_infoNumCount: state => state.infoNumCount,
 	c_updateStatus: state => state.updateStatus,
 	c_fromRoute: state => state.fromRoute,
 	c_isApplyCheck: state => state.isApplyCheck,
 	c_checkStatus: state => state.checkStatus,
 	c_proCitys: state => state.proCitys,
 	c_isChangePensonalInfo: state => state.isChangePensonalInfo
 	// c_isOpenAct: state => state.isOpenAct
 }

 const mutations  = {
 	[types.USER_INFO](state, obj) {
 		state.userInfo = obj
 	},
 	[types.ROUTE_SAVE](state, str) {
 		state.routeSave = str
 	},
 	[types.CHANGE_PHONE](state, status) {
 		state.isShowChangePhone = status
 	},
 	[types.CHANGE_TYPE](state, status) {
 		state.stageType = status
 	},
 	[types.SHOW_REPLY_BOX](state, obj) {
 		state.isShowReplyBox = obj
 	},
 	[types.SHOW_OFFICAL_CODE](state, status) {
 		state.isShowOfficialCode = status
 	},
 	[types.BACK_TOP](state, val) {
 		state.backTopVal = val
 	},
 	[types.LOADING_SHOW](state, val) {
 		state.loadingVal = val
 	},
 	[types.USER_GRADE](state, val) {
 		state.userVal = val
 	},
 	[types.SHOW_OPINION_BOX](state, status) {
 		state.isShowOpinionBox = status
 	},
 	[types.SHOW_SPOT_CONTENT](state, obj) {
 		state.isShowSpotContent = obj
 	},
 	[types.SHOW_MADE_CODE](state, status) {
 		state.isShowMadeCode = status
 	},
 	[types.GET_CITY_NAME](state, arr) {
 		state.cityName = arr
 	},
 	[types.SAVE_CITY_TYPE](state, obj) {
 		state.cityObj = obj
 	},
 	[types.GET_PROVINCE_ARR](state, arr) {
 		state.provinceArr = arr
 	},
 	[types.EDIT_PLAN_DAY_ING](state, status) {
 		state.isEditPlaning = status
 	},
 	[types.SHOW_IMG_LIST](state, status) {
 		state.isShowImgList = status
 	},
 	[types.LIST_UPDATE](state, status) {
 		state.isListUpdate = status
 	},
 	[types.GLOBAL_SEARCH](state, str) {
 		state.searchText = str
 	},
 	[types.INFO_NUM_CHANGE](state, num) {
 		state.infoNumCount = num
 	},
 	[types.TELL_OTHER_UPDATE](state, obj) {
 		state.updateStatus = obj
 	},
 	[types.SAVE_FROM_ROUTE](state, str) {
 		state.fromRoute = str
 	},
 	[types.APPLY_CHECK](state, status) {
 		state.isApplyCheck = status
 	},
 	[types.CHECK_STATUS](state, statusNum) {
 		state.checkStatus = statusNum
 	},
 	[types.PROVINCE_CITY](state, arr) {
 		state.proCitys = arr
 	},
 	[types.CHANGE_PENSONAL_INFO](state, status) {
 		state.isChangePensonalInfo = status
 	},
 }

 const actions = {
 	c_getUserInfo({commit}, obj) {
 		commit(types.USER_INFO, obj)
 	},
 	c_saveRouteStatus({commit}, str) {
 		commit(types.ROUTE_SAVE, str)
 	},
 	c_showChangePhone({commit}, status) {
 		commit(types.CHANGE_PHONE, status)
 	},
 	c_changeStage({commit}, status) {
 		commit(types.CHANGE_TYPE, status)
 	},
 	c_showReplyBox({commit}, obj) {
 		commit(types.SHOW_REPLY_BOX, obj)
 	},
 	c_showOfficialCode({commit}, status) {
 		commit(types.SHOW_OFFICAL_CODE, status)
 	},
 	c_toTop({commit}, val) {
 		commit(types.BACK_TOP, val)
 	},
 	c_loadingShow({commit}, val) {
 		let loading = Loading.service({
			lock: true,
			fullscreen: true,
			background: 'rgba(255, 255, 255, 0.7)'
		})
 		commit(types.LOADING_SHOW, loading)
 	},
 	c_userGrade({commit}, val) {
 		commit(types.USER_GRADE, val)
 	},
 	c_opinionBox({commit}, status) {
 		commit(types.SHOW_OPINION_BOX, status)
 	},
 	c_showSpotContent({commit}, obj) {
 		commit(types.SHOW_SPOT_CONTENT, obj)
 	},
 	c_showMadeCode({commit}, status) {
 		commit(types.SHOW_MADE_CODE, status)
 	},
 	c_getCityName({commit}, arr) {
 		commit(types.GET_CITY_NAME, arr)
 	},
 	c_saveCityType({commit}, obj) {
 		commit(types.SAVE_CITY_TYPE, obj)
 	},
 	c_getProvinceArr({commit}, arr) {
 		commit(types.GET_PROVINCE_ARR, arr)
 	},
 	c_lineEditPlan({commit}, status) {
 		commit(types.EDIT_PLAN_DAY_ING, status)
 	},
 	c_showImgList({commit}, status) {
 		commit(types.SHOW_IMG_LIST, status)
 	},
 	c_listUpdate({commit}, status) {
 		commit(types.LIST_UPDATE, status)
 	},
 	c_toSearch({commit}, str) {
 		commit(types.GLOBAL_SEARCH, str)
 	},
 	c_changeInfoNum({commit}, num) {
 		commit(types.INFO_NUM_CHANGE, num)
 	},
 	c_toUpdateData({commit}, obj) {
 		commit(types.TELL_OTHER_UPDATE, obj)
 	},
 	c_saveFromRoute({commit}, str) {
 		commit(types.SAVE_FROM_ROUTE, str)
 	},
 	c_toApplyCheck({commit}, status) {
 		commit(types.APPLY_CHECK, status)
 	},
 	c_changeCheckStatus({commit}, statusNum) {
 		commit(types.CHECK_STATUS, statusNum)
 	},
 	c_getProvinceCity({commit}, arr) {
 		commit(types.PROVINCE_CITY, arr)
 	},
 	c_changePensonalINfo({commit}, status) {
 		commit(types.CHANGE_PENSONAL_INFO, status)
 	}
 }

 export default {
	state,
    actions,
    getters,
    mutations
}