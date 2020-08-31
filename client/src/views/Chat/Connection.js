import React from 'react';
import {generateImageUrl} from '../../modules/httpQueries';

/* eslint-disable */

const Connection = ({connections, chat, setChat, chatWindow, setChatWindow, setChatUsername}) => {

{
    return(
        connections.map( (connection) => 
            <div key={connection.username}>
            {connection.online ? 
            <>
                <button className="btn btn-secondary" style={{width: '100%', marginBottom: '3px', justifyContent: 'center'}} onClick={() => {setChatUsername(connection.username); setChat(connection.id); {chat === connection.id ? setChatWindow(!chatWindow) : (chat === null ? setChatWindow(!chatWindow) : (chatWindow == true ? setChatWindow(chatWindow) : setChatWindow(!chatWindow)))}}}>
                <img src={generateImageUrl(connection.filename)} style={{maxHeight: '30px'}}/>
                <h4 style={{color: 'white', display: 'inline'}}>  {connection.username} </h4>
                <div style={{backgroundColor: 'green', height: '10px', width: '10px', borderRadius: '5px', display: 'inline-block'}}></div>
                </button>
                

                <br/>
            </>
            :
            <>
                <button className="btn btn-secondary" style={{width: '100%', marginBottom: '3px', justifyContent: 'center'}} onClick={() => {setChatUsername(connection.username); setChat(connection.id); {chat === connection.id ? setChatWindow(!chatWindow) : (chat === null ? setChatWindow(!chatWindow) : (chatWindow == true ? setChatWindow(chatWindow) : setChatWindow(!chatWindow)))}}}>
                <img src={generateImageUrl(connection.filename)} style={{maxHeight: '30px'}}/>
                <h4 style={{color: 'white', display: 'inline'}}>  {connection.username} </h4>
                <div style={{backgroundColor: 'red', height: '10px', width: '10px', borderRadius: '5px', display: 'inline-block'}}></div>
                </button>
                <br/>
            </>
            }
            </div>
        )
        
    )
}

}

export default Connection;
