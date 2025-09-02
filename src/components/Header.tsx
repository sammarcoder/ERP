import React from 'react'
import Link from 'next/link'
const Header = () => {
    return (
        <div className='border-2 w-full h-14 mx-auto flex justify-evenly items-center text-blue-300'>
            <Link href='/coa'>coa</Link>
            <Link href='/control-head2'>control head 2</Link>
            <Link href='/sheet-transaction-voucher'> journal master</Link>
            <Link href='/items-class'>items class</Link>
            <Link href='/item-form'>item form</Link>
            
        </div>
    )
}

export default Header