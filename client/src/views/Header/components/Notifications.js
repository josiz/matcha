import React, {useState, useEffect} from 'react';
import {Button} from 'react-bootstrap';

import { getThisPage } from '../../../modules/httpQueries';
import ProfileImage from '../../../components/ProfileImage';
import {CollapsedNotificationCount} from '../Header';

const NotificationCard = ({notification}) => {
	const style = {
		backgroundColor: 'lightgrey',
		padding: '0.5em',
		borderRadius: '1em',
		marginTop: '4px',
		marginBottom: '4px'
	};

	let notifiStr = '';
	if (notification.reason === 'visit')
		notifiStr = 'visited your profile!';
	else if (notification.reason === 'like')
		notifiStr = 'liked your profile!'
	else if (notification.reason === 'unlike')
		notifiStr = 'unliked you! :('
	else if (notification.reason === 'msg')
		notifiStr = 'sent you a message!';
	else if (notification.reason === 'match')
		notifiStr = 'matched with you!';

	return (
		<div style={{...style, backgroundColor: notification.read ? 'lightgrey' : 'lightblue'}}>
			<ProfileImage filename={notification.filename} style={{height: '50px', marginRight: '0.5em'}} />
			<strong>{notification.username}</strong> {notifiStr}
		</div>
	);
}

const notificationsWindowStyle = {
	display: 'flex',
	backgroundColor: 'slategrey',
	flexFlow: 'column-reverse nowrap',
	padding: '0.5em',
	borderRadius: '1em',
};

const notificationWindowContainerStyle = {
	maxHeight: '300px',
	flexFlow: 'column nowrap',
	overflow: 'auto',
	zIndex: 9,
	position: 'absolute'
}

const Notifications = ({unreadNotificationsCount, setUnreadNotificationsCount}) => {
	const [notificationsDisplay, setNotificationsDisplay] = useState(false);
	const [notifications, setNotifications] = useState([]);
	const [longPollState, setLongPollState] = useState(false);

	const getNotifications = (markRead = false) => {
		const baseUrl = '/myProfile/notifications';
		const url = baseUrl + (markRead ? '?read=1' : '');
		getThisPage(url)
			.then(results => {
				if (results)
					setNotifications(results);
			});
	}

	// const getNotificationsViaLongPolling = () => {
	// 	getThisPage('/myProfile/longNotifications')
	// 		.then(results => {
	// 			if (results) {
	// 				setNotifications(notifications.concat(results));
	// 			}
	// 			//getNotificationsViaLongPolling(notifications);
	// 		});
	// };

	useEffect(() => {
		setTimeout(() => getNotifications(false), 1000);
		// This alone would work for getting notifications with short polling
		//setInterval(() => getNotifications(false), 5000);
	}, []);


	useEffect(() => {
		//getNotificationsViaLongPolling();
		getThisPage('/myProfile/longNotifications')
			.then(results => {
				if (results) {
					setNotifications(notifications => [...notifications, ...results]);
				}
				//getNotificationsViaLongPolling(notifications);
				setLongPollState(!longPollState);
			});
	}, [longPollState]);

	const displayNotifications = (setNotificationsDisplay, notificationsDisplay) => {
		getNotifications(!notificationsDisplay);
		setNotificationsDisplay(!notificationsDisplay);
	};

	const notificationCards = !notifications.length ?
	<p>Empty!</p> :
	notifications.map(item => <NotificationCard notification={item} key={item.id} new={!item.read} />);
	const unreadCount = notifications.filter(i => !i.read).length;
	setTimeout(() => setUnreadNotificationsCount(unreadCount), 100);

	return (
		<>
			<Button size='sm' style={{position: 'relative'}} variant='secondary' onClick={() => displayNotifications(setNotificationsDisplay, notificationsDisplay)}>Notifications
				{unreadCount ? <CollapsedNotificationCount count={unreadCount} right='-3' /> : ''}
			</Button>
			{/* An outer container is required to get the scroll direction right */}
			<div style={{...notificationWindowContainerStyle, display: notificationsDisplay ? 'flex' : 'none' }}>
				<div style={notificationsWindowStyle}>
					{notificationCards}
				</div>
			</div>
			{/* <div>{notifications.map(item=> {
				if (!item.read)
					return <NotificationCard notification={item} new={!item.read} />;
				else
					return '';
			})}</div>
			<div>{notifications.length}</div> */}
		</>
	);
};

export default Notifications;

// 7.8. muokattu rivi 21 ja 27 notifications.length --> notifications. Ei voinut logata sisaan niiden kanssa.
// 8.8. muokattu takas, koska nimenomaan ei tuon muokkauksen jalkeen toiminut mun mielesta :)
