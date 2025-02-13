import React from 'react';
import { Check } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  isCompleted: boolean;
  isActive: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const FileImportBreadCrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <div className="w-full p-4 rounded-lg">
      <div className="flex items-center justify-between relative">
        {items.map((item) => (
          <React.Fragment key={item.label}>
            <div className={`flex items-center flex-grow`}>
              <div className={`flex items-center ${
                item.isActive ? 'text-white' : 'text-white/60'
              }`}>
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-dodgerBlue">
                  {item.isCompleted && (
                    <Check className="w-6 h-6 text-white" />
                  )}
                </div>
                <span className="ml-2 text-[18px] font-medium">{item.label}</span>
              </div>
              <div className="flex-1 mx-4">
                <div className="h-[2px] bg-dodgerBlue/30"></div>
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default FileImportBreadCrumbs;