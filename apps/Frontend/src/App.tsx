
import './App.css'
import './theme.css'
import { RecoilRoot } from 'recoil'; 
import { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from './Screen/Landing';
import Game from './Screen/Game';
import Login from './Screen/Login';
import { Loader } from './components/Loader';
import { Layout } from './layout';
import { ThemesProvider } from './context/themeContext';
import { Settings } from './Screen/Settings';
import { Themes } from './components/themes';


function App() {
  return (
    <div className="min-h-screen bg-bgMain text-textMain">  
      <RecoilRoot>
        <Suspense fallback={<Loader />}>
          <ThemesProvider>
            <AuthApp />
          </ThemesProvider>
        </Suspense>
      </RecoilRoot>
    </div>
  );
}


function AuthApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={<Layout><Landing /></Layout>} 
        />
        <Route
          path="/login"
          element={<Login />}
        />
        <Route
          path="/game/:gameId"
          element={
          <Layout>
            <Game />
           </Layout>
          }
        />
        { <Route 
          path='/settings' 
          element={<Layout><Settings /></Layout>} 
        >
          <Route path="themes" element={<Themes />} />
        </Route> }
      </Routes>
    </BrowserRouter>
  );
}



export default App
