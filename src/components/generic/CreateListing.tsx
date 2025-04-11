import Link from 'next/link'
import React from 'react'
import { FaPlus } from 'react-icons/fa'

const CreateListing = () => {
    return (
        <>
            <Link href='/create-listing'
                className="bg-dark-green flex items-center justify-center gap-2 px-3 text-black text-base  font-bold py-2 w-[fit-content] rounded-md text-center"
            >
                <FaPlus /><span>  Create Listing</span>
            </Link>
        </>
    )
}

export default CreateListing