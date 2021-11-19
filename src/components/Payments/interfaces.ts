export interface PaymentUI {
  id: number,
  type: string,
  reference: string,
  invoice: number,
  createdAt?: Date,
}

export interface PaymentFormUI {
  invoice: number,
}
