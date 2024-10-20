import React from "react";

export default function Main() {
  return (
    <div className="flex px-4 md:px-14 lg:px-18 xl:px-24 ">
      <div className="fixed -z-20 bg-background flex flex-row min-h-screen min-w-full">
        <div className="border-l border-gray-300"></div>
        <div className="border-l border-gray-300"></div>
        <div className="border-l border-gray-300"></div>
        <div className="border-l border-r border-gray-300"></div>
      </div>
      <div className="min-h-screen min-w-full flex items-center justify-center">
        hello world
      </div>
    </div>
  );
}
