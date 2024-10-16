import axios from 'axios';

export const registerUser = async (email: string, username: string, password: string) => {
    try {
      const payload = {
        email: email,
        username: username,
        password: password
      };
      const response = await axios.post("http://192.168.100.9:8000/auth/register/", payload);
      console.log("BECZKA")
      console.log(response.data)
      return response.data;
    } catch (error) {
      console.error('Registration failed', error);
      return null;
    }
  };
  
export const loginUser = async (username: string, password: string) => {
  try {
    const payload = {
      username: username,
      password: password
    };
    const response = await axios.post("http://192.168.100.9:8000/auth/login/", payload);
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error('Invalid login to the service', error);
    return null;
  }
};

export const addBookToProfile = async (isbn: string, token: string) => {
  try {
    console.log("LOL");
    const payload = {
      isbn: isbn
    }
    const response = await axios.post(
      `http://192.168.100.9:8000/api/entries/get_book/`,  // Przekazywanie isbn w URL
      payload,
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error occurred:', error.response ? error.response.data : error.message);
  }
};



export const securedEndpoint = async (token: string) => {
  try {
    const response = await axios.post(
      "http://192.168.100.9:8000/auth/secured/",
      {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('Response from secured endpoint:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error accessing secured endpoint', error);
    return null;
  }
};

export const  getUserBooks = async (token: string) => {
  try {
    console.log("KURWAs")
    const response = await axios.get(
      "http://192.168.100.9:8000/api/entries/get_user_books/",
      {
        headers: {
          Authorization: `Token ${token}`
      }
      }
    );
    console.log("BOOsssKS:")
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error('Error occurred:', error.response ? error.response.data : error.message);
  }
};