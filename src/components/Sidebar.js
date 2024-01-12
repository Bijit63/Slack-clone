import React, { useState } from 'react'
import styled from 'styled-components'
import { IoIosAddCircleOutline } from 'react-icons/io';
import { FaPlus } from 'react-icons/fa';
import { sidebarItemsData } from '../data/SidebarData'
import db from '../firebase'
import {  useLocation, useNavigate } from 'react-router-dom'

function Sidebar(props) {

    const navigate = useNavigate();
    const [ownerID, setownerID] = useState(JSON.parse(localStorage.getItem('user')).uid)

    const goToChannel = (id) => {
        if(id){
            console.log(id);
            navigate(`/room/${id}`)
        }
    }


    const goToDM = (id)=>{
        
        if(id){
            console.log(id);
            navigate(`/personalroom/${id}`)
        }
    }


    const addChannel = () => {
        const promptName = prompt("Enter channel name");
        if(promptName){
            db.collection('rooms').add({
                name: promptName,
                owner : ownerID,
                members:[ownerID],
                managers : [ownerID]
            })
        }
    }

    return (
        <Container>
            <WorkspaceContainer>
                <Name>
                    CleverProgrammer
                </Name>
                <NewMessage>
                    <IoIosAddCircleOutline  />
                </NewMessage>
            </WorkspaceContainer>
            <MainChannels>
                {
                    sidebarItemsData.map(item => (
                        <MainChannelItem>
                            {item.icon}
                            {item.text}
                        </MainChannelItem>
                    ))
                }
            </MainChannels>
            <ChannelsContainer>
                <NewChannelContainer>
                    <div>
                        Channels
                    </div>
                    <FaPlus onClick={addChannel} />
                </NewChannelContainer>
                <ChannelsList>
                    {
                        props.rooms.map(item => (
                            <Channel onClick={()=>goToChannel(item.id)}>
                                # {item.name}
                            </Channel>
                        ))
                    }
                </ChannelsList>
            </ChannelsContainer>

            
            <ChannelsContainer>
                <NewChannelContainer>
                    <div>
                        Personal Messages
                    </div>
                </NewChannelContainer>
                <ChannelsList>
                    {
                        props.usersChatRooms.map(item => (
                            <Channel onClick={()=>goToDM(item.roomId)}>
                                {item.otherUserName}
                            </Channel>
                        ))
                    }
                </ChannelsList>
            </ChannelsContainer>
            
        </Container>
    )
}

export default Sidebar


const Container = styled.div`
    background: #3F0E40;

`

const WorkspaceContainer = styled.div`
    color: white;
    height: 64px;
    display: flex;
    align-items: center;
    padding-left: 19px;
    justify-content: space-between;
    border-bottom: 1px solid  #532753;
`

const Name = styled.div``

const NewMessage = styled.div`
    width: 36px;
    height: 36px;
    background: white;
    color: #3F0E40;
    fill: #3F0E40;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    margin-right: 20px;
    cursor: pointer;
`

const MainChannels = styled.div`
    padding-top: 20px;
`

const MainChannelItem = styled.div`
    color: rgb(188,171,188);
    display: grid;
    grid-template-columns: 15% auto;
    height: 28px;
    align-items: center;
    padding-left: 19px;
    cursor: pointer;
    :hover {
        background: #350D36;
    }
`

const ChannelsContainer = styled.div`
    color: rgb(188,171,188);
    margin-top: 10px;
`

const NewChannelContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 28px;
    padding-left: 19px;
    padding-right: 12px;
`

const ChannelsList = styled.div``

const Channel = styled.div`
    height: 28px;
    display: flex;
    align-items: center;
    padding-left: 19px;
    cursor: pointer;
    :hover {
        background: #350D36;
    }
`
