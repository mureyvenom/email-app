import React from 'react';
import './custom-select.css';

const CustomSelect = ({placeholder, handleChange, name, options, label, ...otherProps}) => {
    return(
        <div className='form-group'>
            {
                label ?
                <label><strong>{label}</strong></label>
                :
                null
            }
            <select className='formfield' onChange={handleChange} name={name} {...otherProps}>
                <option value=''>{placeholder}</option>
                {
                    options ?
                    options.map(option => {
                        return(
                            <option key={option.id} value={option.value}>{option.display}</option>
                        )
                    })
                    : null
                }
            </select>
        </div>
    );
}

export default CustomSelect;