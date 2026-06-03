import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

/**
 * Fetch all agents
 */
export const useAgents = (filters = {}) => {
  return useQuery({
    queryKey: ['agents', filters],
    queryFn: async () => {
      const { data } = await api.get('/agents', { params: filters });
      return data.data;
    },
  });
};

/**
 * Fetch single agent
 */
export const useAgent = (id) => {
  return useQuery({
    queryKey: ['agent', id],
    queryFn: async () => {
      const { data } = await api.get(`/agents/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
};

/**
 * Create agent mutation
 */
export const useCreateAgent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (agentData) => {
      const { data } = await api.post('/agents', agentData);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
    },
  });
};

/**
 * Fetch listings
 */
export const useListings = () => {
  return useQuery({
    queryKey: ['listings'],
    queryFn: async () => {
      const { data } = await api.get('/listings');
      return data.data;
    },
  });
};

