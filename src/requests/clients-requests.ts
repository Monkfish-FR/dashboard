import * as requests from './index';

import { ClientUI } from '../components/Clients/interfaces';

const TABLE_NAME = 'clients';
interface thisType extends ClientUI {}

export async function allClients(): Promise<thisType[]> {
  return requests.all(TABLE_NAME);
}

export async function getClient(id: number): Promise<thisType> {
  return requests.one(TABLE_NAME, id);
}

export async function addClient(
  data: thisType,
  apiMessage: string = '',
  apiError: any = null,
): Promise<string> {
  return requests.add(TABLE_NAME, { data, apiMessage, apiError });
}

export async function editClient(
  id: number,
  data: thisType,
  apiMessage: string = '',
  apiError: any = null,
): Promise<string> {
  return requests.edit(TABLE_NAME, {
    id,
    data,
    apiMessage,
    apiError,
  });
}

export async function deleteClient(
  id: number,
  apiMessage: string = '',
  apiError: any = null,
): Promise<string> {
  return requests.del(TABLE_NAME, {
    id,
    apiMessage,
    apiError,
  });
}

export async function resetClients(
  apiMessage: string = '',
  apiError: any = null,
): Promise<string> {
  return requests.reset(TABLE_NAME, {
    apiMessage,
    apiError,
  });
}
