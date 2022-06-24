function devOnlyIgnoreTLSReject() {
  // prevent error: https://stackoverflow.com/questions/45088006/nodejs-error-self-signed-certificate-in-certificate-chain
  if (process.env.NODE_ENV !== 'production')
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
}

export default devOnlyIgnoreTLSReject
