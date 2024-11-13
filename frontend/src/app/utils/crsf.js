export const getCsrfToken = async () => {
    const response = await fetch(`http://188.165.238.74:8218/accounts/csrf-token/`, {
      credentials: 'include',
    });
    const data = await response.json();
    return data.csrfToken;
  };
  