import React, {useState, useEffect} from 'react';

import {Popup} from '../../../components/Popup';
import InputWithLabel from '../../../components/InputWithLabel';

import {submitRegister} from '../../../modules/httpQueries';

export const RegisterPopup = ({setPopupState}) => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [email, setEmail] = useState('');
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');

	useEffect(() => {
		const jsonData = localStorage.getItem('registerPrefill')
		if (jsonData) {
			const data = JSON.parse(jsonData);
			if (data.uname)
				setUsername(data.username);
			if (data.first_name)
				setFirstName(data.first_name);
			if (data.last_name)
				setLastName(data.last_name);
			if (data.email)
				setEmail(data.email);
			localStorage.removeItem('registerPrefill');
		}
	}, []);

	return (
		<Popup setPopupState={setPopupState}>
			<form id='registerForm'
				onSubmit={event =>
					submitRegister(event, setPopupState,
					username, password, confirmPassword,
					email, firstName, lastName)}
			>
				
				<InputWithLabel
					type='text'
					name='username' 
					label='Username'
					state={username}
					setState={setUsername}
					pattern='[A-Za-z0-9]{4,16}'
				/>
				<p style={{fontSize: '10px', maxWidth: '300px'}}>4-16 characters</p>
				<InputWithLabel
					type='email'
					name='email' 
					label='Email'
					state={email}
					setState={setEmail}
				/>
				<InputWithLabel
					type='text'
					name='firstName' 
					label='First name'
					state={firstName}
					setState={setFirstName}
					pattern="[a-zA-Z\u00c0-\u017e]{2,32}"
				/>
				<InputWithLabel
					type='text'
					name='lastName' 
					label='Last name'
					state={lastName}
					setState={setLastName}
					pattern="[a-zA-Z\u00c0-\u017e]{2,32}"
				/>
				<InputWithLabel
					type='password'
					name='password' 
					label='Password'
					state={password}
					setState={setPassword}
				/>
				<p style={{fontSize: '10px', maxWidth: '300px'}}>Password must be at least 8 characters long and include 3 of: lowercase, uppercase, number, special character</p>
				<InputWithLabel
					type='password'
					name='confirmPassword' 
					label='Confirm password'
					state={confirmPassword}
					setState={setConfirmPassword}
				/>
				<input type='submit' name='submit' value='OK' />
			</form>
			<div>
				<a href='https://api.intra.42.fr/oauth/authorize?client_id=932fc007009ee06ec98cba8f6d4842c092a26a18aef1875d5b7bc91d9308a7a0&redirect_uri=http%3A%2F%2Flocalhost%3A3001%2FapiRegister&response_type=code'>Register with 42</a>
			</div>
		</Popup>
	);
};
