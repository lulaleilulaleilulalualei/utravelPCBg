import *as types from '../types';

 const state = {
 	isShowDraft: false
 }

 const getters = {
 	nl_isShowDraft: state => state.isShowDraft
 }

 const mutations  = {
 	[types.SHOW_NOTE_DRAFT](state, status) {
 		state.isShowDraft = status
 	},
 }

 const actions = {
 	nl_showDraft({commit}, status) {
 		commit(types.SHOW_NOTE_DRAFT, status)
 	},
 }

 export default {
	state,
    actions,
    getters,
    mutations
}