// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui';
import router from './router'
import store from './vuex/store'
import api from './assets/js/api.js'
import { HappyScroll } from 'vue-happy-scroll'
import VueAMap from 'vue-amap';
import browserVer from './assets/js/browser.js'
import QRCode from 'qrcode'
import md5 from 'js-md5';
import VueAwesomeSwiper from 'vue-awesome-swiper'


import 'vue-happy-scroll/docs/happy-scroll.css'
import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/project.css'
import 'swiper/dist/css/swiper.css'

Vue.config.productionTip = false

Vue.prototype.$api = api
Vue.prototype.$md5 = md5;

Vue.use(ElementUI)
Vue.component('happy-scroll', HappyScroll)
Vue.use(VueAMap);
Vue.use(VueAwesomeSwiper)


const awardVer = browserVer.awardVer()
router.beforeEach((to, from, next) => {/*在跳转之前执行*/ //全局
	if(awardVer) {
		if (to.path == '/login') {
		    localStorage.removeItem('userGrade')
		    localStorage.removeItem('userInfo')
			localStorage.removeItem('loginType')
		  }
		  
		  let userObj = JSON.parse(localStorage.getItem('userGrade')), times = new Date().getTime(),
		  		loginType = String(localStorage.getItem('loginType')),
		  		state = sessionStorage.getItem('stateVal')
		  	if(loginType == '0' && state) {
		  		store._actions.c_loadingShow[0]()
		  	}
		  	
			if(userObj) {
				if((times - userObj.times) > 5*60*60*1000 ) {
					localStorage.removeItem('userGrade')
					localStorage.removeItem('userInfo')
					localStorage.removeItem('loginType')
					next({ path: '/login' })
				}else {
					next()
				}
			}else {
				if(loginType == '0' && state) {
					next()
				}else {
					if(to.path != '/login') {
						next({ path: '/login' })
					}else {
						next()
					}
				}
			}

	}else {
		if(to.path != '/browserLoad') {
			next({ path: '/browserLoad' })
		}else {
			next()
		}
	}
	
})

router.afterEach((to, from) => {/*在跳转之后判断*/ //全局 
	store._actions.c_saveFromRoute[0](from.path)
	store._actions.c_saveRouteStatus[0](to.path)
	if(to.path !== '/login') {//
		let userObj = JSON.parse(localStorage.getItem('userGrade')), times = new Date().getTime()
		if(userObj) {
			userObj.times = times
			localStorage.setItem('userGrade', JSON.stringify(userObj))
			store._actions.c_userGrade[0](userObj.userVal)
		}
	}else {
		localStorage.removeItem('userGrade')
		localStorage.removeItem('userInfo')
		localStorage.removeItem('loginType')
	}

	if(to.path != '/hotLineDetail') {
		store._actions.hld_showEdit[0]({id: '', isShow: false})
	}

	if(to.path != '/writeLine') {
		store._actions.wl_showSaveBtn[0](false)
	}

	if(to.path != '/noteDetail') {
		store._actions.nd_showHandleBtn[0]({id: '', isShow: false})
	}

	if(to.path != '/writeNote') {
		store._actions.wn_showBtn[0](false)
	}
})

// 初始化vue-amap
VueAMap.initAMapApiLoader({
  // 高德的key
  key: '0c0dbae29aaee3efcdc76cc094864dc8',
  // 插件集合
  plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor', 'Geolocation', 'AMap.Geocoder'],
  // 高德 sdk 版本，默认为 1.4.4
  v: '1.4.4',
  uiVersion: '1.0.11' // 版本号
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
