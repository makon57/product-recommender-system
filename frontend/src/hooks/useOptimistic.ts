// Optimistic update hooks for better UX
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addToCart, removeFromCart } from '../services/cart';

import type { CartItem } from '../services/cart';

/**
 * Optimistic cart operations that immediately update the UI
 */
export const useOptimisticCart = () => {
  const queryClient = useQueryClient();

  const addToCartOptimistic = useMutation({
    mutationFn: addToCart,
    onMutate: async (newItem: CartItem) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['cart', newItem.user_id] });

      // Snapshot the previous value
      const previousCart = queryClient.getQueryData(['cart', newItem.user_id]);

      // Optimistically update to the new value
      queryClient.setQueryData(
        ['cart', newItem.user_id],
        (old: CartItem[] = []) => {
          const existingItemIndex = old.findIndex(
            item => item.product_id === newItem.product_id
          );

          if (existingItemIndex > -1) {
            // Update existing item quantity
            const updated = [...old];
            updated[existingItemIndex] = {
              ...updated[existingItemIndex],
              quantity:
                (updated[existingItemIndex].quantity || 1) +
                (newItem.quantity || 1),
            };
            return updated;
          } else {
            // Add new item
            return [...old, newItem];
          }
        }
      );

      // Return a context object with the snapshotted value
      return { previousCart };
    },
    onError: (_err, newItem, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousCart) {
        queryClient.setQueryData(
          ['cart', newItem.user_id],
          context.previousCart
        );
      }
    },
    onSettled: (_data, _error, newItem) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['cart', newItem.user_id] });
    },
  });

  const removeFromCartOptimistic = useMutation({
    mutationFn: removeFromCart,
    onMutate: async (item: CartItem) => {
      await queryClient.cancelQueries({ queryKey: ['cart', item.user_id] });
      const previousCart = queryClient.getQueryData(['cart', item.user_id]);

      queryClient.setQueryData(['cart', item.user_id], (old: CartItem[] = []) =>
        old.filter(cartItem => cartItem.product_id !== item.product_id)
      );

      return { previousCart };
    },
    onError: (_err, item, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(['cart', item.user_id], context.previousCart);
      }
    },
    onSettled: (_data, _error, item) => {
      queryClient.invalidateQueries({ queryKey: ['cart', item.user_id] });
    },
  });

  return {
    addToCart: addToCartOptimistic,
    removeFromCart: removeFromCartOptimistic,
  };
};
