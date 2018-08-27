import React from "react";
import classnames from "classnames";
import PropTypes from "prop-types";
const SelectListGroup = ({ name, value, error, info, onChange, options }) => {
  //create an array to store options
  const selectOptions = options.map(option => (
    <option key={option.label} value={option.value}>
      {option.label}
    </option>
  ));
  return (
    <div className="form-group">
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={classnames("form-control form-control-lg", {
          "is-invalid": error
        })}
      >
        {selectOptions}
      </select>
      {info && <small className="form-text text-muted">{info}</small>}
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

SelectListGroup.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  info: PropTypes.string,
  error: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired
};

export default SelectListGroup;
