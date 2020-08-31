import React, {useState} from 'react';
import {Link} from 'react-router-dom';

import {Popup} from '../../../components/Popup';
import InputWithLabel from '../../../components/InputWithLabel';

import {submitForgot} from '../../../modules/httpQueries';

export const ForgotPopup = ({state, setState, setPopupState}) => {
	const [email, setEmail] = useState('');

	return (
		<Popup setPopupState={setPopupState}>
			<form id='forgotPasswordForm' onSubmit={event => submitForgot(event, setPopupState, email)}>
				<InputWithLabel
					type='email'
					name='email' 
					label='Email'
					state={email}
					setState={setEmail}
				/>
				<input type='submit' name='submit' value='OK' />
			</form>
			<Link to='#' onClick={() => setPopupState('login')}>
				Back
			</Link>
		</Popup>
	);
};
