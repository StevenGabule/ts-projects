import {useState, useEffect} from 'react'
import { load } from '../api';
import { AppState } from "../state/appStateReducer"

type InjectedProps = {
  initialState: AppState;
}

type PropsWithoutInjected<TBaseProps> = Omit<TBaseProps, keyof InjectedProps>

export function withInitialState<TProps>(WrappedComponent: React.ComponentType<PropsWithoutInjected<TProps> & InjectedProps>) {
  return (props: PropsWithoutInjected<TProps>) => {
    const [initialState, setInitialState] = useState<AppState>({
      lists: [],
      draggedItem: null
    })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<Error | undefined>();

    useEffect(() => {
      const fetchInitialState = async() => {
        try {
          const data = await load();
          setInitialState(data);
        } catch (error: any) {
          if (error instanceof Error) {
            setError(error)
          }
        }
        setIsLoading(false)
      }
      fetchInitialState();
    }, [])
  
    if (isLoading) return <div>Loading</div>
    if (error) return <div>{error.message}</div>

    return <WrappedComponent {...props} initialState={initialState} />
  }
}