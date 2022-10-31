import { atom } from 'recoil';
import { v1 } from 'uuid';

export const menuState = atom({
  key: `MENU_STATE/${v1()}`,
  default: false,
});
