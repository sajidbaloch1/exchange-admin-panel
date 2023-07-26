import React from "react";
import { CCol, CFormLabel, CFormInput } from "@coreui/react";

const FormInput = ({ label, name, type, value, onChange, onBlur, error, isRequired, width }) => {
    return (
        <CCol md={width}>
            <CFormLabel htmlFor={name}>{label} {isRequired === 'true' && <span className="text-red">*</span>}</CFormLabel>
            <CFormInput
                type={type}
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                className={error ? 'is-invalid' : ''}
            />
            {error && <p className="text-red">{error}</p>}
        </CCol>
    );
};

export default FormInput;
