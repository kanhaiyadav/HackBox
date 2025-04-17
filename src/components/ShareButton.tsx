'use client';

import React from 'react'
import { usePathname } from 'next/navigation';
import { IoShareSocialSharp } from 'react-icons/io5';

const ShareButton = () => {

    const pathname = usePathname()
    // const url = `${window.location.origin}${pathname}`
    const url = `https://hackbox.kanhaiya.me${pathname}`
    
  return (
      <div
          onClick={() => {
              if (navigator.share) {
                  navigator.share({
                      title: "Hackbox Tool",
                      text: "Check this out!",
                      url: url,
                  });
              } else {
                  alert("Sharing not supported on this device.");
              }
          }}
          className="flex items-center gap-2 py-2 px-4 rounded-lg bg-accent shadow-input active:shadow-inset cursor-pointer"
      >
          <IoShareSocialSharp size={20} className="text-white/50" />
          <span className='hidden sm:block'>Share</span>
      </div>
  );
}

export default ShareButton