import { FaSpinner } from 'react-icons/fa';

function Loading() {
  return (
    <div className="w-full h-full flex justify-center items-center text-ash-500">
      <FaSpinner className="animate-spin text-4xl text-ash-500" />
    </div>
  )
}

export default Loading
