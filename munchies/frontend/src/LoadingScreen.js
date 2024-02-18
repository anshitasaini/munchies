import React, { useEffect } from "react";
import munchiesLogo from './munchies_logo.png'; // Ensure the path is correct

const LoadingScreen = ({ onLoadingComplete }) => {
  useEffect(() => {
    // Inject the bounce animation into the head of the document
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = `
      @keyframes bounce {
        0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
        40% { transform: translateY(-30px); }
        60% { transform: translateY(-15px); }
      }
    `;
    document.head.appendChild(styleSheet);

    setTimeout(() => {
      onLoadingComplete();
    }, 2000);
  }, [onLoadingComplete]);

  return (
    <div style={styles.container}>
      <h1 style={{...styles.text, ...styles.bounce}}>munchies</h1>
      <img src={munchiesLogo} alt="Munchies Logo" style={{...styles.logo, ...styles.bounce}} />
    </div>
  );
};

// Styles
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    textAlign: 'center',
  },
  text: {
    fontSize: '4rem',
    fontWeight: 'bold',
    marginRight: '20px',
  },
  logo: {
    height: '100px',
    width: 'auto',
  },
  bounce: {
    animation: 'bounce 2s infinite',
  }
};

export default LoadingScreen;