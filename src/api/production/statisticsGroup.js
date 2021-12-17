import request from '@/utils/productionRequest'
import {getEquipmentUrl} from '@/utils/station'

// 列表数据
export function indexData(params) {
  return request({
    url: getEquipmentUrl() + '/api/data/ajaxIndexData',
    method: 'get',
    params: params
  })
}
