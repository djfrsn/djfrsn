import { FaSpinner } from 'react-icons/fa';

function Loading() {
  return (
    <div className="w-full h-full flex justify-center items-center text-ash-100 ml-4 mt-4">
      <FaSpinner className="animate-spin text-4xl text-ash-100" />
    </div>
  )
}

export default Loading
