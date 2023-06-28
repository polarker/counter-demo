/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  Address,
  Contract,
  ContractState,
  TestContractResult,
  HexString,
  ContractFactory,
  SubscribeOptions,
  EventSubscription,
  CallContractParams,
  CallContractResult,
  TestContractParams,
  ContractEvent,
  subscribeContractEvent,
  subscribeContractEvents,
  testMethod,
  callMethod,
  multicallMethods,
  fetchContractState,
  ContractInstance,
  getContractEventsCurrentCount,
} from "@alephium/web3";
import { default as CounterContractJson } from "../Counter.ral.json";
import { getContractByCodeHash } from "./contracts";

// Custom types for the contract
export namespace CounterTypes {
  export type Fields = {
    owner: Address;
    count: bigint;
    decimals: bigint;
  };

  export type State = ContractState<Fields>;

  export interface CallMethodTable {
    getCurrentCount: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<bigint>;
    };
  }
  export type CallMethodParams<T extends keyof CallMethodTable> =
    CallMethodTable[T]["params"];
  export type CallMethodResult<T extends keyof CallMethodTable> =
    CallMethodTable[T]["result"];
  export type MultiCallParams = Partial<{
    [Name in keyof CallMethodTable]: CallMethodTable[Name]["params"];
  }>;
  export type MultiCallResults<T extends MultiCallParams> = {
    [MaybeName in keyof T]: MaybeName extends keyof CallMethodTable
      ? CallMethodTable[MaybeName]["result"]
      : undefined;
  };
}

class Factory extends ContractFactory<CounterInstance, CounterTypes.Fields> {
  consts = { InvalidCaller: BigInt(0) };

  at(address: string): CounterInstance {
    return new CounterInstance(address);
  }

  tests = {
    getCurrentCount: async (
      params: Omit<TestContractParams<CounterTypes.Fields, never>, "testArgs">
    ): Promise<TestContractResult<bigint>> => {
      return testMethod(this, "getCurrentCount", params);
    },
    add: async (
      params: TestContractParams<CounterTypes.Fields, { num: bigint }>
    ): Promise<TestContractResult<null>> => {
      return testMethod(this, "add", params);
    },
    setOwner: async (
      params: TestContractParams<CounterTypes.Fields, { newOwner: Address }>
    ): Promise<TestContractResult<null>> => {
      return testMethod(this, "setOwner", params);
    },
  };
}

// Use this object to test and deploy the contract
export const Counter = new Factory(
  Contract.fromJson(
    CounterContractJson,
    "",
    "d1dade27f53987a0c9781fd0d5e56fd83856477487565499623659402aa02fd9"
  )
);

// Use this class to interact with the blockchain
export class CounterInstance extends ContractInstance {
  constructor(address: Address) {
    super(address);
  }

  async fetchState(): Promise<CounterTypes.State> {
    return fetchContractState(Counter, this);
  }

  methods = {
    getCurrentCount: async (
      params?: CounterTypes.CallMethodParams<"getCurrentCount">
    ): Promise<CounterTypes.CallMethodResult<"getCurrentCount">> => {
      return callMethod(
        Counter,
        this,
        "getCurrentCount",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
  };

  async multicall<Calls extends CounterTypes.MultiCallParams>(
    calls: Calls
  ): Promise<CounterTypes.MultiCallResults<Calls>> {
    return (await multicallMethods(
      Counter,
      this,
      calls,
      getContractByCodeHash
    )) as CounterTypes.MultiCallResults<Calls>;
  }
}
