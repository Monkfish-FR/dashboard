export interface StructureUI {
  id: number,
  title: string,
  alias: string | null,
  subtitle: string | null,
  siret: string | null,
  address: string,
  locality: string,
}

export interface StructureFormUI {
  structure: number,
  reloadStructures: Function,
}

export interface StructuresListUI {
  structures: StructureUI[],
  handleStructureDelete: (id: number, title: string) => void,
}

export interface StructuresListRowUI {
  structure: StructureUI,
  handleStructureDelete: (id: number, title: string) => void,
}

// If you modify these props,
// don't forget to forward the changes
// to the `/routes/index.ts` file.
export interface StructuresProps { }

export interface StructuresState {
  structure: number,
  structures: StructureUI[],
  loading: boolean,
}
