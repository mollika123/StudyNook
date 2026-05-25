import React from 'react';
import { BounceLoader, ClipLoader, FadeLoader } from 'react-spinners';

const LoadingPage = () => {
  return (
    <div className='flex h-[85vh] items-center justify-center'>

      <BounceLoader
   width={150}   />
 
       
   
    </div>
  );
};

export default LoadingPage;