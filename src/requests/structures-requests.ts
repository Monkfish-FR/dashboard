import * as requests from './index';

import { StructureUI } from '../components/Structures/interfaces';

const TABLE_NAME = 'structures';
interface thisType extends StructureUI {}

export async function allStructures(): Promise<thisType[]> {
  return requests.all(TABLE_NAME);
}

export async function getStructure(id: number): Promise<thisType> {
  return requests.one(TABLE_NAME, id);
}

export async function addStructure(
  data: thisType,
  apiMessage: string = '',
  apiError: any = null,
): Promise<string> {
  return requests.add(TABLE_NAME, { data, apiMessage, apiError });
}

export async function editStructure(
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

export async function deleteStructure(
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

export async function resetStructures(
  apiMessage: string = '',
  apiError: any = null,
): Promise<string> {
  return requests.reset(TABLE_NAME, {
    apiMessage,
    apiError,
  });
}
