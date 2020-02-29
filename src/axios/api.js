import {service, downloadService} from './request'
// import store from '../store/store.js'

// 登录
export const getLogin = data => { return service({method: 'post', url: '/login/userLogin', data, headers: {'Content-Type': 'multipart/form-data'}}) }
// 菜单
export const menuList = data => { return service({method: 'post', url: '/menu/getMenuList', data, headers: {'Content-Type': 'application/json'}}) }
// 验证码
export const verifyCode = data => { return service({method: 'post', responseType: 'arraybuffer', url: '/code/verifyCode', data, witchCredentials: true, headers: {'Content-Type': 'multipart/form-data'}}) }
/**
 * 账号管理
 */
// 账号管理列表
export const listSysUser = data => { return service({method: 'post', url: '/sysUser/listSysUser', data, headers: {'Content-Type': 'application/json'}}) }
// 新增账号管理
export const addSysUser = data => { return service({method: 'post', url: '/sysUser/addSysUser', data, headers: {'Content-Type': 'application/json'}}) }
// 删除账号管理
export const deleteUser = data => { return service({method: 'post', url: '/sysUser/deleteSysUser', data, headers: {'Content-Type': 'multipart/form-data'}}) }
// 编辑账号管理
export const modifiyUser = data => { return service({method: 'post', url: '/sysUser/updateSysUser', data, headers: {'Content-Type': 'application/json'}}) }
// 重置密码
export const resetPassword = data => { return service({method: 'post', url: '/sysUser/resetPassword', data, headers: {'Content-Type': 'multipart/form-data'}}) }
// 编辑账号
export const toUpdateSysUser = data => { return service({method: 'post', url: '/sysUser/toUpdateSysUser', data, headers: {'Content-Type': 'application/json'}}) }
/**
 * 组织管理
 */
// 组织列表
export const getListOrg = data => { return service({method: 'post', url: '/organization/listOrganization', data, headers: {'Content-Type': 'multipart/form-data'}}) }
// 新增组织
export const addOrg = data => { return service({method: 'post', url: '/organization/addOrganization', data, headers: {'Content-Type': 'application/json'}}) }
// 删除组织
export const deleteOrg = data => { return service({method: 'post', url: '/organization/deleteOrganization', data, headers: {'Content-Type': 'multipart/form-data'}}) }
// 获取组织树
export const getOrgTree = data => { return service({method: 'post', url: '/organization/getOrganizationTree', data, headers: {'Content-Type': 'multipart/form-data'}}) }
// 修改组织
export const modifyOrg = data => { return service({method: 'post', url: '/organization/updateOrganization', data, headers: {'Content-Type': 'application/json'}}) }
// 获取组织
export const getOrg = data => { return service({method: 'post', url: '/organization/toUpdateOrganization', data, headers: {'Content-Type': 'application/json'}}) }
// 获取组织人员列表
export const getOrgUsers = data => { return service({method: 'post', url: '/organization/orgUserList', data, headers: {'Content-Type': 'multipart/form-data'}}) }

/**
 * 设备管理
 */
// 新增设备管理
export const addDevice = data => { return service({method: 'post', url: '/device/addDevice', data, headers: {'Content-Type': 'application/json'}}) }
// 删除设备管理
export const deleteDevice = data => { return service({method: 'post', url: '/device/deleteDevice', data, headers: {'Content-Type': 'multipart/form-data'}}) }
// 修改设备管理
export const updateDevice = data => { return service({method: 'post', url: '/device/updateDevice', data, headers: {'Content-Type': 'application/json'}}) }
// 设备管理下拉框
export const getSysDictByParentCode = data => { return service({method: 'post', url: '/sysDict/getSysDictByParentCode', data, headers: {'Content-Type': 'multipart/form-data'}}) }
// 设备管理的查询
export const listDevice = data => { return service({method: 'post', url: '/device/listDevice', data, headers: {'Content-Type': 'multipart/form-data'}}) }
// 设备信息
export const toUpdateDevice = data => { return service({method: 'post', url: '/device/toUpdateDevice', data, headers: {'Content-Type': 'multipart/form-data'}}) }
// 设备 更新时间
export const modifyTime = data => { return service({method: 'post', url: '/time/modifyTime', data, headers: {'Content-Type': 'multipart/form-data'}}) }
// 设备重启
export const restart = data => { return service({method: 'post', url: '/device/restart', data, headers: {'Content-Type': 'multipart/form-data'}}) }
/**
 * 系统管理
 */
