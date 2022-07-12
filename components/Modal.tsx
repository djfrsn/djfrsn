import { gql, useQuery } from '@apollo/client';
import classnames from 'classnames';
import { isModalOpenVar, modalContentVar } from 'lib/cache';
import fetcher from 'lib/utils/fetcher';
import { formatUSD } from 'lib/utils/numbers';
import { format } from 'lib/utils/time';
import moment from 'moment';
import { RichTextToMarkdown } from 'slices/Markdown';
import useSWR from 'swr';

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
      const { data: ratingData } = useSWR(
        `${process.env.NEXT_PUBLIC_FMP_API_URL}/v3/rating/${modalContent.symbol}?apikey=${process.env.NEXT_PUBLIC_FMP_API_KEY}`,
        fetcher
      )
      const { data: profileData } = useSWR(
        `${process.env.NEXT_PUBLIC_FMP_API_URL}/v3/profile/${modalContent.symbol}?apikey=${process.env.NEXT_PUBLIC_FMP_API_KEY}`,
        fetcher
      )

      const tickerRating = Array.isArray(ratingData) && ratingData[0]
      const tickerProfile = Array.isArray(profileData) && profileData[0]
      const positiveChange = tickerProfile?.changes > 0

      return (
        <div>
          {tickerProfile?.website && tickerProfile?.image && (
            <div className="w-16">
              <a href={tickerProfile.website} target="_blank">
                <img
                  alt={`${modalContent.name} logo`}
                  src={tickerProfile.image}
                />
              </a>
            </div>
          )}
          <div className="flex">
            <h2 className="flex flex-wrap flex-1 text-secondary font-bold">
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
            <div className="text-lg flex align-center mr-[10%] cursor-default">
              {modalContent.close}
              <span
                className={classnames(
                  tickerProfile.changes > 0
                    ? 'text-chartPositive-500'
                    : 'text-chartNegative-500',
                  'text-sm tooltip tooltip-info tooltip-bottom'
                )}
                data-tip="Daily Change"
              >
                {tickerProfile &&
                  `(${positiveChange ? '+' : ''}${tickerProfile.changes.toFixed(
                    2
                  )})`}
              </span>
            </div>
          </div>
          {tickerRating?.rating && (
            <p>
              Rating: <strong className="text-xl">{tickerRating.rating}</strong>
            </p>
          )}
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
              {formatUSD(modalContent.high.close)}
            </span>{' '}
            on{' '}
            <em>
              {moment(modalContent.high.date).format(format.standardShort)}
            </em>{' '}
            and a low of{' '}
            <span className="text-chartNegative-500">
              {formatUSD(modalContent.low.close)}
            </span>{' '}
            on{' '}
            <em>
              {moment(modalContent.low.date).format(format.standardShort)}
            </em>
            .
          </p>

          {tickerProfile && (
            <div className="pt-4">
              <p>
                Marketcap: <strong>{formatUSD(tickerProfile.mktCap)}</strong>
              </p>
              <p>
                <span
                  className="tooltip tooltip-info tooltip-right"
                  data-tip="Measure of volatility compared to the S&P 500. Beta higher than 1 would be considered more volatile than the S&P500."
                >
                  Beta
                </span>
                : <strong>{tickerProfile.beta.toFixed(2)}</strong>
              </p>
              <p>
                YTD Range: <strong>${tickerProfile.range}</strong>
              </p>
            </div>
          )}
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
    document.body.style.overflow = ''
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

export const ModalButton = ({ className = '', children, onClick }) => {
  return (
    <label
      onClick={() => {
        localStorage.setItem('isModalOpen', 'true')
        document.body.style.overflow = 'hidden'
        isModalOpenVar(true)
        onClick()
      }}
      htmlFor="main-modal"
      className={classnames(className, 'modal-button cursor-pointer')}
    >
      {children}
    </label>
  )
}

export default Modal
