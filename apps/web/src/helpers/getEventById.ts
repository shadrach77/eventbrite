'use client';

export const getFormData = async (id: string, session: any) => {
  try {
    const response = await fetch(`http://localhost:8000/api/my-events/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${session?.user.authentication_token}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      return data.data;
    } else {
      console.log('Something went wrong!');
    }
  } catch (error) {
    console.error(error);
  }
};
