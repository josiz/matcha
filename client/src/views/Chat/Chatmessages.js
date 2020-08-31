import React from 'react';

/* eslint-disable */

const ChatMessages = (({messages, otherUser, mostRecentMessage}) => {

    if (mostRecentMessage == 'blocked')
        alert("Both users must like eachother before messaging is possible!");
if (messages)
{
    {var asd = 0}
    {var asd2 = 0}
    return (
        
        messages.map((message, index) => {
            asd2 = asd;
            asd = otherUser == message.sender_name ? 1 : 2
            return (
                <div key={index}> 
                
                {asd === 1 ?
                    <>
                        {asd !== asd2 ? <h5 style={{textAlign: 'left'}}>{otherUser}</h5> : ''}
                        <p style={{textAlign: 'left'}}>{message.content}</p>
                    </>
                    :
                    <>
                        {asd !== asd2 ? <h5 style={{textAlign: 'right'}}>{message.sender_name}</h5> : ''}
                        <p style={{textAlign: 'right'}}>{message.content}</p>
                    </>
                    }
                    
                </div>
            )
        })
    )
}
else
    return (
        <p>No messages</p>
    );
});


export default ChatMessages;


