"use client";
import React from "react";
//import "antd/dist/antd.css";
import TreeComponent from "./TreeComponent";

const Home: React.FC = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h1>درخت با سه سطح</h1>
      <TreeComponent />
    </div>
  );
};

export default Home;
