import { useState, useEffect, useContext } from 'react';
import CustomButton from '../../components/CustomButton/CustomButton.tsx';
import MainPageLayout from '../../components/Layouts/MainPageLayout.tsx';
import { AuthContext } from '../../context/authContext.tsx';
import { useButton } from '../../hooks/useButton.ts';
import {useMutation} from '@apollo/react-hooks';
import {gql} from 'graphql-tag'
import {useNavigate} from 'react-router-dom'

//Register & Login
const REGISTER = gql`
    mutation Mutation($registerInput: RegisterInput){
      registerUser(input: $registerInput){
          username
          token
      }
    }
  `

const quotes = [
  'In the heart of every adventure, lies the soul of a hero.',
  'Roll the dice and forge your destiny.',
  'Fate may guide us, but courage decides our path.',
  'Imagination is the only limit to the worlds we create.',
  'A dungeon is not just a place of danger, but a crucible of heroes.',
  'It’s not the sword that makes the hero, but the heart behind it.',
  'In the darkest moments, even a flicker of light can lead to victory.',
  'Every choice is a roll of the dice, every consequence, a new chapter.',
  'The adventure never ends, as long as there’s a story to tell.',
  'Cunning, bravery, and the right spell can turn the tide of any battle.',
];

export default function LoginPage() {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [fade, setFade] = useState(true);
  //Login & Register
  const context = useContext(AuthContext);
  const navigate = useNavigate();
  const {onChange, onClick, values} = useButton(registerUserCallback, {
    username: ""
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentQuoteIndex((prevIndex) => (prevIndex === quotes.length - 1 ? 0 : prevIndex + 1));
        setFade(true);
      }, 500);
    }, 5000); // Change quote every 5 seconds

    return () => clearInterval(interval);
  }, []);



  const [registerUser] = useMutation(REGISTER, {
    update(_,{data}){
      if(data && data.registerUser){
        context.login(data);
        navigate('/home')
      }
    },
    onError(error){
      console.log(error)
    },
    variables: {registerInput: values}

  })
  function registerUserCallback(){
    console.log("callback hit");
    registerUser({variables: {registerInput: values}})
      .catch((error)=>{
      console.log(error);
    })
  }




  return (
    <MainPageLayout isLoginTransition={true}>
      <main
        className="relative flex items-center justify-center h-screen overflow-hidden z-0 before:absolute before:inset-0 before:bg-login before:bg-cover before:bg-center before:animate-background-zoom  before:z-0">
        <div className="absolute inset-0 bg-black opacity-70 z-10"></div>
        <section className="w-full h-3/4 relative z-10 flex flex-col items-center justify-around">
          <header>
            <h1 className={`text-5xl text-white transition-opacity duration-500 ${fade ? 'opacity-100' : 'opacity-0'}`}>
              {quotes[currentQuoteIndex]}
            </h1>
          </header>
          <section className="flex flex-col items-center gap-5">
            <h2 className="text-3xl text-white mb-5">Log in to continue your adventure</h2>
            <input
              id="log-in-input"
              className="text-2xl w-96 p-2 border-2 rounded bg-transparent text-center"
              placeholder="Username"
            ></input>
            <CustomButton text="Log in" linkTo="/project2/home" />
          </section>
          <section className="flex flex-col items-center gap-5">
            <h2 className="text-3xl text-white mb-5">Or register to start a new one</h2>
            <input
              id="register-input"
              className="text-2xl w-96 p-2 border-2 rounded bg-transparent text-center"
              placeholder="Username"
              name="username"
              onChange={onChange}
            ></input>
            <button
              className="relative group text-3xl pb-1"
              onClick={onClick}
            >
              Register
              <span
                className="absolute left-1/2 bottom-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
            </button>

          </section>
        </section>
      </main>
    </MainPageLayout>
  );
}
