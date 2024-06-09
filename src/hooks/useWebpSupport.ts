import { useState, useEffect } from "react";

function useWebpSupport() {
  const [supportsWebp, setSupportsWebp] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      var elem = document.createElement("canvas");

      if (elem.getContext && elem.getContext("2d")) {
        setSupportsWebp(
          elem.toDataURL("image/webp").indexOf("data:image/webp") === 0
        );
      }
    }
  }, []);

  return supportsWebp;
}

export default useWebpSupport;
