import classnames from 'classnames';

export default function ProgressBar({
  className,
  progress,
}: {
  className: string
  progress: number
}) {
  return (
    <div className={classnames('flex flex-col w-full', className)}>
      <span className="text-xxs">{progress}%</span>
      <div
        className="transition-all duration-300 rounded-sm bg-gradient-to-r from-iced-100 to-ash-100 h-1 max-w-full"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
