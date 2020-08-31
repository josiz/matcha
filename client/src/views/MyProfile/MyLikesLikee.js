import React from 'react';
import {getThisPage, generateImageUrl} from '../../modules/httpQueries';

// Databasen 'likes' tableen lisattava id columni, jotta key helpompi saada uniikiksi.

// USERS THAT HAVE LIKED ME

/* eslint-disable */

const MyLikesLikee = ({likes, modifyPreview, modifyWho}) => {

    const smallPic = 
    {
        height: '30px'
    }
    function changePreview(profile)
    {
        if (profile.liker)
        {
        getThisPage('/profile/' + profile.liker)
			.then(response => {
				//console.log('myProfiles/likes response:');
				//console.log(response);
                modifyPreview(response);
            });
        }
        else
        {
            getThisPage('/profile/' + profile.visitor)
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
            <>
                <button className="btn btn-success" onClick={() => {changePreview(like); modifyPreview(like); modifyWho(2);}} style={{width: '80%', marginRight: '50px', marginBottom: '20px'}}>
                {like.visitorPic ? <img src={generateImageUrl(like.visitorPhoto)} style={smallPic} /> : <img src={generateImageUrl(like.likerPhoto)} style={smallPic} /> }
                    <b>  {like.likerUsername ? like.likerUsername : like.visitorUsername}</b>
                </button>
                <br />
            </>
        </div>))
    }
}

export default MyLikesLikee;

// return ( 
//     likes.map( (like) =>
//     <>
//         <button className="btn btn-success" onClick={() => {changePreview(like); modifyPreview(like); modifyWho(1);}} style={{width: '80%', marginRight: '50px', marginBottom: '20px'}}>
//             <b>{like.likeeUsername ? like.likeeUsername : like.visiteeUsername}</b>
//             {like.likeePic}
//         </button>
//         <br />
//     </>)
// ) 
