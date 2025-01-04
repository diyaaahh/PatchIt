import { useAuth0 } from '@auth0/auth0-react'
import React from 'react'
import LogoutButton from '../components/logoutButton'
import LoginButton from '../components/loginButton'
import Sidebar from '../components/sideBar'
import ReportedPothole from './reportedPothole'

export default function Dashboard() {
  return (
    <div className="h-screen w-screen overflow-hidden">
      <div className="flex h-full">
        <div className="h-full shadow-lg shadow-slate-900/20">
          <Sidebar />
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <ReportedPothole />
        </div>
      </div>
    </div>
  );
}