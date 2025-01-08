import { useState, useEffect } from "react";
import "./DotInform.scss";

// Component
import VehicleDisplay from "../vehicle-display/vehicleDisplay";
import Loading from "../../../../components/loading/Loading";

interface DOTInform {
  vehicle: any;
  owner: any;
  rightsHolder: any;
}

function DOTInform({ vehicle, owner, rightsHolder }: DOTInform) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<DOTInform>();

  useEffect(() => {
    const loadData = async () => {
      try {
        // Simulate data loading with a small delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setData({
          vehicle,
          owner,
          rightsHolder
        });
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading DOT information:', error);
        setIsLoading(false);
      }
    };

    loadData();
  }, [vehicle, owner, rightsHolder]);

  return (
    <div className="p-1 text-white rounded-md w-full text-[0.8vw]">
      {isLoading && <Loading />}
      <VehicleDisplay
        pathImageVehicle={data?.vehicle.pathImageVehicle}
        pathImage={data?.vehicle.pathImage}
        desc={data?.vehicle.plateId}
      />
      <div className="flex my-5">
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

      <div className="flex">
        <div className="w-1/3 font-semibold bg-title p-2">ทะเบียนรถ :</div>
        <div className="w-2/3 bg-content p-2">{data?.vehicle.plateId}</div>
      </div>

      <div className="flex">
        <div className="w-1/3 font-semibold bg-title p-2">ยี่ห้อ :</div>
        <div className="w-2/3 bg-content p-2">{data?.vehicle.brand}</div>
      </div>

      <div className="flex">
        <div className="w-1/3 font-semibold bg-title p-2">สี :</div>
        <div className="w-2/3 bg-content p-2">{data?.vehicle.color}</div>
      </div>

      <div className="flex">
        <div className="w-1/3 font-semibold bg-title p-2">รุ่น/แบบ :</div>
        <div className="w-2/3 bg-content p-2">{data?.vehicle.model}</div>
      </div>

      <div className="flex">
        <div className="w-1/3 font-semibold bg-title p-2">ประเภท :</div>
        <div className="w-2/3 bg-content p-2">
          {data?.vehicle.type}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <div className="flex my-5">
            <img width={20} height={20} src="/icons/person.png" alt="car" />
            <p
              className="ms-2"
              style={{
                fontWeight: "bolder",
                color: "white",
              }}
            >
              ข้อมูลผู้ครอบครอง
            </p>
          </div>

          <div className="flex">
            <div className="w-1/3 font-semibold bg-title p-2">ผู้ครอบครอง :</div>
            <div className="w-2/3 bg-content p-2">{data?.owner.name}</div>
          </div>

          <div className="flex">
            <div className="w-1/3 font-semibold bg-title p-2">เลขที่บัตร :</div>
            <div className="w-2/3 bg-content p-2">{data?.owner.nationNumber}</div>
          </div>

          <div className="flex">
            <div className="w-1/3 font-semibold bg-title p-2">ที่อยู่ :</div>
            <div className="w-2/3 bg-content p-2">
              {data?.owner.address}
            </div>
          </div>
        </div>

        <div>
          <div className="flex my-5">
            <img width={20} height={20} src="/icons/person.png" alt="car" />
            <p
              className="ms-2"
              style={{
                fontWeight: "bolder",
                color: "white",
              }}
            >
              ข้อมูลผู้ถือกรรมสิทธิ์
            </p>
          </div>

          <div className="flex">
            <div className="w-1/3 font-semibold bg-title p-2">ผู้ครอบครอง :</div>
            <div className="w-2/3 bg-content p-2">{data?.rightsHolder.name}</div>
          </div>

          <div className="flex">
            <div className="w-1/3 font-semibold bg-title p-2">เลขที่บัตร :</div>
            <div className="w-2/3 bg-content p-2">{data?.rightsHolder.nationNumber}</div>
          </div>

          <div className="flex">
            <div className="w-1/3 font-semibold bg-title p-2">ที่อยู่ :</div>
            <div className="w-2/3 bg-content p-2">
              {data?.rightsHolder.address}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DOTInform;
