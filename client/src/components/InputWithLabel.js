import React from 'react';

// const generateRandomId = () => Math.floor(1 + Math.random());

const CustomInputField = ({type, name, label, state, setState, eventHandler, step = 1, pattern, required, max, min}) => {
	if (type === 'textarea')
		return <textarea name={name} className="form-control" onChange={event => eventHandler(event)} value={state || ''} required={required ? true : false} />;
	else if (type === 'number' && typeof max !== 'undefined' && typeof min !== 'undefined')
		return <input type={type} className="form-control" name={name} value={state} onChange={event => eventHandler(event)} step={step} min={min} max={max} required={required} />;
	else if (type === 'number')
		return <input type={type} className="form-control" name={name} value={state} onChange={event => eventHandler(event)} step={step} required={required} />;
	else if (type === 'text' && pattern)
		return <input type={type} className="form-control" name={name} value={state} onChange={event => eventHandler(event)} pattern={pattern} required={required} />;
	else
		return <input type={type} className="form-control" name={name} value={state} onChange={event => eventHandler(event)} required={required} />;

};

const InputWithLabel = ({type, name, label, state, setState, step, integer, pattern, required, max, min}) => {
	const eventHandler = event => {
		if (!integer || Number.isInteger(Number(event.target.value)))
			setState(event.target.value);
	};

	return (
		<div>
			<label htmlFor={name}>{label}</label>
			<CustomInputField type={type} name={name} label={label} state={state} setState={setState} eventHandler={eventHandler} step={step} pattern={pattern} required={required} max={max} min={min} />
			<br />
		</div>
	);
};

export default InputWithLabel;
