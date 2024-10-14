import React from "react";

const Progress = () => {
  const containerStyle = {
    display: "flex",
    alignItems: "center",
    fontSize: "16px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f7f7f7",
    justifyContent: "center",
    height: "10vh",
    margin: "0",
  };

  const activeStyle = {
    color: "#60a487",
  };

  const inactiveStyle = {
    color: "#888888",
  };

  const separatorStyle = {
    color: "#888888",
    fontSize: "12px",
    margin: "0 10px",
  };

  return (
    <div style={containerStyle}>
      <span style={activeStyle}>Bag</span>
      <span style={separatorStyle}>...............</span>
      <span style={inactiveStyle}>Address</span>
      <span style={separatorStyle}>................</span>
      <span style={inactiveStyle}>Payment</span>
    </div>
  );
};

export default Progress;
