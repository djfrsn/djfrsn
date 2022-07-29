import { gql, useQuery } from '@apollo/client';
import classnames from 'classnames';
import { isModalOpen, modalContent as modalContentVar, modalContentId } from 'lib/cache';
import { useEffect, useRef } from 'react';

import Loading from '../Loading';
import { MarketInfo } from './template/Markets';

const setBodyOverflow = val => (document.body.style.overflow = val)
const modalId = 'main-modal'

const toggleModal = val => {
  const modalEl = document.getElementById(modalId) as HTMLInputElement
  setBodyOverflow('hidden')
  modalEl.checked = val
}

export const onModalClose = (force = false) => {
  if (force) {
    toggleModal(false)
  }
  modalContentId('')
  modalContentVar({})
  localStorage.setItem('isModalOpen', 'false')
  localStorage.setItem('modalContentId', '')
  setBodyOverflow('')
  isModalOpen(false)
}

export const openModal = (force = false) => {
  if (force) {
    toggleModal(true)
  }
  localStorage.setItem('isModalOpen', 'true')
  setBodyOverflow('hidden')
  isModalOpen(true)
}

export const ModalButton = ({ className = '', children, onClick }) => {
  return (
    <label
      onClick={() => {
        openModal()
        onClick()
      }}
      htmlFor="main-modal"
      className={classnames(className, 'modal-button cursor-pointer')}
    >
      {children}
    </label>
  )
}

const ModalContent = ({ data }) => {
  const { modalContentId, modalContent } = data
  if (!modalContentId || !modalContent) return null

  switch (true) {
    case modalContentId === 'markets':
      return <MarketInfo data={data} />
    default:
      return <div>Content unavailable.</div>
  }
}

export const GET_MODAL = gql`
  query GetModal {
    isModalOpen @client
    modalContentId @client
    modalContent @client
  }
`
const Modal = ({ content }) => {
  const { data, loading, error } = useQuery(GET_MODAL)
  const modalContent = data?.modalContent
  const inputRef = useRef()
  useEffect(() => {
    if (data.isModalOpen) {
      // opens modal on page load
      const modalEl = inputRef.current as HTMLInputElement
      setBodyOverflow('hidden')
      modalEl.checked = true
    }
  }, [])

  return (
    <>
      <input
        ref={inputRef}
        onChange={e => {
          if (!e.target.checked) {
            onModalClose()
          }
        }}
        type="checkbox"
        id={modalId}
        className="modal-toggle"
      />
      <label
        htmlFor="main-modal"
        className={classnames('modal cursor-pointer')}
      >
        <label
          className={classnames(
            { 'w-11/12 max-w-3xl': modalContent?.modalSize === 'large' },
            'modal-box relative bg-base-100'
          )}
          htmlFor=""
        >
          <label
            onClick={() => onModalClose()}
            htmlFor="main-modal"
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          {error && (
            <div className="text-crayolaRed-500">Error loading content!</div>
          )}
          {loading && <Loading />}
          {data?.modalContentId && (
            <ModalContent
              data={{
                ...data,
                modalContent,
                pageData: content[data?.modalContentId],
              }}
            />
          )}
        </label>
      </label>
    </>
  )
}

export default Modal
