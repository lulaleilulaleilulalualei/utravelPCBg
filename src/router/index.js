import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login'
import Home from '@/components/home'
import activityList from '@/components/activityList/activityList'
import activityDetail from '@/components/activityList/activityDetail'
import hotLine from '@/components/hotLine/hotLine'
import vHotLine from  '@/components/hotLine/vHotLine'
import hotLineDetail from '@/components/hotLine/hotLineDetail'
import writeLine from '@/components/writeLine/writeLine'
import hotNotes from '@/components/hotNotes/hotNotes'
import noteDetail from '@/components/hotNotes/noteDetail'
import writeNote from '@/components/writeNote/writeNote'
import spotList from '@/components/spotList/spotBox'
import addEditSpot from '@/components/spotList/addEditSpot'
import waitCheck from '@/components/waitCheck/waitCheck'
import personSet from '@/components/otherArea/personSet'
import infoList from '@/components/otherArea/getInfo'
import infoPush from '@/components/infoPush/infoPush'
import uploadSpotImg from '@/components/upLoadSpotImg/upLoadSpotImg'
import browserLoad from '@/components/otherArea/browserLoad'
import error from '@/components/common/error'
import openAct from '@/components/writeAct/writeAct'

import checkProcess from '@/components/applyCheck/checkProcess'
import checkProtocal from '@/components/applyCheck/utravelServiceProtocol'
import officialLetter from '@/components/applyCheck/officialLetterLoad'
import themeNoChangeDue from '@/components/applyCheck/themeNoChangeDue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  // base: '/pc',
  routes: [
    {
      path: '/login',
      component: Login,
      name: 'login',
      hidden: true
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/activityList' }
    },
    {
      path: '/browserLoad',
      component: browserLoad,
      name: 'browserLoad',
      hidden: true
    },
    {
      path: '/error',
      component: error,
      name: 'error',
      hidden: true
    },
    {
      path: '/openAct',
      component: openAct,
      name: '发起活动',
      hidden: true
    },
    {
    	path: '/',
    	component: Home,
    	children: [
        { 
          path: 'activityList', 
          component: activityList, 
          name: '活动列表',
          meta: {
            keepAlive: true // 缓存
          }
        },
        { 
          path: 'activityDetail', 
          component: activityDetail,
          name: '活动详情',
          meta: {
            keepAlive: false // 不需要缓存
          }
         },
        { 
          path: 'hotLine', 
          component: hotLine, 
          name: '推荐线路-用户',
          meta: {
            keepAlive: true // 缓存
          }
        },
    		{ 
          path: 'hotLineDetail', 
          component: hotLineDetail, 
          name: '推荐详情',
          meta: {
            keepAlive: false // 不需要缓存
          }
        },
        {
          path: 'vHotLine', 
          component: vHotLine, 
          name: '推荐线路-官方',
          meta: {
            keepAlive: true // 缓存
          }
        },
        {
          path: 'writeLine', 
          component: writeLine, 
          name: '编写路书',
          meta: {
            keepAlive: false // 不需要缓存
          }
        },
        {
          path: 'hotNotes', 
          component: hotNotes, 
          name: '热门游记',
          meta: {
            keepAlive: true // 缓存
          }
        },
        {
          path: 'noteDetail', 
          component: noteDetail, 
          name: '游记详情',
          meta: {
            keepAlive: false // 不需要缓存
          } 
        },
        {
          path: 'writeNote', 
          component: writeNote, 
          name: '编写游记',
          meta: {
            keepAlive: false // 不需要缓存
          }
        },
        {
          path: 'spotList', 
          component: spotList, 
          name: '景点列表',
          meta: {
            keepAlive: true // 缓存
          }
        },
        {
          path: 'addEditSpot', 
          component: addEditSpot, 
          name: '景点编辑',
          meta: {
            keepAlive: false // 不需要缓存
          }
        },
        {
          path: 'waitCheck', 
          component: waitCheck, 
          name: '待审核',
          meta: {
            keepAlive: true // 缓存
          }
        },
        {
          path: 'uploadSpotImg', 
          component: uploadSpotImg,
          name: '景点图片上传',
          meta: {
            keepAlive: false // 不需要缓存
          }
        },
        {
          path: 'personSet', 
          component: personSet, 
          name: '个人设置',
          meta: {
            keepAlive: false // 不需要缓存
          }
        },
        {
          path: 'infoList', 
          component: infoList, 
          name: '消息列表',
          meta: {
            keepAlive: false // 不需要缓存
          }
        },
        {
          path: 'infoPush', 
          component: infoPush,
          name: '消息推送',
          meta: {
            keepAlive: false // 不需要缓存
          }
        },
        {
          path: 'checkProcess', 
          component: checkProcess,
          name: '认证流程',
          meta: {
            keepAlive: false // 不需要缓存
          }
        },
        {
          path: 'checkProtocal', 
          component: checkProtocal,
          name: '优旅家服务协议',
          meta: {
            keepAlive: false // 不需要缓存
          }
        },
        {
          path: 'officialLetter', 
          component: officialLetter,
          name: '公函模板',
          meta: {
            keepAlive: false // 不需要缓存
          }
        },
        {
          path: 'themeNoChangeDue', 
          component: themeNoChangeDue,
          name: '主题不可更改原因',
          meta: {
            keepAlive: false // 不需要缓存
          }
        },
    	]
    }
  ]
})
