type cube = {
  center: Int[];
  cp: Int[];
  co: Int[];
  ep: Int[];
  eo: Int[];
};

type AuthContextType = {
  currentUser: User | null;
  signIn: (email: string, password: string) => Promise<UserCredential>;
  signUp: (
    email: string,
    password: string,
    newDisplayName: string
  ) => Promise<UserCredential>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserEmail: (email: string) => Promise<void> | undefined;
  updateUserPassword: (password: string) => Promise<void> | undefined;
  updateUserDisplayName: (newDisplayName: string) => Promise<void> | undefined;
};