// 系统授权
export const sysAuthInfoDetails = data => { return service({method: 'get', url: '/sysAuthInfo/sysAuthInfoDetails', data, headers: {'Content-Type': 'application/json'}}) }
// 意见反馈
export const addQuestionRecord = data => { return service({method: 'post', url: '/questionRecord/addQuestionRecord', data, headers: {'Content-Type': 'application/json'}}) }
// 菜单配置
export const updateMenuList = data => { return service({method: 'post', url: '/menu/updateMenuList', data, headers: {'Content-Type': 'application/json'}}) }
// 修改密码
export const modifyPassWord = data => { return service({method: 'post', url: '/login/modifyPassWord', data, headers: {'Content-Type': 'application/json'}}) }
// 识别参数配置detail
export const sysAlgorithmDetail = data => { return service({method: 'post', url: '/sysAlgorithm/sysAlgorithmDetail', data, headers: {'Content-Type': 'application/json'}}) }
// 识别参数配置保存
export const addSysAlgorithm = data => { return service({method: 'post', url: '/sysAlgorithm/addSysAlgorithm', data, headers: {'Content-Type': 'application/json'}}) }
// 磁盘管理-磁盘使用情况
export const diskInfo = () => { return service({method: 'post', url: '/disk/diskInfo', headers: {'Content-Type': 'multipart/form-data'}}) }
// 磁盘管理-记录数
export const countRecord = data => { return service({method: 'post', url: '/disk/countRecord', data, headers: {'Content-Type': 'application/json'}}) }
// 磁盘管理-清除记录
export const clearRecord = data => { return service({method: 'post', url: '/disk/clearRecord', data, headers: {'Content-Type': 'application/json'}}) }
// 图片质量参数配置 - 获取
export const getPicQuality = () => { return service({method: 'post', url: '/sysAlgorithm/qualityDetail', headers: {'Content-Type': 'application/json'}}) }
// 图片质量参数配置 - 保存
export const addPicQuality = data => { return service({method: 'post', url: '/sysAlgorithm/addQuality', data, headers: {'Content-Type': 'application/json'}}) }

/**
 * 底库管理
 */
// 查询底库
export const listLibrary = data => { return service({method: 'post', url: '/library/listLibrary', data, headers: {'Content-Type': 'application/json'}}) }
// 选择底库
export const toAddLibrary = data => { return service({method: 'post', url: '/library/toAddLibrary', data, headers: {'Content-Type': 'application/json'}}) }
// 删除底库
export const deleteLibrary = data => { return service({method: 'post', url: '/library/deleteLibrary', data, headers: {'Content-Type': 'multipart/form-data'}}) }
// 查看底库
export const libraryUserList = data => { return service({method: 'post', url: '/library/libraryUserList', data, headers: {'Content-Type': 'multipart/form-data'}}) }
// 新增底库
export const addLibrary = data => { return service({method: 'post', url: '/library/addLibrary', data, headers: {'Content-Type': 'application/json'}}) }
// 修改底库详情
export const toUpdateLibrary = data => { return service({method: 'post', url: '/library/toUpdateLibrary', data, headers: {'Content-Type': 'multipart/form-data'}}) }
// 提交修改底库
export const updateLibrary = data => { return service({method: 'post', url: '/library/updateLibrary', data, headers: {'Content-Type': 'application/json'}}) }
/**
 * 人员管理
 */
