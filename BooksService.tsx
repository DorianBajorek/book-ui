import axios from 'axios';

export const registerUser = async (email: string, username: string, password: string) => {
    try {
      const payload = {
        email: email,
        username: username,
        password: password
      };
      const response = await axios.post("http://127.0.0.1:8000/rest_api/signup/", payload);
      return response.data;
    } catch (error) {
      console.error('Registration failed', error);
      return null;
    }
  };
  
