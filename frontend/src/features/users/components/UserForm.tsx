import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
} from '@mui/material';
import type { User, CreateUserDTO } from '../types';

interface UserFormProps {
  user?: User;
  onSubmit: (data: CreateUserDTO) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const UserForm = ({ user, onSubmit, onCancel, isLoading }: UserFormProps) => {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CreateUserDTO & { confirmPassword: string }>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const password = watch('password');

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        password: '',
        confirmPassword: '',
      });
    }
  }, [user, reset]);

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        maxWidth: 600,
        mx: 'auto',
        p: 3,
      }}
    >
      <Typography variant="h5" component="h2" gutterBottom>
        {user ? 'Editar Usuário' : 'Criar Usuário'}
      </Typography>

      <Controller
        name="name"
        control={control}
        rules={{ required: 'Nome é obrigatório' }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Nome"
            error={!!errors.name}
            helperText={errors.name?.message}
            fullWidth
          />
        )}
      />

      <Controller
        name="email"
        control={control}
        rules={{
          required: 'Email é obrigatório',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'E-mail inválido',
          },
        }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Email"
            type="email"
            error={!!errors.email}
            helperText={errors.email?.message}
            fullWidth
          />
        )}
      />

      <Controller
        name="password"
        control={control}
        rules={{
          required: !user && 'Senha é obrigatória',
          minLength: {
            value: 6,
            message: 'A senha deve ter no mínimo 6 caracteres',
          },
        }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Senha"
            type="password"
            error={!!errors.password}
            helperText={errors.password?.message}
            fullWidth
          />
        )}
      />

      <Controller
        name="confirmPassword"
        control={control}
        rules={{
          required: !user && 'Confirmação de senha é obrigatória',
          validate: (value) =>
            value === password || 'As senhas não coincidem',
        }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Confirmar Senha"
            type="password"
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            fullWidth
          />
        )}
      />

      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
        <Button
          type="button"
          variant="outlined"
          size="large"
          onClick={onCancel}
          disabled={isLoading}
          fullWidth
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={isLoading}
          fullWidth
        >
          {isLoading ? 'Salvando...' : user ? 'Atualizar Usuário' : 'Criar Usuário'}
        </Button>

      </Stack>
    </Box>
  );
}; 