"use client"

import React from 'react'
import WormholeConnect from "@wormhole-foundation/wormhole-connect";

interface SwapComponentProps {
  params: boolean;
}

function SwapComponent({params}: SwapComponentProps) {
  return (
    <div>{params && <WormholeConnect />}</div>
  )
}

export default SwapComponent
