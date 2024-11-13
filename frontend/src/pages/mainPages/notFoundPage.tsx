import CustomButton from '../../components/CustomButton/CustomButton.tsx';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen relative">
      <div className="flex flex-col items-center justify-center flex-grow">
        <h1 className="text-4xl">404</h1>
        <h4>Page Not Found</h4>
      </div>
      <div className="absolute bottom-6">
        <CustomButton className="text-xl" text="Back to homepage" linkTo="/home" />
      </div>
    </div>
  );
}
