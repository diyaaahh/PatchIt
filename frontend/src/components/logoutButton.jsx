import { useAuth0 } from '@auth0/auth0-react'
import React from 'react'

export default function LogoutButton() {
    const { logout } = useAuth0();

    return (
        <div>
            <button onClick={() => logout({ logoutParams: { returnTo: 'http://localhost:5173/' } })}>
                Log Out
            </button>
        </div>
    )
}
