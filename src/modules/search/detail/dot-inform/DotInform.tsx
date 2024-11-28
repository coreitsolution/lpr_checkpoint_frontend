import React, { useState, useEffect } from "react";
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
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<DOTInform>();

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

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
    <div className="p-1 text-white rounded-md w-full">
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
        <div className="w-1/3 font-semibold bg-title p-3">ทะเบียนรถ :</div>
        <div className="w-2/3 bg-content p-3">{data?.vehicle.plateId}</div>
      </div>

      <div className="flex">
        <div className="w-1/3 font-semibold bg-title p-3">ยี่ห้อ :</div>
        <div className="w-2/3 bg-content p-3">{data?.vehicle.brand}</div>
      </div>

      <div className="flex">
        <div className="w-1/3 font-semibold bg-title p-3">สี :</div>
        <div className="w-2/3 bg-content p-3">{data?.vehicle.color}</div>
      </div>

      <div className="flex">
        <div className="w-1/3 font-semibold bg-title p-3">รุ่น/แบบ :</div>
        <div className="w-2/3 bg-content p-3">{data?.vehicle.model}</div>
      </div>

      <div className="flex">
        <div className="w-1/3 font-semibold bg-title p-3">ประเภท :</div>
        <div className="w-2/3 bg-content p-3">
          {data?.vehicle.type}
        </div>
      </div>

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
        <div className="w-1/3 font-semibold bg-title p-3">ผู้ครอบครอง :</div>
        <div className="w-2/3 bg-content p-3">{data?.owner.name}</div>
      </div>

      <div className="flex">
        <div className="w-1/3 font-semibold bg-title p-3">เลขที่บัตร :</div>
        <div className="w-2/3 bg-content p-3">{data?.owner.nationNumber}</div>
      </div>

      <div className="flex">
        <div className="w-1/3 font-semibold bg-title p-3">ที่อยู่ :</div>
        <div className="w-2/3 bg-content p-3">
          {data?.owner.address}
        </div>
      </div>

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
        <div className="w-1/3 font-semibold bg-title p-3">ผู้ครอบครอง :</div>
        <div className="w-2/3 bg-content p-3">{data?.rightsHolder.name}</div>
      </div>

      <div className="flex">
        <div className="w-1/3 font-semibold bg-title p-3">เลขที่บัตร :</div>
        <div className="w-2/3 bg-content p-3">{data?.rightsHolder.nationNumber}</div>
      </div>

      <div className="flex">
        <div className="w-1/3 font-semibold bg-title p-3">ที่อยู่ :</div>
        <div className="w-2/3 bg-content p-3">
          {data?.rightsHolder.address}
        </div>
      </div>
    </div>
  );
}

export default DOTInform;
