import { atom } from 'recoil';
import { v1 } from 'uuid';

export const defaultUser = {
  l1: {
    address: '',
  },
  l2: {
    register: false,
    name: '',
    index: 0, // account index
    pk: '',
  },
};

export const userState = atom({
  key: `LOGIN_STATE/${v1()}`,
  default: {
    ...defaultUser,
  },
});
