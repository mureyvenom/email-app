import React from 'react';
import './custom-input.css';

const CustomInput = ({name, handleChange, placeholder, type, label, ...otherProps}) => {
    return(
        <div className='form-group'>
            {
                label ?
                <label><strong>{label}</strong></label>
                :
                null
            }
            <input name={name} placeholder={placeholder} type={type} onChange={handleChange} {...otherProps} className='formfield' />
        </div>
    )
}

export default CustomInput;