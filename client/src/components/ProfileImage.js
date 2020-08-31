import React from 'react';

import {generateImageUrl, fallbackImageUrl} from '../modules/httpQueries';

const ProfileImage = ({filename, style}) => 
	<img alt='User' src={generateImageUrl(filename)} onError={event => fallbackImageUrl(event)} style={style ? style : {}} />
;

export default ProfileImage;
