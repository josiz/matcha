import React from 'react';
import {Button, Row, Container} from 'react-bootstrap';

import {generateImageUrl, photoActions} from '../../modules/httpQueries';

const MyProfileImage = ({photo, previewImage, popupState, main_pic, rerenderTrick, setRerenderTrick}) => {
	let disabled = false;
	let photoStyle = {maxWidth: '300px', maxHeight: '300px'};

	if (photo.id === main_pic) {
		disabled = true;
		photoStyle = {...photoStyle,
			boxShadow: '0 0 20px 10px lightsteelblue',
			marginBottom: '10px',
			marginTop: '10px'
		}
	}

	return (
	<Container>
		<Row className="justify-content-center" style={{marginBottom: '10px'}}>
			
            	<div onClick={() => {previewImage(photo.id); popupState(true);}}><img alt='Your upload' src={generateImageUrl(photo.id, photo.extension)} style={photoStyle}/></div>
			
		</Row>
		<Row className="justify-content-center" style={{marginBottom: '30px'}}>
				<Button className="btn" disabled={disabled} onClick={() => photoActions('primary', photo.id, rerenderTrick, setRerenderTrick)} style={{marginRight: '15px'}}>Make photo primary</Button>
				<Button className="btn btn-danger" disabled={disabled} onClick={() => photoActions('delete', photo.id, rerenderTrick, setRerenderTrick)}>Delete photo</Button>
		</Row>
    </Container>
	);
}

export default MyProfileImage;
