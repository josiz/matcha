import React from 'react';

import InputWithLabel from '../../components/InputWithLabel';
import RadioWithLabel from '../../components/RadioWithLabel';
import TagsInput from './TagsInput';
import MyProfileMap from './MyProfileMap';

import {sendMyProfileData} from '../../modules/httpQueries';

const MyProfileInfo = ({rerenderTrick, setRerenderTrick, firstName, setFirstName, lastName, setLastName, age, setAge, latitude, setLatitude, longitude, setLongitude, email, setEmail, gender, setGender, target, setTarget, biography, setBiography, tags, setTags, myProfileSaveStatus, setMyProfileSaveStatus}) => {
    return (
        <>
        <h2>Your information</h2>
        <form id='myProfileForm' onSubmit={(event) => sendMyProfileData(event, firstName, lastName, age, latitude, longitude, email, gender, target, biography, tags, rerenderTrick, setRerenderTrick, setMyProfileSaveStatus)}>        
        <InputWithLabel
            type='text'
            name='firstName'
            label='First name'
            state={firstName}
            setState={setFirstName}
            pattern="[a-zA-Z\u00c0-\u017e]{2,32}"
            required={true}
        />
        <InputWithLabel
            type='text'
            name='lastName'
            label='Last name'
            state={lastName}
            setState={setLastName}
            pattern="[a-zA-Z\u00c0-\u017e]{2,32}"
            required={true}
        />
        <InputWithLabel
            type='email'
            name='email'
            label='Email'
            state={email}
            setState={setEmail}
            required={true}
        />
        <InputWithLabel
            type='text'
            name='age'
            label='Age'
            state={age}
            setState={setAge}
            required={true}
            pattern="(1[6-9])|([2-9][0-9])"
        />
        <div>Location</div>
        <MyProfileMap
            lat={latitude} lon={longitude}
            setLat={setLatitude} setLon={setLongitude}
        />
        <div>Gender</div>
        <RadioWithLabel
            name='gender'
            state={gender}
            setState={setGender}
            options={[
                {label: 'Man', value: 'm'},
                {label: 'Woman', value: 'f'}
            ]}
            required={true}
        />  <br />
        <div>Looking for</div>
        <RadioWithLabel
            name='target'
            state={target}
            setState={setTarget}
            options={[
                {label: 'Men', value: 'm'},
                {label: 'Both', value: 'fm', checked: (target, value) => target.length === 2},
                {label: 'Women', value: 'f'}
            ]}
            required={true}
        /> <br />
        <InputWithLabel
            type='textarea'
            name='biography'
            label='Biography'
            state={biography}
            setState={setBiography}
            required={true}
        />

        <div>Tags</div>

        <TagsInput tags={tags} setTags={setTags} />
        
        {myProfileSaveStatus.length === 2 ?
            <div className='alert alert-success'>{myProfileSaveStatus}</div> :
            myProfileSaveStatus.length ?
                <div className='alert alert-danger'>{myProfileSaveStatus}</div> :
                ''
        }

        <input className='button btn btn-primary' type='submit' name='submit' value='Save' style={{marginLeft: '50%', marginRight: '50%', marginBottom: '1em'}} />
        </form>
        </>);
}

export default MyProfileInfo;
