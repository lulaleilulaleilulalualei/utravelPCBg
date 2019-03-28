import *as types from '../types';

 const state = {
 	actPlanObj: {
		cityArr: [{shortName: '暂无安排', id: 0}],
		spotArr: [],
		desc: '',
		isActive: true,
		index: 1,
		chageType: 1, //1是普通修改，2是增添删除修改
	}, //当日活动安排对象
 	toDeleteCity: null, //去除城市
 	addSpotObj: {},//景点对象
 	spotArr: [], //景点数组
 	isShowActBox: false,
 	actInfo: {} ,//携带活动信息
 	mapFirstPos: false ,//地图首次定位是否完成
 }

 const getters = {
 	wa_actPlanObj: state => state.actPlanObj,
 	wa_toDeleteCity: state => state.toDeleteCity,
 	wa_addSpotObj: state => state.addSpotObj,
 	wa_spotArr: state => state.spotArr,
 	wa_isShowActBox: state =>  state.isShowActBox,
 	wa_actInfo: state => state.actInfo,
 	wa_mapFirstPos: state => state.mapFirstPos
 }

 const mutations  = {
 	[types.ACT_PLAN_ARR](state, obj) {
 		state.actPlanObj = obj
 	},
 	[types.TO_DELETE_CITY](state, obj) {
 		state.toDeleteCity = obj
 	},
 	[types.SELECT_ADD_SPOT](state, obj) {
 		state.addSpotObj = obj
 	},
 	[types.DAY_SPOT_LIST](state, arr) {
 		state.spotArr = arr
 	},
 	[types.START_ACT_BOX](state, obj) {
 		state.isShowActBox = obj
 	},
 	[types.GET_ACT_INFO](state, obj) {
 		state.actInfo = obj
 	},
 	[types.MAP_FIRST_POS](state, status) {
 		state.mapFirstPos = status
 	},
 }

 const actions = {
 	wa_toChangeActObj({commit}, obj) {
 		commit(types.ACT_PLAN_ARR, obj)
 	},
 	wa_getDeleteCityIndex({commit}, obj) {
 		commit(types.TO_DELETE_CITY, obj)
 	},
 	wa_addToSpot({commit}, obj) {
 		commit(types.SELECT_ADD_SPOT, obj)
 	},
 	wa_setSpotMap({commit}, arr) {
 		commit(types.DAY_SPOT_LIST, arr)
 	},
 	wa_showActBox({commit}, obj) {
 		commit(types.START_ACT_BOX, obj)
 	},
 	wa_getActInfo({commit}, obj) {
 		commit(types.GET_ACT_INFO, obj)
 	},
 	wa_getMapFirstPos({commit}, status) {
 		commit(types.MAP_FIRST_POS, status)
 	},
 }

 export default {
	state,
    actions,
    getters,
    mutations
}