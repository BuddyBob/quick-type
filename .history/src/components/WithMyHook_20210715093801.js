import { useAuth } from './context/AuthContext'
function withMyHook(Component) {
    return function WrappedComponent() {
      const myHookValue = useMyHook();
      return <Component myHookValue={myHookValue} />;
    }
}
export default withMyHook;