/* eslint-disable no-unused-vars */
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { UserSidebar } from './components/layouts/UserSidebar'
if (location.pathname !== "/") {
  import("./assets/adminlte.css");
  import("./assets/adminlte.min.css");
}
import "./assets/sidebar.css"
import { Route, Routes } from 'react-router-dom'
import { UserProfile } from './components/user/UserProfile'
import { Login } from './components/common/Login'
import { Signup } from './components/common/Signup'
import { AdminSidebar } from './components/layouts/AdminSidebar'
import { AddTransaction } from './components/user/AddTransaction'
import axios from 'axios'
import PrivateRoutes from './hooks/PrivateRoutes'
import { UserDashboard } from './components/user/UserDashboard'
import { UserAccount } from './components/user/UserAccount'
import { UserViewTransaction } from './components/user/UserViewTransaction'
import { UserIncomeSection } from './components/user/UserIncomeSection'
import { UserExpenseSection } from './components/user/UserExpenseSection'
import LandingPage from './components/common/LandingPage'
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminUsersList } from './components/admin/AdminUsersList';
import { AdminUserDetails } from './components/admin/AdminUserDetails';
import { AdminEditUser } from './components/admin/AdminEditUser';
import { AdminTransactionList } from './components/admin/AdminTransactionList';
import { AdminAddUser } from './components/admin/AdminAddUser';
import { AdminProfile } from './components/admin/AdminProfile';
import { UserExport } from './components/user/UserExport';
import { AdminExport } from './components/admin/AdminExport';



function App() {
  const [count, setCount] = useState(0)
  axios.defaults.baseURL = "http://localhost:3000"

  return (
  <>
  {/* this both below comment are taken from the inde.html inspect from pages in templ late folder */}
{/* <body class="layout-fixed sidebar-expand-lg bg-body-tertiary app-loaded"> */}
{/* <div className='app-wrapper'></div> */}

<body className="layout-fixed sidebar-expand-lg bg-body-tertiary app-loaded">
<div className='app-wrapper'>
  <Routes>
    <Route path='/' element={<LandingPage></LandingPage>}></Route>
    <Route path='/login' element={<Login/>}></Route>
    <Route path='/signup' element={<Signup/>}></Route>
    <Route path="" element={<PrivateRoutes></PrivateRoutes>}>
        <Route path="/user" element={<UserSidebar/>}>
          <Route path='profile' element={<UserProfile/>}></Route>
          <Route path='addtransaction' element={<AddTransaction></AddTransaction>}></Route>
          <Route path='dashboard' element={<UserDashboard></UserDashboard>}></Route>
          <Route path='account' element={<UserAccount></UserAccount>}></Route>
          <Route path='income' element = {<UserIncomeSection></UserIncomeSection>}></Route>
          <Route path='expense' element = {<UserExpenseSection></UserExpenseSection>}></Route>
          <Route path='export' element={<UserExport></UserExport>}></Route>
          <Route path='viewTransaction' element={<UserViewTransaction></UserViewTransaction>}></Route>
        </Route>
        
    </Route>
    <Route path="" element={<PrivateRoutes></PrivateRoutes>}>
        <Route path="/admin" element={<AdminSidebar/>}>
          <Route path='profile' element={<AdminProfile></AdminProfile>}></Route>
          <Route path='dashboard' element={<AdminDashboard></AdminDashboard>}></Route>
          <Route path='users' element={<AdminUsersList></AdminUsersList>}></Route>
          <Route path="users/:id" element={<AdminUserDetails></AdminUserDetails>} />
          <Route path="users/:id/edit" element={<AdminEditUser></AdminEditUser>} />
          <Route path='export' element={<AdminExport></AdminExport>}></Route>
          
          <Route path='addUser' element={<AdminAddUser></AdminAddUser>}></Route>
          <Route path='viewTransaction' element={<AdminTransactionList></AdminTransactionList>}></Route>
        </Route>
        <Route path="/admin" element={<AdminSidebar></AdminSidebar>}>
          <Route path='profile' element={<UserProfile></UserProfile>}></Route>
        </Route>
    </Route>
    
    {/* <Route path="/user" element={<UserSidebar></UserSidebar>}></Route> this is same as above*/}
  </Routes>
</div>
</body>
  </>
  )
}

export default App
