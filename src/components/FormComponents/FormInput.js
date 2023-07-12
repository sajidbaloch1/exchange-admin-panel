import React from "react";
import { CCol, CFormLabel, CFormInput } from "@coreui/react";

const FormInput = ({ label, name, type, value, onChange, onBlur, error }) => {
    return (
        <CCol md={4}>
            <CFormLabel htmlFor={name}>{label} <span className="text-red">*</span></CFormLabel>
            <CFormInput
                type={type}
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                onBlur={onBlur} />
            {error && <p className="text-red">{error}</p>}
        </CCol>
    );
};

export default FormInput;
