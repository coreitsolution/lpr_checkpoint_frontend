import React from 'react';
import { ToastContentProps } from 'react-toastify';
import cx from 'clsx';
import dayjs from 'dayjs';
import buddhistEra from 'dayjs/plugin/buddhistEra';
dayjs.extend(buddhistEra)

// i18n
import { useTranslation } from 'react-i18next';

type NotificationData = {
  cameraName: string;
  approved?: boolean;
  timestamp: string;
  isReactive: boolean;
  onUpdate?: () => void;
  updateVisible?: boolean;
};

interface CameraAlertProps extends ToastContentProps<NotificationData> {
  type?: 'success' | 'error' | 'info' | 'warning';
}

const CameraAlert: React.FC<CameraAlertProps> = ({
  closeToast,
  data,
  toastProps,
}) => {
  // i18n
  const { t, i18n } = useTranslation();

  const isColored = toastProps?.theme === 'light';

  const handleUpdate = () => {
    if (data.onUpdate) {
      data.onUpdate();
    }
    closeToast();
  };

  return (
    <div
      className={cx(
        'flex flex-col w-full gap-3 overflow-y-auto max-h-[80vh]',
      )}
    >
      <div className='flex justify-center items-center'>
        <div className='relative'>
          <img src="/svg/bell.svg" alt="Bell" className='w-[70px] h-[70px] bell-shake' />
          <div className='absolute top-0 right-[-5px] rotate-[-15deg]'>
            <img src="/svg/bell-ring.svg" alt="Bell Ring" className='w-[70px] h-[70px] ring-shake' />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 items-center">
        <p className="text-[16px] text-[#4A4A4A]">{`${t('text.camera')}: ${data?.cameraName}`}</p>
        {
          i18n.language === 'th' ? (
            data.isReactive ? (
            <p className="text-[14px] text-[#4A4A4A]">ได้กลับมา<span className='font-bold underline'>ถูกเปิดใช้งาน</span>เมื่อ {dayjs(data?.timestamp).format('DD/MM/BBBB HH:mm:ss')}</p>
            ) :
            (
              <div className='flex flex-col gap-1 justify-center items-center'>
                <p className="text-[14px] text-[#4A4A4A]">การลบกล้องนี้ได้รับการ<span className='font-bold underline'>{data?.approved ? 'อนุมัติ' : 'ปฏิเสธ'}</span></p>
                <p className="text-[14px] text-[#4A4A4A]">เมื่อ {dayjs(data?.timestamp).format('DD/MM/BBBB HH:mm:ss')}</p>
              </div>
            )
          ) : 
          i18n.language === 'en' ? (
            data.isReactive ? (
            <p className="text-[14px] text-[#4A4A4A]">Has been <span className='font-bold underline'>reactivated</span> at {dayjs(data?.timestamp).format('DD/MM/YYYY HH:mm:ss')}</p>
            ) :
            (
              <div className='flex flex-col gap-1 justify-center items-center'>
                <p className="text-[14px] text-[#4A4A4A]">This camera deletion has been <span className='font-bold underline'>{data?.approved ? 'Approve' : 'Reject'}</span></p>
                <p className="text-[14px] text-[#4A4A4A]">At {dayjs(data?.timestamp).format('DD/MM/YYYY HH:mm:ss')}</p>
              </div>
            )
          ) :
          (
            data.isReactive ? (
            <p className="text-[14px] text-[#4A4A4A]">ກັບມາ<span className='font-bold underline'>ເປີດໃຊ້ແລ້ວ</span> ເວລາ {dayjs(data?.timestamp).format('DD/MM/YYYY HH:mm:ss')}</p>
            ) :
            (
              <div className='flex flex-col gap-1 justify-center items-center'>
                <p className="text-[14px] text-[#4A4A4A]">ການລຶບກ້ອງນີ້ໄດ້ຖືກ<span className='font-bold underline'>{data?.approved ? 'ອະນຸມັດ' : 'ປະຕິເສດ'}</span></p>
                <p className="text-[14px] text-[#4A4A4A]">ເວລາ {dayjs(data?.timestamp).format('DD/MM/YYYY HH:mm:ss')}</p>
              </div>
            )
          )
        }
        {
          data.updateVisible && (
            <button
              type="button"
              onClick={handleUpdate}
              className={cx(
                'ml-4 text-[12px] rounded-md px-3 py-1.5 transition-all active:scale-[.95]',
                isColored ? 'text-[#071C3B] font-bold bg-[#FFC300]' : 'text-white font-bold bg-[#2B9BED]'
              )}
            >
              {t('button.detail')}
            </button>
          )
        }
      </div>
    </div>
  );
};

export default CameraAlert;
