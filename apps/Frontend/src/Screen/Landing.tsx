import { useNavigate } from "react-router-dom"
import { Button } from "../Components/Button"

export default function Landing() {
  const navigate = useNavigate()
  return (
    <div className="flex justify-center">
    <div className="pt-8 max-w-screen-lg"> 
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="mt-8 flex justify-center ">
       <img src={'/image.png'}
            alt="chess image"
            className="h-3/4 w-2/3"/>
      </div>
    <div className="pt-16">
      <div className="flex justify-center text-center">
        <h1 className="text-white text-4xl font-bold">
          Play Chess Online on Number #1 site
        </h1>
      </div>
      <div className="flex justify-center mt-8">
        <Button onClick={()=>navigate('/game')}>
             ▶ PLAY
        </Button>
        </div>
    </div>
    </div>
  </div>
</div>
  )
}
