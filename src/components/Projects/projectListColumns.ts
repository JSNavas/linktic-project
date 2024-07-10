export const columns = [
  {
    name: 'name',
    label: 'Nombre',
    field: 'name',
    align: 'left',
    sortable: true,
  },
  {
    name: 'description',
    label: 'Descripción',
    field: 'description',
    align: 'left',
    sortable: true,
  },
  {
    name: 'status',
    label: 'Estado',
    field: (row: string) => row.status,
    align: 'left',
    sortable: true,
  },
  {
    name: 'actions',
    required: true,
    label: '',
    align: 'center',
    field: 'actions',
  },
];