// 人员列表
export const listStaff = (data, userRole) => { return service({method: 'post', url: '/user/listStaff/' + userRole, data, headers: {'Content-Type': 'multipart/form-data'}}) }
// 人员列表-访客-被访人列表
export const listVisited = (data) => { return service({method: 'post', url: '/user/listUser', data, headers: {'Content-Type': 'multipart/form-data'}}) }
// 添加人员
export const addStaff = (data, userRole) => { return service({method: 'post', url: '/user/addStaff/' + userRole, data, headers: {'Content-Type': 'application/json'}}) }
// 删除人员
export const deleteStaff = (data, userRole) => { return service({method: 'post', url: '/user/deleteStaff/' + userRole, data, headers: {'Content-Type': 'multipart/form-data'}}) }
// 修改人员
export const modifyStaff = (data, userRole) => { return service({method: 'post', url: '/user/modifyStaff/' + userRole, data, headers: {'Content-Type': 'application/json'}}) }
// 获取动态查询条件项
export const getDynamicSearchField = (userRole) => { return service({method: 'post', url: '/user/getDynamicSearchField/' + userRole, headers: {'Content-Type': 'multipart/form-data'}}) }
// 获取增改表单项
export const getDynamicForm = (userRole) => { return service({method: 'post', url: '/user/getDynamicForm/' + userRole, headers: {'Content-Type': 'multipart/form-data'}}) }
// 获取制定员工增改表单项
export const getDynamicFormWithValue = (data, userRole) => { return service({method: 'post', url: '/user/getDynamicFormWithValue/' + userRole, data, headers: {'Content-Type': 'multipart/form-data'}}) }
// 批量删除员工
export const deleteStaffBatch = (data, userRole) => { return service({method: 'post', url: '/user/deleteStaffBatch/' + userRole, data, headers: {'Content-Type': 'multipart/form-data'}}) }

// 访客列表
export const listVisitor = (data) => { return service({method: 'post', url: '/user/listVisitor', data, headers: {'Content-Type': 'multipart/form-data'}}) }
// 添加访客
export const addVisitor = (data) => { return service({method: 'post', url: '/user/addVisitor', data, headers: {'Content-Type': 'application/json'}}) }
// 删除访客
export const deleteVisitor = (data) => { return service({method: 'post', url: '/user/deleteVisitor', data, headers: {'Content-Type': 'multipart/form-data'}}) }
// 修改访客
export const modifyVisitor = (data) => { return service({method: 'post', url: '/user/modifyVisitor', data, headers: {'Content-Type': 'application/json'}}) }
// 获取指定访客表单项
export const getVisitorById = (data) => { return service({method: 'post', url: '/user/getVisitorById', data, headers: {'Content-Type': 'application/json'}}) }
// 批量删除访客
export const deleteVisitorBatch = (data) => { return service({method: 'post', url: '/user/deleteVisitorBatch', data, headers: {'Content-Type': 'multipart/form-data'}}) }

// 黄名单列表
export const listBlack = (data) => { return service({method: 'post', url: '/user/listBlack', data, headers: {'Content-Type': 'multipart/form-data'}}) }
// 添加黄名单
export const addBlack = (data) => { return service({method: 'post', url: '/user/addBlack', data, headers: {'Content-Type': 'application/json'}}) }
// 删除黄名单
export const deleteBlack = (data) => { return service({method: 'post', url: '/user/deleteBlack', data, headers: {'Content-Type': 'multipart/form-data'}}) }
// 修改黄名单
export const modifyBlack = (data) => { return service({method: 'post', url: '/user/modifyBlack', data, headers: {'Content-Type': 'application/json'}}) }
// 获取指定黑名单增改表单项、包含值
export const getBlackById = (data) => { return service({method: 'post', url: '/user/getBlackById', data, headers: {'Content-Type': 'multipart/form-data'}}) }

// 上传图片
export const imgUpload = (data) => { return service({method: 'post', url: '/upload/imgUpload', data, headers: {'Content-Type': 'multipart/form-data'}}) }

/**
 * 记录管理
 */
// 记录管理列表
export const listUserRecord = (data) => { return service({method: 'post', url: '/record/listUserRecord', data, headers: {'Content-Type': 'application/json'}}) }
// 导出记录列表
export const dataExport = (data) => { return downloadService({method: 'post', responseType: 'blob', url: '/record/dataExport', data, headers: {'Content-Type': 'application/json'}}) }
// 陌生人警告
export const strangerCount = (data) => { return service({method: 'post', url: '/record/strangerCount', data, headers: {'Content-Type': 'multipart/form-data'}}) }
// 黄名单警告
export const blackCount = (data) => { return service({method: 'post', url: '/record/blackCount', data, headers: {'Content-Type': 'multipart/form-data'}}) }

