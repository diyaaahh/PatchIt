import React from 'react'

export default function LogoutButton() {
    return (
        <div>
            <button onClick={() => logout({ logoutParams: { returnTo: 'http://localhost:5173/' } })}>
                Log Out
            </button>
        </div>
    )
}
