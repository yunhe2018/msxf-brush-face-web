import {service} from './dataServiceRequest'

// 服务器地址配置
export const getAddress = () => { return service({method: 'post', url: '/dataService/getAddress'}) }
export const changeAdminIp = (data) => { return service({method: 'post', url: '/dataService/changeAdminIp', data, headers: {'Content-Type': 'multipart/form-data'}}) }
export const changeNetwork = (data) => { return service({method: 'post', url: '/dataService/changeNetwork', data, headers: {'Content-Type': 'multipart/form-data'}}) }
