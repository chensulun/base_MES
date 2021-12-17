import request from '@/utils/productionRequest'
import {getEquipmentUrl} from '@/utils/station'

// 列表数据
export function list(params) {
  return request({
    url: getEquipmentUrl() + '/api/temperature/out/ajaxList',
    method: 'get',
    params: params
  })
}

// 项目数据
export function projectList(params) {
  return request({
    url: getEquipmentUrl() + '/api/data/scProjectList',
    method: 'get',
    params: params
  })
}

// 配比数据
export function tempPBList(params) {
  return request({
    url: getEquipmentUrl() + '/api/temperature/out/ajaxGetTempPB',
    method: 'get',
    params: params
  })
}

