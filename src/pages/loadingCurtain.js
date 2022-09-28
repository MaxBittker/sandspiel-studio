import React, { useEffect, useState, useCallback } from "react";
import useStore from "../store.js";

export const LoadingCurtain = () => {
  const colorName = useStore((store) => store.curtainColor);
  const loading = useStore((store) => store.loading);
  return (
    <div
      className={
        "loading-curtain background-" + colorName + (loading ? " visible" : "")
      }
    >
      <div>LOADING</div>
    </div>
  );
};

export default LoadingCurtain;
