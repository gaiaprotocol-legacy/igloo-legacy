/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "https://esm.sh/ethers@6.7.0";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedListener,
  TypedContractMethod,
} from "../common.ts";

export interface IglooSubjectAggregatorInterface extends Interface {
  getFunction(
    nameOrSignature: "getBulkKeyBalances" | "getBulkKeyPrices" | "subject"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "getBulkKeyBalances",
    values: [AddressLike, AddressLike[]]
  ): string;
  encodeFunctionData(
    functionFragment: "getBulkKeyPrices",
    values: [AddressLike[]]
  ): string;
  encodeFunctionData(functionFragment: "subject", values?: undefined): string;

  decodeFunctionResult(
    functionFragment: "getBulkKeyBalances",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getBulkKeyPrices",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "subject", data: BytesLike): Result;
}

export interface IglooSubjectAggregator extends BaseContract {
  connect(runner?: ContractRunner | null): IglooSubjectAggregator;
  waitForDeployment(): Promise<this>;

  interface: IglooSubjectAggregatorInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  getBulkKeyBalances: TypedContractMethod<
    [holder: AddressLike, subjects: AddressLike[]],
    [bigint[]],
    "view"
  >;

  getBulkKeyPrices: TypedContractMethod<
    [subjects: AddressLike[]],
    [bigint[]],
    "view"
  >;

  subject: TypedContractMethod<[], [string], "view">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "getBulkKeyBalances"
  ): TypedContractMethod<
    [holder: AddressLike, subjects: AddressLike[]],
    [bigint[]],
    "view"
  >;
  getFunction(
    nameOrSignature: "getBulkKeyPrices"
  ): TypedContractMethod<[subjects: AddressLike[]], [bigint[]], "view">;
  getFunction(
    nameOrSignature: "subject"
  ): TypedContractMethod<[], [string], "view">;

  filters: {};
}
