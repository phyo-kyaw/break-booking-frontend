import { createAction, props } from '@ngrx/store';

export const login = createAction(
  'store login status',
  props<{ isLogin: boolean }>()
);
export const role = createAction('role', props<{ role: string | undefined }>());
