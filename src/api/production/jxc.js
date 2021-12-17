import request from '@/utils/productionRequest'
import {getEquipmentUrl} from '@/utils/station'

// 榜单管理
export function list(params) {
  return request({
    url: getEquipmentUrl() + '/api/data/ajaxShipmentList',
    method: 'get',
    params: params
  })
}

// 入库日志
export function ajaxPutLogList(params) {
  return request({
    url: getEquipmentUrl() + '/api/data/ajaxPutLogList',
    method: 'get',
    params: params
  })
}

// 入库日志
export function ckrz(params) {
  return request({
    url: getEquipmentUrl() + '/api/data/ckrz',
    method: 'get',
    params: params
  })
}
// 手动盘存
export function shoudong(params) {
  return request({
    url: getEquipmentUrl() + '/manage/materialTakeInventory/list',
    method: 'get',
    params: params
  })
}



