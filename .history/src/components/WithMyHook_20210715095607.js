import { useAuth } from './context/AuthContext'
function withMyHook(Component) {
    return function WrappedComponent(props) {
      const { currentUser, logout } = useAuth();
      console.log("THING",props)
      console.log(currentUser.email)
      function handleLogout(){console.log("hello")}
      return <Component myHookValue={currentUser} />;
    }
}
export default withMyHook;