import React, {useState} from 'react';

import MyProfileImage from './MyProfileImage';
import {Popup} from '../../components/Popup';
import {uploadPhoto} from '../../modules/httpQueries';
import {generateImageUrl} from '../../modules/httpQueries';

const MyProfileImages = ({profile, rerenderTrick, setRerenderTrick}) => {	
    const [previewImage, modifyPreviewImage] = useState(null);
    const [imagePopupState, modifyImagePopupState] = useState(false);

    const popUpImage = 
    {
        maxWidth: '100%',
        maxHeight: '100%',
    }

    const uploadPhotos = (event, rerenderTrick, setRerenderTrick) => {
        const element = event.target;
        // Array.prototype.forEach.call(element.files, file => {
        //     if (file.type.startsWith('image/') && file.size < 5000000) {
        //         const res = uploadPhoto(file);
        //     }
        //     else
        //         alert('File ' + file.name + ' is not an image or is too large.');
        // })
                const res = uploadPhoto(element.files);
                res.then(r => setRerenderTrick(!rerenderTrick));
                
                // MITEN RES:sta SAADAAN PROMISE VALUE ULOS?
                //window.location.reload(false);
    }

    /* eslint-disable eqeqeq */
    const uploadedImages = profile.images.length ?
        profile.images.map(photo => <MyProfileImage photo={photo} key={photo.id} previewImage={modifyPreviewImage} popupState={modifyImagePopupState} main_pic={profile.userData.main_pic} rerenderTrick={rerenderTrick} setRerenderTrick={setRerenderTrick} />)
            .sort((a, b) => {
                if (a.key == a.props.main_pic || b.key == b.props.main_pic)
                    return (b.key == b.props.main_pic) - (a.key == a.props.main_pic);
                else
                    return a.key - b.key;
            }) :
        <p style={{color: 'red'}}>You haven't uploaded any images! You must upload atleast one image before you can like other users</p>;

    return (
        <>
        <h1>Your photos</h1>
        <div className="custom-file">
            <input type='file' name='photoUpload' className="form-control-file" id="exampleFormControlFile1" onChange={event => uploadPhotos(event, rerenderTrick, setRerenderTrick)} multiple accept="image/*" />
            <label className="custom-file-label" htmlFor="exampleFormControlFile1" data-browse="Upload">Upload photos</label>
        </div>
        <h2>Uploaded photos ({profile.images.length}/5)</h2>
        {uploadedImages}
        {imagePopupState === true ?
            <Popup setPopupState={modifyImagePopupState}><img src={generateImageUrl(previewImage, 'png')} style={popUpImage} alt='Enlarged profile' /></Popup>
        : ''}

        </>
        );
}

export default MyProfileImages;
