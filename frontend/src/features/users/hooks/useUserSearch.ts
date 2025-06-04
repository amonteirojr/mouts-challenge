import { useMemo } from 'react';
import type { User } from '../types';

export function useUserSearch(users: User[] | undefined, searchTerm: string) {
  const filteredUsers = useMemo(() => {
    if (!users) return [];
    if (!searchTerm.trim()) return users;

    const searchLower = searchTerm.toLowerCase().trim();

    return users.filter((user) => {
      const nameMatch = user.name.toLowerCase().includes(searchLower);
      const emailMatch = user.email.toLowerCase().includes(searchLower);

      return nameMatch || emailMatch;
    });
  }, [users, searchTerm]);

  return filteredUsers;
} 