// 业务地点下拉列表
export const businessPosition = (data) => { return service({method: 'post', url: '/record/businessPosition', data, headers: {'Content-Type': 'multipart/form-data'}}) }
/**
 * 门禁业务
 */
// 门禁管理
export const listAccessBusiness = (data) => { return service({method: 'post', url: '/accessBusiness/listAccessBusiness', data, headers: {'Content-Type': 'multipart/form-data'}}) }
// 门禁管理
export const toAddAccessBusiness = (data) => { return service({method: 'post', url: '/accessBusiness/toAddAccessBusiness', data, headers: {'Content-Type': 'multipart/form-data'}}) }
// 新增门禁
export const addAccessBusiness = (data) => { return service({method: 'post', url: '/accessBusiness/addAccessBusiness', data, headers: {'Content-Type': 'application/json'}}) }
// 修改门禁
export const toUpdateAccessBusiness = (data) => { return service({method: 'post', url: '/accessBusiness/toUpdateAccessBusiness', data, headers: {'Content-Type': 'multipart/form-data'}}) }
// 提交修改门禁
export const updateAccessBusiness = (data) => { return service({method: 'post', url: '/accessBusiness/updateAccessBusiness', data, headers: {'Content-Type': 'application/json'}}) }
// 删除门禁
export const deleteAccessBusiness = (data) => { return service({method: 'post', url: '/accessBusiness/deleteAccessBusiness', data, headers: {'Content-Type': 'multipart/form-data'}}) }
// 屏幕配置
export const toShowScreenConfig = (data) => { return service({method: 'post', url: '/scree/toShowScreenConfig', data, headers: {'Content-Type': 'application/json'}}) }
// 屏幕配置保存
export const saveScreenConfig = (data) => { return service({method: 'post', url: '/scree/saveScreenConfig', data, headers: {'Content-Type': 'application/json'}}) }
/**
 * 门禁规则
 */
// 列表查询
export const listRule = (data) => { return service({method: 'post', url: '/rule/listRule', data, headers: {'Content-Type': 'multipart/form-data'}}) }
// 删除列表
export const deleteRule = (data) => { return service({method: 'post', url: '/rule/deleteRule', data, headers: {'Content-Type': 'multipart/form-data'}}) }
// 添加规则
export const addRule = (data) => { return service({method: 'post', url: '/rule/addRule', data, headers: {'Content-Type': 'application/json'}}) }
// 修改规则
export const toUpdateRule = (data) => { return service({method: 'post', url: '/rule/toUpdateRule', data, headers: {'Content-Type': 'multipart/form-data'}}) }
// 提交修改
export const updateRule = (data) => { return service({method: 'post', url: '/rule/updateRule', data, headers: {'Content-Type': 'application/json'}}) }

/**
 * 迎宾
 */
// 迎宾列表
export const listGreetingBusiness = (data) => { return service({method: 'post', url: '/greeting/listGreetingBusiness', data, headers: {'Content-Type': 'multipart/form-data'}}) }
// 添加迎宾
export const addGreetingBusiness = (data) => { return service({method: 'post', url: '/greeting/addGreetingBusiness', data, headers: {'Content-Type': 'application/json'}}) }
// 删除迎宾
export const deleteGreetingBusiness = (data) => { return service({method: 'post', url: '/greeting/deleteGreetingBusiness', data, headers: {'Content-Type': 'multipart/form-data'}}) }
// 修改迎宾
export const updateGreetingBusiness = (data) => { return service({method: 'post', url: '/greeting/updateGreetingBusiness', data, headers: {'Content-Type': 'application/json'}}) }
// 跳转新增迎宾信息
export const toAddGreetingBusiness = () => { return service({method: 'post', url: '/greeting/toAddGreetingBusiness', headers: {'Content-Type': 'multipart/form-data'}}) }
// 跳转编辑迎宾信息
export const toUpdateGreetingBusiness = (data) => { return service({method: 'post', url: '/greeting/toUpdateGreetingBusiness', data, headers: {'Content-Type': 'multipart/form-data'}}) }
// 首页
export const getTodayLog = (data) => { return service({method: 'post', url: '/main/todayLogCount', data, headers: {'Content-Type': 'application/json'}}) }

