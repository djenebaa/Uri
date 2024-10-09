export const getCsrfToken = async () => {
    const response = await fetch("http://localhost:8000/accounts/csrf-token/", {
      credentials: 'include',
    });
    const data = await response.json();
    return data.csrfToken;
  };
  