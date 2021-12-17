import request from '@/utils/productionRequest'
import {getEquipmentUrl} from '@/utils/station'

// 列表数据
export function list(params) {
  return request({
    url: getEquipmentUrl() + '/api/data/ajaxList',
    method: 'get',
    params: params
  })
}

//项目列表
export function projectList(params) {
  return request({
    url: getEquipmentUrl() + '/api/data/scProjectList',
    method: 'get',
    params: params
  })
}

//配比编号
export function pBHByDate(params) {
  return request({
    url: getEquipmentUrl() + '/api/data/ajaxGetPBHByDate',
    method: 'get',
    params: params
  })
}

// 列表数据
export function modelList(params) {
  return request({
    url: 'https://test.zgdrkj.cn:8686/prod-api/push/qualityParameters/list',
    method: 'get',
    params: params
  })
}
