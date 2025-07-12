import { useState } from 'react'

import './App.css'
import React from 'react'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import UserDashboard from './pages/userDashboard'
import AddItemPage from './pages/AddItem'
import ItemDetail from './pages/ItemDetail'
import AllItemsPage from './pages/AllItem'
import SwapPage from './pages/SwapPage'
import AdminApprovalPage from './pages/admin'
import { Router, Routes,Route } from 'react-router-dom'

function App() {
  
  return (
 
  <Routes>
     <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path='upload' element={<AddItemPage/>}/>
          <Route path="/items/:id" element={<ItemDetail />} />
        <Route path="/items" element={<AllItemsPage />} />
         <Route path="/swap" element={<SwapPage />} />
         <Route path="/admin/approval" element={<AdminApprovalPage />} />


  </Routes> 

  )
}

export default App