// 下载模板-人员管理
export const downloadTemplate = (data) => { return downloadService({method: 'post', responseType: 'blob', url: '/excle/download', data, headers: {'Content-Type': 'application/json'}}) }
// 导出-人员管理
export const excelExport = (data) => { return downloadService({method: 'post', responseType: 'blob', url: '/excle/export', data, headers: {'Content-Type': 'application/json'}}) }
// 获取服务器时间
export const getTime = (data) => { return service({method: 'post', url: '/time/getTime', data, headers: {'Content-Type': 'multipart/form-data'}}) }

/**
 *
 * logo配置
 */
// logo切换身份认证
export const loginLogo = (data) => { return service({method: 'post', url: '/logo/loginLogo', data, headers: {'Content-Type': 'multipart/form-data'}}) }
// logo设置
export const saveSysLogoRecord = (data) => { return service({method: 'post', url: '/logo/saveSysLogoRecord', data, headers: {'Content-Type': 'application/json'}}) }
// GET LOGO
export const getSysLogoInfo = (data) => { return service({method: 'post', url: '/logo/getSysLogoInfo', data, headers: {'Content-Type': 'application/json'}}) }

/**
 *
 * 考勤业务
 */
// 考勤规则
export const attendanceRuleInfo = (data) => { return service({method: 'post', url: '/atRule/attendanceRuleInfo', data, headers: {'Content-Type': 'application/json'}}) }
export const saveAttendanceRule = (data) => { return service({method: 'post', url: '/atRule/saveAttendanceRule', data, headers: {'Content-Type': 'application/json'}}) }
// 考勤统计
export const getAttendanceNameList = (data) => { return service({method: 'post', url: '/attendance/attendanceNameList', data, headers: {'Content-Type': 'application/json'}}) }
export const getAttendanceDealList = (data) => { return service({method: 'post', url: '/attendanceDeal/attendanceDealList', data, headers: {'Content-Type': 'multipart/form-data'}}) }
export const excelAttendance = (data) => { return downloadService({method: 'post', responseType: 'blob', url: '/attendanceDeal/attendanceDealExport', data, headers: {'Content-Type': 'application/json'}}) }
export const attendanceDetails = (data) => { return service({method: 'post', url: '/attendanceDeal/attendanceDealDetails', data, headers: {'Content-Type': 'multipart/form-data'}}) }
export const detailsExport = (data) => { return downloadService({method: 'post', responseType: 'blob', url: '/attendanceDeal/detailsExport', data, headers: {'Content-Type': 'multipart/form-data'}}) }
// 考勤管理
export const listAttendance = (data) => { return service({method: 'post', url: '/attendance/listAttendance', data, headers: {'Content-Type': 'multipart/form-data'}}) }
export const toAddAttendance = (data) => { return service({method: 'post', url: '/attendance/toAddAttendance', data, headers: {'Content-Type': 'multipart/form-data'}}) }
export const addAttendance = (data) => { return service({method: 'post', url: '/attendance/addAttendance', data, headers: {'Content-Type': 'application/json'}}) }
export const deleteAttendance = (data) => { return service({method: 'post', url: '/attendance/deleteAttendance', data, headers: {'Content-Type': 'multipart/form-data'}}) }
export const toUpdateAttendance = (data) => { return service({method: 'post', url: '/attendance/toUpdateAttendance', data, headers: {'Content-Type': 'multipart/form-data'}}) }
export const updateAttendance = (data) => { return service({method: 'post', url: '/attendance/updateAttendance', data, headers: {'Content-Type': 'application/json'}}) }
// 考勤记录
export const listAttendanceRecord = (data) => { return service({method: 'post', url: '/attendanceRecord/listAttendance', data, headers: {'Content-Type': 'application/json'}}) }
export const recordExport = (data) => { return downloadService({method: 'post', responseType: 'blob', url: '/attendanceRecord/recordExport', data, headers: {'Content-Type': 'application/json'}}) }
// 业务名称
export const businessNameList = (data) => { return service({method: 'post', url: '/attendanceRecord/businessNameList', data, headers: {'Content-Type': 'multipart/form-data'}}) }
// 安装位置
export const addressList = (data) => { return service({method: 'post', url: '/attendanceRecord/addressList', data, headers: {'Content-Type': 'multipart/form-data'}}) }

