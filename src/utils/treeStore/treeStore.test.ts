import { describe, it, expect } from 'vitest';
import { TreeStore } from './treeStore';

import { mockData as data, mockNumericData as numbersData } from '@/__tests__/mocks';

/**
 * Тестовое дерево:
 * - a (root)
 *   - b
 *     - d
 *     - e
 *   - c
 */
describe('TreeStore', () => {
  describe('constructor', () => {
    it('сохраняет initialNodes без изменений', () => {
      const tree = new TreeStore(data);
      expect(tree.getAll()).toBe(data);
    });

    it('строит индексы itemById и childrenByParentId', () => {
      const tree = new TreeStore(data);

      expect(tree.getItem('a')).toEqual({ id: 'a', parent: null, label: 'a' });
      expect(tree.getChildren('a').map((i) => i.id)).toEqual(['b', 'c']);
      expect(tree.getChildren('b').map((i) => i.id)).toEqual(['d', 'e']);
      expect(tree.getChildren('c')).toEqual([]);
    });

    it('работает с numeric id', () => {
      const tree = new TreeStore(numbersData);

      expect(tree.getItem(1)).toEqual({ id: 1, parent: null, label: '1' });
      expect(tree.getChildren(1).map((i) => i.id)).toEqual([2, 3]);
      expect(tree.getChildren(2).map((i) => i.id)).toEqual([4]);
    });
  });

  describe('getAll()', () => {
    it('возвращает оригинальный массив', () => {
      const tree = new TreeStore(data);
      expect(tree.getAll()).toBe(data);
    });
  });

  describe('getItem(id)', () => {
    it('возвращает узел по id', () => {
      const tree = new TreeStore(data);
      const a = tree.getItem('a');
      const b = tree.getItem('b');

      expect(a?.id).toBe('a');
      expect(b?.id).toBe('b');
    });

    it('возвращает undefined для несуществующего id', () => {
      const tree = new TreeStore(data);
      expect(tree.getItem('x')).toBeUndefined();
    });
  });

  describe('getChildren(id)', () => {
    it('возвращает непосредственных детей', () => {
      const tree = new TreeStore(data);

      expect(tree.getChildren('a').map((i) => i.id)).toEqual(['b', 'c']);
      expect(tree.getChildren('b').map((i) => i.id)).toEqual(['d', 'e']);
      expect(tree.getChildren('c')).toEqual([]);
    });

    it('возвращает пустой массив для несуществующего id', () => {
      const tree = new TreeStore(data);
      expect(tree.getChildren('x')).toEqual([]);
    });
  });

  describe('getAllChildren(id)', () => {
    it('возвращает всех потомков', () => {
      const tree = new TreeStore(data);

      expect(tree.getAllChildren('a').map((i) => i.id)).toEqual(['b', 'c', 'd', 'e']);
      expect(tree.getAllChildren('b').map((i) => i.id)).toEqual(['d', 'e']);
      expect(tree.getAllChildren('c')).toEqual([]);
    });

    it('возвращает пустой массив для несуществующего id', () => {
      const tree = new TreeStore(data);
      expect(tree.getAllChildren('x')).toEqual([]);
    });
  });

  describe('getAllParents(id)', () => {
    it('возвращает цепочку родителей до корня', () => {
      const tree = new TreeStore(data);

      expect(tree.getAllParents('d').map((i) => i.id)).toEqual(['d', 'b', 'a']);
      expect(tree.getAllParents('b').map((i) => i.id)).toEqual(['b', 'a']);
      expect(tree.getAllParents('a').map((i) => i.id)).toEqual(['a']);
    });

    it('возвращает пустой массив для несуществующего id', () => {
      const tree = new TreeStore(data);
      expect(tree.getAllParents('x')).toEqual([]);
    });
  });

  describe('addItem(item)', () => {
    it('добавляет узел в дерево и индексы', () => {
      const tree = new TreeStore(data);
      const f = { id: 'f', parent: 'c', label: 'f' };

      tree.addItem(f);

      expect(tree.getItem('f')).toEqual(f);
      expect(tree.getChildren('c').map((i) => i.id)).toEqual(['f']);
      expect(tree.getAllChildren('a').map((i) => i.id)).toContain('f');
    });

    it('работает с numeric id', () => {
      const tree = new TreeStore(data);

      const n = { id: 100, parent: 'a', label: '100' };
      tree.addItem(n);

      expect(tree.getItem(100)).toEqual(n);
      expect(tree.getChildren('a').map((i) => i.id)).toEqual(['b', 'c', 100]);
    });
  });

  describe('removeItem(id)', () => {
    it('удаляет узел', () => {
      const tree = new TreeStore(data);

      tree.removeItem('b');

      expect(tree.getItem('b')).toBeUndefined();
      expect(tree.getChildren('a').map((i) => i.id)).toEqual(['c']);
      expect(tree.getAllChildren('a').map((i) => i.id)).toEqual(['c']);
      expect(tree.getChildren('b')).toEqual([]); // индекс родителя удалён
    });

    it('удаляет всё поддерево', () => {
      const tree = new TreeStore(data);

      tree.removeItem('b');

      expect(tree.getItem('b')).toBeUndefined();
      expect(tree.getItem('d')).toBeUndefined();
      expect(tree.getItem('e')).toBeUndefined();
    });

    it('ничего не делает, если id не существует', () => {
      const tree = new TreeStore(data);
      const old = tree.getAllChildren('a').map((i) => i.id);

      tree.removeItem('x');

      expect(tree.getAllChildren('a').map((i) => i.id)).toEqual(old);
    });

    it('корректно удаляет корень', () => {
      const tree = new TreeStore(data);

      tree.removeItem('a');

      expect(tree.getItem('a')).toBeUndefined();
      expect(tree.getAllChildren('a')).toEqual([]); // даже если бы кто‑то ещё ссылался
    });
  });

  describe('updateItem(newItem)', () => {
    it('обновляет поля узла', () => {
      const tree = new TreeStore(data);
      const oldB = tree.getItem('b')!;

      const newB = { ...oldB, label: 'B-new' };
      tree.updateItem(newB);

      const updatedB = tree.getItem('b')!;
      expect(updatedB.label).toBe('B-new');
      expect(updatedB.id).toBe('b');
    });

    it('не делает ничего, если id не существует', () => {
      const tree = new TreeStore(data);

      tree.updateItem({ id: 'x', parent: 'a', label: 'x' });

      expect(tree.getItem('x')).toBeUndefined();
    });

    it('переносит узел в новый parent', () => {
      const tree = new TreeStore(data);

      const oldB = tree.getItem('b')!;
      const newB = { ...oldB, parent: 'c' };

      tree.updateItem(newB);

      expect(tree.getChildren('a').map((i) => i.id)).toEqual(['c']);
      expect(tree.getChildren('c').map((i) => i.id)).toEqual(['b']);
    });
  });
});
