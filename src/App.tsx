import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Mainpage from './pages/index.tsx'
import RegisterPage from './register/page.tsx'
import LoginPage from './login/page.tsx'
import Documentpage from './document-list/page.tsx'
import Document from './document/page.tsx'
import { AuthProvider } from './AuthContext.tsx'

export default function App() {
  return (
    <BrowserRouter>
    <AuthProvider>
    <Routes>
      <Route path='/' element={<Mainpage/>}/>
      <Route path='/register' element={<RegisterPage/>}/>
      <Route path='/login' element={<LoginPage/>}/>
      <Route path='/documents' element={<Documentpage/>}/>
      <Route path='/document/:id' element={<Document/>}/>
    </Routes>
    </AuthProvider>
    </BrowserRouter>
  )
}
