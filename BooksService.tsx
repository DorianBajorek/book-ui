import axios from 'axios';

export const registerUser = async (email: string, username: string, password: string) => {
    try {
      const payload = {
        email: email,
        username: username,
        password: password
      };
      const response = await axios.post("http://192.168.100.9:8000/auth/register/", payload);
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
    return response.data;
  } catch (error) {
    console.error('Invalid login to the service', error);
    return null;
  }
};

export const addBookToProfile = async (isbn: string, token: string) => {
  try {
    const payload = {
      isbn: isbn
    }
    const response = await axios.post(
      `http://192.168.100.9:8000/api/entries/get_book/`,
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
    return response.data;
  } catch (error) {
    return null;
  }
};

export const  getUserBooks = async (token: string) => {
  try {
    const response = await axios.get(
      "http://192.168.100.9:8000/api/entries/get_user_books/",
      {
        headers: {
          Authorization: `Token ${token}`
      }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error occurred:', error.response ? error.response.data : error.message);
  }
};

export const findBooks = async (token: string, searchQuery: string) => {
  try {
    const url = `http://192.168.100.9:8000/api/entries/search_users_with_book/?searchQuery=${encodeURIComponent(searchQuery)}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Token ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Search failed', error);
    return null;
  }
}