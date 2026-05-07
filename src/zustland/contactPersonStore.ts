import AsyncStorage from '@react-native-async-storage/async-storage';
import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';

export type OfflineContactPerson = {
  id: number;
  firstName: string;
  lastName: string;
  phones: string[];
  emails: string[];
  position: string;
  notes: string;
  dob: string;
  createdAt: string;
  updatedAt: string;
  companyId: string;
  categoryType: 'BUYER' | 'SELLER';
};

interface ContactPersonState {
  contactPersons: OfflineContactPerson[];
  addContactPerson: (value: Omit<OfflineContactPerson, 'id'>) => OfflineContactPerson;
  setContactPersons: (value: OfflineContactPerson[]) => void;
  clear: () => void;
}

const useContactPersonStore = create<ContactPersonState>()(
  persist(
    set => ({
      contactPersons: [],
      addContactPerson: value => {
        const contactPerson = {
          ...value,
          id: -Date.now(),
        };

        set(state => ({
          contactPersons: [...state.contactPersons, contactPerson],
        }));

        return contactPerson;
      },
      setContactPersons: value => {
        set(state => {
          const offlineContactPersons = state.contactPersons.filter(
            contactPerson => contactPerson.id < 0,
          );
          const byId = new Map<number, OfflineContactPerson>();

          value.forEach(contactPerson => {
            byId.set(contactPerson.id, contactPerson);
          });
          offlineContactPersons.forEach(contactPerson => {
            byId.set(contactPerson.id, contactPerson);
          });

          return {contactPersons: Array.from(byId.values())};
        });
      },
      clear: () => {
        set({contactPersons: []});
      },
    }),
    {
      name: 'contact-person-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export default useContactPersonStore;
