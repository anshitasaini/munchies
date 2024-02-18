import React, { useState } from "react";

const LoadingScreen = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  if (isLoading) {
    return <div>munchies</div>;
  } else {
    return <div></div>;
  }
};

export default LoadingScreen;