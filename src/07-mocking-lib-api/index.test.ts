jest.mock('lodash', () => ({
  throttle: (fn: unknown) => fn,
}));

jest.mock('axios', () => ({
  __esModule: true,
  default: {
    create: jest.fn(),
  },
}));

import axios from 'axios';
import { throttledGetDataFromApi } from './index';

const asMock = (fn: unknown) => fn as jest.Mock;

describe('throttledGetDataFromApi', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  test('should create instance with provided base url', async () => {
    const getMock = jest.fn().mockResolvedValue({ data: null });
    asMock(axios.create).mockReturnValue({ get: getMock });

    await throttledGetDataFromApi('/posts');

    expect(asMock(axios.create)).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    const getMock = jest.fn().mockResolvedValue({ data: null });
    asMock(axios.create).mockReturnValue({ get: getMock });

    const path = '/posts/42';
    await throttledGetDataFromApi(path);

    expect(getMock).toHaveBeenCalledWith(path);
  });

  test('should return response data', async () => {
    const responseData = { id: 1, title: 'hello' };
    const getMock = jest.fn().mockResolvedValue({ data: responseData });
    asMock(axios.create).mockReturnValue({ get: getMock });

    const result = await throttledGetDataFromApi('/posts/1');

    expect(result).toEqual(responseData);
  });
});
