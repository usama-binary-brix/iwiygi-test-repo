export const apiEndpoints = {
    signIn: {
      url: "/api/auth/signin",
      method: "POST",
    },
    signup: {
      url: "/api/auth/signup",
      method: "POST",
    },
    forgotPassword: {
      url: "/api/auth/forgotPassword",
      method: "POST",
    },
    resendVerificationEmail: {
      url: "/api/auth/resendVerificationEmail",
      method: "POST",
    },
    getAds: {
      url: "/api/admin/fetchAllAds",
      method: "GET",
    },
    fetchPopularCategories: {
      url: "/api/categories/popularCategoriesList",
      method: "GET",
    },
    fetchNormalCategories: {
      url: "/api/categories/categoriesList",
      method: "GET",
    },
    searchByCategory: {
      url: "/api/listings/searchByCategory",
      method: "GET",
    },
    fetchAllListings: {
      url: "/api/listings/fetchAllListings",
      method: "GET",
    },
    getListingDetails: {
      url: "/api/listings/fetchListingBySlug",
      method: "GET",
    },
    getListingMessagesByUserId: {
      url: "/api/listings/fetchListingMessagesByUserId",
      method: "GET",
    },
    getMessagesConversationSeller: {
      url: "/api/chat/getMessagesConversationSeller",
      method: "GET",
    },
    getMessagesConversationBuyer: {
      url: "/api/chat/getMessagesConversationBuyer",
      method: "GET",
    },
    updateUserInfo: {
      url: "/api/auth/updateShippingAddress",
      method: "POST",
    },
    updateUserContactInfo: {
      url: "/api/auth/updateContactInformation",
      method: "POST",
    },
    
  };
  