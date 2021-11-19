export interface NavLinkUI {
  path: string,
  label: string,
  component: any,
  props?: any,
}

export interface NavLinksListUI {
  routes: NavLinkUI[],
}
