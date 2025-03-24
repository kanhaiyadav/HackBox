import React from 'react'
import UserSpecificSection from './userSpecificSection'
import Tools from './Tools'

const page = () => {
  return (
      <div className='m-auto w-full flex flex-col items-center gap-4 grow min-h-0'>
          <UserSpecificSection />
          <Tools />
    </div>
  )
}

export default page