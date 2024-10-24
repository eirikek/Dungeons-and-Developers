import {useState} from 'react';



export const useForm = (
  callback: ()=>void,
  initialState: Record<string, any> = {},

) => {

  const [formState, setFormState] = useState(initialState)

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({...formState, [event.target.name]: event.target.value});
    console.log(formState);
  }

  const onClick = () => {
    callback();
  }
  return {
    onChange,
    onClick,
    values: formState,
  }
}