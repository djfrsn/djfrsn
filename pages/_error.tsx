import Link from 'next/link';

function Error({ statusCode }) {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <h3>
        {statusCode
          ? `⚠️ An error ${statusCode} occurred on the server`
          : '⚠️ An error occurred on the client'}
      </h3>
      <Link href="/markets">
        <a className="mt-12 text-lg link font-bold no-underline">Refresh</a>
      </Link>
    </div>
  )
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Error
