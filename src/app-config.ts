import type { ApiInstance } from './api';
import { handleError } from './api';
import type { DomainData } from './types/general';
import type { ChainConfigResult } from './types/api-types';
import { ApiError } from './api/api-helper';


export class AppConfig {
  constructor(apiInstance?: ApiInstance) {
    this.apiInstance = apiInstance;
  }

  apiInstance: ApiInstance | undefined = undefined;

  domainData: DomainData | null = null;

  usdcAddress = '';

  getDomainDataFromBe = async () => {
    if (!this.apiInstance) throw new Error('apiInstance is not defined');
    const res = await this.apiInstance?.getChainConfigs();
    const { result, error } = handleError(res) as { result: ChainConfigResult | undefined, error: ApiError | undefined };
    if (error || !result) return { error };
    const domainData: DomainData = {
      name: result.main.name,
      version: result.main.version,
      chainId: Number(result.main.chain_id), // 84531 Goerli, 84532 Sepolia
      verifyingContract: result.main.verifying_contract,
    };
    this.domainData = domainData;
    this.usdcAddress = result.addresses.usdc_contract;
    return {
      result,
      domainData,
      usdcAddress: result.addresses.usdc_contract,
      error,
    };
  };

  getDomainData = async () => {
    if (this.domainData) return this.domainData;
    const { domainData, error } = await this.getDomainDataFromBe();
    if (error) throw new Error(error.message);
    if (domainData) return domainData;
    throw new Error('Cannot get domain data.');
  };

  getUsdcAddress = async () => {
    if (this.usdcAddress) return this.usdcAddress;
    const { usdcAddress, error } = await this.getDomainDataFromBe();
    if (error) throw new Error(error.message);
    if (usdcAddress) return usdcAddress;
    throw new Error('Cannot get usdc address.');
  };
}
