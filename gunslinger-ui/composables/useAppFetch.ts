export default (path: string, options: Parameters<typeof useFetch>[1]) => {
  return useFetch(path, {
    baseURL: 'http://localhost:5005',
    ...options
  })
}
