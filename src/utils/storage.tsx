export const getUserData = () => localStorage.getItem('userDetails');
export const getToken = () => getUserData() ? JSON.parse(getUserData()!).token : '';
export const getUser = () => getUserData() ? JSON.parse(getUserData()!) : null;


export const setUserData = (data: object) => localStorage.setItem('userDetails', JSON.stringify(data));

export const clearToken = () => localStorage.removeItem('userDetails');
