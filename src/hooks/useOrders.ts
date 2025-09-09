import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Order } from '@/types/product';

export const useOrders = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createOrder = async (orderData: Omit<Order, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar pedido';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['payment_status']) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('orders')
        .update({ payment_status: status })
        .eq('id', orderId);

      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar pedido');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createOrder, updateOrderStatus, loading, error };
};