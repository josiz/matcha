import React from 'react';
import {getThisPage, generateImageUrl} from '../../modules/httpQueries';

// Databasen 'likes' tableen lisattava id columni, jotta key helpompi saada uniikiksi.

// USERS I HAVE LIKED

/* eslint-disable */

const MyLikesLikes = ({likes, modifyPreview, modifyWho, rerenderTrick}) => {

    const smallPic = 
    {
        height: '30px'
    }

    function changePreview(profile)
    {
        if (profile.likee)
        {
        getThisPage('/profile/' + profile.likee)
			.then(response => {
				//console.log('myProfiles/likes response:');
				//console.log(response);
                modifyPreview(response);
            });
        }
        else
        {
            getThisPage('/profile/' + profile.visitee)
			.then(response => {
				//console.log('myProfiles/likes response:');
				//console.log(response);
                modifyPreview(response);
            });
        }
    }


    if (!likes)
    {
        return(<h1>Loading</h1>);
    }
    else
    {
        return ( 
            likes.map( (like, index) =>
            <div key={index}>
                <button className="btn btn-success" onClick={() => {changePreview(like); modifyPreview(like); modifyWho(1);}} style={{width: '80%', marginRight: '50px', marginBottom: '20px'}}>
                    {like.visiteePic ? <img src={generateImageUrl(like.visiteePhoto)} style={smallPic} /> : <img src={generateImageUrl(like.likeePhoto)} style={smallPic} /> }
                    <b>  {like.likeeUsername ? like.likeeUsername : like.visiteeUsername}</b>
                </button>
                <br />
            </div>)
        ) 
    }
}

export default MyLikesLikes;
