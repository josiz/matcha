import axios from 'axios';

import {setUser, setToken} from './userData';
import {getToken} from './userData';
import {getGeolocation} from './geolocate';

import {likeButtonStrings} from '../config.json';

const baseUrl = '/api';

// This function will generate a link to a user image on the server.
// Can be used with 2 arguments: (id, extension) or 1: (filename)
export const generateImageUrl = (id, extension) => {
	if (id === 'placeholder.png' || !id || id === 'null')
		return '/img/placeholder.png';
	const dirUrl = '/img/userPhotos/';
	if (typeof extension === 'undefined')
		return dirUrl + id;
	else
		return dirUrl + id + '.' + extension;
};

export const fallbackImageUrl = event => {
	event.target.src = generateImageUrl('placeholder.png');
}

const getAuthHeader = () => {
	return {Authorization: `Bearer ${getToken()}`};
};

export const getThisPage = relativeUrl => {
	const url = baseUrl + relativeUrl;
	const request = axios.get(url, {headers: getAuthHeader()});
	return request.then(response => {
		if (response.data === 'logged out') {
			localLogout(true);
			return;
		}
		else
			return response.data;
	});
}

const localLogout = (reload = false) => {
	localStorage.clear();
	if (reload)
		window.location.href = '/';
}

export const submit42Code = (code, action) => {
	let coords = {};
	if (action === 'apiLogin')
		coords = getGeolocation();
	const url = baseUrl + '/' + action;
	
	const request = axios.post(url, {code: code, latitude: coords.latitude, longitude: coords.longitude});
	return new Promise((resolve, reject) => {
		request.then(response => resolve(response.data));
	});
};

export const logOut = (setState, socketState, all = false) => {
	const url = baseUrl + '/logout';
	const request = axios.post(url, {all: all}, {headers: getAuthHeader()});
	setState({});
	socketState.emit('logOut', {user: getToken()});
	localStorage.clear();
	request.then(response => localLogout(true));
	
};

export const uploadPhoto = photos => {
	let formData = new FormData();
	Array.prototype.forEach.call(photos, photo => {
		formData.append('photos', photo);
	});
	const request = axios.post(baseUrl + '/myProfile/pics', formData, {headers: getAuthHeader()});
	return request.then(response => {
		if (response.data === 'logged out') {
			localLogout(true);
			return;
		}
		else
			return response.data;
	});	
}

export const photoActions = (action, id, rerenderTrick, setRerenderTrick) => {
	const request = axios.post(baseUrl + '/myProfile/photoActions',
		{action: action, id: id},
		{headers: getAuthHeader()});
	if (action === 'delete')
		window.location.reload(false);
	return request.then(response => {
		if (response.data === 'logged out') {
			localLogout(true);
			return;
		}
		else {
			setRerenderTrick(!rerenderTrick);
			return response.data;
		}
	});	
};

export const sendMyProfileData = (event, firstName, lastName, age, latitude, longitude, email, gender, target, biography, tags, rerenderTrick, setRerenderTrick, setMyProfileSaveStatus) => {
	event.preventDefault();
	if (!event.target.checkValidity()) {
		event.target.reportValidity();
		return;
	}
	
	const url = baseUrl + '/myProfile/profile';
	const reqBody = {
		firstName: firstName,
		lastName: lastName,
		age: age,
		latitude: latitude,
		longitude: longitude,
		email: email,
		gender: gender,
		target: target,
		biography: biography,
		tags: tags
	};

	const request = axios.post(url, reqBody, {headers: getAuthHeader()});
	return request.then(response => {
		if (response.data === 'logged out') {
			localLogout(true);
			return;
		}
		else {
			setRerenderTrick(!rerenderTrick);
			if (response.data && response.data.token) {
				setToken(response.data.token);
				setMyProfileSaveStatus('OK');
			}
			else
				setMyProfileSaveStatus('Error, changes not saved');
		}
	});
}

export const submitLike = (path, action, state, setState) => {
	
	const url = baseUrl + path;
	let likeAction = '';
	if (action === 'block')
		likeAction = 'block';
	else if (action === 'unblock')
		likeAction = 'unblock';
	else if (action === 'report')
		likeAction = 'report';
	else if (action === likeButtonStrings.noLikes || action === likeButtonStrings.theyLike)
		likeAction = 'like';
	else
		likeAction = 'unlike';

	const request = axios.post(url, {action: likeAction},
		{headers: getAuthHeader()});
	request.then(response => {
		if (response.data === 'logged out') {
			localLogout(true);
			return;
		}
		else
			setState(!state);;
	});
};

export const loginResponseHandler = (data, setState, setPopupState) => {
	if (!data || data === 'email' || data === 'Database error') {
		setState({});
		localStorage.clear();
		if (data === 'email')
			alert('Make sure to confirm your email address before logging in.');
		else
			alert('Login failed.');
		return false;
	}
	else {
		setUser(data.username, data.id, data.age, data.tags, true);
		setToken(data.token);
		setState({loggedIn: true, username: data.username, id: data.id});
		setPopupState(false);
		window.location.href = '/';
		return true;
	}
}

export const submitLogin = (event, setState, setPopupState, username, password) => {
	event.preventDefault();

	const coords = getGeolocation();

	let reqBody = {
		username: username,
		password: password,
		latitude: coords.latitude,
		longitude: coords.longitude
	};

	axios.post(baseUrl + '/login', reqBody)
		.then(response => {
			loginResponseHandler(response.data, setState, setPopupState);
		});
};

export const submitRegister = (event, setPopupState, username, password, confirmPassword, email, firstName, lastName) => {
	event.preventDefault();
	if (!event.target.checkValidity()) {
		event.target.reportValidity();
		return;
	}

	const reqBody = {
		username: username,
		password: password,
		confirmPassword: confirmPassword, 
		email: email,
		firstName: firstName,
		lastName: lastName
	};

	axios.post(baseUrl + '/register', reqBody)
		.then(response => {
			if (response.data)
				setPopupState(false);
			else
				alert('Failed to register an account.');
		});
};

export const submitForgot = (event, setPopupState, email) => {
	event.preventDefault();

	const reqBody = {email: email};

	axios.post(baseUrl + '/forgotPassword', reqBody)
		.then(response => {
			if (!response.data)
				alert('Something went wrong, nothing has been done.');
			else
				setPopupState(false);
		});
};

export const submitResetPassword = (event, setPopupState, password, confirmPassword) => {
	event.preventDefault();

	axios.post(baseUrl + '/resetPassword', {password: password, confirmPassword: confirmPassword})
		.then(response => {
			if (!response.data)
				alert('Something went wrong');
			else
				setPopupState(false);
		});
};

export const submitConfirmEmailOrResetPassword = (obj, endpoint) => {
	axios.post(baseUrl + '/' + endpoint, obj)
		.then(response => {
			if (!response.data)
				alert('Something went wrong, nothing has been done.');
			else
				return true;
			return false;				
		});
};

export const parseSearchString = str => {
	if (str.length < 2)
		return null;
	const arr = str.substring(1).split('&');
	const ret = {};
	arr.forEach(value => {
		if (value.split('=').length === 2)
			ret[value.split('=')[0]] = value.split('=')[1];
	});
	return ret;
}

export const getConnections = () => {
	const request = axios.get(baseUrl + '/getConnections', {headers: getAuthHeader()})
		return request.then(response => {
			if (!response.data || response.data === 'logged out')
				alert('Something went wrong (getConnections) (probably trying to get connections without being logged in)');
			else
			{
				return(response.data);
			}
		});
};
