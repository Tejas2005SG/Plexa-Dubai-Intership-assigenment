import React from 'react'

function Input({ icon: Icon, ...props }) {
    return (
        <div className='relative mb-4'>
            <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                <Icon className="size-5 text-blue-500" />
            </div>
            <input
             {...props}
                className='w-full pl-10 pr-3  py-2 bg-zinc-400 bg-opacity-50 rounded-lg border  focus-border-green-500 focus-ring-2 focus:ring-blue-500 text-black placeholder-black transition duration-200'
            
            />
               

        </div>
    )
}

export default Input