import { useState, useEffect } from "react";
import "./DotInform.scss";

// Component
import VehicleDisplay from "../vehicle-display/vehicleDisplay";
import Loading from "../../../../components/loading/Loading";

interface DOTInform {
  vehicle: any;
}

function DOTInform({ vehicle }: DOTInform) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<DOTInform>();

  useEffect(() => {
    const loadData = async () => {
      try {
        // Simulate data loading with a small delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setData({
          vehicle,
        });
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading DOT information:', error);
        setIsLoading(false);
      }
    };

    loadData();
  }, [vehicle]);

  return (
    <div className="grid grid-cols-2 py-2 text-white rounded-md w-full gap-1">
      {isLoading && <Loading />}
      <div>
        <VehicleDisplay
          vehicleImage={data?.vehicle.vehicleImage}
          pathImage={data?.vehicle.pathImage}
          desc=""
        />
      </div>
      <div className="h-[260px]">
        <div className="flex py-3 px-2 text-[14px] bg-swamp">
          <img width={20} height={20} src="/icons/detail.png" alt="car" />
          <p
            className="ms-2"
            style={{
              fontWeight: "bolder",
              color: "white",
            }}
          >
            ข้อมูลรถยนต์
          </p>
        </div>

        <div className="text-[14px]">
          <div className="flex h-[43.5px]">
            <div className="w-1/3 font-semibold bg-title p-2 flex items-center">ทะเบียนรถ</div>
            <div className="w-2/3 bg-content p-2 flex items-center">{data?.vehicle.plateId}</div>
          </div>

          <div className="flex h-[43.5px]">
            <div className="w-1/3 font-semibold bg-title p-2 flex items-center">ยี่ห้อ</div>
            <div className="w-2/3 bg-content p-2 flex items-center">{data?.vehicle.brand}</div>
          </div>

          <div className="flex h-[43.5px]">
            <div className="w-1/3 font-semibold bg-title p-2 flex items-center">สี</div>
            <div className="w-2/3 bg-content p-2 flex items-center">{data?.vehicle.color}</div>
          </div>

          <div className="flex h-[43.5px]">
            <div className="w-1/3 font-semibold bg-title p-2 flex items-center">รุ่น/แบบ</div>
            <div className="w-2/3 bg-content p-2 flex items-center">{data?.vehicle.model}</div>
          </div>

          <div className="flex h-[43.5px]">
            <div className="w-1/3 font-semibold bg-title p-2 flex items-center">ประเภท</div>
            <div className="w-2/3 bg-content p-2 flex items-center">
              {data?.vehicle.type}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DOTInform;
