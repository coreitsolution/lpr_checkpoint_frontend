import { useEffect, useState } from "react"
import Map from "../../../../components/map/map";
import DOTInform from "../dot-inform/DotInform";
import {
  Dialog,
  DialogTitle
} from "@mui/material"
import { useSelector } from "react-redux"
import { RootState } from "../../../../app/store"

// Types
import { RealTimeLprData } from "../../../../features/live-view-real-time/liveViewRealTimeTypes";

// Utils
import { reformatString } from "../../../../utils/commonFunction"

// Config
import { getUrls } from '../../../../config/runtimeConfig';

// Component
import Loading from "../../../../components/loading/Loading"

// i18n
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";

interface LocationDialog {
  open: boolean;
  close: () => void;
  detailData: RealTimeLprData | null;
  isCompare: boolean;
}

export default function LocationDetailDialog({
  open,
  detailData,
  close,
  isCompare = false,
}: LocationDialog) {
  // i18n
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false)
  const { IMAGE_URL } = getUrls();

  const { regions } = useSelector(
    (state: RootState) => state.dropdown
  )

  useEffect(() => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 500)
  }, [])

  return (
    <Dialog open={open} onClose={() => {}} className="absolute z-50">
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-black bg-opacity-25 backdrop-blur-sm ">
        {isLoading && <Loading />}
        <div 
          className="bg-black 
          w-[90vw] h-[95vh] overflow-y-auto flex flex-col"
        >
          <DialogTitle className={`text-[25px] p-[20px]`}>
            <span className='text-white ml-[15px]'>{t('screen.map-route')}</span>
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
                                {t('text.detail')}
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
                                  {t('text.vehicle-data')}
                                </p>
                              </div>
                              <div className="flex flex-col w-full">
                                <div className="flex w-full">
                                  <div className="w-full">
                                    <DOTInform
                                      vehicle={{
                                        vehicleImage: `${IMAGE_URL}${detailData.vehicleImage}`,
                                        pathImage: `${IMAGE_URL}${detailData.plateImage}`,
                                        plateId: `${detailData.plateGroup} ${detailData.plateNumber} ${i18n.language === 'th' ? detailData.regionNameTH : regions?.data?.find((data) => data.code === detailData.region)?.name || "" }`,
                                        brand: reformatString(detailData.make),
                                        color: i18n.language === 'th' ? reformatString(detailData.colorNameTH) : reformatString(detailData.colorNameEN),
                                        model: reformatString(detailData.model),
                                        type: i18n.language === 'th' ? reformatString(detailData.bodyTypeTH) : reformatString(detailData.bodyType),
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
                                      {t('text.checkpoint-order-pass')}
                                    </p>
                                  </div>

                                  <div className="flex text-center text-white bg-swamp p-2 text-[14px]">
                                    <div className="w-2/3 font-semibold bg-table-title">
                                      {t('table.column.station-checkpoint')}
                                    </div>
                                    <div className="w-1/3 bg-table-title">
                                      {t('table.column.time')}
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
            <div className='flex justify-end mx-8 mt-3'>
              <button 
                type="button" 
                className="bg-white text-black w-[90px] h-[40px] rounded" 
                onClick={close}
              >
                {t('button.cancel')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
