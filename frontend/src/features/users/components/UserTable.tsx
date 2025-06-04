import { useRouter } from 'next/navigation';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import type { User } from '../types';
import { useDeleteUser } from '../api/useUsers';
import { ConfirmDialog } from './ConfirmDialog';
import { DataTable, type Column, type Action } from '@/components/DataTable';
import { useState } from 'react';
import { enqueueSnackbar } from 'notistack';

interface UserTableProps {
  users: User[];
  isLoading: boolean;
}

export const UserTable = ({ users, isLoading }: UserTableProps) => {
  const router = useRouter();
  const deleteUser = useDeleteUser();
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; userId: string | null }>({
    open: false,
    userId: null,
  });

  const columns: Column<User>[] = [
    { id: 'name', label: 'Nome' },
    { id: 'email', label: 'Email' },
    {
      id: 'createdAt',
      label: 'Data de Criação',
      render: (user) => new Date(user.createdAt).toLocaleDateString('pt-BR'),
    },
  ];

  const actions: Action<User>[] = [
    {
      icon: <EditIcon />,
      tooltip: 'Editar',
      onClick: (user) => router.push(`/users/${user.id}/edit`),
    },
    {
      icon: <DeleteIcon />,
      tooltip: 'Deletar',
      onClick: (user) => setDeleteDialog({ open: true, userId: user.id }),
      color: 'error',
    },
  ];

  const handleDeleteConfirm = async () => {
    if (deleteDialog.userId) {
      await deleteUser.mutateAsync(deleteDialog.userId);
      setDeleteDialog({ open: false, userId: null });
      enqueueSnackbar('Usuário deletado com sucesso!', { variant: 'success' });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, userId: null });
  };

  return (
    <>
      <DataTable
        data={users}
        columns={columns}
        actions={actions}
        isLoading={isLoading}
        getRowId={(user) => user.id}
        labelRowsPerPage="Usuários por página"
      />
      <ConfirmDialog
        open={deleteDialog.open}
        title="Confirmar exclusão"
        message="Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita."
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </>
  );
}; 