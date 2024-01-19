import Header from '../containers/Header';
import Home from '../containers/Home';
import Portfolio from '../containers/Portfolio';
import './../styles/App.css';

function Index() {
  return <div className="App">
    {/* <Header /> */}
	<section className='main'>
		{/* <Home/> */}
		<Portfolio/>
	</section>
	<footer>

	</footer>
</div>
}

export default Index;