import React, { ReactElement } from 'react'
import logo from '../../images/icon.png'

export default function Logo(): ReactElement {
  return <img src={logo} style={{marginRight: "5px", width: "70px", height: "70px"}} />
}
