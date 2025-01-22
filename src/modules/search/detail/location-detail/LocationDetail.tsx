import { useEffect, useState } from "react"
import Map from "../../../../components/map/map";
import DOTInform from "../dot-inform/DotInform";
import {
  DialogTitle
} from "@mui/material"

// Types
import { LastRecognitionData } from "../../../../features/live-view-real-time/liveViewRealTimeTypes";

// Utils
import { reformatString } from "../../../../utils/comonFunction"

// Config
import { FILE_URL } from '../../../../config/apiConfig'

// Component
import Loading from "../../../../components/loading/Loading"

interface LocationDialog {
  close: () => void;
  detailData: LastRecognitionData | null;
  isCompare: boolean,
}

export default function LocationDetailDialog({
  detailData,
  close,
  isCompare = false,
}: LocationDialog) {
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 500)
  }, [])

  return (
    <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-black bg-opacity-25 backdrop-blur-sm ">
      {isLoading && <Loading />}
      <div 
        className="bg-black 
        w-[90vw] h-[95vh] overflow-y-auto flex flex-col"
      >
        <DialogTitle className={`text-[25px] p-[20px]`}>
          <span className='text-white ml-[15px]'>แผนที่เส้นทาง</span>
        </DialogTitle>
        
        <div className="flex flex-col">
          <div className="h-[80vh] mx-8">
            <div className="h-full">
              { 
                detailData &&  
                  (
                    <div className={`grid grid-cols-[40%_1fr] w-full h-full`}>
                      <div className="border-[1px] border-charade">
                        <div
                          className={`flex flex-col w-full h-full mt-[-20px] relative `}
                        >
                          <Map
                            coordinates={detailData.map}
                            isCompare={isCompare}
                            height="79.5vh"
                          />
                        </div>
                      </div>
                      <div className="border-l-[3px] border-y-[1px] border-r-[1px] border-charade">
                        <div className="flex flex-col mt-[-1px] h-[79.5vh] overflow-y-auto">
                          <div className="flex title-header">
                            <p
                              style={{
                                color: "white",
                                fontSize: "16px",
                                padding: "10px",
                              }}
                            >
                              รายละเอียด
                            </p>
                          </div>

                          <div className="flex flex-col">
                            <div
                              className="flex p-2 bg-tuna"
                            >
                              <img
                                width={20}
                                height={20}
                                src="/icons/car-front.png"
                                alt="car"
                              />
                              <p
                                className="ml-2"
                                style={{ color: "white", fontWeight: "bolder", fontSize: "14px" }}
                              >
                                ข้อมูลรถ
                              </p>
                            </div>
                            <div className="flex flex-col w-full">
                              <div className="flex w-full">
                                <div className="w-full">
                                  <DOTInform
                                    vehicle={{
                                      vehicleImage: `${FILE_URL}${detailData.vehicle_image}`,
                                      pathImage: `${FILE_URL}${detailData.plate_image}`,
                                      plateId: `${detailData.plate} ${detailData.region_info ? detailData.region_info.name_th : ""}`,
                                      brand: detailData.vehicle_make_info ? detailData.vehicle_make_info.make_en : reformatString(detailData.vehicle_make),
                                      color: detailData.vehicle_color_info ? detailData.vehicle_color_info.color_th : reformatString(detailData.vehicle_color),
                                      model: detailData.vehicle_model_info ? detailData.vehicle_model_info.model_en : reformatString(detailData.vehicle_make_model),
                                      type: detailData.vehicle_body_type_info ? detailData.vehicle_body_type_info.body_type_th : reformatString(detailData.vehicle_body_type),
                                    }}
                                  />
                                </div>
                              </div>
                              <div className="flex flex-col h-[394px] overflow-y-auto">
                                <div className="flex p-2 bg-tuna">
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
                                      fontSize: "14px",
                                    }}
                                  >
                                    ลำดับการเดินทางผ่านจุดตรวจ/ด่านตรวจ
                                  </p>
                                </div>

                                <div className="flex text-center text-white bg-swamp p-2 text-[14px]">
                                  <div className="w-2/3 font-semibold bg-table-title">
                                    ด่านตรวจ/จุดตรวจ
                                  </div>
                                  <div className="w-1/3 bg-table-title">
                                    เวลา
                                  </div>
                                </div>
                                <div className="text-[14px]">
                                  {
                                    detailData.directionDetail && detailData.directionDetail.map((item, index) => 
                                      (
                                        <div className="flex" key={index}>
                                          <div className="w-2/3 font-semibold bg-title p-1">
                                            {item.direction}
                                          </div>
                                          <div className="w-1/3 bg-content p-1">
                                            {item.dateTime}
                                          </div>
                                        </div>
                                      )
                                    )
                                  }
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                  </div>
                )
              }
            </div>
          </div>
          {/* Footer */}
          <div className='flex justify-end mx-8 mt-5'>
            <button 
              type="button" 
              className="bg-white text-black w-[90px] h-[40px] rounded" 
              onClick={close}
            >
              ยกเลิก
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
