import axios from 'axios';
import config from '@/config'
import store from '../../vuex/store'
import { Message } from 'element-ui';

const tool = {
	ajax: function(obj) {
		if (!obj.url) {
			alert('请填写接口地址');
			return false;
		}

		let cancel ,promiseArr = {}
		const CancelToken = axios.CancelToken;

		axios.interceptors.request.use(config => {
	    //发起请求时，取消掉当前正在进行的相同请求
	    if (promiseArr[config.url]) {
	        promiseArr[config.url]('操作取消')
	        promiseArr[config.url] = cancel
		    } else {
		        promiseArr[config.url] = cancel
		    }
		      return config
		}, error => {
		    return Promise.reject(error)
		})

		//响应拦截器即异常处理
		axios.interceptors.response.use(response => {
		    return response
		}, err => {
		    return Promise.resolve(err.response)
		})

		axios({
			method: obj.method || 'get',
			url: obj.url,
            data: obj.data || {},
            params: obj.params || {},
			headers: obj.headers || {
			  	'Content-Type':'application/json'
			},
            baseURL: '',
			time: obj.time || 10*1000,
			responseType: obj.responseType || 'json',
			cancelToken: new CancelToken(c => {
            	cancel = c
          })
		}).then(function(res){
           if(res) {
             if(res.status == 200 ){
                if(obj.success){ 
                    obj.success(res.data);
                }
                
            }else{
                if (obj.error) {
                    obj.error(error);
                }
                
            }
           }		
		}).catch(function (error){
			if (obj.error) {
				obj.error(error);
			} 
		})
	},
	isEmptyObject: function(obj) {//判定是否为空对象
        for(let key in obj ) {
            return false
        }
        return true
    },
    getUrlParam:function(name){
        let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        let r = window.location.search.substr(1).match(reg);  //匹配目标参数
        if (r != null) return unescape(r[2]);
        return null; //返回参数值
    },
     trim: function (strs) { 
        if(Object.prototype.toString.call(strs) === "[object String]") {
 			return strs.replace(/(^\s*)|(\s*$)/g, '');
 		}
    },
    timeFormat: function() {
    	let nowTime = new Date(),
    		nowHours = nowTime.getHours() + 1,
    		nowMinutes = nowTime.getMinutes(),
    		nowSeconds = nowTime.getSeconds()

    	if(nowHours < 10) nowHours = '0' + nowHours
    	if(nowMinutes < 10) nowMinutes = '0' + nowMinutes
    	if(nowSeconds < 10) nowSeconds = '0' + nowSeconds

    	return `${nowHours}:${nowMinutes}:${nowSeconds}`
    },
    textFilter:function(txt){
        if(txt) {
            return txt.replace(/\n/g,'<br/>')
        }else {
            return ''
        }
        
    },
    cityList: function(callBack) {
    	this.ajax({
    		// url: config.cityList,
            url: '/static/allCity.json',
    		headers: {
				'API-User-Token': store.getters.c_userInfo.token
			},
    		success: (res) => {
    			if(res.code == 0) {
    				typeof callBack === 'function' && callBack(res.data)
    			}else {
    				Message({
	    				type: 'error',
						message: res.message,
						center: true
	    			})
    			}
    		},
    		error: () => {
    			Message({
    				type: 'error',
					message: '获取城市列表失败',
					center: true
    			})
    		}
    	})
    },
    provinceList: function(callBack) {
    	this.ajax({
    		url: config.province,
    		headers: {
				'API-User-Token': store.getters.c_userInfo.token
			},
    		success: (res) => {
    			if(res.code == 0) {
                    let arr = res.data
                    arr.unshift({
                        id: '0',
                        name: '全国境内'
                    })
    				typeof callBack === 'function' && callBack(arr)
    			}else {
    				Message({
	    				type: 'error',
						message: res.message,
						center: true
	    			})
    			}
    		},
    		error: (err) => {
    			Message({
    				type: 'error',
					message: '获取省份列表失败',
					center: true
    			})
    		}
    	})
    },
    getTags: function(callBack) {
    	const $this = this
		this.ajax({
		    url: config.getLineTags,
		    headers: {
				'Content-Type':'application/x-www-form-urlencoded',
				'API-User-Token': store.getters.c_userInfo.token
			},
			success: (res) => {
				if(res.code == 0) {
						typeof callBack === 'function' && callBack(res.data)
					}else {
						Message({
						    type: 'error',
						    message: res.message,
						    center: true
						})
					}
				},
				error: () => {
					Message({
					    type: 'error',
					    message: '获取标签失败',
					  	center: true
					});
			}
		 })
    },
    proAndCity: function(callBack) {
        this.ajax({
            // url: '/static/response.json',collect.ulvjia.com
            url: `http://${config.collectApi}/api/select/city`,
            headers: {
                // 'API-User-Token': store.getters.c_userInfo.token
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            success: (res) => {
                if(res.code == 0) {
                    let arr = res.data
                    arr.map((v, i) => {
                        if(i == 0) {
                            v.isShow = true
                        }else {
                            v.isShow = false
                        }
                    })
                    typeof callBack === 'function' && callBack(arr)
                }else {
                    Message({
                        type: 'error',
                        message: res.message,
                        center: true
                    })
                }
            },
            error: () => {
                Message({
                    type: 'error',
                    message: '获取城市列表失败',
                    center: true
                })
            }
        })
    },
    randomNum:function(min, max) {
    	return Math.floor(Math.random()*(max-min)+min)
    },
    countDown: function(callback) {
    	var downObj = {
    		maxTime : 60,
    		countTxt: '',
    		status: false,
    		timer: '',
    		downTime: function() {
    			var $this = this
    			if(this.maxTime > 1) {
    				this.maxTime--
    				this.countTxt = this.maxTime + '秒后获取'
    				this.status = true
    				typeof callback == 'function' && callback($this.countTxt, $this.status)
    				this.timer = setTimeout(function(){
    					$this.downTime()
    				}, 1000)
    			}else {
    				this.status = false
    				this.timer = setTimeout(function() {
    					typeof callback == 'function' && callback('获取验证码', $this.status)
    				}, 1000)
    			}
    		}
    	}
    	downObj.downTime()
    	
    },
    hasClass: function(ele, cName) {
        return !!ele.className.match( new RegExp( "(\\s|^)" + cName + "(\\s|$)") ); 
    },
    addClass: function(ele, cName) {
        if( !this.hasClass( ele,cName ) ){
            ele.className += " " + cName
        }
    },
    removeClass: function(ele, cName) {
        if( this.hasClass( ele,cName ) ){
            ele.className = ele.className.replace( new RegExp( "(\\s|^)" + cName + "(\\s|$)" ), " " )
        }
    },
    returnImgArr(pic) {
        return pic.split(',')
    },
    compareDistance(index, sportArr) {
        if(index < sportArr.length -1) {
            let startPos = new AMap.LngLat(sportArr[index].longitude, sportArr[index].latitude)
            var myDistance = startPos.distance([sportArr[index+1].longitude,sportArr[index+1].latitude]);//这里测量距离
            return (myDistance/1000).toFixed(2) + 'km'
        }
    }
}

export default tool;