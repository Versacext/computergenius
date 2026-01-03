export default function GlobalStyles() {
  return (
    <style jsx global>{`
      @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap');
      
      * {
        font-family: 'JetBrains Mono', 'Courier New', monospace;
      }
      
      body {
        margin: 0;
        padding: 0;
        overflow-x: hidden;
      }
      
      /* Custom scrollbar */
      ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      
      ::-webkit-scrollbar-track {
        background: #0A0A0A;
      }
      
      ::-webkit-scrollbar-thumb {
        background: #1A1A1A;
        border: 1px solid #333333;
      }
      
      ::-webkit-scrollbar-thumb:hover {
        background: #333333;
      }
      
      /* Scanline effect */
      @keyframes scanline {
        0% {
          transform: translateY(-100%);
        }
        100% {
          transform: translateY(100vh);
        }
      }
      
      /* Pulse animation for logo */
      @keyframes pulse {
        0%, 100% {
          opacity: 0.2;
        }
        50% {
          opacity: 0.4;
        }
      }
      
      /* Selection color */
      ::selection {
        background: #00FF4140;
        color: #00FF41;
      }
      
      /* Remove number input spinners */
      input[type='number']::-webkit-inner-spin-button,
      input[type='number']::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
      
      input[type='number'] {
        -moz-appearance: textfield;
      }
    `}</style>
  );
}
