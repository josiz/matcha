import React, {useEffect, useState} from 'react';
import ProfileNav from './ProfileNav';
import MyProfileInfo from './MyProfileInfo';
import MyProfileImages from './MyProfileImages';

import {getThisPage} from '../../modules/httpQueries';



const MyProfile = ({state, setState}) => {	
    const [rerenderTrick, setRerenderTrick] = useState(false);
	const [profileState, setProfileState] = useState(null);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [age, setAge] = useState(16);
    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);
    const [email, setEmail] = useState('');
    const [gender, setGender] = useState('f');
    const [target, setTarget] = useState('fm');
    const [biography, setBiography] = useState('');
	const [tags, setTags] = useState([]);
	const [myProfileSaveStatus, setMyProfileSaveStatus] = useState('');
	
	useEffect(() => {
		getThisPage(window.location.pathname)
			.then(response => {
				setProfileState(response);
				setFirstName(response.userData.first_name); setLastName(response.userData.last_name); setAge(response.userData.age || 'Unknown');
				setLatitude(response.userData.latitude); setLongitude(response.userData.longitude); setEmail(response.userData.email);
				setGender(response.userData.gender); setTarget(response.userData.target_genders); setBiography(response.userData.biography);
				setTags(response.tags);
			});
	}, [rerenderTrick]);

	if (profileState)
		return (<>
		<ProfileNav />
		<div className="row">
			<div className="col-sm-6">
				<MyProfileInfo rerenderTrick={rerenderTrick} setRerenderTrick={setRerenderTrick}
					age={age} setAge={setAge} firstName={firstName} setFirstName={setFirstName} lastName={lastName} setLastName={setLastName}
					latitude={latitude} setLatitude={setLatitude} longitude={longitude} setLongitude={setLongitude} email={email} setEmail={setEmail}
					gender={gender} setGender={setGender} target={target} setTarget={setTarget} biography={biography} setBiography={setBiography}
					tags={tags} setTags={setTags} myProfileSaveStatus={myProfileSaveStatus} setMyProfileSaveStatus={setMyProfileSaveStatus}
				/>
			</div>
			<div className="col-sm-6">
				<MyProfileImages profile={profileState} rerenderTrick={rerenderTrick} setRerenderTrick={setRerenderTrick} />
			</div>
		</div>			
		</>);

	else
		return (
			<>
			<ProfileNav />
			<h1>My profile</h1>
			</>
		);
};

export default MyProfile;
