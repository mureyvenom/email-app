import React from 'react';
import './dash-bg.css';

const DashBg = ({children}) => {
    return(
        <div className='dash-bg'>
            {children}
        </div>
    )
}

export default DashBg;