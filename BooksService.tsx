import axios from 'axios';

export const registerUser = async (email: string, username: string, password: string) => {
    try {
      const payload = {
        email: email,
        username: username,
        password: password
      };
      const response = await axios.post("http://192.168.100.9:8000/auth/v1/register/", payload);
      return response.data
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
    const response = await axios.post("http://192.168.100.9:8000/auth/v1/login/", payload);
    return response.data;
  } catch (error) {
    console.error('Invalid login to the service', error);
    return null;
  }
};

export const createOffer = async (isbn: string, token: string, frontImage: string, backImage: string) => {
  try {
    const formData = new FormData();

    formData.append('isbn', isbn);

    if (frontImage) {
      formData.append('frontImage', {
        uri: frontImage,
        name: 'front_image.jpg',
        type: 'image/jpeg',
      });
    }

    if (backImage) {
      formData.append('backImage', {
        uri: backImage,
        name: 'back_image.jpg',
        type: 'image/jpeg',
      });
    }

    const response = await axios.post(
      `http://192.168.100.9:8000/books/v1/create_offer/`,
      formData,
      {
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'multipart/form-data',
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

export const getUserOffers = async (token: string) => {
  try {
    const response = await axios.get(
      "http://192.168.100.9:8000/books/v1/get_user_offers/",
      {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error occurred:', error.response ? error.response.data : error.message);
  }
};

export const getOffersByQuery = async (token: string, searchQuery: string) => {
  try {
    const url = `http://192.168.100.9:8000/books/v1/search_users_with_title/?searchQuery=${encodeURIComponent(searchQuery)}`;
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