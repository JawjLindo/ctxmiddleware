import React from 'react';

export type ActionCreator<
  Arg extends any = undefined,
  SyncDispatch extends React.Dispatch<any> = React.Dispatch<any>
> = (dispatch: SyncDispatch, arg: Arg) => void;
