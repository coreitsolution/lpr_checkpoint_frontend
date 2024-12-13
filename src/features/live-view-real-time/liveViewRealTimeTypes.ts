import { BenefitInformation, DirectionDetail, MapPosition, OwnerInformation, VehicleViewModel } from "../api/types"
import { Agencies } from "../dropdown/dropdownTypes";

export interface LastRecognitionResult {
  id: number
  cameraName: string
  plate: string
  registration_type: string
  location: string
  pathImage: string
  pathImageVehicle: string
  directionString: string
  brand: string
  model: string
  color: string
  directionDetail: DirectionDetail[]
  periodTime: string
  map: MapPosition[]
  vehicle: VehicleViewModel
  agency: Agencies
  ownerPerson: OwnerInformation
  benefitPerson: BenefitInformation
}

export interface VehicleCountResult {
  id: number
  startTime: string
  endTime: string
  vehicle: number
  watchOutVehicle: number
  summary: number
}

export interface ConnectionResult {
  id: number
  sendingTime: string
  ipServer: string
  port: number
  host: number
  sendCompleted: number
  pending: number
  status: number
}

export interface SystemStatusResult {
  id: number
  time: string
  message: string
}