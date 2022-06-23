import LoadingIndicator from './Loading';

const Container = ({ loading, error, children }) => {
  if (loading) {
    return <LoadingIndicator />
  }
  if (error) {
    return <div className="errorText">Error: {error.message}</div>
  }

  return children
}

export default Container
