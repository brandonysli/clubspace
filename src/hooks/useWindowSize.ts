import { useState, useEffect } from "react";
import debounce from "lodash/debounce"; // Import the debounce function

interface WindowSize {
  width?: number;
  height?: number;
}

export default function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    // Create a debounced function to handle the resize
    const handleResize = debounce(() => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }, 500); // delay in milliseconds

    // Set size at the first client-side load
    handleResize();

    window.addEventListener("resize", handleResize);
    // Remove event listener on cleanup
    return () => {
      // Cancel any scheduled debounced function executions
      handleResize.cancel();

      window.removeEventListener("resize", handleResize);
    };
  }, []); // Empty array means that effect is only run on mount and unmount

  return windowSize;
}
