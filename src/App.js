import { Helmet } from 'react-helmet';
import Home from './pages/Index';
import { HEADERCONFIG } from './external-config';

function App() {
  return (
    <>
      {/* <Helmet>
        <title>{HEADERCONFIG.title}</title>
        {HEADERCONFIG.meta.map((meta, index) => (
          <meta key={index} {...meta} />
        ))}
        {HEADERCONFIG.link.map((link, index) => (
          <link key={index} {...link} />
        ))}
        {HEADERCONFIG.script.map((script, index) => (
          <script key={index} {...script}></script>
        ))} */}
        <Home />
      {/* </Helmet> */}
      {/* <noscript>You need to enable JavaScript to run this app.</noscript>
      <div id="root"></div> */}
    </>
  );
}

export default App;
