import React, {useEffect, useState} from 'react';

import {getConnections, getThisPage} from '../../modules/httpQueries';

import Connection from './Connection';
import Chatwindow from './Chatwindow';

/* eslint-disable */

const Chat= ({socket}) => {
	const [longPollState, setLongPollState] = useState(false);

    const connectionsWindow =
    {
        position: "fixed",
        bottom: '45px',
        right: '5px',
        width: '200px',
        maxWidth: '45%',
        display: 'none',
        zIndex: '33'
    }

    const chatWindoww = 
    {
        display: 'flex',
        flexDirection: 'column-reverse',
        position: 'fixed',
        bottom: '48px',
        right: '203px',
        width: '200px',
        maxWidth: '40%',
        backgroundColor: 'gray',
        height: 'auto',
        maxHeight: '400px',
        marginRight: '10px',
        borderRadius: '10px',
        zIndex: '33'
    }

    const connectionButton =
    {
        width: '200px',
        maxWidth: '45%',
        height: '40px',
        backgroundColor: 'gray',
        position: 'fixed',
        bottom: '5px',
        right: '5px',
        textAlign: 'center',
        zIndex: '32'
    }

    const [connections, setConnections] = useState(null);
    const [refresh, setRefresh] = useState(true);
    const [chat, setChat] = useState(null);
    const [chatUsername, setChatUsername] = useState(null);
    const [chatWindowOpen, setChatWindow] = useState(false);


    useEffect(() => {
		getConnections()
			.then(response => {
                setConnections(response);
            });

    }, [refresh, chat]);

    useEffect(() => {
		getThisPage('/getLongConnections?count=' + (connections !== null ? connections.length : 0))
			.then(results => {
				if (results) {
					setConnections(results);
				}
				//getNotificationsViaLongPolling(notifications);
				setLongPollState(!longPollState);
			});
	}, [longPollState]);




    if (connections)
    {
        return(
        <>
            
            <div style={connectionsWindow} id="connections">
                    <Connection connections={connections} chat={chat} setChat={setChat} setChatWindow={setChatWindow} chatWindow={chatWindowOpen} chatUsername={chatUsername} setChatUsername={setChatUsername}/> 
            </div>
            {chatWindowOpen ?
                <>
                
                    <div style={chatWindoww}>
                   
                        {/* <div style={{backgroundColor: "light-blue", textAlign: 'center', height: '23px', position: 'relative', bottom: '-10px'}}><p>{chatUsername}</p></div> */}
                    
                        <Chatwindow socket={socket} chat={chat} chatWindow={chatWindowOpen} chatUsername={chatUsername}/>
                        <div style={{backgroundColor: 'transparent', margin: '10px', position: 'absolute', top: '-40px'}}>
                            <h3>{chatUsername}</h3>
                        </div>
                    </div>
                    
                </>
            : ''}
            <button className="btn btn-info" onClick={() => {openConnections(); setRefresh(!refresh); {chatWindowOpen === true ? setChatWindow(false) : setChatWindow(chatWindowOpen)}}} style={connectionButton}>Connections ({connections.length})</button>

        </>)
    }
    else
    {
        return(<h1>Loading</h1>)
    }



function openConnections()
{
    var connections = document.getElementById('connections');
    if (connections.style.display === 'none')
        connections.style.display = 'block'
    else
        connections.style.display = 'none'
}
}

export default Chat;
