/*
 * This file is part of the Gala Network Connect project for LFGW.
 */
import { ChainCallDTO, ConstructorArgs } from "@gala-chain/api";
import { BrowserProvider, getAddress } from "ethers";

import { CustomEventEmitter, MetaMaskEvents } from "../helpers";
import { CustomClient } from "../types/CustomClient";

declare global {
  interface Window {
    lfgw: {
      providers: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        gala: any;
      };
    };
  }
}

enum LfgwConnectError {
  NO_PROVIDER = "Gala provider not found",
  NO_ACCOUNT = "No account connected"
}

enum LfgwConnectEvents {
  ACCOUNT_CHANGED = "accountChanged",
  ACCOUNTS_CHANGED = "accountsChanged"
}

export enum LfgwConnectMethods {
  REQUEST_ACCOUNTS = "eth_requestAccounts",
  SIGN_OBJECT = "gala_signObject"
}

export class LfgwConnectClient extends CustomEventEmitter<MetaMaskEvents> implements CustomClient {
  #address: string;
  #provider: BrowserProvider | undefined;
  #chainCodeUrl: string;

  get getChaincodeUrl() {
    return this.#chainCodeUrl;
  }

  get getGalachainAddress() {
    return this.#address.replace("0x", "eth|");
  }

  get getWalletAddress(): string {
    return this.#address;
  }

  set setWalletAddress(val: string) {
    this.#address = getAddress(`0x${val.replace(/0x|eth\|/, "")}`);
  }

  constructor(chainCodeUrl: string) {
    super();
    this.#chainCodeUrl = chainCodeUrl;
    this.#address = "";

    if (window.lfgw.providers.gala) {
      this.#provider = new BrowserProvider(window.lfgw.providers.gala);
    } else {
      throw new Error(LfgwConnectError.NO_PROVIDER);
    }
  }

  private initializeListeners(): void {
    if (!window.lfgw.providers.gala) {
      return;
    }
    window.lfgw.providers.gala.on(LfgwConnectEvents.ACCOUNTS_CHANGED, (accounts: string[]) => {
      if (accounts.length > 0) {
        this.setWalletAddress = getAddress(accounts[0]);
        this.emit(LfgwConnectEvents.ACCOUNT_CHANGED, this.getGalachainAddress);
        this.emit(LfgwConnectEvents.ACCOUNTS_CHANGED, accounts);
      } else {
        this.setWalletAddress = "";
        this.emit(LfgwConnectEvents.ACCOUNT_CHANGED, null);
        this.emit(LfgwConnectEvents.ACCOUNTS_CHANGED, null);
      }
    });
  }

  public async connect() {
    if (!this.#provider) {
      throw new Error(LfgwConnectError.NO_PROVIDER);
    }
    this.initializeListeners();

    try {
      const accounts = (await this.#provider.send(LfgwConnectMethods.REQUEST_ACCOUNTS, [])) as string[];
      this.setWalletAddress = getAddress(accounts[0]);
      return this.getGalachainAddress;
    } catch (error: unknown) {
      throw new Error((error as Error).message);
    }
  }

  public async signObject<U extends ConstructorArgs<ChainCallDTO>>(
    payload: U
  ): Promise<{ signature: string }> {
    if (!this.#provider) {
      throw new Error(LfgwConnectError.NO_PROVIDER);
    }
    if (!this.#address) {
      throw new Error(LfgwConnectError.NO_ACCOUNT);
    }

    try {
      const signature = this.#provider.send(LfgwConnectMethods.SIGN_OBJECT, [
        this.#address.toLowerCase(),
        JSON.stringify(payload)
      ]);

      return signature;
    } catch (error: unknown) {
      throw new Error((error as Error).message);
    }
  }

  public async sign<U extends ConstructorArgs<ChainCallDTO>>(
    _method: string,
    _payload: U
  ): Promise<U & { signature: string; prefix: string }> {
    throw new Error("Method not implemented.");
  }
}
