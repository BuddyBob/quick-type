import { useAuth } from './context/AuthContext'
function withMyHook(Component) {
    return function WrappedComponent() {
      const { currentUser, logout } = useAuth();
      console.log(currentUser.email)
      async handleLogout(){await logout()}
      await logout()
      return <Component myHookValue={currentUser} />;
    }
}
export default withMyHook;