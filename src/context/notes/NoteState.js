import NoteContext from './noteContext';
import { useState } from 'react';

const NoteState = (props) => {
    const initalNotes = [
        {
          "_id": "62628cdc40a24515a647c519",
          "user": "62628429abd07837f2dfeff7",
          "title": "My title",
          "description": "Please review my  notes",
          "tag": "personal",
          "date": "2022-04-22T11:09:16.484Z",
          "__v": 0
        },
        {
          "_id": "6262954963936a944e7beb08",
          "user": "62628429abd07837f2dfeff7",
          "title": "My title",
          "description": "Please review my  notes",
          "tag": "personal",
          "date": "2022-04-22T11:45:13.193Z",
          "__v": 0
        },
        {
          "_id": "6262954e63936a944e7beb0a",
          "user": "62628429abd07837f2dfeff7",
          "title": "My title",
          "description": "Please review my  notes",
          "tag": "personal",
          "date": "2022-04-22T11:45:18.168Z",
          "__v": 0
        },
        {
          "_id": "6262954f63936a944e7beb0c",
          "user": "62628429abd07837f2dfeff7",
          "title": "My title",
          "description": "Please review my  notes",
          "tag": "personal",
          "date": "2022-04-22T11:45:19.838Z",
          "__v": 0
        }
      ]
      const [notes, setNotes] = useState(initalNotes)
    return(
        <NoteContext.Provider value={{notes, setNotes}}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState;