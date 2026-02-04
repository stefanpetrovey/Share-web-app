import React from 'react';
import {Link} from 'react-router-dom';

function PageNotFound() {
  return (
    <div>
      <h1>Page NOT found: </h1>
      <h3>Go to the home page <Link to="/">Home</Link></h3>
    </div>
  )
}

export default PageNotFound
