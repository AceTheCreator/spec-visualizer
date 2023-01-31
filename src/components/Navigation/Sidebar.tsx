import React from 'react'

function Sidebar({node}) {
  return (
    <div className="side-bar">
      <h1>AsyncAPI Map</h1>
      <p>
        The AsyncAPI Map aims to help you find your way in the AsyncAPI
        Specification documentation. It has been created by{" "}
        <a href="https://twitter.com/_acebuild">Acethecreator</a>
      </p>
    </div>
  );
}

export default Sidebar