import classnames from 'classnames';

const TickersUnavailable = ({ className = '' }) => (
  <div className={classnames(className, 'text-crayolaRed-500')}>
    Tickers Unavailable
  </div>
)

export default TickersUnavailable
