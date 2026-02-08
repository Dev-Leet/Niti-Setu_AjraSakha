import { Middleware, UnknownAction } from '@reduxjs/toolkit';
import { addNotification } from '@store/slices/uiSlice';

export const apiMiddleware: Middleware =
  (store) => (next) => (action: unknown) => {   
    if (
      typeof action === 'object' &&
      action !== null &&
      'type' in action &&
      typeof (action as UnknownAction).type === 'string'
    ) {
      const typedAction = action as UnknownAction;

      if (typedAction.type.endsWith('/rejected')) {
        const errorMessage =
          'payload' in typedAction && typeof typedAction.payload === 'string'
            ? typedAction.payload
            : 'An error occurred';

        store.dispatch(
          addNotification({
            type: 'error',
            message: errorMessage,
          })
        );
      }

      if (typedAction.type.endsWith('/fulfilled')) {
        if (
          typedAction.type.includes('create') ||
          typedAction.type.includes('update') ||
          typedAction.type.includes('delete')
        ) {
          store.dispatch(
            addNotification({
              type: 'success',
              message: 'Operation completed successfully',
            })
          );
        }
      }
    }

    return next(action);
  };
