import React, {useEffect, useState} from 'react';

import {getToken} from '../../modules/userData';

import {getThisPage} from '../../modules/httpQueries';

import ChatMessages from './Chatmessages';

/* eslint-disable */

const Chatwindow = (({socket, chat, chatWindow, chatUsername}) => {

    const [chatMessages, setChatMessages] = useState(null);
    const [mostRecentMessage, setMostRecentMessage] = useState(null);

    const myToken = getToken();
    socket.emit('privateChat', {user: chat, me: myToken})

    useEffect(() => {
        getThisPage(`/chat?id=${chat}`)
            .then(results => {
                if (results)
                {
                    setChatMessages(results)
                }
            })
    }, [chatWindow, chat, mostRecentMessage]);

    function message()
    {
        var message = document.getElementById('message').value;
        // socket.on('test', () => {
        if (message)
        {
            socket.emit('chat', {
                msg: message,
                id: chat,
                me: myToken
            }, response => {})
        
            document.getElementById('message').value = '';
        }
        // })
    }


    socket.on('FromClient', {
      message: 'asd'
    })
    
    socket.on('chat', function(data) {

        if (data.error == "block")
            setMostRecentMessage("blocked");
        else
            setMostRecentMessage(data);
    })

    function enterPressed(event)
    {
        var code = event.keyCode || event.which;
        if (code === 13)
            message();
    }

    return (
        <>
            
            <button className="btn btn-primary" onClick={() => message()}>Send</button>
            <input type="text" className="form-control" placeholder="" aria-label="" aria-describedby="basic-addon1" name="msg" id="message" autoComplete="off" onKeyPress={enterPressed.bind(this)} />
            <div style={{display: 'flex', flexDirection: 'column-reverse', overflowY: 'auto'}}>
                <div style={{display: 'flex', flexDirection: 'column', overflowWrap: 'break-word', padding: '4px'}}>
                    <ChatMessages messages={chatMessages} otherUser={chatUsername} mostRecentMessage={mostRecentMessage}/>
                </div>
            </div>
            
        </>
    )
})


export default Chatwindow;
