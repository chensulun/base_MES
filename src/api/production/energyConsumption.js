import request from '@/utils/productionRequest'
import {getEquipmentUrl} from '@/utils/station'

// 获取能源数据
export function getEntry(params) {
  return request({
    url: getEquipmentUrl() + '/api/data/getEntry',
    method: 'get',
    params: params
  })
}
