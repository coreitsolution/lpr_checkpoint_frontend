import * as React from "react";
import Button from "@mui/material/Button";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { SelectChangeEvent } from "@mui/material/Select";
import Map from "../../../../components/map/map";
import DOTInform from "../dot-inform/DotInform";
import { Typography } from "@mui/material";
import { SearchResult } from "../../../../features/api/types";

interface LocationDialog {
  open: boolean;
  close: () => void;
  compareData: SearchResult[];
  data?: SearchResult;
  isCompare: boolean;
  closeText?:string;
  closeButtonCss?:string;
}

export default function LocationDetailDialog({
  data,
  compareData,
  open,
  close,
  isCompare = false,
  closeText,
  closeButtonCss,
}: LocationDialog) {
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState<DialogProps["maxWidth"]>("sm");

  const vehicleInfo = {
    pathImage: data?.vehicle.imgPlate || "",
    pathImageVehicle: data?.vehicle.imgCar || "",
    plateId: data?.vehicle.plate || "",
    brand: data?.vehicle.brand || "",
    color: data?.vehicle.color || "",
    model: data?.vehicle.model || "",
    type: data?.vehicle.type || "",
    ownerName: data?.ownerPerson.name || "",
    ownerNationNumber: data?.ownerPerson.nationNumber || "",
    ownerAddress: data?.ownerPerson.address || "",
    rightsHolderName: data?.ownerPerson.name || "",
    rightsHolderIdNumber: data?.ownerPerson.nationNumber || "",
    rightsHolderAddress: data?.ownerPerson.address || "",
  }

  const handleMaxWidthChange = (event: SelectChangeEvent<typeof maxWidth>) => {
    setMaxWidth(event.target.value as DialogProps["maxWidth"]);
  };

  const handleFullWidthChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFullWidth(event.target.checked);
  };

  const handleClose = () => {
    close();
  };

  return (
    <Dialog
      fullWidth={fullWidth}
      maxWidth={"xl"}
      open={open}
      onClose={handleClose} // Use the `close` function from props
    >
      <div style={{ backgroundColor: "black", color: "white" }}>
        <DialogTitle>
          <Typography variant="h6">แผนที่เส้นทาง</Typography>
          <div className="flex items-center">
            <div className="w-1/4">
              <p
                style={{
                  color: "rgba(159, 12, 12, 1)",
                  display: "flex",
                  alignItems: "center",
                  fontWeight: "bold",
                  fontSize: "14px",
                }}
              >
                <svg
                  width="17"
                  height="15"
                  viewBox="0 0 17 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16.54 13.1488L9.88259 0.95806C9.41072 0.0937326 8.15368 0.0937326 7.68142 0.95806L1.02439 13.1488C0.921931 13.3364 0.870564 13.547 0.8753 13.7601C0.880037 13.9731 0.940714 14.1814 1.05141 14.3644C1.16211 14.5474 1.31904 14.699 1.50689 14.8044C1.69474 14.9098 1.90709 14.9653 2.12321 14.9656H15.4392C15.6555 14.9657 15.8681 14.9103 16.0562 14.8051C16.2444 14.6999 16.4016 14.5483 16.5125 14.3652C16.6234 14.1821 16.6843 13.9738 16.6891 13.7606C16.6939 13.5474 16.6425 13.3366 16.54 13.1488ZM8.7822 13.0783C8.62768 13.0783 8.47664 13.0331 8.34816 12.9485C8.21968 12.8638 8.11955 12.7435 8.06042 12.6027C8.00129 12.462 7.98582 12.3071 8.01596 12.1577C8.04611 12.0082 8.12051 11.871 8.22977 11.7632C8.33903 11.6555 8.47824 11.5821 8.62978 11.5524C8.78133 11.5227 8.93842 11.5379 9.08117 11.5962C9.22392 11.6545 9.34594 11.7533 9.43178 11.88C9.51763 12.0066 9.56345 12.1556 9.56345 12.3079C9.56345 12.5122 9.48114 12.7082 9.33463 12.8527C9.18811 12.9971 8.9894 13.0783 8.7822 13.0783ZM9.63064 5.33054L9.40642 10.0296C9.40642 10.1931 9.34057 10.3498 9.22336 10.4654C9.10615 10.581 8.94718 10.6459 8.78142 10.6459C8.61566 10.6459 8.45669 10.581 8.33948 10.4654C8.22227 10.3498 8.15642 10.1931 8.15642 10.0296L7.9322 5.33246C7.92716 5.22022 7.94509 5.10813 7.98492 5.00286C8.02475 4.8976 8.08567 4.80132 8.16404 4.71976C8.24242 4.63821 8.33664 4.57304 8.4411 4.52816C8.54555 4.48328 8.6581 4.45959 8.77204 4.45851H8.78025C8.89496 4.45845 9.0085 4.48131 9.11401 4.52571C9.21952 4.57011 9.31481 4.63512 9.39414 4.71683C9.47346 4.79854 9.53518 4.89525 9.57555 5.00113C9.61593 5.107 9.63414 5.21985 9.62907 5.33285L9.63064 5.33054Z"
                    fill="#DFB23E"
                  />
                </svg>
                ห้ามนำข้อมูลเเละรูปภาพ
                <svg
                  width="17"
                  height="15"
                  viewBox="0 0 17 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16.54 13.1488L9.88259 0.95806C9.41072 0.0937326 8.15368 0.0937326 7.68142 0.95806L1.02439 13.1488C0.921931 13.3364 0.870564 13.547 0.8753 13.7601C0.880037 13.9731 0.940714 14.1814 1.05141 14.3644C1.16211 14.5474 1.31904 14.699 1.50689 14.8044C1.69474 14.9098 1.90709 14.9653 2.12321 14.9656H15.4392C15.6555 14.9657 15.8681 14.9103 16.0562 14.8051C16.2444 14.6999 16.4016 14.5483 16.5125 14.3652C16.6234 14.1821 16.6843 13.9738 16.6891 13.7606C16.6939 13.5474 16.6425 13.3366 16.54 13.1488ZM8.7822 13.0783C8.62768 13.0783 8.47664 13.0331 8.34816 12.9485C8.21968 12.8638 8.11955 12.7435 8.06042 12.6027C8.00129 12.462 7.98582 12.3071 8.01596 12.1577C8.04611 12.0082 8.12051 11.871 8.22977 11.7632C8.33903 11.6555 8.47824 11.5821 8.62978 11.5524C8.78133 11.5227 8.93842 11.5379 9.08117 11.5962C9.22392 11.6545 9.34594 11.7533 9.43178 11.88C9.51763 12.0066 9.56345 12.1556 9.56345 12.3079C9.56345 12.5122 9.48114 12.7082 9.33463 12.8527C9.18811 12.9971 8.9894 13.0783 8.7822 13.0783ZM9.63064 5.33054L9.40642 10.0296C9.40642 10.1931 9.34057 10.3498 9.22336 10.4654C9.10615 10.581 8.94718 10.6459 8.78142 10.6459C8.61566 10.6459 8.45669 10.581 8.33948 10.4654C8.22227 10.3498 8.15642 10.1931 8.15642 10.0296L7.9322 5.33246C7.92716 5.22022 7.94509 5.10813 7.98492 5.00286C8.02475 4.8976 8.08567 4.80132 8.16404 4.71976C8.24242 4.63821 8.33664 4.57304 8.4411 4.52816C8.54555 4.48328 8.6581 4.45959 8.77204 4.45851H8.78025C8.89496 4.45845 9.0085 4.48131 9.11401 4.52571C9.21952 4.57011 9.31481 4.63512 9.39414 4.71683C9.47346 4.79854 9.53518 4.89525 9.57555 5.00113C9.61593 5.107 9.63414 5.21985 9.62907 5.33285L9.63064 5.33054Z"
                    fill="#DFB23E"
                  />
                </svg>
              </p>
            </div>
            <div className="">
              <p style={{ fontSize: "12px", lineHeight: "1.5" }}>
                ภายในเว็บไซต์ Thailpr ไปเผยแพร่
                เนื่องจากเป็นข้อมูลความลับของทางราชการ
                ไม่อนุญาตให้นำข้อมูลดังกล่าวไปเผยแพร่ในทุกช่องทาง
                ก่อนได้รับอนุญาต
              </p>
              <p style={{ fontSize: "12px", lineHeight: "1.5" }}>
                *<u>หากผู้ใดนำข้อมูลไปเผยแพร่และก่อให้เกิดความเสียหาย</u>*
                แก่ทางราชการหรือก่อให้เกิดความเสียหายกับบุคคลอื่น
                อาจเข้าข่ายเป็นความผิดตาม พ.ร.บ.คอมพิวเตอร์
                เจ้าของรหัสจะถูกตัดสิทธิ์การใช้งานระบบ LPR
                และถูกดำเนินการทางวินัย *
              </p>
            </div>
          </div>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <div className="flex flex-2">
              <div
                className="flex-initial w-[90%]"
                style={{
                  height: "800px",
                  margin: "-24px",
                  position: "relative",
                }}
              >
                <Map
                  coordinates={data?.map}
                  compareCoordinates={compareData.map((x) => x.map)}
                  isCompare={isCompare}
                  height={"100%"}
                  width="95%"
                />
              </div>
              <div className="flex-initial w-full">
                <div className="title-header">
                  <p
                    style={{
                      color: "white",
                      fontSize: "16px",
                      padding: "10px",
                    }}
                  >
                    เส้นทางเดินรถ
                  </p>
                </div>

                {isCompare ? (
                  <>
                    {compareData.map((x, index) => (
                      <div className="flex flex-col">
                        <div
                          className="flex p-2"
                          style={{ backgroundColor: "rgba(72, 73, 75, 1)" }}
                        >
                          <img
                            width={20}
                            height={20}
                            src="/icons/car-front.png"
                            alt="car"
                          />
                          <p
                            className="ml-2"
                            style={{ color: "white", fontWeight: "bolder" }}
                          >
                            รถคันที่ {index + 1}
                          </p>
                        </div>
                        <div className="flex ">
                          <div className="flex w-2/3">
                            <div>
                              <DOTInform
                                key={index} // Adding a unique key for each item
                                vehicle={{
                                  pathImageVehicle: x.pathImageVehicle,
                                  pathImage: x.pathImage,
                                  plateId: x.plate,
                                  brand: "Honda",
                                  color: "White",
                                  model: "City RS",
                                  type: "รถยนต์นั่งส่วนบุคคลไม่เกิน 7 คน",
                                }}
                                owner={{
                                  name: "นายอนุวัฒน์ เสถียรพิศุทธิ์",
                                  idNumber: "3456799876145",
                                  address:
                                    "22/78 ซ.พัฒนาการ32 ถ.พัฒนาการ แขวงพัฒนาการ เขตสวนหลวง กรุงเทพมหานคร",
                                }}
                                rightsHolder={{
                                  name: "นายอนุวัฒน์ เสถียรพิศุทธิ์",
                                  idNumber: "3456799876145",
                                  address:
                                    "22/78 ซ.พัฒนาการ32 ถ.พัฒนาการ แขวงพัฒนาการ เขตสวนหลวง กรุงเทพมหานคร",
                                }}
                              />
                            </div>
                          </div>
                          <div className="flex w-1/2">
                            <div>
                              <div className="flex my-2">
                                <img
                                  width={20}
                                  height={20}
                                  src="/icons/detail.png"
                                  alt="car"
                                />
                                <p
                                  className="ms-2"
                                  style={{
                                    fontWeight: "bolder",
                                    color: "white",
                                  }}
                                >
                                  ลำดับการเดินทางผ่านจุดตรวจ/ด่านตรวจ
                                </p>
                              </div>

                              <div className="flex">
                                <div className="w-2/3 font-semibold bg-table-title p-1">
                                  ด่านตรวจ/จุดตรวจ
                                </div>
                                <div className="w-1/3 bg-table-title p-1">
                                  เวลา
                                </div>
                              </div>
                              {x?.directionDetail?.map((item, index) => (
                                <div className="flex" key={index}>
                                  <div className="w-2/3 font-semibold bg-title p-1">
                                    {item.direction}
                                  </div>
                                  <div className="w-1/3 bg-content p-1">
                                    {item.dateTime}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    <DOTInform
                      vehicle={{
                        pathImageVehicle: vehicleInfo.pathImageVehicle,
                        pathImage: vehicleInfo.pathImage,
                        plateId: vehicleInfo.plateId,
                        brand: vehicleInfo.brand,
                        color: vehicleInfo.color,
                        model: vehicleInfo.model,
                        type: vehicleInfo.type,
                      }}
                      owner={{
                        name: vehicleInfo.ownerName,
                        idNumber: vehicleInfo.ownerNationNumber,
                        address: vehicleInfo.ownerAddress,
                      }}
                      rightsHolder={{
                        name: vehicleInfo.rightsHolderName,
                        idNumber: vehicleInfo.rightsHolderIdNumber,
                        address: vehicleInfo.rightsHolderAddress,
                      }}
                    />
                  </>
                )}
              </div>
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button className={ closeButtonCss ? closeButtonCss : "primary-btn"} onClick={handleClose}>{ closeText ? closeText : "Close"}</Button>
        </DialogActions>
      </div>
    </Dialog>
  );
}
