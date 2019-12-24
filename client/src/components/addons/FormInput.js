import React from 'react'
import Proptypes from 'prop-types'
import If from './If'

const FormInput = ({
  accept,
  error,
  id,
  label,
  value,
  disabled,
  placeholder,
  type,
  onBlur,
  onChange,
  hidden,
  title
}) => {
  return (
    <If
      condition={type === 'file'}
      otherwise={
        <div className={`input-section${error ? ' error' : ''}`}>
          {label && <label htmlFor={id}>{error || label}</label>}
          <input
            accept={accept}
            disabled={disabled}
            hidden={hidden}
            id={id}
            onBlur={onBlur}
            onChange={onChange}
            placeholder={placeholder}
            title={title}
            type={type}
            value={value}
          />
        </div>
      }
    >
      <input
        accept={accept}
        disabled={disabled}
        hidden={hidden}
        id={id}
        onChange={onChange}
        type='file'
      />
    </If>
  )
}

FormInput.propTypes = {
  accept: Proptypes.string,
  error: Proptypes.string,
  id: Proptypes.string.isRequired,
  label: Proptypes.string,
  value: Proptypes.string,
  disabled: Proptypes.bool,
  placeholder: Proptypes.string,
  type: Proptypes.string,
  onBlur: Proptypes.func,
  onChange: Proptypes.func,
  hidden: Proptypes.bool,
  title: Proptypes.string
}

FormInput.defaultProps = {
  type: 'text'
}

export default FormInput
