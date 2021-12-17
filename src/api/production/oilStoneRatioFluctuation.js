import request from '@/utils/productionRequest'
import {getEquipmentUrl} from '@/utils/station'

// 列表数据
export function list(params) {
  return request({
    url: getEquipmentUrl() + '/api/data/ajaxGetYSB',
    method: 'get',
    params: params
  })
}

// ***数据
export function batch(params) {
  return request({
    url: getEquipmentUrl() + '/api/data/ajaxGetBatchByDateAndPBH',
    method: 'get',
    params: params
  })
}

// 配比数据
export function PBList(params) {
  return request({
    url: getEquipmentUrl() + '/api/data/ajaxGetPBHByDate',
    method: 'get',
    params: params
  })
}
