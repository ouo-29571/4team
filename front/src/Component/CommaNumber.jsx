import React from 'react'
import { formatNumber } from '@/utils/formatNumber'

export default function CommaNumber({ value }) {
  return <>{formatNumber(value)}</>
}