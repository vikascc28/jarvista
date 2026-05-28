'use client'
import Image from 'next/image'
import React from 'react'

function Header() {
  return (
    <div className='p-3 flex justify-between items-center px-14 fixed'>
      <Image src={'/projectLogo.jpeg'} alt='logo'
        width={100}
        height={100}
      />
    </div>
  )
}

export default Header
