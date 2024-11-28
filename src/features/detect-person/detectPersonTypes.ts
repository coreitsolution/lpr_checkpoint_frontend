import { DirectionDetail } from "../api/types";
export interface DetectPerson {
  id: number;
  prefix: string;
  fullName: string;
  pathImages: string[];
  accuracy: number;
  directionDetail: DirectionDetail[];
  periodTime: string;
  remark: string;
  firstName: string;
  lastName: string;
  dateTime: string;
  type: string;
  time: string;
}
