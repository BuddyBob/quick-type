function withMyHook(Component) {
    return function WrappedComponent(props) {
      const myHookValue = useMyHook();
      return <Component {...props} myHookValue={myHookValue} />;
    }
}
export default withMyHook;