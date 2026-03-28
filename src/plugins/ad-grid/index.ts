import 'ag-grid-enterprise';

import './style.scss';

import {
  ModuleRegistry,
  ClientSideRowModelModule,
  ValidationModule,
  CellStyleModule,
  RowStyleModule,
} from 'ag-grid-community';
import { TreeDataModule } from 'ag-grid-enterprise';

export function setupAdGrid() {
  ModuleRegistry.registerModules([
    ClientSideRowModelModule,
    TreeDataModule,
    CellStyleModule,
    RowStyleModule,
    ...(process.env.NODE_ENV !== 'production' ? [ValidationModule] : []),
  ]);
}
