import Cookies from 'js-cookie'

const mixingStationKey = 'mixingStation';
const mixingStationIdKey = 'mixingStationId';
const equipmentKey = 'equipment';
const equipmentIdKey = 'equipmentId';
const equipmentUrlKey = 'equipmentUrl';
const equipmentWSKey = 'equipmentWS';
const prIdKey = 'prId';
const peIdKey = 'peId';
const prNameKey = 'prName';

export function getMS() {
  return Cookies.get(mixingStationKey)
}

export function setMS(mixingStation) {
  return Cookies.set(mixingStationKey, mixingStation)
}

export function removeMS() {
  return Cookies.remove(mixingStationKey)
}

export function getMSId() {
  return Cookies.get(mixingStationIdKey)
}

export function setMSId(mixingStationId) {
  return Cookies.set(mixingStationIdKey, mixingStationId)
}

export function removeMSId() {
  return Cookies.remove(mixingStationIdKey)
}

export function getEquipment() {
  return Cookies.get(equipmentKey)
}

export function setEquipment(equipment) {
  return Cookies.set(equipmentKey, equipment)
}

export function removeEquipment() {
  return Cookies.remove(equipmentKey)
}

export function getEquipmentId() {
  return Cookies.get(equipmentIdKey)
}

export function setEquipmentId(equipmentId) {
  return Cookies.set(equipmentIdKey, equipmentId)
}

export function removeEquipmentId() {
  return Cookies.remove(equipmentIdKey)
}

export function getEquipmentUrl() {
  return Cookies.get(equipmentUrlKey)
}

export function setEquipmentUrl(equipmentUrl) {
  return Cookies.set(equipmentUrlKey, equipmentUrl)
}

export function removeEquipmentUrl() {
  return Cookies.remove(equipmentUrlKey)
}

export function getEquipmentWS() {
  return Cookies.get(equipmentWSKey)
}

export function setEquipmentWS(equipmentWS) {
  return Cookies.set(equipmentWSKey, equipmentWS)
}

export function removeEquipmentWS() {
  return Cookies.remove(equipmentWSKey)
}

export function setPrId(prId) {
  return Cookies.set(prIdKey,prId)
}

export function getPrId() {
  return Cookies.get(prIdKey)
}

export function removePrId() {
  return Cookies.remove(prIdKey)
}
export function setPeId(peId) {
  return Cookies.set(peIdKey,peId)
}

export function getPeId() {
  return Cookies.get(peIdKey)
}

export function removePeId() {
  return Cookies.remove(peIdKey)
}
export function setPrName(prName) {
  return Cookies.set(prNameKey,prName)
}

export function getPrName() {
  return Cookies.get(prNameKey)
}

export function removePrName() {
  return Cookies.remove(prNameKey)
}

