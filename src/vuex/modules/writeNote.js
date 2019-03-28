import *as types from '../types';

 const state = {
 	isShowBtn: false,
 	isShowSectionBox: false,
 	isShowAddImg: false,
 	isShowVideo: false,
 	globalIndex: null,
 	isShowNoteInfo: false,
 	isAutoAddText: false,
 	noteType: 2 ,//1.草稿箱  2.全部游记  3.我的游记
 	saveCount: {count: 0, saveType: 1}, //保存计数
 	isCanTellSave: false,
 }

 const getters = {
 	wn_isShowBtn: state => state.isShowBtn,
 	wn_isShowSectionBox: state => state.isShowSectionBox,
 	wn_isShowAddimg: state => state.isShowAddImg,
 	wn_isShowVideo: state => state.isShowVideo,
 	wn_globalIndex: state => state.globalIndex,
 	wn_isShowNoteInfo: state => state.isShowNoteInfo,
 	wn_isAutoAddText: state => state.isAutoAddText,
 	wn_noteType: state => state.noteType,
 	wn_saveCount: state => state.saveCount,
 	wn_isCanTellSave: state => state.isCanTellSave
 }

 const mutations  = {
 	[types.SHOW_OPERATION_BTN](state, status) {
 		state.isShowBtn = status
 	},
 	[types.SHOW_SECTION_BOX](state, status) {
 		state.isShowSectionBox = status
 	},
 	[types.SHOW_ADD_IMG](state, status) {
 		state.isShowAddImg = status
 	},
 	[types.SHOW_ADD_VIDEO](state, status) {
 		state.isShowVideo = status
 	},
 	[types.GLOBAL_ADD_CONTENT](state, index) {
 		state.globalIndex = index
 	},
 	[types.NOTE_INFO_BOX](state, status) {
 		state.isShowNoteInfo = status
 	},
 	[types.AUTO_ADD_TEXT](state, status) {
 		state.isAutoAddText = status
 	},
 	[types.NOTE_LOAD_TYPE](state, type) {
 		state.noteType = type
 	},
 	[types.NOTE_SAVE_COUNT](state, obj) {
 		state.saveCount = obj
 	},
 	[types.TELL_CAN_SAVE_NOTE](state, status) {
 		state.isCanTellSave = status
 	},
 }

 const actions = {
 	wn_showBtn({commit}, status) {
 		commit(types.SHOW_OPERATION_BTN, status)
 	},
 	wn_showSectionBox({commit}, status) {
 		commit(types.SHOW_SECTION_BOX, status)
 	},
 	wn_addImg({commit}, status) {
 		commit(types.SHOW_ADD_IMG, status)
 	},
 	wn_addVideo({commit}, status) {
 		commit(types.SHOW_ADD_VIDEO, status)
 	},
 	wn_addContent({commit}, index) {
 		commit(types.GLOBAL_ADD_CONTENT, index)
 	},
 	wn_showNoteInfo({commit}, status) {
 		commit(types.NOTE_INFO_BOX, status)
 	},
 	wn_autoAddText({commit}, status) {
 		commit(types.AUTO_ADD_TEXT, status)
 	},
 	wn_changeNoteType({commit}, type) {
 		commit(types.NOTE_LOAD_TYPE, type)
 	},
 	wn_changeCount({commit}, obj) {
 		commit(types.NOTE_SAVE_COUNT, obj)
 	},
 	wn_canTellSave({commit}, status) {
 		commit(types.TELL_CAN_SAVE_NOTE, status)
 	},
 }

 export default {
	state,
    actions,
    getters,
    mutations
}