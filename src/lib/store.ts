import { create } from 'zustand';

type screenType = "none" | "airdrop" | "balance" | "sign" | "transact" | "token";

type WalletStoreType = {
    screen: screenType;
    setScreen:(screen: screenType) => void;
}

const useWalletStore = create<WalletStoreType>()((set) => ({
    screen: 'none',
    setScreen: (screen) => set({screen})
}))

export { useWalletStore };