export {};
// import { Dispatch, Reducer } from 'react';
// import { ThunkDispatch } from './contextThunk';
// import { Action, ActionCreatorWithPreparedPayload } from './createAction';
// import { FallbackIfUnknown, IsAny, IsUnknown } from './tsHelpers';

// type AsyncThunkConfig = {
//   state?: unknown;
//   dispatch?: Dispatch<Reducer<any, any>>;
//   extra?: unknown;
//   rejectedValue?: unknown;
//   serializedErrorType?: unknown;
//   pendingMeta?: unknown;
//   fulfilledMeta?: unknown;
//   rejectedMeta?: unknown;
// };

// class RejectWithValue<Payload, RejectedMeta> {
//   private readonly _type!: 'RejectWithValue';
//   constructor(
//     public readonly payload: Payload,
//     public readonly meta: RejectedMeta
//   ) {}
// }

// class FulfillWithMeta<Payload, FulfilledMeta> {
//   private readonly _type!: 'FulfulledWithMeta';
//   constructor(
//     public readonly payload: Payload,
//     public readonly meta: FulfilledMeta
//   ) {}
// }

// export type BaseThunkApi<
//   S,
//   E,
//   D extends Dispatch<Reducer<any, any>> = Dispatch<Reducer<any, any>>,
//   RejectedValue = undefined,
//   RejectedMeta = unknown,
//   FulfilledMeta = unknown
// > = {
//   dispatch: D;
//   getState: () => S;
//   extra: E;
//   requestId: string;
//   signal: AbortSignal;
//   abort: (reason?: string) => void;
//   rejectWithValue: IsUnknown<
//     RejectedMeta,
//     (value: RejectedValue) => RejectWithValue<RejectedValue, RejectedMeta>,
//     (
//       value: RejectedValue,
//       meta: RejectedMeta
//     ) => RejectWithValue<RejectedValue, RejectedMeta>
//   >;
//   fulfillWithValue: IsUnknown<
//     FulfilledMeta,
//     <FulfilledValue>(
//       value: FulfilledValue
//     ) => FulfillWithMeta<FulfilledValue, FulfilledMeta>,
//     <FulfilledValue>(
//       value: FulfilledValue,
//       meta: FulfilledMeta
//     ) => FulfillWithMeta<FulfilledValue, FulfilledMeta>
//   >;
// };

// type GetState<ThunkApiConfig> = ThunkApiConfig extends {
//   state: infer State;
// }
//   ? State
//   : unknown;

// type GetExtra<ThunkApiConfig> = ThunkApiConfig extends {
//   extra: infer Extra;
// }
//   ? Extra
//   : unknown;

// type GetDispatch<ThunkApiConfig> = ThunkApiConfig extends {
//   dispatch: infer Dispatch;
// }
//   ? FallbackIfUnknown<
//       Dispatch,
//       ThunkDispatch<GetState<ThunkApiConfig>, GetExtra<ThunkApiConfig>, Action>
//     >
//   : ThunkDispatch<GetState<ThunkApiConfig>, GetExtra<ThunkApiConfig>, Action>;

// type GetRejectValue<ThunkApiConfig> = ThunkApiConfig extends {
//   rejectValue: infer RejectValue;
// }
//   ? RejectValue
//   : unknown;

// type GetRejectedMeta<ThunkApiConfig> = ThunkApiConfig extends {
//   rejectedMeta: infer RejectedMeta;
// }
//   ? RejectedMeta
//   : unknown;

// type GetFulfilledMeta<ThunkApiConfig> = ThunkApiConfig extends {
//   fulfilledMeta: infer FulfilledMeta;
// }
//   ? FulfilledMeta
//   : unknown;

// type GetThunkApi<ThunkApiConfig> = BaseThunkApi<
//   GetState<ThunkApiConfig>,
//   GetExtra<ThunkApiConfig>,
//   GetDispatch<ThunkApiConfig>,
//   GetRejectValue<ThunkApiConfig>,
//   GetRejectedMeta<ThunkApiConfig>,
//   GetFulfilledMeta<ThunkApiConfig>
// >;

// type MaybePromise<T> = T | Promise<T> | (T extends any ? Promise<T> : never);

// type AsyncThunkPayloadCreatorReturnValue<
//   Returned,
//   ThunkApiConfig extends AsyncThunkConfig
// > = MaybePromise<
//   | IsUnknown<
//       GetFulfilledMeta<ThunkApiConfig>,
//       Returned,
//       FulfillWithMeta<Returned, GetFulfilledMeta<ThunkApiConfig>>
//     >
//   | RejectWithValue<
//       GetRejectValue<ThunkApiConfig>,
//       GetRejectedMeta<ThunkApiConfig>
//     >
// >;

// type AsyncThunkPayloadCreator<
//   Returned,
//   ThunkArg = void,
//   ThunkApiConfig extends AsyncThunkConfig = {}
// > = (
//   arg: ThunkArg,
//   thunkApi: GetThunkApi<ThunkApiConfig>
// ) => AsyncThunkPayloadCreatorReturnValue<Returned, ThunkApiConfig>;

// interface SerializedError {
//   name?: string;
//   message?: string;
//   stack?: string;
//   code?: string;
// }

// type GetSerializedErrorType<ThunkApiConfig> = ThunkApiConfig extends {
//   serializedErrorType: infer GetSerializedErrorType;
// }
//   ? GetSerializedErrorType
//   : SerializedError;

