const BASE = "https://fakestoreapi.com";

async function handle(res) {
  if (!res.ok) throw new Error(`FakeStore API error: ${res.status}`);
  return res.json();
}

export const fakestoreApi = {
  getProducts: () => fetch(`${BASE}/products`).then(handle),
  getProduct: (id) => fetch(`${BASE}/products/${id}`).then(handle),
  getCategories: () => fetch(`${BASE}/products/categories`).then(handle),
  getByCategory: (cat) =>
    fetch(`${BASE}/products/category/${encodeURIComponent(cat)}`).then(handle),
};
