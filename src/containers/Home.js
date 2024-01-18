function Home() {
    const list = () => {
        return <div className="text-white">
            <p>12<span>+</span></p>
            <p>Years of experience</p>
        </div>
    }

    return <section className="home">
        <div>
            <div>
                <h5>Hey there,</h5>
                <h1>I'm Morgan Maxwell</h1>
                <h2>-White hat hacker</h2>
                <p>A hacker is someone who uses their programming skills and knowledge of computer systems to gain unauthorized access to computer networks, systems, or data.</p>
            </div>
            <div>
                {list()}
                {list()}
                {list()}
            </div>
        </div>
    </section>
}

export default Home;