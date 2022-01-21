import React from 'react';
import './custom-button.css';

const CustomButton = ({displayText, type}) => {
    return(
        <div className='form-group'>
            <button className='custom-button' type={type}>{displayText}</button>
        </div>
    );
}

export default CustomButton;