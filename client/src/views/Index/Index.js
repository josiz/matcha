import React, {useState, useEffect} from 'react';

import Suggestions from './Suggestions';
import Filters from './Filters';
import {getThisPage, submitConfirmEmailOrResetPassword, parseSearchString, submit42Code, loginResponseHandler} from '../../modules/httpQueries';
import UserCard from './UserCard';
import ProfilePreview from './ProfilePreview';
import {getUser} from '../../modules/userData';
import DropdownButton from 'react-bootstrap/DropdownButton';

import {sortingMethods} from '../../config.json';

/* eslint-disable */

const Index = ({state, action, setPopupState, setState}) => {
	const userData = getUser();
	// Userdata doesn't load instantly, so set a default to prevent errors
	const age = userData.age ? userData.age : 25;

	const [users, setUsers] = useState([]);
	const [distanceFilter, setDistanceFilter] = useState(100);
	const [minAge, setMinAge] = useState(age - 3);
	const [maxAge, setMaxAge] = useState(age + 3);
	const [minFame, setMinFame] = useState(0);
	const [maxFame, setMaxFame] = useState(9999999999999);
	const [minCommonTags, setMinCommonTags] = useState(0);
	const [sort, setSort] = useState(0);
	const [tagSearch, setTagSearch] = useState('');
	const [previewId, setPreviewId] = useState(null);
	const [previewProfile, setPreviewProfile] = useState(null);
	const [stateChange, setStateChange] = useState(false);

	if (action === 'resetPassword')
		setPopupState('resetPassword');

	const generateUserCards = users => {
		if (!users || !users.length)
			return '';
		return users.map(user => <UserCard key={user.id} profile={user} preview={setPreviewId}/>);
	};

	useEffect(() => {
		if (action === 'confirmEmail') {
			const searchObj = parseSearchString(window.location.search);
			if (!searchObj || !searchObj.user || !searchObj.token)
				return;
			if (submitConfirmEmailOrResetPassword(searchObj, action)) {
				setPopupState('login');
				window.location.href = '/';
			}
		}
		else if ((action === 'apiLogin' || action === 'apiRegister') && window.location.search) {
			if (window.location.search.substr(0,6) !== '?code=')
				window.location.href = '/';
			const req = submit42Code(window.location.search.substr(6), action)
			req.then(data => {
				if (data && data.action === 'register') {
					localStorage.setItem('registerPrefill', JSON.stringify(data));
					setPopupState('register');
				}
				else {
					loginResponseHandler(data, setState, setPopupState);
				}
			});
		}
		else if (!action)
			getThisPage(window.location.pathname)
				.then(response => {
					response = response || [];
					setUsers(generateUserCards(response));
				});

		

		if (previewId)
		{
			getThisPage('/profile/'+previewId)
				.then(response => {
					setPreviewProfile(response);
				});
		}
	}, [action, setPopupState, previewId, stateChange]);

	if (state.loggedIn)
		return (
			<div>
				<div className="row">
				
				
					<div className="col-md-6 h-25 order-md-2" id="searchContainer">
						
						<DropdownButton id="dropdown-basic-button" title="Filters">
							<Filters
								distance={distanceFilter} setDistance={setDistanceFilter}
								minAge={minAge} setMinAge={setMinAge}
								maxAge={maxAge} setMaxAge={setMaxAge}
								minCommonTags={minCommonTags} setMinCommonTags={setMinCommonTags}
								sort={sort} setSort={setSort} sortingMethods={sortingMethods}
								tagSearch={tagSearch} setTagSearch={setTagSearch}
								minFame={minFame} setMinFame={setMinFame}
								maxFame={maxFame} setMaxFame={setMaxFame}
							/>
						</DropdownButton>
						<div style={{marginTop: '10px'}}>

							<ProfilePreview user={previewProfile} stateChange={stateChange} setStateChange={setStateChange} />
							<br />
						</div>
					</div>
					
					<div className="col-md-6 h-25 order-md-1" id="suggestionContainer">

						<div className="container" style={{overflowY: 'auto', maxHeight: '700px'}}>
							<Suggestions
								users={users} distanceFilter={distanceFilter}
								minAge={minAge} maxAge={maxAge}
								minCommonTags={minCommonTags}
								sort={sortingMethods[sort]}
								tagSearch={tagSearch}
								minFame={minFame} maxFame={maxFame}
							/>
						</div>
						<br />
						<br />
					</div>
					
				</div>
				
			</div>
		);

	else
		return(
			<div>Log in to gain access to this great service!</div>
		);
};

export default Index;
