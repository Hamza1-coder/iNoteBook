import NoteContext from './noteContext';
import { useState } from 'react';

const NoteState = (props) => {
    const s1 = {
        "name": "Hamza",
        "class": "12"
    }
    const [state, setState] = useState(s1);
    const update = () => {
        setTimeout(() =>{
            setState({
                "name": "ameer",
                "class": "11"
            })
        },1000)
    }  
    return(
        <NoteContext.Provider value={{state, update}}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState;