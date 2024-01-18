import Header from '../containers/Header';
import Home from '../containers/Home';
import './../styles/App.css';

function Index() {
  return <div className="App">
    <Header />
		<section className='main'>
			<Home/>
		</section>
		<footer>

		</footer>
  </div>
}

export default Index;