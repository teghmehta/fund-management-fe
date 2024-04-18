import React from 'react';
import styled from 'styled-components';
const Input = styled.input`
    width: 100%;
    height: 40px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    padding: 12px 20px;
    margin: 8px 0;
    font-size: 16px;
    font-weight: 300;
    color: #333;
    outline: none;
    &:focus {
        border: 1px solid #333;
    }
`;

const Label = styled.label`
    font-size: 16px;
    font-weight: 300;
    color: white;
    ${({isDark}) => isDark && `
        color: #333;
    `}
`;

export const FormInput = ({
    type,
    onChange,
    value,
    placeholder,
    disabled,
    label,
    isDark,
    ...props
}) => {
    const myRef = React.useRef(null);

    React.useEffect(() => {
        if (myRef.current && !value) {
            myRef.current.value = '';
        }
    }, [value]);

    return (
        <>
            {label && <Label isDark={isDark}>{label}</Label>}
            <Input
                type={type}
                onChange={onChange}
                ref={myRef}
                value={value}
                id={props.id}
                placeholder={placeholder}
                disabled={disabled}
                {...props}
            />
        </>
    );
}