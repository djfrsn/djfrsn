function gracefulShutdown(onShutdown = () => null): void {
  process.once('SIGUSR2', () => {
    onShutdown()
    process.kill(process.pid, 'SIGUSR2')
  })
}

export default gracefulShutdown
