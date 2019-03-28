import *as types from '../types';

 const state = {
 	isShowVideo: false,
 	isShowRejectBox: {},
 	isClearSearch: false
 }

 const getters = {
 	wc_isShowVideo: state => state.isShowVideo,
 	wc_isShowRejectBox: state => state.isShowRejectBox,
 	wc_isClearSearch: state => state.isClearSearch
 }

 const mutations  = {
 	[types.SHOW_VIDEO_BOX](state, status) {
 		state.isShowVideo = status
 	},
 	[types.SHOW_REJECT_BOX](state, obj) {
 		state.isShowRejectBox = obj
 	},
 	[types.CLEAR_SEARCH](state, status) {
 		state.isClearSearch = status
 	},
 }

 const actions = {
 	wc_showVideo({commit}, status) {
 		commit(types.SHOW_VIDEO_BOX, status)
 	},
 	wc_showRejectBox({commit}, obj) {
 		commit(types.SHOW_REJECT_BOX, obj)
 	},
 	wc_clearSearch({commit}, status) {
 		commit(types.CLEAR_SEARCH, status)
 	}
 }

 export default {
	state,
    actions,
    getters,
    mutations
}