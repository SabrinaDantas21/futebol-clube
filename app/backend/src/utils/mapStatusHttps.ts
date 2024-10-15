export const http = {
  successful: 200,
  created: 201,
  notFound: 404,
  badRequest: 400,
  unauthorized: 401,
  invalidValue: 422,
};

const mapStatusHTTP = (status: keyof typeof http): number => http[status] || 500;

export default mapStatusHTTP;
