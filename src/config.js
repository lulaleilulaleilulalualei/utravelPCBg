// const host  = "/api"
// const host = 'http://ulvjia.douziit.com/api'
// const wsHost = 'ws://ulvjia.douziit.com/api'
// const host = "http://test-api.ulvjia.com"
// const wsHost = 'ws://test-api.ulvjia.com'
const host  = "http://api.ulvjia.com"
const wsHost = 'ws://api.ulvjia.com'

const config = {
	host: host,
	wsHost: wsHost,
	getCodeNum: `${host}/user/sendSmsCode`, //获取验证码
	cityList: `${host}/admin/common/allCity`, //城市列表
	province: `${host}/admin/common/allProvince`, //省份列表
	wxLogin: `${host}/admin/web/wxLogin`, //微信扫码登录
	codegetData: `${host}/admin/info`, //扫码获取用户数据
	phoneLogin: `${host}/admin/web/login`, //手机号登录
	uploadImg: `${host}/upload/images`, //上次图片
	uploadSpotImg: `${host}/admin/manager/node/saveNodePics`, //单独上传景点图片
	uploadVideo: `${host}/admin/upload/videos`, //上传视频
	shareUrl: `${host}/admin/common/getShareUrl`, //分享链接
	getPhoneImg: `${host}/admin/common//getImgUrl`, // 获取手机照片
	appLogin: `${host}/user/codeLogin`, //app扫码
	wsLoginUrl: `${wsHost}/websocket`, //ws登录地址
	collectApi: 'collect.ulvjia.com',
	//管理员接口
	getManagerActList: `${host}/admin/manager/activity/list`, // 管理员获取活动列表
	getActDetail: `${host}/admin/manager/activity/detail`, //查询活动详情
	deleteAct: `${host}/admin/manager/activity/delete`, //删除活动
	managerLineList: `${host}/admin/manager/route/list`, //管理员获取线路列表
	lineDetail: `${host}/admin/manager/route/detail`, //查询路书详情
	spotDetail: `${host}/admin/manager/node/detail`, //查询景点详情
	createLine: `${host}/admin/manager/route/saveRoute`, //创建路书
	editLine: `${host}/admin/manager/route/editRoute`, //编辑线路
	getAllSpot: `${host}/admin/common/allNodes`, //查询或有景点
	addManagerSpot: `${host}/admin/manager/node/saveNode`, //新增景点
	getSpotList: `${host}/admin/manager/node/list`, //查询景点列表
	getLineTags: `${host}/admin/common/routeTags`, //查询路书标签
	adminAddSpot: `${host}/admin/manager/node/saveNode`, //添加景点
	getAllClub: `${host}/admin/manager/route/allClub`, //获取自驾团数据
	clubRecommend: `${host}/admin/manager/route/routeRecommend`, //线路推荐
	linkClubGroup: `${host}/admin/manager/route/recommendClubList`, //路书关联列表
	cancelClubLink: `${host}/admin/manager/route/delSingleRecommend`, // 线路取消单个自驾团/省推送
	managerDeleteLine: `${host}/admin/manager/route/del`, //删除线路
	getManagerSpotList: `${host}/admin/manager/node/list`, //景点列表
	deleteSpot: `${host}//admin/manager/node/del`, //删除景点
	managerNoteList: `${host}/admin/manager/post/hotTraveList`, //游记列表
	deleteNote: `${host}/admin/manager/post/delTravel`, //删除游记
	noteDetail: `${host}/admin/manager/post/travelDetail`, //游记详情
	createTravelNote: `${host}/admin/manager/post/saveTravel`, //建立游记
	addSpotImg: `${host}/admin/manager/node/addNodePic`, //添加景点图片
	deleteSpotImg: `${host}/admin/manager/node/delNodePic`, //删除景点图片
	checkNote: `${host}/admin/manager/post/uncheckTraveList`, //游记审核列表
	checkLine: `${host}/admin/manager/route/uncheckRoutelist`, //线路审核列表
	checkSpot: `${host}/admin/manager/node/uncheckList`, //景点审核列表
	checkVideo: `${host}/admin/manager/post/uncheckVideoList`, //视频审核列表
	linePass: `${host}/admin/manager/route/pass`, //线路审核通过
	spotPass: `${host}/admin/manager/node/pass`, //景点审核通过
	noteOrVideoPass: `${host}/admin/manager/post/pass`, //视频游记审核通过
	rejectLine: `${host}/admin/manager/route/rebut`, //驳回线路
	rejectNoteOrVideo: `${host}/admin/manager/post/rebut`, //驳回视频游记
	infoList: `${host}/admin/manager/feedback/list`, //消息列表
	replyInfo: `${host}/admin/manager/feedback/add`, //回复消息
	infoNum: `${host}/admin/manager/feedback/findUnRead`, //消息数量
	changeInfoType: `${host}/admin/manager/feedback/read`, //修改消息状态
	getUserList: `${host}/admin/manager/user/findUser`, //获取用户列表
	pushText: `${host}/admin/manager/notice/sendText`, //推送文本信息
	pushArticle: `${host}/admin/manager/notice/sendObj`, //推送文章信息
	getMSpotList: `${host}/select/point`, //获取m的城市景点
	getMSpotImg: `${host}/select/photo`, //获取m景点的图片
	//普通用户
	userActList: `${host}/admin/user/activity/list`, //活动列表
	userActDetail: `${host}/admin/user/activity/detail`, //活动详情
	userLineList: `${host}/admin/user/route/list`, //线路列表
	userLineDetail: `${host}/admin/user/route/detail`, // 线路详情
	userEditLine: `${host}/admin/user/route/editRoute`, //编辑线路
	userCollectLine: `${host}/admin/user/route/collect`, //收藏/取消收藏路书线路
	userCreateLine: `${host}/admin/user/route/saveRoute`, //创建路书线路
	userDeleteLine: `${host}/admin/user/route/del`, //删除线路
	userApplyCheck: `${host}/admin/user/route/approve`, //路书提交审核
	userNoteList: `${host}/admin/user/post/travelList`, //游记列表
	userNoteDetail: `${host}/admin/user/post/travelDetail`, //游记详情
	userNoteDelete: `${host}/admin/user/post/del`, //删除游记
	userCollectNote: `${host}/admin/user/post/collect`, //收藏/取消收藏游记
	userNoteSave: `${host}/admin/user/post/saveTravel`, //添加/编辑游记
	userSpotDetail: `${host}/admin/user/node/detail`, //查看景点详情
	userSpotAdd: `${host}/admin/user/node/saveNode`, //自定义景点
	userInfoList: `${host}/admin/user/feedback/list`, //反馈消息列表
	userInfoNoRead: `${host}/admin/user/feedback/findUnRead`, //查询未读反馈信息
	userInfoChangeRead: `${host}/admin/user/feedback/read`, //修改反馈消息为已读
	userInfoApply: `${host}/admin/user/feedback/add`, //提交反馈意见
	userChangeInfo: `${host}/admin/user/update`, //修改用户信息
	userTestPhone: `${host}/admin/user/validataCode`, //验证手机验证码是否正确
	userBindPhone: `${host}/admin/user//bindAccount` //修改绑定手机号
}

export default config