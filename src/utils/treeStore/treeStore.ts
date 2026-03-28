import { TreeId, TreeNode } from '@/utils/types';

export class TreeStore<T extends TreeNode = TreeNode> {
  private nodes: T[];
  private readonly initialNodes: T[];
  private readonly itemById: Map<TreeId, T>;
  private readonly childrenByParentId: Map<TreeId | null, TreeId[]>;

  constructor(data: T[]) {
    this.nodes = [...data];
    this.initialNodes = data;
    this.itemById = new Map(data.map((item) => [item.id, item]));
    this.childrenByParentId = new Map<TreeId | null, TreeId[]>();

    for (const node of data) {
      this.addParent(node);
    }
  }

  private addParent(item: T) {
    const key = item.parent;
    if (!this.childrenByParentId.has(key)) {
      this.childrenByParentId.set(key, []);
    }
    this.childrenByParentId.get(key)!.push(item.id);
  }

  /**
   * Возвращает оригинальный массив.
   *
   * @returns плоский список
   */
  getAll() {
    return this.initialNodes;
  }

  /**
   * Возвращает узел по id.
   *
   * @param id - идентификатор узла
   * @returns объект
   */
  getItem(id: TreeId) {
    return this.itemById.get(id);
  }

  /**
   * Возвращает непосредственных детей узла по id.
   *
   * @param id - идентификатор узла
   * @returns массив детей (возможно пустой)
   */
  getChildren(id: TreeId) {
    return (this.childrenByParentId.get(id) || []).map((childId) => this.itemById.get(childId)!);
  }

  /**
   * Возвращает всех потомков (всех уровней) узла по id через BFS.
   *
   * @param id - идентификатор узла
   * @returns массив всех потомков (может быть пустым)
   */
  getAllChildren(id: TreeId) {
    const result: T[] = [];
    const queue: T[] = this.getChildren(id);
    let queueIndex = 0;

    while (queueIndex < queue.length) {
      const node = queue[queueIndex++];
      result.push(node);

      queue.push(...this.getChildren(node.id));
    }

    return result;
  }

  /**
   * Возвращает все родительские узлы (включая сам узел) до корня.
   *
   * @param id - идентификатор узла
   * @returns массив родителей (от узла до корня)
   */
  getAllParents(id: TreeId) {
    const result: T[] = [];
    let current = this.getItem(id);

    while (current) {
      result.push(current);
      current = current.parent != null ? this.getItem(current.parent) : undefined;
    }
    return result;
  }

  /**
   * Добавляет новый узел в дерево.
   *
   * @param item - объект узла
   */
  addItem(item: T) {
    this.nodes.push(item);
    this.itemById.set(item.id, item);
    this.addParent(item);
  }

  private removeChildTree(id: TreeId): void {
    const children = this.getChildren(id);
    if (children) {
      for (const child of children) {
        this.removeItem(child.id);
      }
    }
  }

  /**
   * Удаляет узел по id из дерева и всех индексов.
   *
   * @param id - идентификатор узла
   */
  removeItem(id: TreeId) {
    const item = this.getItem(id);
    if (!item) return;

    const index = this.nodes.indexOf(item);
    if (index !== -1) {
      this.nodes.splice(index, 1);
    }

    this.itemById.delete(id);

    // удаляем как дочку у родителя
    const parentId = item.parent;
    const children = this.childrenByParentId.get(parentId);
    if (children) {
      const index = children.findIndex((it) => it === id);
      if (index !== -1) {
        children.splice(index, 1);
      }
    }

    this.removeChildTree(id);
  }

  /**
   * Обновляет узел по id, заменяя его объект во всех индексах.
   *
   * @param newItem - обновлённый объект узла
   */
  updateItem(newItem: T) {
    const id = newItem.id;
    const item = this.getItem(id);
    if (!item) return;

    const index = this.nodes.findIndex((it) => it.id === id);
    if (index !== -1) {
      this.nodes[index] = newItem;
    }

    this.itemById.set(id, newItem);

    const oldParent = item.parent;
    const newParent = newItem.parent;

    if (oldParent !== newParent) {
      const oldParentChildren = this.childrenByParentId.get(oldParent);
      if (oldParentChildren) {
        const childIndex = oldParentChildren.findIndex((it) => it === id);
        if (childIndex !== -1) {
          oldParentChildren.splice(childIndex, 1);
        }
      }

      if (!this.childrenByParentId.has(newParent)) {
        this.childrenByParentId.set(newParent, []);
      }
      this.childrenByParentId.get(newParent)!.push(id);
    }
  }
}
