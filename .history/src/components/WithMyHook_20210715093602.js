function withMyHook(Component) {
    return function WrappedComponent(props) {
      const myHookValue = useMyHook();
      return <Component {'hello'} myHookValue={myHookValue} />;
    }
}
export default withMyHook;