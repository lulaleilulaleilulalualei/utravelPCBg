import *as types from '../types';

 const state = {
 	isShowBox: {isShow: false, id: '', lineName: ''},
 	isShowOfficalLine: false,
 	isShowDraft: false,
 	isShowMineLine: false,
 	lineType: 2
 }

 const getters = {
 	vhl_isShowBox : state => state.isShowBox,
 	vhl_isShowOfficalLine: state => state.isShowOfficalLine,
 	vhl_isShowDraft : state => state.isShowDraft,
 	vhl_isShowMineLine: state => state.isShowMineLine,
 	vhl_lineType: state => state.lineType
 }

 const mutations  = {
 	[types.RCM_CLUB](state, obj) {
 		state.isShowBox = obj
 	},
 	[types.SHOW_OFFICAL_LINE](state, status) {
 		state.isShowOfficalLine = status
 	},
 	[types.SHOW_LINE_DRAFT](state, status) {
 		state.isShowDraft = status
 	},
 	[types.SHOW_MINE_LINE](state, status) {
 		state.isShowMineLine = status
 	},
 	[types.V_LINE_TYPE](state, type) {
 		state.lineType = type
 	},
 }

 const actions = {
 	vhl_showBox({commit}, obj) {
 		commit(types.RCM_CLUB, obj)
 	},
 	vhl_showOfficalLine({commit}, status) {
 		commit(types.SHOW_OFFICAL_LINE, status)
 	},
 	vhl_showDraft({commit}, status) {
 		commit(types.SHOW_LINE_DRAFT, status)
 	},
 	vhl_showMineLine({commit}, status) {
 		commit(types.SHOW_MINE_LINE, status)
 	},
 	vhl_changeTypeVal({commit}, type) {
 		commit(types.V_LINE_TYPE, type)
 	}
 }

 export default {
	state,
    actions,
    getters,
    mutations
}