import { BrowserRouter, Routes, Route } from 'react-router'
import OnboardingPage from './pages/applicant/OnboardingPage'
import { Toaster } from 'react-hot-toast'
import AdminProtectedRoutes from '../routes/AdminProtectedRoutes'
import DashboardPage from './pages/DashboardPage'
import LoginPage from './pages/auth/LoginPage'
import MainLayout from './layouts/admin/MainLayout'
import TestPage from './pages/admin/ApplicantsTab/TestsPage'
import ComingSoon from './components/ComingSoon'
import TestBankPage from './pages/admin/AssesmentsTab/TestBankPage'
import NotFound from './components/NotFound'

import ErrorMessage from './pages/admin/ErrorMessage'
function App() {
  return (
    
      <BrowserRouter>
        <Toaster position='top-center' reverseOrder={false} />
        <Routes>
          {/* Applicant Routes */}
          <Route path='/' element={ <OnboardingPage/> }/>
          <Route path='/auth/login' element={<LoginPage/>} />

          {/* <Route path="/" element={<ApplicantOnboardingPage />} />
          <Route path="/instructions" element={<TestInstructions />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="/CompletedTest" element={<CompletedTestPage />} />
          <Route path="/TestProgress" element={<TestProgress />} /> */}

          {/* ProtectedRoutes */}
          {/* /admin protected routes */}
          <Route element={<AdminProtectedRoutes/>}>
            <Route path='admin' element={<MainLayout/>}>
              <Route index path='dashboard' element={<DashboardPage/>} />
              <Route path='applicants' element={<TestPage/>} />
              <Route path='trainings' element={<ComingSoon/>} />
              <Route path='assesments' element={<TestBankPage/>} />
            </Route>
          </Route>
          {/* <Route path='*' element={<NotFound/>}/> */}
          <Route path='*' element={ <ErrorMessage/> }/>
      </Routes>
      </BrowserRouter>
  )
}

export default App;
