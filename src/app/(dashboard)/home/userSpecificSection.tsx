'use client';

import React from 'react'

const UserSpecificSection = () => {

    const [active, setActive] = React.useState(0)

    const navs = [
        {name: 'Recent Used', id: 'recent'},
        {name: 'Frequently Used', id: 'frequent'},
        {name: 'Favourite', id: 'favourite'}
    ]
    
  return (
      <div className="w-full">
          <div className="flex items-center w-full gap-[1px]">
              {navs.map((nav, index) => (
                  <button
                      key={index}
                      className={`px-6 py-3 rounded-t-xl ${
                          active === index
                              ? "bg-gray-300/5 border-2 border-white/5 border-b-0"
                              : "bg-gray-500/5"
                      }`}
                      onClick={() => setActive(index)}
                  >
                      {nav.name}
                  </button>
              ))}
          </div>
          <div className="w-full h-[500px] bg-gray-300/5 rounded-b-xl rounded-r-xl border-2 border-white/5"></div>
      </div>
  );
}

export default UserSpecificSection