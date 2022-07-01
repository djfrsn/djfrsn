import { Progress } from '@mantine/core';

export default function ProgressBar({
  className,
  value,
}: {
  className: string
  value: number
}) {
  return <Progress value={value} />
}
