import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/header';

/*
    in nextjs, whenever you navigate to a route, nextjs will import
    you component from one of the files in the pages folder and load it.
    However, nextjs doesn't just load the component directly on screen,
    instead it wraps it up inside its own custom default component - app
    So what we are doing below is to override that app with our own _app.js, 
    this is so we can include our global css file to every single page
*/

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <Component {...pageProps} />
    </div>
  );
};

AppComponent.getInitialProps = async appContext => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get('/api/users/currentuser');

  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }

  return {
    pageProps,
    ...data
  };
};

export default AppComponent;
