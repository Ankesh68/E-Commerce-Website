import { getCategoryLabel } from "./format";

// Search synonyms for the categories returned by FakeStore. These only make
// the existing API data easier to find - they do not add any products.
const CATEGORY_ALIASES = {
  jewelery: ["jewellery", "jewelry", "jewel"],
  "men's clothing": [
    "mens clothing",
    "menswear",
    "men",
    "man",
    "men clothing",
    "clothes",
    "apparel",
  ],
  "women's clothing": [
    "womens clothing",
    "womenswear",
    "women",
    "woman",
    "women clothing",
    "clothes",
    "apparel",
  ],
  electronics: ["electronic", "tech", "gadgets"],
};

// When the whole query is a category name/synonym, show that category only.
// This prevents "womens" from also matching jewellery titles containing
// "Women's", while broader queries still search titles and categories.
const EXACT_CATEGORY_QUERIES = new Map([
  ["jewelery", ["jewelery"]],
  ["jewellery", ["jewelery"]],
  ["jewelry", ["jewelery"]],
  ["jewel", ["jewelery"]],
  ["men", ["men's clothing"]],
  ["man", ["men's clothing"]],
  ["mens", ["men's clothing"]],
  ["men clothing", ["men's clothing"]],
  ["mens clothing", ["men's clothing"]],
  ["men clothes", ["men's clothing"]],
  ["mens clothes", ["men's clothing"]],
  ["menswear", ["men's clothing"]],
  ["women", ["women's clothing"]],
  ["woman", ["women's clothing"]],
  ["womens", ["women's clothing"]],
  ["women clothing", ["women's clothing"]],
  ["womens clothing", ["women's clothing"]],
  ["women clothes", ["women's clothing"]],
  ["womens clothes", ["women's clothing"]],
  ["womenswear", ["women's clothing"]],
  ["electronics", ["electronics"]],
  ["electronic", ["electronics"]],
  ["tech", ["electronics"]],
  ["gadget", ["electronics"]],
  ["gadgets", ["electronics"]],
  ["clothing", ["men's clothing", "women's clothing"]],
  ["clothes", ["men's clothing", "women's clothing"]],
  ["apparel", ["men's clothing", "women's clothing"]],
]);

function normalizeSearchText(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9-]+/g, " ")
    .trim();
}

// Build searchable words from text. Handles:
//   T-Shirts -> tshirts, t, shirts
//   T Shirt  -> tshirt, t, shirt
function searchTerms(value) {
  const words = normalizeSearchText(value).split(/\s+/).filter(Boolean);
  const terms = new Set();

  words.forEach((word, index) => {
    terms.add(word.replace(/-/g, ""));
    word.split("-").forEach((part) => {
      if (part) terms.add(part);
    });

    // "T Shirt"/"T Shirts" should also be searchable as "tshirt"/"tshirts".
    if (word.length === 1 && words[index + 1]) {
      terms.add(`${word}${words[index + 1].replace(/-/g, "")}`);
    }
  });

  return terms;
}

function productSearchTerms(product) {
  const category = String(product?.category || "");
  const aliases = CATEGORY_ALIASES[category] || [];

  return searchTerms(
    [
      product?.title,
      product?.name,
      category,
      getCategoryLabel(category),
      ...aliases,
    ]
      .filter(Boolean)
      .join(" ")
  );
}

function queryVariants(term) {
  const variants = new Set([term]);
  if (term.length > 3 && term.endsWith("s")) variants.add(term.slice(0, -1));
  return variants;
}

export function matchesProductSearch(product, query) {
  const normalized = normalizeSearchText(query);
  if (!normalized) return true;

  const queryTerms = [...searchTerms(normalized)].filter(
    (term) => term.length > 1
  );
  if (!queryTerms.length) return true;

  const terms = productSearchTerms(product);

  return queryTerms.every((queryTerm) =>
    [...queryVariants(queryTerm)].some((variant) =>
      [...terms].some((term) => term.startsWith(variant))
    )
  );
}

export function filterProducts(products, query) {
  if (!Array.isArray(products)) return [];

  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return products;

  const exactCategories = EXACT_CATEGORY_QUERIES.get(normalizedQuery);
  if (exactCategories) {
    return products.filter((product) =>
      exactCategories.includes(product?.category)
    );
  }

  return products.filter((product) =>
    matchesProductSearch(product, normalizedQuery)
  );
}
