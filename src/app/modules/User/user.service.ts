const getUser = async (id: string) => {
  console.log("Service: getUser", id);

  return {
    id,
    name: "Demo User",
    email: "demo@example.com",
  };
};

const updateUser = async (id: string, payload: any) => {
  console.log("Service: updateUser", id, payload);

  return {
    id,
    ...payload,
  };
};

const deleteUser = async (id: string) => {
  console.log("Service: deleteUser", id);
};

// WATCHLIST
const getMyWatchlist = async (userId: string) => {
  console.log("Service: getMyWatchlist", userId);

  return [
    { movieId: "1", title: "Batman Begins" },
    { movieId: "2", title: "Inception" },
  ];
};

const addToWatchlist = async (userId: string, movieId: string) => {
  console.log("Service: addToWatchlist", userId, movieId);

  return { userId, movieId };
};

const removeFromWatchlist = async (userId: string, movieId: string) => {
  console.log("Service: removeFromWatchlist", userId, movieId);

  return { userId, movieId };
};

// ACCESS (purchase/rent check)
const checkAccess = async (userId: string, movieId: string) => {
  console.log("Service: checkAccess", userId, movieId);

  return {
    hasAccess: true,
    type: "purchase", // or rent
  };
};

// PURCHASES
const getMyPurchases = async (userId: string) => {
  console.log("Service: getMyPurchases", userId);

  return [
    { movieId: "1", type: "purchase", status: "paid" },
    { movieId: "2", type: "rent", status: "active" },
  ];
};

export const UserService = {
  getUser,
  updateUser,
  deleteUser,
  getMyWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  checkAccess,
  getMyPurchases,
};