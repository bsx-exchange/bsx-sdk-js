import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { parseEther } from 'ethers';

import type { EnvName } from '../types/general';

const CONTRACT_ENV_NAME = process.env.CONTRACT_ENV_NAME as EnvName;
export const getBaseScanLink = (hash: string, type: 'tx' | 'address') => {
  return CONTRACT_ENV_NAME === 'mainnet'
    ? `https://basescan.org/${type}/${hash}`
    : CONTRACT_ENV_NAME === 'public-testnet'
      ? `https://sepolia.basescan.org/${type}/${hash}`
      : `https://sepolia.arbiscan.io/${type}/${hash}`;
};

export const toServerTime = (datetime: Dayjs) => {
  return `${datetime.valueOf()}000000`;
};

export const anyToWei = (value: any, fallback: any = '0') => {
  try {
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(value) || !value) return fallback;
    const result = parseEther(value.toString()).toString();
    return result;
  } catch (e) {
    return fallback;
  }
};

export const anyToFloat = (value: any, fallback: any = 0) => {
  const calcValue = value?.toString?.().replace(/,/g, '');

  // eslint-disable-next-line no-restricted-globals
  if (isNaN(calcValue) || !calcValue) return fallback;
  return parseFloat(calcValue);
};

const loadNs = process?.hrtime?.bigint?.() || BigInt(0);
const loadMs = new Date().getTime();

export const nowInNano = () => {
  if (process?.hrtime?.bigint) {
    const current = process.hrtime.bigint();
    return BigInt(BigInt(loadMs * 1000000) + (current - loadNs)).toString();
  }
  if (
    typeof window === 'undefined' ||
    !window.performance ||
    !window.performance.now
  )
    return toServerTime(dayjs());
  const ts = window.performance.now() + window.performance.timeOrigin;
  return `${Math.round(ts * 1000000)}`;
};

export const anyToFloatWithIncrement = (
  value: any,
  increment?: string | number,
  fallback?: any,
) => {
  const calcValue = value?.toString?.().replace(/,/g, '');

  // eslint-disable-next-line no-restricted-globals
  if (isNaN(calcValue) || !calcValue) return fallback || '0';
  const fixedNumber =
    typeof increment === 'number'
      ? increment
      : increment?.split('.')?.[1]?.length || 0;
  return parseFloat(calcValue).toFixed(fixedNumber);
};
