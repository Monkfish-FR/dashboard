import axios from 'axios';

export async function all(table: string): Promise<any> {
  const axiosResponse = await axios
    .get(`http://localhost:4001/${table}/all`);

  return axiosResponse.data;
}

export async function some(table: string, where: { [key: string]: any }): Promise<any> {
  const axiosResponse = await axios
    .get(
      `http://localhost:4001/${table}/some`,
      {
        params: { ...where },
      },
    );

  return axiosResponse.data;
}

export async function one(table: string, id: number): Promise<any> {
  const axiosResponse = await axios
    .get(`http://localhost:4001/${table}/one?id=${id}`);

  return axiosResponse.data;
}

export async function last(table: string): Promise<any> {
  const axiosResponse = await axios
    .get(`http://localhost:4001/${table}/last`);

  return axiosResponse.data;
}

export async function average(table: string): Promise<any> {
  const axiosResponse = await axios
    .get(`http://localhost:4001/${table}/average`);

  return axiosResponse.data;
}

export async function median(table: string): Promise<any> {
  const axiosResponse = await axios
    .get(`http://localhost:4001/${table}/median`);

  return axiosResponse.data;
}

// Axios returns as response.data the params we send with the requests:
// Add the 'apiMessage' argument to get the server response back
export async function add(
  table: string,
  params: {
    data: any,
    apiMessage: string,
    apiError: any,
  },
): Promise<string> {
  try {
    const axiosResponse = await axios
      .post(
        `http://localhost:4001/${table}/add`,
        { ...params },
      )
      .then((response) => {
        const { data: res } = response;
        if (res.apiError) throw new Error(res.apiError);

        return res.apiMessage;
      });

    return axiosResponse;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('Unknown error');
    }
  }
}

// Axios returns as response.data the params we send with the requests:
// Add the 'apiMessage' argument to get the server response back
export async function put(
  table: string,
  op: 'edit' | 'validate' | 'deactivate' | 'delete' | 'reset',
  params: {
    apiMessage: string,
    apiError: any,
    id?: number,
    data?: any,
  },
): Promise<string> {
  try {
    const axiosResponse = await axios
      .put(
        `http://localhost:4001/${table}/${op}`,
        { ...params },
      )
      .then((response) => {
        const { data: res } = response;
        if (res.apiError) throw new Error(res.apiError);

        return res.apiMessage;
      });

    return axiosResponse;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('Unknown error');
    }
  }
}

export async function edit(
  table: string,
  params: {
    id: number,
    data: any,
    apiMessage: string,
    apiError: any,
  },
): Promise<string> {
  return put(table, 'edit', params);
}

export async function validate(
  table: string,
  params: {
    id: number,
    apiMessage: string,
    apiError: any,
  },
): Promise<string> {
  return put(table, 'validate', params);
}

export async function deactivate(
  table: string,
  params: {
    id: number,
    apiMessage: string,
    apiError: any,
  },
): Promise<string> {
  return put(table, 'deactivate', params);
}

export async function del(
  table: string,
  params: {
    id: number,
    apiMessage: string,
    apiError: any,
  },
): Promise<string> {
  return put(table, 'delete', params);
}

export async function reset(
  table: string,
  params: {
    apiMessage: string,
    apiError: any,
  },
): Promise<string> {
  return put(table, 'reset', params);
}
