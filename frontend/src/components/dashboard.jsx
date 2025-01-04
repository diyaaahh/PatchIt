import { useAuth0 } from '@auth0/auth0-react'
import React from 'react'
import LogoutButton from '../components/logoutButton'
import LoginButton from '../components/loginButton'
import Sidebar from '../components/sideBar'

export default function Dashboard() {

    return (
        <>
        <div className="flex flex-row">
<Sidebar/>
        </div>
        </>
    )
}
