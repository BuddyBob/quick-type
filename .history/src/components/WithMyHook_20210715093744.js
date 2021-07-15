function withMyHook(Component) {
    return function WrappedComponent(props) {
      const myHookValue = useMyHook();
      return <Component myHookValue={myHookValue} />;
    }
}
export default withMyHook;