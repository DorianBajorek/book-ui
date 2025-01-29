import axios from 'axios';

export const registerUser = async (email: string, username: string, password: string, phoneNumber: string) => {
    try {
      const payload = {
        email: email,
        username: username,
        password: password,
        phoneNumber: phoneNumber,
      };
      const response = await axios.post("https://drugaksiazka.pl/api/auth/v1/register/", payload);
      return response.data
    } catch (error) {
      throw error;
    }
  };
  
  export const registerGoogle = async (id_token: string) => {
    try {
      const payload = {
        type: "mobile",
        id_token: id_token,
      };
      const response = await axios.post('https://drugaksiazka.pl/api/auth/v1/google_register/', payload);
      return response.data
    } catch (error: any) {
      throw error;
    }
  };
  
export const loginUser = async (username: string, password: string) => {
  try {
    const payload = {
      username: username,
      password: password
    };
    const response = await axios.post("https://drugaksiazka.pl/api/auth/v1/login/", payload);
    return response.data;
  } catch (error) {
    throw error
  }
};

export const createOffer = async (isbn: string, token: string, frontImage: string, backImage: string, price: string) => {
  const formData = new FormData();
  formData.append('isbn', isbn);
  formData.append('price', price);

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
    `https://drugaksiazka.pl/api/books/v1/create_offer/`,
    formData,
    {
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data;
};

export const securedEndpoint = async (token: string) => {
  try {
    const response = await axios.post(
      "https://drugaksiazka.pl/api/auth/secured/",
      {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'applicion/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    return null;
  }
};

export const getUserOffers = async (token: string, username: string) => {
  try {
    const response = await axios.get(
      `https://drugaksiazka.pl/api/books/v1/get_user_offers/${username}/`);
    return response.data;
  } catch (error) {
  }
};

export const getUserData = async (token: string, username: string) => {
  try {
    const response = await axios.get(
      `https://drugaksiazka.pl/api/auth/v1/get_user_data/${username}/`,
      {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
  }
};

export const deleteOffer = async (token: string, offerId: string) => {
  try {
    const response = await axios.delete(
      `https://drugaksiazka.pl/api/books/v1/delete_offer/${offerId}/`,
      {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.status === 204 ? "Offer deleted successfully" : response.data;
  } catch (error) {
  }
};

export const getOffersByQuery = async (token: string, searchQuery: string) => {
  try {
    const url = `https://drugaksiazka.pl/api/books/v1/search_users_with_title/?searchQuery=${encodeURIComponent(searchQuery)}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Token ${token}`
      }
    });
    return response.data;
  } catch (error) {
    return null;
  }
}

export const getLastAddedOffers = async (token: string, pageSize: string, pageNumber: string) => {
  try {
    const url = `https://drugaksiazka.pl/api/books/v2/get_last_added_offers?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    const response = await axios.get(url)
    return response.data;
  } catch (error) {
    return null;
  }
}

export const sendMessage = async (token: string, recipient: string, message: string) => {
  try {
    const payload = {
      recipient: recipient,
      message: message,
      isRead: false,
    };
    const response = await axios.post("https://drugaksiazka.pl/api/messages/v1/send_message/", 
      payload,
      {
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      } );
    return response.data;
  } catch (error) {
    return null;
  }
}

export const getAllConversations = async (token: string) => {
  try {
    const url = `https://drugaksiazka.pl/api/messages/v1/get_all_conversations/`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Token ${token}`
      }
    });
    return response.data;
  } catch (error) {
    return null;
  }
}

export const readMessage = async (token: string, recipant: string) => {
  try {
    const payload = {
      recipant: recipant,
    };
    const response = await axios.post("https://drugaksiazka.pl/api/messages/v1/read_messages/", 
      payload,
      {
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      } );
    return response.data;
  } catch (error) {
    return null;
  }
};

export const updateUserPhoneNumber = async (phoneNumber: string, token: string) => {
  const payload = {
    phoneNumber: phoneNumber,
  };
  const response = await axios.patch(
    'https://drugaksiazka.pl/api/auth/v1/update_user_phone_number/',
    payload,
    {
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
};

export const deleteUser = async (token: string) => {
  try {
    const response = await axios.delete(
      'https://drugaksiazka.pl/api/auth/v1/delete_user/',
      {
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    return null;
  }
};

export const checkIsbn = async (isbn: string, token: string) => {
  try {
    const url = `https://drugaksiazka.pl/api/books/v1/check_isbn?isbn=${encodeURIComponent(isbn)}`;
    await axios.get(
      url,
      {
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return true;
  } catch (error) {
    return false;
  }
};