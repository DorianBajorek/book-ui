import axios from 'axios';

export const registerUser = async (email: string, username: string, password: string) => {
    try {
      const payload = {
        email: email,
        username: username,
        password: password
      };
      const response = await axios.post("http://192.168.100.9:8000/rest_api/signup/", payload);
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
    const response = await axios.post("http://192.168.100.9:8000/rest_api/login/", payload);
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error('Invalid login to the service', error);
    return null;
  }
};

export const addBookToProfle = async (title: string, token: string) => {
  try {
    const payload = {
      title: title
    };
    const authentication = {
      headers: {
        Authorization: token,
      },
    };
    const response = await axios.post("http://192.168.100.9:8000/rest_api/add_book/", payload, authentication);
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error('Invalid login to the service', error);
    return null;
  }
};

export const loadBooksToProfile = async (token: string) =>{
  try {
    const authentication = {
      headers: {
        Authorization: token,
      },
    };
    const response = await axios.get("http://192.168.100.9:8000/rest_api/load_book/", authentication);
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error('Invalid login to the service', error);
    return null;
  }
}