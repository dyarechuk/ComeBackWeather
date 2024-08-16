import React, { useEffect, useState } from 'react';

export interface CityExistsModalProps {
  onClose: () => void;
}

export const CityExistsModal: React.FC<CityExistsModalProps> = ({
  onClose,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setIsVisible(true);

    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onClose();
      }, 300);
    }, 1000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`z-50 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#3b4460] h-1/3 w-1/3 rounded-2xl border-2 shadow-lg flex justify-center items-center transition-all duration-300 ${
        isMounted && isVisible ? 'opacity-95 scale-100' : 'opacity-0 scale-95'
      }`}
    >
      <div className="modal-content">
        <p className="text-white text-2xl ">This city already exists!</p>
      </div>
    </div>
  );
};

export default CityExistsModal;