// type GetPendingMeta<ThunkApiConfig> = ThunkApiConfig extends {
//   pendingMeta: infer PendingMeta;
// }
//   ? PendingMeta
//   : unknown;

// type AsyncThunkOptions<
//   ThunkArg = void,
//   ThunkApiConfig extends AsyncThunkConfig = {}
// > = {
//   condition?(
//     arg: ThunkArg,
//     api: Pick<GetThunkApi<ThunkApiConfig>, 'getState' | 'extra'>
//   ): MaybePromise<boolean | undefined>;

//   dispatchConditionRejection?: boolean;

//   serializeError?: (x: unknown) => GetSerializedErrorType<ThunkApiConfig>;

//   idGenerator?: (arg: ThunkArg) => string;
// } & IsUnknown<
//   GetPendingMeta<ThunkApiConfig>,
//   {
//     getPendingMeta?(
//       base: {
//         arg: ThunkArg;
//         requestId: string;
//       },
//       api: Pick<GetThunkApi<ThunkApiConfig>, 'getState' | 'extra'>
//     ): GetPendingMeta<ThunkApiConfig>;
//   },
//   {
//     getPendingMeta?(
//       base: {
//         arg: ThunkArg;
//         requestId: string;
//       },
//       api: Pick<GetThunkApi<ThunkApiConfig>, 'getState' | 'extra'>
//     ): GetPendingMeta<ThunkApiConfig>;
//   }
// >;

// type AsyncThunkFulfilledActionCreator<
//   Returned,
//   ThunkArg,
//   ThunkApiConfig = {}
// > = ActionCreatorWithPreparedPayload<
//   [Returned, string, ThunkArg, GetFulfilledMeta<ThunkApiConfig>?],
//   Returned,
//   string,
//   never,
//   {
//     arg: ThunkArg;
//     requestId: string;
//     requestStatus: 'fulfilled';
//   } & GetFulfilledMeta<ThunkApiConfig>
// >;

// type AsyncThunkAction<
//   Returned,
//   ThunkArg,
//   ThunkApiConfig extends AsyncThunkConfig
// > = (
//   dispatch: GetDispatch<ThunkApiConfig>,
//   getState: () => GetState<ThunkApiConfig>,
//   extra: GetExtra<ThunkApiConfig>
// ) => Promise<
//   | ReturnType<AsyncThunkFulfilledActionCreator<Returned, ThunkArg>>
//   | ReturnType<AsyncThunkRejectedActionCreator<ThunkArg, ThunkApiConfig>>
// > & {
//   abort: (reason?: string) => void;
//   requestId: string;
//   arg: ThunkArg;
//   unwrap: () => Promise<Returned>;
// };

// type AsyncThunkActionCreator<
//   Returned,
//   ThunkArg,
//   ThunkApiConfig extends AsyncThunkConfig
// > = IsAny<
//   ThunkArg,
//   (arg: ThunkArg) => AsyncThunkAction<Returned, ThunkArg, ThunkApiConfig>,
//   unknown extends ThunkArg
//     ? (arg: ThunkArg) => AsyncThunkAction<Returned, ThunkArg, ThunkApiConfig>
//     : [ThunkArg] extends [void] | [undefined]
//     ? () => AsyncThunkAction<Returned, ThunkArg, ThunkApiConfig>
//     : [void] extends [ThunkArg]
//     ? (arg?: ThunkArg) => AsyncThunkAction<Returned, ThunkArg, ThunkApiConfig>
//     : [undefined] extends [ThunkArg]
//     ? WithStrictNullChecks<
//         (
//           arg?: ThunkArg
//         ) => AsyncThunkAction<Returned, ThunkArg, ThunkApiConfig>,
//         (arg: ThunkArg) => AsyncThunkAction<Returned, ThunkArg, ThunkApiConfig>
//       >
//     : (arg: ThunkArg) => AsyncThunkAction<Returned, ThunkArg, ThunkApiConfig>
// >;

// type AsyncThunk<
//   Returned,
//   ThunkArg,
//   ThunkApiConfig extends AsyncThunkConfig
// > = AsyncThunkActionCreator<Returned, ThunkArg, ThunkApiConfig> & {
//   pending: AsyncThunkPendingActionCreator<ThunkArg, ThunkApiConfig>;
//   rejected: AsyncThunkRejectedActionCreator<ThunkArg, ThunkApiConfig>;
//   fulfilled: AsyncThunkFulfilledActionCreator<
//     Returned,
//     ThunkArg,
//     ThunkApiConfig
//   >;
//   typePrefix: string;
// };

// export const createAsyncThunk = (() => {
//   function createAsyncThunk<
//     Returned,
//     ThunkArg,
//     ThunkApiConfig extends AsyncThunkConfig
//   >(
//     typePrefix: string,
//     payloadCreator: AsyncThunkPayloadCreator<
//       Returned,
//       ThunkArg,
//       ThunkApiConfig
//     >,
//     options?: AsyncThunkOptions<ThunkArg, ThunkApiConfig>
//   ): AsyncThunk<Returned, ThunkArg, ThunkApiConfig> {
//     type RejectedValue = GetRejectValue<ThunkApiConfig>;
//     type PendingMeta = GetPendingMeta<ThunkApiConfig>;
//     type FulfilledMeta = GetFulfilledMeta<ThunkApiConfig>;
//     type RejectedMeta = GetRejectedMeta<ThunkApiConfig>;
//   }

//   return createAsyncThunk as CreateAsyncThunk<AsyncThunkConfig>;
// })();
