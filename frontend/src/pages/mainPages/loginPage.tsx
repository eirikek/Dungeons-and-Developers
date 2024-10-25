import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import CustomButton from '../../components/CustomButton/CustomButton.tsx';
import MainPageLayout from '../../components/Layouts/MainPageLayout.tsx';
import { useMutation, useLazyQuery } from '@apollo/client';
import { gql } from '@apollo/client';

const CHECK_USERNAME = gql`
    query checkUsername($userName: String!) {
        checkUsername(userName: $userName)
    }
`;

const CREATE_USER = gql`
    mutation createUser($userName: String!) {
        createUser(userName: $userName) {
            id
            userName
            class
            race
            abilityScores {
                name
                score
            }
            equipments {
                name
            }
        }
    }
`;

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

const formVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
  }),
};

export default function LoginPage() {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [isLogin, setIsLogin] = useState(true);
  const [direction, setDirection] = useState(1);
  const [registerUsername, setRegisterUsername] = useState('');
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentQuoteIndex((prevIndex) => (prevIndex === quotes.length - 1 ? 0 : prevIndex + 1));
        setFade(true);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const toggleForm = () => {
    setDirection(isLogin ? 1 : -1);
    setIsLogin(!isLogin);
  };

  const [createUser] = useMutation(CREATE_USER, {
    onCompleted: () => setIsUsernameAvailable(true),
    onError: () => setIsUsernameAvailable(false),
  });

  const handleRegister = async () => {
    try {
      const { data } = await createUser({ variables: { userName: registerUsername } });
      console.log('User created:', data);
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  const [checkUsername] = useLazyQuery(CHECK_USERNAME, {
    onCompleted: (data) => setIsUsernameAvailable(data.checkUsername),
  });

  const handleRegisterUsernameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRegisterUsername(value);
    if (value) {
      await checkUsername({ variables: { userName: value } });
    }
  };

  return (
    <MainPageLayout isLoginTransition={true}>
      <main
        className="relative flex items-center justify-center h-screen overflow-hidden z-0 before:absolute before:inset-0 before:bg-login before:bg-cover before:bg-center before:animate-background-zoom before:z-0">
        <div className="black-overlay"></div>
        <section className="w-[90%] h-3/4 relative z-10 flex flex-col items-center justify-center">
          <header className="absolute top-0 w-full">
            <h1
              className={`sub-header xl:text-2xl text-center transition-opacity duration-500 ${fade ? 'opacity-100' : 'opacity-0'}`}>
              {quotes[currentQuoteIndex]}
            </h1>
          </header>

          <section className="flex flex-col items-center">
            <AnimatePresence mode={'wait'} custom={direction}>
              <motion.div
                key={isLogin ? 'login' : 'register'}
                custom={direction}
                variants={formVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.15 }}
                className="flex flex-col items-center gap-10"
              >
                {isLogin ? (
                  <>
                    <h2 className="sub-header mb-5">Log in to continue your adventure</h2>
                    <div className="flex flex-col items-center gap-5">
                      <input
                        id="log-in-input"
                        className="text w-60 xs:w-72 p-2 border-2 focus:border-transparent rounded bg-transparent text-center focus:outline-none focus:ring-2 focus:ring-gray-500"
                        placeholder="Username"
                      />
                      <CustomButton text="Log in" linkTo="/project2/home" />
                    </div>
                    <div className="text">
                      Don't have an account?{' '}
                      <button className="underline transition-all hover:text-gray-300 outline-none"
                              onClick={toggleForm}>
                        Register
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="sub-header mb-5">Or register to start a new adventure</h2>
                    <input
                      id="register-input"
                      value={registerUsername}
                      onChange={handleRegisterUsernameChange}
                      className={`text w-60 xs:w-72 p-2 border-2 rounded bg-transparent text-center focus:outline-none 
                        ${isUsernameAvailable === false
                        ? 'border-red-500 focus:ring-2 focus:ring-red-500'
                        : isUsernameAvailable === true
                          ? 'border-green-500 focus:ring-2 focus:ring-green-500'
                          : 'focus:ring-2 focus:ring-gray-500'}`}
                      placeholder="Username"
                    />
                    <CustomButton text="Register" onClick={handleRegister} />
                    <div className="text">
                      Already have an account?{' '}
                      <button className="underline transition-all hover:text-gray-300 outline-none"
                              onClick={toggleForm}>
                        Log in
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </section>
        </section>
      </main>
    </MainPageLayout>
  );
}