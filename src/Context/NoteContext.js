import { createContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import db, { auth } from "../firebase";


export const Context=createContext();




export const NoteContext=(props)=>{
  
  

    const [rooms, setRooms] = useState([]) 
    const [admin, setadmin] = useState({}) 
    const [usersChatRooms, setusersChatRooms] = useState([]) 
    const [user, setUser] = useState({
      accessToken: "",
      name: "",
      photo: "",
      role: "",
      uid: ""
    });

    const [userlists,setUserLists] = useState([])







    // TO GET DATA

    const getUserDataFromAccessToken = (accessToken) => {
      try {
        // Set up a real-time listener for the user with the given accessToken
        const unsubscribe = db.collection('userlists')
          .where('accessToken', '==', accessToken)
          .onSnapshot((userSnapshot) => {
            if (!userSnapshot.empty) {
              const userData = userSnapshot.docs[0].data();
              setUser(userData);
            } else {
              console.log('User not found in userlists collection.');
            }
          });
    
      } catch (error) {
        console.error('Error setting up real-time listener for user data:', error);
      }
    };
    
    
    useEffect(() => {
      getUserDataFromAccessToken(localStorage.getItem('accesstoken'))
      
    }, [localStorage])


    // TO GET DATA





    // FUNCTION TO SHOW ALERT 

    const [alerttype, setalerttype] = useState('')
  const [alertmessage, setalertmessage] = useState('')
  const [showAlert, setShowAlert] = useState(false);


  const alert=(type,message)=>{

    setalerttype(type)
    setalertmessage(message)
    setShowAlert(true);


    setTimeout(() => {
      setShowAlert(false);
      setalerttype('')
      setalertmessage('')
    }, 4000);   

  }
  

  // FUNCTION TO SHOW ALERT 

  
  
  
  
  
    // to get all the users 
  
   const getuserLists = () => {
  try {
    // Set up a real-time listener for changes in the 'userlists' collection
    const unsubscribe = db.collection('userlists').onSnapshot((userListsSnapshot) => {
      const userListsData = [];

      // Iterate through each document in the 'userlists' collection
      userListsSnapshot.forEach((doc) => {
        const userData = {
          userId: doc.id,
          username: doc.data().name,
          image: doc.data().photo,
          role: doc.data().role
        };
        userListsData.push(userData);
      });

      const adminUsers = userListsData.filter(user => user.role === 'admin');

      // Set the state with the updated data
      setadmin(adminUsers[0]);
      setUserLists(userListsData);
    });
    
  } catch (error) {
    console.error('Error setting up real-time listener for user lists:', error);
    return [];
  }
};

  
    // to get all the users 
  
  
  
  
  

    // to get all personal message rooms 
  
    const fetchPersonalChatRooms = (uid) => {
      try {
        const unsubscribe = db
          .collection('personalMessages')
          .where('users', 'array-contains', uid)
          .onSnapshot(async (roomsSnapshot) => {
            const personalChatRooms = [];
    
            for (const roomDoc of roomsSnapshot.docs) {
              const roomData = roomDoc.data();
              const otherUserID = roomData.users.find(id => id !== uid);
    
              // Fetch other user's information from 'userlists'
              const otherUserDoc = await db.collection('userlists').doc(otherUserID).get();
              const otherUserData = otherUserDoc.data();
    
              // Create an object containing room details and other user's information
              const roomDetails = {
                roomId: roomDoc.id,
                otherUserID,
                otherUserName: otherUserData.name,
                otherUserPhoto: otherUserData.photo,
              };
    
              personalChatRooms.push(roomDetails);
            }
    
            // Update state with the latest personal chat rooms
            setusersChatRooms(personalChatRooms);
          });
    
      } catch (error) {
        console.error('Error setting up real-time listener for personal chat rooms:', error);
      }
    };
    
    // to get all personal message rooms 
  
  
  
  
  
    
    // TO get channels 
    const getChannels = () => {
      
        db.collection('rooms')
  .onSnapshot((snapshot) => {
    const userRooms = snapshot.docs
      .filter(doc => {
        const members = doc.data().members || [];
        return members.some(member => member.userid === user.uid);
      })
      .map(doc => {
        const roomData = doc.data();
        const memberData = (roomData.members || []).find(member => member.userid === user.uid);
        const isRestricted = memberData ? memberData.isRestricted : false;
        
        return {
          id: doc.id,
          name: roomData.name,
          isRestricted: isRestricted
        };
      });

      // console.log("Chatrooms",userRooms)
    setRooms(userRooms);
  });

        
    };
    // TO get channels 
  
    const signOut = () => {
      auth.signOut().then(()=>{
        // console.log(user)
        localStorage.removeItem('user');
        setUser(null);
      })
    }
  
    useEffect(() =>{
      
      if(user)
      {
        getChannels();

        fetchPersonalChatRooms(user.uid);
        
        getuserLists();
      }
    }, [user])
    
  
    return(
        <Context.Provider value={{setUser,user,signOut,usersChatRooms,setusersChatRooms,admin,rooms,setUserLists,userlists ,
          setShowAlert,alert,showAlert,alertmessage,alerttype 
          
          }} >
            {props.children}
        </Context.Provider>

    )

}