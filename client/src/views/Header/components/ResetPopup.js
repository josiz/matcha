import React, {useState} from 'react';
import {Link} from 'react-router-dom';

import {Popup} from '../../../components/Popup';
import InputWithLabel from '../../../components/InputWithLabel';

import {submitResetPassword} from '../../../modules/httpQueries';

export const ResetPopup = ({state, setState, setPopupState}) => {
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	return (
		<Popup setPopupState={setPopupState}>
			<form id='forgotPasswordForm' onSubmit={event => submitResetPassword(event, setPopupState, password, confirmPassword)}>
				<InputWithLabel
					type='password'
					name='password' 
					label='Password'
					state={password}
					setState={setPassword}
				/>
				<InputWithLabel
					type='password'
					name='confirmPassword' 
					label='Confirm password'
					state={confirmPassword}
					setState={setConfirmPassword}
				/>
				<input type='submit' name='submit' value='OK' />
			</form>
			<Link to='#' onClick={() => setPopupState('login')}>
				Back
			</Link>
		</Popup>
	);
};
