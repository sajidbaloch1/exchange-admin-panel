import React from 'react';
import { CCol, CFormSelect, CFormLabel } from '@coreui/react';

const FormSelect = ({ label, name, value, onChange, onBlur, error, children, isRequired, width }) => {
    return (
        <CCol md={width}>
            <CFormLabel htmlFor={name}>{label} {isRequired === 'true' && <span className="text-red">*</span>}</CFormLabel>
            <CFormSelect
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                className={error ? 'is-invalid' : ''}
            >
                {children}
            </CFormSelect>
            {error && <p className="text-red">{error}</p>}
        </CCol>
    );
};

export default React.memo(FormSelect);

