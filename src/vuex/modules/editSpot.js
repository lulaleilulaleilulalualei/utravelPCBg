import *as types from '../types';

 const state = {
 	isShowMap: false,
 	mapInfo: {}
 }

 const getters = {
 	es_isShowMap: state => state.isShowMap,
 	es_mapInfo: state => state.mapInfo
 }

 const mutations  = {
 	[types.SPOT_MAP](state, status) {
 		state.isShowMap = status
 	},
 	[types.SPOT_MAP_INFO](state, obj) {
 		state.mapInfo = obj
 	},
 }

 const actions = {
 	es_showMap({commit}, status) {
 		commit(types.SPOT_MAP, status)
 	},
 	es_mapInfoObj({commit}, obj) {
 		commit(types.SPOT_MAP_INFO, obj)
 	},
 }

 export default {
	state,
    actions,
    getters,
    mutations
}