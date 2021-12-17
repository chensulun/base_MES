import request from '@/utils/productionRequest'
import { getEquipmentUrl } from '@/utils/station'

// 列表数据
export function list(params) {
  return request({
    url: getEquipmentUrl() + '/api/data/ajaxXHL',
    method: 'get',
    params: params
  })
}
