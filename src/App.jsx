import { BrowserRouter, Routes, Route } from 'react-router'
import OnboardingPage from './pages/applicant/OnboardingPage' 
import DashboardPage from './pages/admin/DashboardPage'
function App() {

  return (
   <BrowserRouter>
      <Routes>
        <Route path='/' element={ <OnboardingPage/> }/>
        {/* /admin */}
        <Route path='/admin/dashboard' element={ <DashboardPage/>} />
      </Routes>
   </BrowserRouter>
  )
}

export default App
