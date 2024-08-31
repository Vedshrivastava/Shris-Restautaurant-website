import React from 'react'
import { useNavigate } from 'react-router-dom'

const Success = () => {
  const navigate = useNavigate();
  return (
    navigate("/my-orders")
  )
}

export default Success