import axios from 'axios';

export async function totalByMonth(): Promise<any> {
  const axiosResponse = await axios
    .get('http://localhost:4001/invoices/total?groupBy=month');

  return axiosResponse.data;
}
