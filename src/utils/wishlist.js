const WISHLIST_KEY = "wishlist";

// Get wishlist items from localStorage
export const getWishlistItems = () => {
  try {
    const storedWishlist = localStorage.getItem(WISHLIST_KEY);

    if (!storedWishlist) {
      return [];
    }

    const wishlist = JSON.parse(storedWishlist);

    return Array.isArray(wishlist) ? wishlist : [];
  } catch (error) {
    console.error("Error reading wishlist:", error);
    return [];
  }
};

// Save wishlist items to localStorage
export const saveWishlistItems = (items) => {
  try {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));

    // Notify other components that wishlist changed
    window.dispatchEvent(new Event("wishlistUpdated"));
  } catch (error) {
    console.error("Error saving wishlist:", error);
  }
};

// Check whether a product is already in wishlist
export const isInWishlist = (productId) => {
  const wishlist = getWishlistItems();

  return wishlist.some(
    (item) => String(item.id) === String(productId)
  );
};

// Add a product to wishlist
export const addToWishlist = (product) => {
  if (!product?.id) {
    return false;
  }

  const wishlist = getWishlistItems();

  const alreadyExists = wishlist.some(
    (item) => String(item.id) === String(product.id)
  );

  if (alreadyExists) {
    return false;
  }

  const updatedWishlist = [
    ...wishlist,
    {
      ...product,
      addedAt: Date.now(),
    },
  ];

  saveWishlistItems(updatedWishlist);

  return true;
};

// Remove a product from wishlist
export const removeFromWishlist = (productId) => {
  const wishlist = getWishlistItems();

  const updatedWishlist = wishlist.filter(
    (item) => String(item.id) !== String(productId)
  );

  saveWishlistItems(updatedWishlist);

  return updatedWishlist;
};

// Get wishlist count
export const getWishlistCount = () => {
  return getWishlistItems().length;
};

// Clear entire wishlist
export const clearWishlist = () => {
  saveWishlistItems([]);
};