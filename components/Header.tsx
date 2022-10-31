import { useIsMounted } from 'hooks/useIsMounted';
import { Menu } from './menu';

export const Header = () => {
  const isMounted = useIsMounted();
  // const { data: signer } = useSigner();
  // const { connect, connectors, error, isLoading, pendingConnector } = useConnect();
  // const { disconnect } = useDisconnect();
  // console.log(openMenu);

  return (
    <div>
      {isMounted && <Menu />}

      {/* {isMounted && isConnected && (
        <div>
          <button onClick={() => disconnect()}>Disconnect from {connector?.name}</button>
          <p>address: {address}</p>
        </div>
      )}

      {isMounted &&
        connectors.map((connector) => (
          <button
            disabled={!connector.ready}
            key={connector.id}
            onClick={() => connect({ connector })}
          >
            {connector.name}
            {!connector.ready && ' (unsupported)'}
            {isLoading && connector.id === pendingConnector?.id && ' (connecting)'}
          </button>
        ))}

      {error && error.message} */}
    </div>
  );
};
