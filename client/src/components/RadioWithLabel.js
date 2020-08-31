import React from 'react';

const RadioWithLabel = ({
	name, state, setState, options, required
}) => {
	const eventHandler = event => {
		setState(event.target.value);
	};

	return options.map(option => {
		if (!option.checked)
			option.checked = (state, value) => state === option.value;
		return (
		<span key={option.value + option.label}>
			<div className="custom-control custom-radio" style={{display: 'inline'}}>
				<input type='radio' name={name} value={option.value} checked={option.checked(state, option.value)} onChange={event => eventHandler(event)} required={required} />
				<label htmlFor={option.value} style={{paddingLeft: '0.2em'}}>{option.label}</label>
			</div>
		</span>
		)
	});
};

export default RadioWithLabel;
