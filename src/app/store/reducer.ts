import { createReducer, on } from '@ngrx/store';
import { login, role } from './action';

export interface Status {
  isLogin: boolean;
  role: string | undefined;
}

export const initialState: Status = {
  isLogin: Boolean(localStorage.getItem('token')) || false,
  role: localStorage.getItem('role') || undefined
};

export const Reducer = createReducer(
  initialState,
  on(login, (state, { isLogin }) => ({ ...state, isLogin: isLogin })),
  on(role, (state, { role }) => ({ ...state, role: role }))
);
