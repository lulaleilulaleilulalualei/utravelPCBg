import *as types from '../types';

 const state = {
 	isShowHandleBtn: {id: '', isShow: false}
 }

 const getters = {
 	nd_isShowHandleBtn: state => state.isShowHandleBtn,
 }

 const mutations  = {
 	[types.HANDLE_NOTE](state, obj) {
 		state.isShowHandleBtn = obj
 	},
 }

 const actions = {
 	nd_showHandleBtn({commit}, obj) {
 		commit(types.HANDLE_NOTE, obj)
 	},
 }

 export default {
	state,
    actions,
    getters,
    mutations
}