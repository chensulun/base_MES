import request from '@/utils/productionRequest'
import {getEquipmentUrl} from '@/utils/station'

// 列表数据
export function list(params) {
  return request({
    url: getEquipmentUrl()+'/api/data/ajaxGetAllDistance',
    method: 'get',
    params: params
  })
}

// 项目数据
export function projectList(params) {
  return request({
    url: getEquipmentUrl()+'/api/data/ajaxGetProject',
    method: 'get',
    params: params
  })
}

// 车牌数据
export function locationList(params) {
  return request({
    url: getEquipmentUrl()+'/api/location/ajaxGet',
    method: 'get',
    params: params
  })
}

