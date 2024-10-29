import React, {useState} from 'react';



export const useButton = (
  callback: ()=>void,
  initialState: Record<string, any> = {},

) => {

  const [usernameState, setUsernameState] = useState(initialState)

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsernameState({...usernameState, [event.target.name]: event.target.value});
    console.log(usernameState);
  }

  const onClick = () => {
    callback();
  }
  return {
    onChange,
    onClick,
    values: usernameState,
  }
}