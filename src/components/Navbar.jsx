import React from 'react'

const Navbar = () => {
  return (
    <nav className='flex justify-between bg-indigo-600 text-white py-7'>
      <div className="logo">
        <span className="font-bold text-xl mx-8 my-2">SHIVAM's ToDo</span>
      </div>
      <ul className="flex gap-8 mx-9">
        <li className='cursor-pointer hover:font-bold transition-all'>HOME</li>
        <li className='cursor-pointer hover:font-bold transition-all'>YOUR TASKS</li>
      </ul>
    </nav>
   
  )
}

export default Navbar
