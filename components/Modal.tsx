import { gql, useQuery } from '@apollo/client';
import classnames from 'classnames';
import { isModalOpenVar } from 'lib/cache';
import { RichTextToMarkdown } from 'slices/Markdown';

import Loading from './Loading';

export const GET_MODAL = gql`
  query GetModal {
    isModalOpen @client
    modalContentId @client
  }
`

const ModalContent = ({ data: { modalContentId }, content }) => {
  switch (true) {
    case modalContentId.includes('Info'):
      return (
        <div>
          {content.map((item, index) => {
            return (
              item?.markdown && (
                <RichTextToMarkdown key={index} content={item.markdown} />
              )
            )
          })}
        </div>
      )
    default:
      return <div>default style</div>
  }
}

const Modal = ({ content }) => {
  const { data, loading, error } = useQuery(GET_MODAL)
  const modalContent = data?.modalContentId && content[data.modalContentId]

  return (
    <>
      <input type="checkbox" id="my-modal-4" className="modal-toggle" />
      <label htmlFor="my-modal-4" className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
          <label
            onClick={() => {
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
          {data?.modalContentId && (
            <ModalContent data={data} content={modalContent} />
          )}
        </label>
      </label>
    </>
  )
}

export const ModalButton = ({ className = '', children, onClick }) => (
  <label
    onClick={() => {
      localStorage.setItem('isModalOpen', 'true')
      isModalOpenVar(true)
      onClick()
    }}
    htmlFor="my-modal-4"
    className={classnames(className, 'modal-button cursor-pointer')}
  >
    {children}
  </label>
)

export default Modal
