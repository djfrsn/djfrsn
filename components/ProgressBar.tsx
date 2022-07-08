import classnames from 'classnames';

export default function ProgressBar({
  className,
  value,
}: {
  className: string
  value: number | string
}) {
  return (
    <div className={classnames('flex flex-col w-full', className)}>
      <span className="text-xxs">{value}%</span>
      <div
        className="transition-all duration-300 rounded-sm bg-gradient-to-r from-iced-300 to-iced-600 h-1 max-w-full"
        style={{ width: `${value}%` }}
      />
    </div>
  )
}
