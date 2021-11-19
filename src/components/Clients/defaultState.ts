import { ClientUI } from './interfaces';
import { structureDefault } from '../Structures/defaultState';

export const clientDefault: ClientUI = {
  id: 0,
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  structure: 0,
  structureData: {
    ...structureDefault,
  },
};
