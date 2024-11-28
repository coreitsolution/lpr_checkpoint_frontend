import { BenefitInformation, DirectionDetail, MapPosition, OwnerInformation, VehicleViewModel } from "../api/types";

export interface SearchResult {
  isSelected: boolean;
  id: number;
  plate: string;
  location: string;
  pathImage: string;
  pathImageVehicle: string;
  directionString: string;
  brand: string;
  model: string;
  color: string;
  directionDetail: DirectionDetail[];
  periodTime: string;
  map: MapPosition[];
  vehicle: VehicleViewModel;
  ownerPerson: OwnerInformation;
  benefitPerson: BenefitInformation;
}