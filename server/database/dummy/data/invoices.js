module.exports = [
  {
    id: 1,
    number: '2101-01',
    type: 'invoice',
    status: 1,
    amount: 320,
    discount: null,
    comment: null,
    client: 1,
    quotation: 1,
    created_at: '2021-01-21 09:55:34',
    updated_at: '2021-01-21 09:55:34',
  },
  {
    id: 2,
    number: '2101-02',
    type: 'deposit',
    status: 1,
    amount: 1150,
    discount: null,
    comment: null,
    client: 1,
    quotation: 2,
    created_at: '2021-01-11 16:54:14',
    updated_at: '2021-01-22 13:20:48',
  },
  {
    id: 3,
    number: '2110-01',
    type: 'invoice',
    status: 0,
    amount: 300,
    discount: '{"description":{"title":"Remise exceptionnelle de 10 %","content":"si paiement avant le 31 octobre 2021"},"rate":"10"}',
    comment: 'Facture correspondant au BC/OS n° 4500150551',
    client: 3,
    quotation: 4,
    created_at: '2021-10-21 09:55:34',
    updated_at: '2021-10-21 09:58:12',
  },
  {
    id: 4,
    number: '2110-02',
    type: 'invoice',
    status: 0,
    amount: 700,
    discount: null,
    comment: null,
    client: 4,
    quotation: 5,
    created_at: '2021-10-21 10:23:04',
    updated_at: '2021-10-21 10:23:04',
  },
  {
    id: 5,
    number: '2110-03',
    type: 'invoice',
    status: 0,
    amount: 1150,
    discount: null,
    comment: null,
    client: 1,
    quotation: 2,
    created_at: '2021-10-23 16:54:14',
    updated_at: '2021-10-23 16:54:14',
  },
];
