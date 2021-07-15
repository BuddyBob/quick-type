function withMyHook(Component) {
    return function WrappedComponent(props) {
      const myHookValue = useMyHook();
      return <Component {...props} myHookValue={myHookValue} />;
    }
}
default export withMyHook;