type Item = {
  id: string | number;
  parent: string | number | null;
  label: string;
};
export const mockData: Item[] = [
  { id: 'a', parent: null, label: 'a' },
  { id: 'b', parent: 'a', label: 'b' },
  { id: 'c', parent: 'a', label: 'c' },
  { id: 'd', parent: 'b', label: 'd' },
  { id: 'e', parent: 'b', label: 'e' },
];

export const mockNumericData: Item[] = [
  { id: 1, parent: null, label: '1' },
  { id: 2, parent: 1, label: '2' },
  { id: 3, parent: 1, label: '3' },
  { id: 4, parent: 2, label: '4' },
];
