export type TreeId = string | number;

export type TreeNode = {
  id: TreeId;
  parent: TreeId | null;
  [key: string]: unknown; // другие поля
};
