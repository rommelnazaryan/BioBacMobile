import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AllCompanyProps } from '@/types';

interface AllCompanyCashState {
  allCompanyCash: AllCompanyProps[];
  setAllCompanyCash: (
    value:
      | AllCompanyProps[]
      | ((current: AllCompanyProps[]) => AllCompanyProps[]),
  ) => void;
  clear: () => void;
}

const useAllCompanyCashStore = create<AllCompanyCashState>()(
  persist(
    set => ({
      allCompanyCash: [],
      setAllCompanyCash: value => {
        set(state => ({
          allCompanyCash:
            typeof value === 'function' ? value(state.allCompanyCash) : value,
        }));
      },
      clear: () => {
        set({allCompanyCash: []});
      },
    }),
    {
      name: 'all-company-cash-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export default useAllCompanyCashStore;