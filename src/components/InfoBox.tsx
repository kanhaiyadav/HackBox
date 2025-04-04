import React from 'react'
import { RiInformation2Line } from "react-icons/ri";
import { Skeleton } from './ui/skeleton';

const InfoBox = ({
    description,
    loading,
}: {
    description: string | undefined;
    loading: boolean;
}) => {
  return (
      <div className="w-full h-fit min-h-[100px] bg-blue-500/10 border-l-[3.5px] border-blue-500 relative px-[15px] pt-[30px] pb-[15px]">
          <RiInformation2Line className="text-blue-500 text-4xl absolute top-0 left-0 transform -translate-x-1/2 -translate-y-1/2 z-2" />
          <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28.5"
              height="34.5"
              fill="none"
              viewBox="0 0 57 69"
              preserveAspectRatio="none"
              className="absolute top-0 left-[-3px]"
          >
              <path
                  className=" fill-background"
                  d="M54 0V0.716804C54 25.9434 35.0653 47.1517 10 50L0 57V0H54Z"
              ></path>
              <path
                  className=" fill-blue-500"
                  d="M56.9961 4.15364C57.0809 2.49896 55.8083 1.08879 54.1536 1.00394C52.499 0.919082 51.0888 2.19168 51.0039 3.84636L56.9961 4.15364ZM9.09704 51.7557L8.49716 48.8163L9.09704 51.7557ZM6 69V59.2227H0V69H6ZM9.69692 54.6951L14.3373 53.7481L13.1375 47.8693L8.49716 48.8163L9.69692 54.6951ZM14.3373 53.7481C38.202 48.8777 55.7486 28.4783 56.9961 4.15364L51.0039 3.84636C49.8967 25.4384 34.3213 43.5461 13.1375 47.8693L14.3373 53.7481ZM6 59.2227C6 57.0268 7.54537 55.1342 9.69692 54.6951L8.49716 48.8163C3.55195 49.8255 0 54.1756 0 59.2227H6Z"
              ></path>
          </svg>
          {
                loading ? (
                  <>
                      <Skeleton className="h-5 w-[250px] bg-gray-500/20 rounded-md mb-2" />
                      <Skeleton className="h-5 w-full bg-gray-500/20 rounded-md mb-2" />
                      <Skeleton className="h-5 w-[220] bg-gray-500/20 rounded-md mb-2" />
                      <Skeleton className="h-5 w-[290px] bg-gray-500/20 rounded-md mb-2" />
                  </>
                ) : (
                    <div dangerouslySetInnerHTML={{__html: description || ""}} className='text-blue-400'/>
                )
          }
      </div>
  );
}

export default InfoBox