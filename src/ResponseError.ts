export default interface ResponseError extends Error {
  responseStatusCode: number;
}
