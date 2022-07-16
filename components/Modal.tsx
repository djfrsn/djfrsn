import { gql, useQuery } from '@apollo/client';
import classnames from 'classnames';
import { isModalOpen, modalContent as modalContentVar, modalContentId } from 'lib/cache';
import { COLORS } from 'lib/const';
import chartOptions from 'lib/utils/chartOptions';
import fetcher from 'lib/utils/fetcher';
import getFriendlyMarketSymbol from 'lib/utils/getFriendlyMarketSymbol';
import { formatUSD } from 'lib/utils/numbers';
import { format } from 'lib/utils/time';
import moment from 'moment';
import { useEffect, useRef } from 'react';
import { RichTextToMarkdown } from 'slices/Markdown';
import useSWR from 'swr';

import LineChart from './LineChart';
import Loading from './Loading';

function getRatingClassName(val) {
  switch (val) {
    case 5:
      return 'text-gradeS-500 tooltip-success'
    case 4:
      return 'text-gradeA-500 tooltip-info'
    case 3:
      return 'text-gradeB-500 tooltip-warning'
    case 2:
    case 1:
      return 'text-gradeD-500 tooltip-error'
    default:
      return ''
  }
}

const toggleModal = val => {
  const modalEl = document.getElementById(modalId) as HTMLInputElement
  setBodyOverflow('hidden')
  modalEl.checked = val
}

const onModalClose = (force = false) => {
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

const setBodyOverflow = val => (document.body.style.overflow = val)
const modalId = 'main-modal'
export const openModal = (force = false) => {
  if (force) {
    toggleModal(true)
  }
  localStorage.setItem('isModalOpen', 'true')
  setBodyOverflow('hidden')
  isModalOpen(true)
}

export const GET_MODAL = gql`
  query GetModal {
    isModalOpen @client
    modalContentId @client
    modalContent @client
  }
`

const ModalContent = ({ data: { modalContentId, modalContent, pageData } }) => {
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
      const { data: tickerNews } = useSWR(
        `${process.env.NEXT_PUBLIC_FMP_API_URL}/v3/stock_news?tickers=${modalContent.symbol}&limit=5&apikey=${process.env.NEXT_PUBLIC_FMP_API_KEY}`,
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
                href={tickerProfile.website}
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
              <a
                href={`https://www.marketwatch.com/investing/stock/${modalContent.symbol}`}
                target="_blank"
              >
                <strong>{modalContent.close}</strong>
              </a>
              <span
                className={classnames(
                  tickerProfile.changes > 0
                    ? 'text-positiveValue-500'
                    : 'text-negativeValue-500',
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
              Rating:{' '}
              <strong
                className={classnames(
                  getRatingClassName(tickerRating.ratingScore),
                  'text-xl tooltip'
                )}
                data-tip={tickerRating.ratingRecommendation}
              >
                {tickerRating.rating}
              </strong>
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
            <span className="text-positiveValue-500">
              {formatUSD(modalContent.high.close)}
            </span>{' '}
            on{' '}
            <em>
              {moment(modalContent.high.date).format(format.standardShort)}
            </em>{' '}
            and a low of{' '}
            <span className="text-negativeValue-500">
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
          <div className="pt-4">
            <div className="text-center mb-1">
              <h3>
                <strong className="mr-2 text-correlationBeta-500">
                  ${modalContent.symbol}
                </strong>
                vs
                <span className="ml-2 text-correlationBase-500">
                  {getFriendlyMarketSymbol(modalContent.marketIndex.symbol)}
                </span>
              </h3>
            </div>
            <LineChart
              options={chartOptions.correlation}
              data={{
                labels: modalContent.marketIndex.timeSeries
                  .map(series =>
                    moment(series.date).format(format.standardShort)
                  )
                  .reverse(),
                datasets: [
                  {
                    label: modalContent.symbol,
                    data: modalContent.timeSeries
                      .map(set => Number(set.close))
                      .reverse(),
                    borderColor: COLORS.correlationBeta,
                    yAxisID: 'y1',
                  },
                  {
                    label: getFriendlyMarketSymbol(
                      modalContent.marketIndex.symbol
                    ),
                    data: modalContent.marketIndex.timeSeries
                      .map(set => Number(set.close))
                      .reverse(),
                    borderColor: COLORS.correlationBase,
                    yAxisID: 'y',
                  },
                ],
              }}
            />
          </div>
          {Array.isArray(tickerNews) && (
            <div className="pt-4">
              <h3>News</h3>
              <div className="flex flex-col">
                {tickerNews.map((article, index) => (
                  <a
                    key={index}
                    href={article.url}
                    className="link truncate no-underline mb-1 last-of-type:mb-0"
                    target="_blank"
                  >
                    {article.title}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )
    case modalContentId === 'markets':
      const marketInfo = pageData?.find(
        content => content.name === modalContent.marketName
      )

      return (
        <div>
          {marketInfo ? (
            <RichTextToMarkdown
              content={marketInfo.description}
              onLinkClick={() => {
                console.log('close')
                onModalClose(true)
              }}
            />
          ) : (
            <p>Info unavailable for {modalContent.marketName}.</p>
          )}
        </div>
      )
    default:
      return <div>Content unavailable.</div>
  }
}

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

export default Modal
