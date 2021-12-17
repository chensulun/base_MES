import request from '@/utils/productionRequest'
import { getEquipmentUrl } from '@/utils/station'

// 列表数据
export function list(params) {
  return request({
    url: getEquipmentUrl() + '/api/data/ajaxHSL',
    method: 'get',
    params: params
  })
}

// ***数据
export function projectList(params) {
  return request({
    url:  getEquipmentUrl() + '/api/data/getHslProject',
    method: 'get',
    params: params
  })
}

// 配比数据
export function PBList(params) {
  return request({
    url: getEquipmentUrl() + '/api/data/ajaxGetWLByDate',
    method: 'get',
    params: params
  })
}
