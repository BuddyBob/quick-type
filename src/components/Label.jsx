import React from 'react';

export const Label = ({ children, type}) => {
    return (
        <label className={`settings`} type={type}>
            {children}
        </label>
    )
}

export default Label;