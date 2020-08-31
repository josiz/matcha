import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';

import {Popup} from '../../../components/Popup';
import InputWithLabel from '../../../components/InputWithLabel';

import {userGeolocation} from '../../../modules/geolocate';
import {submitLogin} from '../../../modules/httpQueries';

export const LoginPopup = ({state, setState, setPopupState}) => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const button = 
	{
		color: 'white',
		fontWeight: 'bold',
		backgroundColor: '#000050',
		padding: '5px 15px',
		boxShadow: '6px 6px 29px -4px rgba(0, 0, 0, 0.75)',
		borderRadius: '5px',
		marginTop: '25px',
		transition: '0.4s'
	}

	useEffect(() => {
		userGeolocation()
	}, []);

	return (
		<Popup setPopupState={setPopupState}>
			<form id='loginForm' onSubmit={event => submitLogin(event, setState, setPopupState, username, password)}>
				<InputWithLabel
					type='text'
					name='username' 
					label='Username'
					state={username}
					setState={setUsername}
				/>
				<InputWithLabel
					type='password'
					name='password' 
					label='Password'
					state={password}
					setState={setPassword}
				/>
				<input style={button} type='submit' name='submit' value='OK' />
			</form>
			<Link to='#' onClick={() => setPopupState('forgotPassword')}>
				Forgot your password?
			</Link>
			<div>
				<a href='https://api.intra.42.fr/oauth/authorize?client_id=932fc007009ee06ec98cba8f6d4842c092a26a18aef1875d5b7bc91d9308a7a0&redirect_uri=http%3A%2F%2Flocalhost%3A3001%2FapiLogin&response_type=code'>Login with 42</a>
			</div>
		</Popup>
	);
};
