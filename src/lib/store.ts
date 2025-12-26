import { create } from 'zustand';
import type { TokenData } from '../components/Token';

type screenType = "none" | "airdrop" | "balance" | "sign" | "transact" | "token";

type WalletStoreType = {
    balance: number | null;
    screen: screenType;
    tokensData: TokenData[];
    setBalance: (value: number) => void;
    setScreen:(screen: screenType) => void;
    setTokensData: (data: TokenData[]) => void;
}

const useWalletStore = create<WalletStoreType>()((set) => ({
    balance: null,
    screen: 'none',
    tokensData: [],
    setBalance: (value) => set({balance: value}),
    setScreen: (screen) => set({screen}),
    setTokensData: (data: TokenData[]) => set({ tokensData: data }),
}))

export { useWalletStore };