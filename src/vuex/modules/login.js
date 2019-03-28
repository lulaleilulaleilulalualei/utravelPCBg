import *as types from '../types';
import Api from '../../assets/js/api.js'

 const state = {
 	isPhoneTest: false,
 	isCodeTest: false,
 	isCodeShow: false,
 	isBindPhone: false,
 	isBindCode: false,
 	boxTypeVal: 1
 }

 const getters = {
 	l_isPhoneTest: state => state.isPhoneTest,
 	l_isCodeTest: state => state.isCodeTest,
 	l_isCodeShow: state => state.isCodeShow,
 	l_isBindPhone: state => state.isBindPhone,
 	l_isBindCode: state => state.isBindCode,
 	l_boxTypeVal: state => state.boxTypeVal
 }

 const mutations  = {
 	[types.PHONE_VAL](state, status) {
 		state.isPhoneTest = status
 		state.isBindPhone = status
 	},
 	[types.CODE_VAL](state, status) {
 		state.isCodeTest = status
 		state.isBindCode = status
 	},
 	[types.CODE_SHOW](state, status) {
 		state.isCodeShow = status
 	},
 	[types.LOGIN_TYPE_VAL](state, val) {
 		state.boxTypeVal = val
 	},
 }

 const actions = {
 	l_phoneTest({commit}, val) {
 		let phoneReg = /^\s*1[345678]\d{9}$/
 		if(phoneReg.test(val)) {
 			commit(types.PHONE_VAL, true)
 		}else {
 			commit(types.PHONE_VAL, false)
 		}

 	},
 	l_codeTest({commit}, val) {
 		let codeReg = /^\d{4}$/
 		if(Api.trim(val) != '') {
 			if(codeReg.test(val)) {
	 			commit(types.CODE_VAL, true)
	 		}else {
	 			commit(types.CODE_VAL, false)
	 		}
 		}	
 	},
 	l_codeShow({commit}, status) {
 		commit(types.CODE_SHOW, status)
 	},
 	l_loginType({commit}, val) {
 		commit(types.LOGIN_TYPE_VAL, val)
 	},
 }

 export default {
	state,
    actions,
    getters,
    mutations
}