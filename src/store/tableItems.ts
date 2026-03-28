import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';

import type { TreeNode, TreeId } from '@/utils/types';
import { TreeStore } from '@/utils/treeStore/treeStore';
import type { TreeStore as TreeStoreType } from '@/utils/treeStore/treeStore';

type TableRow = TreeNode & { category: string; isGroup: boolean };

export const useTableItems = defineStore('tableItems', () => {
  const treeStore = ref<TreeStoreType<TreeNode> | null>(null);
  const items = ref<TableRow[]>([]);

  const toItemRow = (item: TreeNode): TableRow => {
    const hasChildren = (treeStore.value?.getChildren(item.id) || []).length > 0;
    return {
      ...item,
      isGroup: hasChildren,
      category: hasChildren ? 'Группа' : 'Элемент',
    };
  };

  const init = (data: TreeNode[]) => {
    const store = new TreeStore(data);
    treeStore.value = store;

    // синхронизируем items с TreeStore
    watch(
      () => store.getAll(),
      (newItems) => {
        items.value = newItems.map(toItemRow);
      },
      { immediate: true },
    );
  };

  const addItem = (item: TreeNode) => {
    const store = treeStore.value;
    if (!store) return;

    store.addItem(item);
  };

  const updateItem = (newItem: TreeNode) => {
    const store = treeStore.value;
    if (!store) return;

    store.updateItem(newItem);
  };

  const removeItem = (id: TreeId) => {
    const store = treeStore.value;
    if (!store) return;

    store.removeItem(id);
  };

  const clearAll = () => {
    const store = treeStore.value;
    if (!store) return;
  };

  const isEmpty = computed(() => items.value.length === 0);

  return {
    init,
    addItem,
    updateItem,
    removeItem,
    clearAll,

    items,
    isEmpty,
  };
});
