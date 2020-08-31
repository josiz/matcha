import React, {useEffect, useState} from 'react';

import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';


import ProfileNav from './ProfileNav';
import ProfilePreview from '../Index/ProfilePreview';
import {getThisPage, generateImageUrl} from '../../modules/httpQueries';
import Likes from './MyLikesLikes';
import Likee from './MyLikesLikee';
import {Popup} from '../../components/Popup';

/* eslint-disable */

const MyVisits = ({state, setState}) => {

    const [visitsState, setVisitsState] = useState(null);
    const [previewState, modifyPreviewState] = useState(null);
    const [previewLikedWhoState, modifyPreviewLikedWhoState] = useState(null);
    const [previewImage, modifyPreviewImage] = useState(null);
    const [imagePopupState, modifyImagePopupState] = useState(false);
    const [rerenderTrick, setRerenderTrick] = useState(false);

    var blockFilter = {display: 'block'};
    if (previewState)
    {
        if (previewState.blockStatus == false)
        {
            blockFilter = 
            {
                
            }
        }
        else
        {
            blockFilter = 
            {
                position: 'absolute',
                margin: '0',
                padding: '0',
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%',
                backgroundSize: 'cover',
                WebkitFilter: 'blur(4px)',
                MozFilter: 'blur(4px)',
                MsFilter: 'blur(4px)',
                OFilter: 'blur(4px)',
                filter: 'blur(4px)',
                Zindex: '13'
            }
        }
    }

    const mainPicStyle = 
    {
        maxWidth: '100%',
        maxHeight: '100%',
        borderRadius: '100px'
    }

    const smallPicStyle =
    {
        maxWidth: '120px',
        maxHeight: '100px',
        padding: '20px'
    }

    // Remove all default stylings from the button, that the image is just a button
    const imageButton =
    {
        background: 'none',
        color: 'inherit',
        border: 'none',
        padding: '0',
        font: 'inherit',
        cursor: 'pointer',
        outline: 'inherit'
    }

    const popUpImage = 
    {
        maxWidth: '100%',
        maxHeight: '100%',
    }

	useEffect(() => {
		getThisPage(window.location.pathname)
			.then(response => {
				setVisitsState(response);
            });
            if (previewState)
            {
                getThisPage('/profile/'+previewState.profileData.id)
                    .then(response => {
                        modifyPreviewState(response);
                    });
            }

	}, [rerenderTrick]);

	if (visitsState)
		return (
        <>  
            <ProfileNav />
                <h1>Visits</h1>
                <div className="row">
                    <div className="col-sm-6">
                        <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example" className="w-80" style={{margin: '20px'}}>
                            <Tab eventKey="home" title="Users you have visited" className="w-80" style={{margin: '20px', maxHeight: '800px', overflowY: 'auto'}}>
								<Likes likes={visitsState.visited} modifyPreview={modifyPreviewState} modifyWho={modifyPreviewLikedWhoState}/>
                            </Tab>
                            <Tab eventKey="profile" title="Users that have visited you" className="w-80" style={{margin: '20px', maxHeight: '800px', overflowY: 'auto'}}>
								<Likee likes={visitsState.visitedMe} modifyPreview={modifyPreviewState} modifyWho={modifyPreviewLikedWhoState}/>
                            </Tab>
                        </Tabs>
                    </div>
                <div className="col-sm-5" style={{margin: '20px', justifyContent: 'center', textAlign: 'center'}}>

                {previewState && previewState.profileData ?
                    <ProfilePreview user={previewState} stateChange={rerenderTrick} setStateChange={setRerenderTrick} />
                        : ''}
 
                {imagePopupState === true ?
                    <Popup setPopupState={modifyImagePopupState}><img src={generateImageUrl(previewImage)} style={popUpImage}/></Popup>
                        : ''}
                  
                </div>
            </div>
            <br />
            <br />
        </>
        );

	else
		return (
        <>
            <ProfileNav />
			<h1>Profile empty or loading</h1>
            <h1>Serverille 'myProfile/likes'</h1>
        </>
        );
};

export default MyVisits;