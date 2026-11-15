export const categoryDisplayNames = {
  accessories: "Accessories",
  clothing: "Clothing",
  home: "Kitchen & Home",
} as const;

export type MainCategoryId = keyof typeof categoryDisplayNames;

export const mainCategoryIds = Object.keys(categoryDisplayNames) as MainCategoryId[];

export const getMainCategoryId = (category: string): MainCategoryId | "other" => {
  const value = category.toLowerCase();

  if (/(phone|mobile|laptop|computer|electronics|audio|watch|shoe)/.test(value)) {
    return "accessories";
  }
  if (/(shirt|clothing|men|women|beauty|makeup|apparel|top|dress|jewell?ery)/.test(value)) {
    return "clothing";
  }
  if (/(home|furniture|kitchen|grocer|decor)/.test(value)) {
    return "home";
  }
  return "other";
};

export const getCategoryDisplayName = (categoryId: string): string => {
  return categoryDisplayNames[categoryId as MainCategoryId] || categoryId;
};
