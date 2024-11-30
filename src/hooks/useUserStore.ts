import { User } from "firebase/auth";
import { create } from "zustand";

type UserStateType = {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
};

const useUserStore = create<UserStateType>((set) => ({
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),
}));

export default useUserStore;
