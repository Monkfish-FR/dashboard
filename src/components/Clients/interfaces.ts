import { StructureUI } from '../Structures/interfaces';

export interface ClientUI {
  id: number,
  firstName: string,
  lastName: string,
  email: string,
  phone: string | null,
  structure: number,
  structureData: StructureUI,
}

export interface ClientFormUI {
  client: number,
  reloadClients: Function,
}

export interface ClientsListUI {
  clients: ClientUI[],
  handleClientDelete: (id: number) => void,
}

export interface ClientsListRowUI {
  client: ClientUI,
  handleClientDelete: (id: number) => void,
}

// If you modify these props,
// don't forget to forward the changes
// to the `/routes/index.ts` file.
export interface ClientsProps { }

export interface ClientsState {
  client: number,
  clients: ClientUI[],
  loading: boolean,
}
