import HomePage from '../components/HomePage';
import Clients from '../components/Clients';
import Invoices from '../components/Invoices';
import Quotations from '../components/Quotations';
import Structures from '../components/Structures';

export const APP_ROUTES = [
  {
    path: '/',
    label: 'Home',
    component: HomePage,
  },
  {
    path: '/invoices/',
    label: 'Invoices',
    component: Invoices,
  },
  {
    path: '/quotations/',
    label: 'Quotations',
    component: Quotations,
  },
  {
    path: '/clients/',
    label: 'Clients',
    component: Clients,
  },
  {
    path: '/structures/',
    label: 'Structures',
    component: Structures,
    props: {}, // @see interface.StructuresProps
  },
];
