
import './App.css'
import { RecoilRoot } from 'recoil'; 
import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from './Screen/Landing';
import Game from './Screen/Game';
import Login from './Screen/Login';
import { Loader } from './Components/Loader';
import ReactDOM from 'react-dom/client';



function App() {
  return (
    <div className="min-h-screen bg-bgMain text-textMain">  
      <RecoilRoot>
        <Suspense fallback={<Loader />}>
          {/* <ThemesProvider> */}
            <AuthApp />
          {/* </ThemesProvider> */}
        </Suspense>
      </RecoilRoot>
    </div>
  );
}


function AuthApp() {
  
  return (
    <div className='bg-slate-900  h-screen'>
     <BrowserRouter>
      <Routes>
          <Route path="/" element={<Landing />}/>
          <Route path="/login" element={<Login />} />
          <Route path="/game" element={<Game />} />
      </Routes>
    </BrowserRouter>
    </div>
  )
}


export default App
