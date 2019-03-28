import *as types from '../types';

 const state = {
 	isShowMap: false,
 	isShowSelf: false,
 	isShowTag: false,
 	pointAddInfo: {},//地址信息
 	pointInfo: {},//景点信息
 	isShowSaveBtn: false,
 	saveCount: {count: 0, saveType: 1}, //1为手动，2为自动
 	matterBox: {
 		isShow: false, 
 		text: ''
 	},
 	planSaveObj: {},
 	addMoreInfoObj: {type: '', isShow: false, infoObj: {}, isEdit: false},
 	isShowPlanList: false,
 	isCanTellSave: false,
 }

 const getters = {
 	wl_isShowMap : state => state.isShowMap,
 	wl_isShowSelf: state => state.isShowSelf,
 	wl_isShowTag: state => state.isShowTag,
 	wl_pointAddInfo: state => state.pointAddInfo,//地址信息
 	wl_pointInfo: state => state.pointInfo,//景点信息
 	wl_isShowSaveBtn: state => state.isShowSaveBtn,
 	wl_saveCount: state => state.saveCount,
 	wl_matterBox: state => state.matterBox,
 	wl_planSaveObj: state => state.planSaveObj,
 	wl_addMoreInfoObj: state => state.addMoreInfoObj,
 	wl_isShowPlanList: state => state.isShowPlanList,
 	wl_isCanTellSave: state => state.isCanTellSave
 }

 const mutations  = {
 	[types.LOAD_MAP](state, status) {
 		state.isShowMap = status
 	},
 	[types.SHOW_SELF_LINE](state, status) {
 		state.isShowSelf = status
 	},
 	[types.SHOW_TAGBOX](state, status) {
 		state.isShowTag = status
 	},
 	[types.POINT_ADD_INFO](state, obj) {
 		state.pointAddInfo = obj
 	},
 	[types.POINT_INFO](state, obj) {
 		state.pointInfo = obj
 	},
 	[types.SAVE_LINE](state, status) {
 		state.isShowSaveBtn = status
 	},
 	[types.SAVE_COUNT](state, obj) {
 		state.saveCount = obj
 	},
 	[types.LINE_MATTER_BOX](state, obj) {
 		state.matterBox = obj
 	},
 	[types.PLAN_DAY_INFO_SAVE](state, obj) {
 		state.planSaveObj = obj
 	},
 	[types.ADD_MORE_INFO](state, obj) {
 		state.addMoreInfoObj = obj
 	},
 	[types.SHOW_PLAN_LIST](state, status) {
 		state.isShowPlanList = status
 	},
 	[types.TELL_CAN_SAVE](state, status) {
 		state.isCanTellSave = status
 	},
 }

 const actions = {
 	wl_showMap({commit}, status) {
 		commit(types.LOAD_MAP, status)
 	},
 	wl_showSelfLine({commit}, status) {
 		commit(types.SHOW_SELF_LINE, status)
 	},
 	wl_showTag({commit}, status) {
 		commit(types.SHOW_TAGBOX, status)
 	},
 	wl_addressInfo({commit}, obj) {
 		commit(types.POINT_ADD_INFO, obj)
 	},
 	wl_showPointInfo({commit}, obj) {
 		commit(types.POINT_INFO, obj)
 	},
 	wl_showSaveBtn({commit}, status) {
 		commit(types.SAVE_LINE, status)
 	},
 	wl_saveCountMehod({commit}, obj) {
 		commit(types.SAVE_COUNT, obj)
 	},
 	wl_lineMatter({commit}, obj) {
 		commit(types.LINE_MATTER_BOX, obj)
 	},
 	wl_savePlanInfo({commit}, obj) {
 		commit(types.PLAN_DAY_INFO_SAVE, obj)
 	},
 	wl_addMOreINfo({commit}, obj) {
 		commit(types.ADD_MORE_INFO, obj)
 	},
 	wl_showPlanList({commit}, status) {
 		commit(types.SHOW_PLAN_LIST, status)
 	},
 	wl_canTellSave({commit}, status) {
 		commit(types.TELL_CAN_SAVE, status)
 	},
 }

 export default {
	state,
    actions,
    getters,
    mutations
}