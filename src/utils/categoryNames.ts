export const categoryDisplayNames: Record<string, string> = {
  accessories: "Accessories",
  clothing: "Clothing",
  home: "Kitchen & Home",
};

export const getCategoryDisplayName = (categoryId: string): string => {
  return categoryDisplayNames[categoryId] || categoryId;
};
