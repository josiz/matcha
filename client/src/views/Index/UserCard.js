import React from 'react';

import {generateImageUrl, fallbackImageUrl} from '../../modules/httpQueries';

const CommonTagsDisplay = ({tag}) => {
	return (
		<div>#{tag}</div>
	);
};

const UserCard = ({profile, preview}) => {

	const suggestionImage = 
	{
		maxHeight: '100px',
		borderRadius: '50px',
		margin: '10px',
		border: '1px solid black'
	}

	const cardButton =
	{
		background: 'lightGray',
        color: 'inherit',
        border: 'none',
        padding: '0',
        font: 'inherit',
        cursor: 'pointer',
		outline: 'inherit',
		marginBottom: '10px',
		marginTop: '20px',
		width: '100%',
		borderRadius: '20px',
		boxShadow: '0 0 5px 10px lightGray'
	}

	const cardInfo = 
	{
		justifyContent: 'center',
        alignItems: 'center'
	}

	const commonTagsList = profile.commonTagsList.map((tag, index) => <CommonTagsDisplay key={index} tag={tag} />);

	return (
		<>
		<button style={cardButton} onClick={() => {preview(profile.id)}}>
			
			<div className="row">
				<div className="col-sm-6">
					<img alt='User' src={generateImageUrl(profile.filename)} onError={event => fallbackImageUrl(event)} style={suggestionImage} />
					<h3 key={profile.id} style={{textAlign: 'center'}}>{profile.first_name}, {profile.age}</h3>
					<h5 style={{textAlign: 'center', color: 'rgb(80,80,80)', fontStyle: 'italic'}}>{profile.username}</h5>
					{profile.online ? <h6 style={{color: 'green'}}>Online!</h6> : <h6 style={{color: 'red'}}>Offline</h6>}
					
				</div>
				<div className="col-sm-6" style={cardInfo}>
					{profile.distance < 1 ? <p style={{color: 'green'}}>Very close to you!</p> : profile.distance < 10 ? <p style={{color: 'yellow'}}>In the same city</p> : <p style={{color: 'red'}}>In another city</p>}
					<p style={{display: 'inline'}}>Distance: {profile.distance < 1 ? "less than a " : Number((profile.distance).toFixed(0))} </p> <p style={{display: 'inline'}}>km</p>
					{profile.commonTags ? <div>{profile.first_name} is also interested in: {commonTagsList}</div> : <div style={{fontStyle: 'italic', color: 'rgb(100,100,100)'}}>No common interests</div>}
				</div>
			</div>
		</button>
		<br />
		</>
	);
};

export default UserCard;
