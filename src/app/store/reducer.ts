import { createReducer, on } from '@ngrx/store';
import { login, role } from './action';

export interface Status {
  isLogin: boolean;
  role: string;
}

export const initialState: Status = {
  isLogin: JSON.parse(localStorage.getItem('isLogin') || 'false'),
  role: localStorage.getItem('role') || ''
};

export const Reducer = createReducer(
  initialState,
  on(login, (state, { isLogin }) => ({ ...state, isLogin: isLogin })),
  on(role, (state, { role }) => ({ ...state, role: role }))
);
