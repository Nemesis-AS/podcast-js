import React from "react";

const ToastManager = ({ toasts, defaultDelay }) => {
  return (
    <div 
      className={`fixed bottom-4 right-4 py-2 px-4 flex flex-col gap-2 items-end`}
    >
      {
        toasts.map((toast, idx) => {
          return (
            <div 
              className={`flex gap-0 bg-slate-50 text-slate-800 border-2 border-l-0 border-${toast.color} group disappear-right`}
              style={{ "--delay": defaultDelay + "ms" }}
              key={idx}
            >
              <span className={`flex justify-center items-center text-white px-1 w-0 group-hover:w-8 transition-all duration-300 bg-${toast.color}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </span>
              <span className="py-2 px-4">
                { toast.text }
              </span>
            </div>
          )
        })
      }
    </div>
  )
};

export default ToastManager;