/**
 * 升级管理
 */
// 列表查询
export const listSysSoftware = (data) => { return service({method: 'post', url: '/software/listSysSoftware', data, headers: {'Content-Type': 'multipart/form-data'}}) }
// 上传文件
export const appUpload = (data) => { return service({method: 'post', url: '/software/appUpload', data, headers: {'Content-Type': 'multipart/form-data'}}) }
// 添加信息
export const addSoftware = (data) => { return service({method: 'post', url: '/software/addSoftware', data, headers: {'Content-Type': 'application/json'}}) }
// 删除APP
export const deleteSoftware = (data) => { return service({method: 'post', url: '/software/deleteSoftware', data, headers: {'Content-Type': 'multipart/form-data'}}) }
// 客户端更新记录
export const listSysSoftwareRecord = (data) => { return service({method: 'post', url: '/software/listSysSoftwareRecord', data, headers: {'Content-Type': 'multipart/form-data'}}) }
// 返显信息
export const toUpdateSoftware = (data) => { return service({method: 'post', url: '/software/toUpdateSoftware', data, headers: {'Content-Type': 'multipart/form-data'}}) }
// 编辑信息
export const updateSoftware = (data) => { return service({method: 'post', url: '/software/updateSoftware', data, headers: {'Content-Type': 'application/json'}}) }

// 获取摄像头
export const getCameraList = (data) => { return service({method: 'post', url: '/business/getCameraList', data, headers: {'Content-Type': 'multipart/form-data'}}) }
/**

 * 远程控制
 */
// 是否开启远程
export const remoteStatus = () => { return downloadService({method: 'post', url: '/support/status', headers: {'Content-Type': 'multipart/form-data'}}) }
// 网络检查
export const netCheck = (data) => { return downloadService({method: 'post', url: '/support/check', data, headers: {'Content-Type': 'multipart/form-data'}}) }
// 开启、关闭远程
export const remoteOpen = (data) => { return downloadService({method: 'post', url: '/support/open', data, headers: {'Content-Type': 'multipart/form-data'}}) }
/**
 * 签到设备
 */
// 会议业务列表
export const listMeetingBusiness = (data) => { return service({method: 'post', url: '/meeting/listMeetingBusiness', data, headers: {'Content-Type': 'multipart/form-data'}}) }
// 新增业务
export const addMeetingBusiness = (data) => { return service({method: 'post', url: '/meeting/addMeetingBusiness', data, headers: {'Content-Type': 'application/json'}}) }
// 新增业务回显
export const toAddMeetingBusiness = (data) => { return service({method: 'post', url: '/meeting/toAddMeetingBusiness', data, headers: {'Content-Type': 'multipart/form-data'}}) }
// 删除业务
export const deleteMeetingBusiness = (data) => { return service({method: 'post', url: '/meeting/deleteMeetingBusiness', data, headers: {'Content-Type': 'multipart/form-data'}}) }
// 编辑业务回显
export const toUpdateMeetingBusiness = (data) => { return service({method: 'post', url: '/meeting/toUpdateMeetingBusiness', data, headers: {'Content-Type': 'multipart/form-data'}}) }
// 编辑业务
export const updateMeetingBusiness = (data) => { return service({method: 'post', url: '/meeting/updateMeetingBusiness', data, headers: {'Content-Type': 'application/json'}}) }
/**
 * 会议管理
 */
// 会议管理列表
export const listMeetingRoom = (data) => { return service({method: 'post', url: '/room/listMeetingRoom', data, headers: {'Content-Type': 'multipart/form-data'}}) }
// 新增会议回显
export const toAddMeetingRoom = (data) => { return service({method: 'post', url: '/room/toAddMeetingRoom', data, headers: {'Content-Type': 'multipart/form-data'}}) }

