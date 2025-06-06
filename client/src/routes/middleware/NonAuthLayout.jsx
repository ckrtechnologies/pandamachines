import React from 'react';
import { Navigate } from 'react-router-dom';

const NonAuthLayout = (props) => {
  if (localStorage.getItem('carRental-userData')) {
    return (
      <Navigate to={{ pathname: '/dashboard' }} />
    );
  }

  return (
    <React.Fragment>
      {props.children}
    </React.Fragment>
  )
}

export default NonAuthLayout