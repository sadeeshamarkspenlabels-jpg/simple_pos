import React from 'react'
import { CrossIcon } from 'lucide-react'

const PopUp = ( {isOpen, onClose, children, title }) => {
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center   z-50 transition-opacity duration-300 ${
        isOpen ? "bg-[rgba(0,0,0,0.5)] pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`bg-white rounded-lg shadow-lg px-4 py-2 w-96 relative transform transition-transform duration-300 ${
          isOpen ? "translate-y-0 scale-100" : "-translate-y-10 scale-90"
        }`}
      >
        <div className=' flex justify-between p-2'>
            {
                title ? (
                    <h1 className=' font-bold text-[18px]'>{title}</h1>
                ) : (
                    <h1></h1>
                )
            }
            <button onClick={onClose} className=' font-bold text-xl cursor-pointer'>x</button>
        </div>
        <div className=' p-4'>
            {children}
        </div>
      </div>
    </div>
  )
}

export default PopUp