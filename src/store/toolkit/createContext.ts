import React, { createContext as createContextReact, Reducer, useContext, useReducer } from "react"
import { ContextMiddleware } from "."
import { Action } from "./createAction"
import { useEnhancedReducer } from "./enhancedReducer"

export type CreateContextOptions<S, A> = {
    displayName: string
    initialState: S
    actions: A
}

type TContext<S, A> = {
    state: S;
    dispatch: React.Dispatch<Action<any>>;
    actions: A
}

export function createContext<S, A>(
    { displayName, initialState, actions }: CreateContextOptions<S, A>,
    reducer: (state: S, action: Action<any>) => S,
    middleware?: ContextMiddleware<Reducer<S, Action<any>>>[]
) {
    const Context = createContextReact<TContext<S, A> | undefined>(undefined)

    Context.displayName = `${displayName}.Context`

    function Provider({ children }: { children: React.ReactNode }) {
        const [state, dispatch] = useEnhancedReducer(reducer, initialState, undefined, middleware);
        return React.createElement(
            Context.Provider,
            {value: {state, dispatch, actions}},
            children
        )
    }
    Provider.prototype.displayName = `${displayName}.Provider`

    const useSelector = () => {
        const state = useContext(Context)
        if (state === undefined) {
            throw new Error(`[${displayName}] must be used within a Provider`)
        }
        return state.state;
    }

    const useDispatch = () => {
        const state = useContext(Context)
        if (state === undefined) {
            throw new Error(`[${displayName}] must be used within a Provider`)
        }
        return state.dispatch;
    }

    const useActions = () => {
        const state = useContext(Context)
        if (state === undefined) {
            throw new Error(`[${displayName}] must be used within a Provider`)
        }
        return state.actions;
    }

    return { Provider, context: Context, hooks: [useSelector, useDispatch, useActions] } as const
}
