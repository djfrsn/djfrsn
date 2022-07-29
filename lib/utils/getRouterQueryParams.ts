const getRouterQueryParams = () =>
  new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop: string) => searchParams.get(prop),
  })

export default getRouterQueryParams
