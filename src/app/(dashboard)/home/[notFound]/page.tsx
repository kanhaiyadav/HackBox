import Image from 'next/image'
import React from 'react'

const NotFound = () => {
  return (
      <div className='w-full grow flex items-center justify-between px-[100px] mt-[100px]'>
          <div>
                <h2 className='text-3xl'>404</h2>
                <p className='text-lg'>Page not found</p>
          </div>
          <div className='w-[500px] h-[500px] relative'>
              <Image fill src='/error404.svg' alt='error404'/>
          </div>
    </div>
  )
}

export default NotFound