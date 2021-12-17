import request from '@/utils/productionRequest'
import {getEquipmentUrl} from '@/utils/station'

// 项目数据
export function projectList(data) {
  return request({
    url: getEquipmentUrl() + '/api/data/ajaxGetProject',
    method: 'get',
    data: data
  })
}

// 定位数据
export function list(params) {
  return request({
    url: getEquipmentUrl() + '/api/location/ajaxGet',
    method: 'get',
    params: params
  })
}


// 绑定项目终点
export function pushProject(data) {
  return request({
    url: getEquipmentUrl() + '/api/data/ajaxPushProject',
    method: 'post',
    data: data
  })
}

