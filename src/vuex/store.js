import Vue from 'vue'
import Vuex from 'vuex'

import common from './modules/common.js'
import login from './modules/login.js'
import hotLineDetail from './modules/hotLineDetail.js'
import vHotLine from './modules/vHotLine.js'
import writeLine from './modules/writeLine.js'
import noteList from './modules/noteList.js'
import noteDetail from './modules/noteDetail.js'
import writeNote from './modules/writeNote.js'
import editSpot from './modules/editSpot.js'
import waitCheck from './modules/waitCheck.js'
import writeAct from './modules/writeAct.js'


Vue.use(Vuex);
//创建store实例
export default new Vuex.Store({
	modules : {
		common,
		login,
		hotLineDetail,
		vHotLine,
		writeLine,
		noteList,
		noteDetail,
		writeNote,
		editSpot,
		waitCheck,
		writeAct
	}
});