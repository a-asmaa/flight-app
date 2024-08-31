export const getToken = () => localStorage.getItem('userDetails');

export const setToken = (data: object) => localStorage.setItem('userDetails', JSON.stringify(data));
