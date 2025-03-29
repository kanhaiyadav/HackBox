import React from 'react'
import { Skeleton } from '../ui/skeleton'

const HeaderSkeleton = () => {
  return (
    <div className="col-span-full">
                <Skeleton className="h-[36px] w-[200px] rounded-sm" />
                <div className="py-2 flex items-center gap-4">
                    <Skeleton className="h-[40px] w-[97px]" />
                    <Skeleton className="h-[40px] w-[126px]" />
                    <Skeleton className="h-[40px] w-[99px]" />
                    <Skeleton className="h-[40px] w-[172px]" />
                </div>
                <hr className="my-4 border-white/40" />
            </div>
  )
}

export default HeaderSkeleton