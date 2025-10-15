// Temporary empty file to fix imports
export const authAPI = {
  login: async () => ({ user: null, accessToken: '', refreshToken: '' }),
  register: async () => ({ user: null, accessToken: '', refreshToken: '' }),
};

export const storeAuthData = () => {};
export const clearAuthData = () => {};
export const getStoredUser = () => null;
export const getStoredToken = () => null;