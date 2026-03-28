<template>
  <div class="treeview__container">
    <div class="treeview__wrapper">
      <ag-grid-vue
        :treeData="true"
        :columnDefs="columnDefs"
        :rowData="tableItems.items"
        treeDataParentIdField="parent"
        :getRowId="getRowId"
        :getRowClass="getRowClass"
        :autoGroupColumnDef="autoGroupColumnDef"
        :defaultColDef="defaultColDef"
        :groupDefaultExpanded="-1"
        style="width: 100%; height: 100%"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { AgGridVue } from 'ag-grid-vue3';
  import { useTableItems } from '@/store/tableItems';
  import { onMounted } from 'vue';
  import { ColDef, GetRowIdFunc, RowClassParams } from 'ag-grid-community';
  import { getData } from '@/utils/data';
  import { TreeNode } from '@/utils/types';

  const tableItems = useTableItems();

  const getRowId: GetRowIdFunc = (params) => params.data.id;

  const defaultColDef = {
    resizable: false, // отключает resize для всех колонок
    sortable: true,
  };

  const autoGroupColumnDef = {
    headerName: 'Категория',
    field: 'category',
    cellRenderer: 'agGroupCellRenderer',
    cellRendererParams: {
      suppressCount: true,
    },
  };
  const columnDefs: ColDef<TreeNode>[] = [
    {
      field: 'id',
      headerName: '№ п\\п',
      sortable: true,
      pinned: 'left',
      width: 80,
      cellStyle: { textAlign: 'center' },
    },
    { field: 'name', headerName: 'Наименование', sortable: true, flex: 1 },
  ];

  const getRowClass = (params: RowClassParams<TreeNode>) => {
    if (params.data?.isGroup) {
      return 'treeview__group-row';
    }
    return '';
  };

  const loadData = () => {
    tableItems.init(getData());
  };

  onMounted(() => {
    loadData();
  });
</script>

<style lang="scss">
  .treeview {
    &__group-row {
      font-weight: 500;
    }
  }
</style>
