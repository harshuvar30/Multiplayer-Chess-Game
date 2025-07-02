
export const Button = ({onClick , children}: {onClick:()=>void,children:React.ReactNode}) => {
  return (
     <button  onClick={onClick} className=" w-full px-8 py-4 text-white text-xl font-bold rounded-full bg-green-500 hover:bg-green-600 hover:scale-105 hover:shadow-xl transition-all duration-300 ease-in-out">
            {children}
        </button>
  )
}

 