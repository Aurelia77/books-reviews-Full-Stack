import { User } from "firebase/auth";
import { create } from "zustand";

type UserStateType = {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  profileImage: string | null;
  setProfileImage: (image: string | null) => void;
};

const useUserStore = create<UserStateType>((set) => ({
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),
  profileImage: null,
  setProfileImage: (image) => set({ profileImage: image }),
}));

export default useUserStore;
