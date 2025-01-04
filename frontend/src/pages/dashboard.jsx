import { useAuth0 } from '@auth0/auth0-react'
import React from 'react'
import LogoutButton from '../components/logoutButton'
import LoginButton from '../components/loginButton'

export default function Dashboard() {
    const { user, isAuthenticated } = useAuth0()
    const roles = user && user['https://your-app.com/roles'];

    return (
        <div>      {isAuthenticated ?
            <div>
                <img src={user.picture} alt={user.name} />
                <h2>{user.name}</h2>
                <p>{user.email}</p>
                <p>{user.sub}</p>
                <p>{user.roles}</p>
                <LogoutButton />
            </div> :
            <LoginButton />}</div>
    )
}
