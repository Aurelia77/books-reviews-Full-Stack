import { User } from "firebase/auth";
import { create } from "zustand";

type UserStateType = {
  user: User | null;
  setUser: (user: User | null) => void;
};

const useUserStore = create<UserStateType>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

export default useUserStore;
