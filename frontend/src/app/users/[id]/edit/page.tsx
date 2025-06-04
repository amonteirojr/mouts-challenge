'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Paper, Typography } from '@mui/material';
import { UserForm } from '@/features/users/components/UserForm';
import { useUser, useUpdateUser } from '@/features/users/api/useUsers';
import { useSnackbar } from 'notistack';

interface EditUserPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditUserPage({ params }: EditUserPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { data: user, isLoading: isLoadingUser } = useUser(id);
  const updateUser = useUpdateUser();

  const handleSubmit = async (data: any) => {
    try {
      const userData = {
        id,
        ...data,
        password: data.password.trim() === '' ? null : data.password,
      }
      await updateUser.mutateAsync(userData);
      enqueueSnackbar('Usuário atualizado com sucesso!', { variant: 'success' });
      router.push('/users');
    } catch (error: unknown) {
      console.log(error);
      enqueueSnackbar('Falha ao atualizar o usuário.', { variant: 'error' });
    }
  };

  const handleCancel = () => {
    router.push('/users');
  };

  if (isLoadingUser) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>Carregando...</Typography>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography color="error">Usuário não encontrado</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Editar usuário
        </Typography>
        <UserForm
          user={user}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={updateUser.isPending}
        />
      </Paper>
    </Container>
  );
} 