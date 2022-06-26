function gracefulShutdown(
  onShutdown = function () {
    process.kill(process.pid, 'SIGUSR2')
  }
): void {
  onShutdown()
}

export default gracefulShutdown
