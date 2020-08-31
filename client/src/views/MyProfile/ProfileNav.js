import React from 'react';

import {Link} from 'react-router-dom';


const ProfileNav = () => {	

    return (
        <nav className="navbar navbar-expand navbar-light bg-light">
			<div className="navbar-nav">
                <div className="navbar-nav">
                    <Link className="nav-item nav-link" to='/myProfile/profile'>Profile</Link>
                    <Link className="nav-item nav-link" to='/myProfile/likes'>Likes</Link>
                    <Link className="nav-item nav-link" to='/myProfile/visits'>Visits</Link>
                </div>
            </div>
        </nav>
    )
}


export default ProfileNav;
