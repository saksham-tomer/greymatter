"use client";

import React from "react";
import Image from "next/image";
import SwapComponent from "./SwapComponent";
import PortfolioComponent from "./ProtfolioComponent";
import { StakeComponent } from "./StakeComponent";
import Footer from "./Footer";

type Component = "Swap" | "Stake" | "Portfolio";

enum Active {
  Swap = "Swap",
  Stake = "Stake",
  Portfolio = "Portfolio",
}

function Defi() {
  const [showSwap, setShowSwap] = React.useState<boolean>(true);
  const [currentComponent, setCurrentComponent] =
    React.useState<Component>("Stake");
  const [active, setActive] = React.useState<Active>(Active.Swap);

  const renderActiveComponent = () => {
    switch (active) {
      case Active.Swap:
        return (
          <div className="w-full font-cygnito">
            <SwapComponent params={showSwap} />
          </div>
        );
      case Active.Stake:
        return (
          <div className="max-w-8xl flex mb-14 justify-center font-cygnito">
            <StakeComponent />
          </div>
        );
      case Active.Portfolio:
        return (
          <div className="w-full font-cygnito">
            <PortfolioComponent />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-gradient-to-br from-neutral-800 to-neutral-950 px-4 sm:px-6 md:px-12 lg:px-20 xl:px-32">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col sm:flex-row items-center justify-between w-full py-6 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <Image
              src="/greymatterlogo.svg"
              alt="GreyMatter Logo"
              width={32}
              height={32}
              className="w-8 h-8 object-cover rounded-xl"
            />
            <div className="flex items-center space-x-2">
              <p className="text-white text-xl font-bold font-cygnito">
                GreyMatter / {currentComponent}
              </p>
              <span className="text-xs text-black font-cygnito font-bold bg-white rounded-xl px-2 py-0.5">
                v1
              </span>
            </div>
          </div>
        </div>
        <div className="flex justify-center w-full mb-6">
          <div className="bg-gray-200 rounded-xl p-1.5 px-8 inline-flex space-x-1">
            {Object.values(Active).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActive(tab as Active);
                  setCurrentComponent(tab as Component);

                  setShowSwap(tab === Active.Swap);
                }}
                className={`
                  px-4 sm:px-6 md:px-8 py-2 rounded-xl font-cygnito text-sm sm:text-base 
                  transition-colors duration-300 ease-in-out
                  ${
                    active === tab
                      ? "bg-white text-gray-950 shadow-md font-bold"
                      : "text-gray-600 hover:bg-gray-300 font-bold"
                  }
                `}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div className="w-full min-h-[calc(100vh-250px)] flex items-center justify-center">
          {renderActiveComponent()}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Defi;
