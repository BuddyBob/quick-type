import { useAuth } from './context/AuthContext'
function withMyHook(Component) {
    return function WrappedComponent() {
      const { currentUser } = useAuth();
      console.log(currentUser)
      return <Component myHookValue={myHookValue} />;
    }
}
export default withMyHook;