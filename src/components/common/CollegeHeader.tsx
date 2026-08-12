import React from 'react';
import collegeHeaderImg from '../../assets/college_header.png';

export const CollegeHeader: React.FC = () => {
  return (
    <div className="w-full bg-black border-b border-white/5 relative z-40 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center items-center h-16 sm:h-20 md:h-24">
        <img
          src={collegeHeaderImg}
          alt="College Logo Header"
          className="h-full w-auto object-contain py-1.5 sm:py-2 md:py-2.5 transition-transform duration-300 filter drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]"
        />
      </div>
    </div>
  );
};

export default CollegeHeader;
