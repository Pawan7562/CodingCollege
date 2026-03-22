const reportWebVitals = (onPerfEntry?: (metric: any) => void) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(() => {
      // Empty function for now
    });
  }
};

export default reportWebVitals;
