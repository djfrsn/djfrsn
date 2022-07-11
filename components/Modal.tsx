import { gql, useApolloClient, useQuery } from '@apollo/client';
import { isModalOpenVar } from 'lib/cache';

import Loading from './Loading';

export const GET_MODAL = gql`
  query GetModal {
    isModalOpen @client
    modalContentId @client
  }
`

const ModalContent = ({ data: { modalContentId } }) => {
  switch (true) {
    case modalContentId.includes('-info'):
      return <div>info style</div>
    default:
      return <div>default style</div>
  }
}

const Modal = () => {
  const client = useApolloClient()
  const { data, loading, error } = useQuery(GET_MODAL)

  console.log('data', data)

  return (
    <>
      <input type="checkbox" id="my-modal-4" className="modal-toggle" />
      <label htmlFor="my-modal-4" className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
          <label
            onClick={() => {
              // client.cache.evict({ fieldName: 'isModalOpen' })
              // client.cache.gc()
              localStorage.setItem('isModalOpen', 'false')
              isModalOpenVar(false)
            }}
            htmlFor="my-modal-4"
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          {error && (
            <div className="text-crayolaRed-500">Error loading content!</div>
          )}
          {loading && <Loading />}
          {data?.modalContentId && <ModalContent data={data} />}
        </label>
      </label>
    </>
  )
}

export const ModalButton = ({ children, onClick }) => (
  <label
    onClick={() => {
      localStorage.setItem('isModalOpen', 'true')
      isModalOpenVar(true)
      onClick()
    }}
    htmlFor="my-modal-4"
    className="modal-button cursor-pointer"
  >
    {children}
  </label>
)

export default Modal
