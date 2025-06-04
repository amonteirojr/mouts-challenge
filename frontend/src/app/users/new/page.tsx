'use client';

import { useRouter } from 'next/navigation';
import { Container, Paper, Typography } from '@mui/material';
import { UserForm } from '@/features/users/components/UserForm';
import { useCreateUser } from '@/features/users/api/useUsers';
import { useSnackbar } from 'notistack';

export default function NewUserPage() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const createUser = useCreateUser();

  const handleSubmit = async (data: any) => {
    try {
      await createUser.mutateAsync(data);
      enqueueSnackbar('Usuário cadastrado com sucesso!', { variant: 'success' });
      router.push('/users');
    } catch (error: unknown) {
      console.log(error);
      enqueueSnackbar('Falha ao cadastrar o usuário.', { variant: 'error' });
    }
  };

  const handleCancel = () => {
    router.push('/users');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Criar novo usuário
        </Typography>
        <UserForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={createUser.isPending}
        />
      </Paper>
    </Container>
  );
} 