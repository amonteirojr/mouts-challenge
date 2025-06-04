'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Container,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useUsers } from '@/features/users/api/useUsers';
import { UserTable } from '@/features/users/components/UserTable';
import { useUserSearch } from '@/features/users/hooks/useUserSearch';

export default function UsersPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const { data, isLoading } = useUsers();
  const filteredUsers = useUserSearch(data?.users, search);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ p: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Typography variant="h4" component="h1">
            Usuários
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => router.push('/users/new')}
          >
            Novo Usuário
          </Button>
        </Box>

        <TextField
          fullWidth
          label="Pesquisar usuários"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mb: 2 }}
        />

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <UserTable users={filteredUsers} isLoading={isLoading} />
        )}
      </Box>
    </Container>
  );
} 