import { Reducer, ReducerState, ReducerAction } from "react";

type ThunkAction<ReturnType, ExtraThunkArg, R extends Reducer<any, any>, BasicAction extends ReducerAction<R>> = (
    dispatch: ThunkDispatch<ExtraThunkArg, R, BasicAction>,
    getState: () => ReducerState<R>,
    extraArgument: ExtraThunkArg
) => ReturnType

interface ThunkDispatch<ExtraThunkArg, R extends Reducer<any, any>, BasicAction extends ReducerAction<R>> {
    <ReturnType>(thunkAction: ThunkAction<ReturnType, ExtraThunkArg, R, BasicAction>): ReturnType;

    (action: ReducerAction<R>): ReducerAction<R>;

    <ReturnType>(action: ReducerAction<R> | ThunkAction<ReturnType, ExtraThunkArg, R, BasicAction>):
        ReducerAction<R> | ReturnType
}