// 删除会议
export const deleteMeetingRoom = (data) => { return service({method: 'post', url: '/room/deleteMeetingRoom', data, headers: {'Content-Type': 'multipart/form-data'}}) }
// 新增会议
export const addMeetingRoom = (data) => { return service({method: 'post', url: '/room/addMeetingRoom', data, headers: {'Content-Type': 'application/json'}}) }
// 编辑会议回显
export const toUpdateMeetingRoom = (data) => { return service({method: 'post', url: '/room/toUpdateMeetingRoom', data, headers: {'Content-Type': 'multipart/form-data'}}) }
// 编辑会议
export const updateMeetingBusinessRoom = (data) => { return service({method: 'post', url: '/room/updateMeetingBusiness', data, headers: {'Content-Type': 'application/json'}}) }
/* 会议管理-会议预约 */
// 会议预约列表
export const listMeetingAppointment = (data) => {
  return service({
    method: 'post',
    url: '/appointment/listMeetingAppointment',
    data,
    headers: {'Content-Type': 'multipart/form-data'}
  })
}
// 手工签到
export const signByHand = (data) => { return service({method: 'post', url: '/appointment/signByHand', data, headers: {'Content-Type': 'multipart/form-data'}}) }

// 新增会议预约回显
export const toAddMeetingAppointment = (data) => { return service({method: 'post', url: '/appointment/toAddMeetingAppointment', data, headers: {'Content-Type': 'multipart/form-data'}}) }
// 新增会议预约
export const addMeetingAppointment = (data) => { return service({method: 'post', url: '/appointment/addMeetingAppointment', data, headers: {'Content-Type': 'application/json'}}) }
// 编辑会议预约回显
export const toUpdateMeetingAppointment = (data) => { return service({method: 'post', url: '/appointment/toUpdateMeetingAppointment', data, headers: {'Content-Type': 'multipart/form-data'}}) }
// 编辑会议预约
export const updateMeetingAppointment = (data) => { return service({method: 'post', url: '/appointment/updateMeetingAppointment', data, headers: {'Content-Type': 'application/json'}}) }
// 预约详情
export const detailsMeetingAppointment = (data) => { return service({method: 'post', url: '/appointment/detailsMeetingAppointment', data, headers: {'Content-Type': 'multipart/form-data'}}) }
// 预约删除
export const deleteMeetingAppointment = (data) => { return service({method: 'post', url: '/appointment/deleteMeetingAppointment', data, headers: {'Content-Type': 'multipart/form-data'}}) }
// 预约导出
export const detailsMeetingExport = (data) => { return downloadService({method: 'post', responseType: 'blob', url: '/appointment/detailsMeetingExport', data, headers: {'Content-Type': 'multipart/form-data'}}) }
// 会议预约-签到记录列表
export const meetingRecordByUserId = (data) => {
  return service({
    method: 'post',
    url: '/appointment/meetingRecordByUserId',
    data,
    headers: {'Content-Type': 'multipart/form-data'}
  })
}

// 获取系统版本
export const sysVersion = () => { return service({method: 'post', url: '/upgrade/sysVersion', headers: {'Content-Type': 'multipart/form-data'}}) }
// 系统版本更新检查
export const verCheck = () => { return service({method: 'post', url: '/upgrade/check', headers: {'Content-Type': 'multipart/form-data'}}) }
// 系统版本下载
export const verDownload = (data) => { return downloadService({method: 'post', url: '/upgrade/download', data, headers: {'Content-Type': 'multipart/form-data'}}) }
// 系统版本升级
export const verUpgrade = (data) => { return service({method: 'post', url: '/upgrade/upgrade', data, headers: {'Content-Type': 'multipart/form-data'}}) }

// 获取客户授权信息
export const getAuth = () => { return service({method: 'post', url: '/systeminfo/client', headers: {'Content-Type': 'multipart/form-data'}}) }

// 客户授权
export const setAuth = (data) => { return service({method: 'post', url: '/systeminfo/auth', data, headers: {'Content-Type': 'multipart/form-data'}}) }
