import { LandingPage } from './components/LandingPage.tsx';
import { SignupPage } from './components/SignupPage.tsx';
import { SignInPage } from './components/SignInPage.tsx';
import { MainPage } from './components/MainPage.tsx';
import { GoogleAuthPage } from './components/GoogleAuthPage.tsx';
import { Routes, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import React from 'react';
function App() {
  return (
    <>
      <RecoilRoot>
        <React.Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path='/' element={<LandingPage />} />
            <Route path='/signup-page' element={<SignupPage />} />
            <Route path='/sign-in-page' element={<SignInPage />} />
            <Route path='/main' element={<MainPage />} />
            <Route path='/google-auth' element={<GoogleAuthPage />} />
          </Routes>
        </React.Suspense>
      </RecoilRoot>
    </>


  );
}

export default App;