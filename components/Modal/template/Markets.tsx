import { RichTextToMarkdown } from 'slices/Markdown';

import { onModalClose } from '..';

const MarketInfo = ({ data: { modalContentId, modalContent, pageData } }) => {
  if (!modalContentId || !modalContent) return null

  switch (true) {
    case modalContentId === 'markets':
      const marketInfo = pageData?.find(
        content => content.name === modalContent.marketName
      )

      return (
        <div>
          {marketInfo ? (
            <RichTextToMarkdown
              content={marketInfo.description}
              onLinkClick={() => onModalClose(true)}
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

export { MarketInfo }
