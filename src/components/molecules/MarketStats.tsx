import { Logger } from '@oceanprotocol/lib'
import React, { ReactElement, useEffect, useState } from 'react'
import PriceUnit from '../atoms/Price/PriceUnit'
import axios from 'axios'
import styles from './MarketStats.module.css'
import { useInView } from 'react-intersection-observer'

interface MarketStatsResponse {
  datasets: {
    pools: number
    exchanges: number
    none: number
    total: number
  }
  owners: number
  ocean: number
  datatoken: number
}

const refreshInterval = 60000 // 60 sec.

export default function MarketStats(): ReactElement {
  const [ref, inView] = useInView()

  return (
    <div className={styles.stats} ref={ref}>

    </div>
  )
}
