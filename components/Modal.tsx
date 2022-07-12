import { gql, useQuery } from '@apollo/client';
import classnames from 'classnames';
import { isModalOpenVar, modalContentVar } from 'lib/cache';
import { format } from 'lib/utils/time';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { RichTextToMarkdown } from 'slices/Markdown';

import Loading from './Loading';

export const GET_MODAL = gql`
  query GetModal {
    isModalOpen @client
    modalContentId @client
    modalContent @client
  }
`

const ModalContent = ({ data: { modalContentId, modalContent } }) => {
  if (!modalContentId || !modalContent) return null

  switch (true) {
    case modalContentId.includes('TickerInfo'):
      if (!modalContent?.id) return null

      return (
        <div>
          <h2 className="text-secondary font-bold">
            <a
              href={`https://www.marketwatch.com/investing/stock/${modalContent.symbol}`}
              target="_blank"
              className="z-0 link no-underline"
            >
              {modalContent.name}
            </a>
            {typeof modalContent.founded === 'string' && (
              <span className="ml-3 text-sm italic text-wash-50">
                Est. {modalContent.founded}
              </span>
            )}
          </h2>
          <p>
            <span className="text-sm text-wash-50">Headquarter</span>:{' '}
            {modalContent.headQuarter}
          </p>
          <p>
            {modalContent.sector}
            {modalContent.subSector && `, ${modalContent.subSector}`}
          </p>
          <p className="mt-4">
            <strong>${modalContent.symbol}</strong> last reached a high of{' '}
            <span className="text-chartPositive-500">
              ${modalContent.high.close}
            </span>{' '}
            on {moment(modalContent.high.date).format(format.standardShort)} and
            a low of{' '}
            <span className="text-chartNegative-500">
              ${modalContent.low.close}
            </span>{' '}
            on {moment(modalContent.low.date).format(format.standardShort)}.
          </p>
        </div>
      )
    case modalContentId.includes('MarketInfo'):
      return (
        <div>
          {Array.isArray(modalContent) &&
            modalContent.map((item, index) => {
              return (
                item?.markdown && (
                  <RichTextToMarkdown key={index} content={item.markdown} />
                )
              )
            })}
        </div>
      )
    default:
      return <div>Content not found.</div>
  }
}

const Modal = ({ content }) => {
  const { data, loading, error } = useQuery(GET_MODAL)
  const externalContent = data?.modalContentId && content[data.modalContentId]
  const modalContent = externalContent ? externalContent : data?.modalContent
  const onModalClose = () => {
    localStorage.setItem('isModalOpen', 'false')
    modalContentVar({})
    isModalOpenVar(false)
  }

  return (
    <>
      <input
        onChange={e => {
          if (!e.target.checked) {
            onModalClose()
          }
        }}
        type="checkbox"
        id="main-modal"
        className="modal-toggle"
      />
      <label htmlFor="main-modal" className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
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
            <ModalContent data={{ ...data, modalContent }} />
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
    htmlFor="main-modal"
    className={classnames(className, 'modal-button cursor-pointer')}
  >
    {children}
  </label>
)

export default Modal
