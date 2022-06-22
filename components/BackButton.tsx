import { useRouter } from 'next/router';
import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';

const BackButton = () => {
  const router = useRouter()

  if (router.pathname === '/') return null

  return (
    <FaArrowLeft
      onClick={() => router.back()}
      className="cursor-pointer link"
    />
  )
}

export default BackButton
