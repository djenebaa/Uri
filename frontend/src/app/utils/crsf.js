export const getCsrfToken = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/accounts/csrf-token/`, {
      credentials: 'include',
    });
    const data = await response.json();
    return data.csrfToken;
  };
  