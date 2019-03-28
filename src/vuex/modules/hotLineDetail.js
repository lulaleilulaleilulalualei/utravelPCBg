import *as types from '../types';

 const state = {
 	isShowEdit: {id: '', isShow: false}
 }

 const getters = {
 	hld_isShowEdit : state => state.isShowEdit
 }

 const mutations  = {
 	[types.DEIT_LINEDETAIL](state, obj) {
 		state.isShowEdit = obj
 	},
 }

 const actions = {
 	hld_showEdit({commit}, obj) {
 		commit(types.DEIT_LINEDETAIL, obj)
 	}
 }

 export default {
	state,
    actions,
    getters,
    mutations
}