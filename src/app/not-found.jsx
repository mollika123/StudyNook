import Link from 'next/link';
import React from 'react';

const NotFound = () => {
  return (
    <div className='h-[80vh] flex justify-center items-center flex-col'>
      <h2 className="text-5xl font-bold">This page is not found</h2>
      <Link href="/">
      <button className='px-4 py-3 rounded-md pt-4 btn-primary'>Go back</button></Link>
    </div>
  );
};

export default NotFound ;