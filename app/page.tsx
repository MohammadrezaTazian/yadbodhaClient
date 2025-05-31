import Home from './(pages)/home/page';

export default function Main() {
  //return <>home{/* <HourlyVacation /> */}</>;
  return <>{<Home />}</>;
}

// import { ReactElement, useContext } from 'react';
// import { NextPageWithLayout } from './_app';
// import MainLayout from './layout/mainLayout';

// const Home: NextPageWithLayout = () => {
//   //const {user} = useContext(Context);
//   return (
//     <h2>
//       home
//       {/* Home welcome {user.name} {user.family} */}
//     </h2>
//   );
// };

// Home.getLayout = function getLayout(page: ReactElement) {
//   console.log('Home.getLayout');
//   return <MainLayout>{page}</MainLayout>;
// };

// export default Home;
