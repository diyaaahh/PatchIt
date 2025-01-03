import { useAuth0 } from "@auth0/auth0-react"
import LoginButton from "./components/loginButton"
import LogoutButton from "./components/logoutButton";

function App() {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    <>
      {isAuthenticated ?
        <div>
          <img src={user.picture} alt={user.name} />
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          <p>{user.sub}</p>
          <LogoutButton/>
        </div> :
        <LoginButton />}
    </>
  );

}

export default App

