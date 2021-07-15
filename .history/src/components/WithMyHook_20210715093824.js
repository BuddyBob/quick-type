import { useAuth } from './context/AuthContext'
function withMyHook(Component) {
    return function WrappedComponent() {
      const { currentUser } = useAuth();
      console.log(currentUser.email)
      return <Component myHookValue={currentUser} />;
    }
}
export default withMyHook;