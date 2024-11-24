import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Button, Form, Modal, Stack } from 'react-bootstrap';
import { COMPANIES, EXPERIENCES, logEvent, PROJECTS_DESCRIPTION_AI, SKILLS } from '../config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-solid-svg-icons';

const ChatAgent = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello, I am your Carl Louis Manuel assistant. How can I help you?' },
  ]);
  const [input, setInput] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputRef = useRef(null);

  useEffect(() => {
    if (show) {
      inputRef.current.focus();
    }
  }, []);

  const handleSend = async () => {
    setLoading(true);
    if (input.trim() === '') return;

    const newMessage = { role: 'user', content: input };
    setMessages([...messages, newMessage]);
    logEvent({ event: 'chatai', option: { action: 'send', message: input } });

    try {
      const data = {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'assistant', content: JSON.stringify({
            ...SKILLS,
            'DESCRIPTION': PROJECTS_DESCRIPTION_AI({time: '12 years'}),
            ...COMPANIES,
            ...EXPERIENCES,
          }) },
          ...messages,
          newMessage,
        ],
      };
      const config = {
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_openaikey}`,
          'Content-Type': 'application/json',
        },
      };

      const response = await axios.post('https://api.openai.com/v1/chat/completions', data, config);

      const botMessage = { role: 'assistant', content: response.data.choices[0].message.content.trim() };
      setMessages([...messages, newMessage, botMessage]);
      setLoading(false);
      logEvent({ event: 'chatai', option: { action: 'response', message: botMessage.content } });
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages([...messages, { role: 'assistant', content: 'Sorry, I am unable to process your request at the moment.' }]);
      setLoading(false);
      logEvent({ event: 'chatai', option: { action: 'error', message: error.message } });
    }

    setInput('');
  };

  const generatePrompt = (messages) => {
    const portfolioContent = `
      Carl Louis Manuel
      Hello, I'm a Fullstack Web / App Developer
      I am a Web Developer who seeks challenging web development job.
      ABOUT
      I'm Carl Louis Manuel
      “I am a fullstack web developer working for over 12 years since 2012, I am mainly focused on web development using HTML, CSS, JS (AngularJS, VueJS, JQuery), PHP/MySQL - (XAMPP, WAMP, LAMP). I build website from scratch using any top frameworks such as Laravel, Codeigniter, and Zend on any development environment with support of Linux command or local development environment and my code is up to the current standards, secure, and safe from SQL injections or similar hacking attempts with understanding of OOP. I could be a maintenance support with high analytical thinking skill to solve complex problems. All the websites I developed was built using the latest version of PHP. I have knowledge on building a website from CMS such as Wordpress, Drupal and Joomla, I could make customized themes. I have experienced in SEO friendly website that may affect the visibility of a website or a web page in a search engine’s results. I always adopt latest technologies to meet the market requirements and I am creating a responsive web design that loads correctly in all modern browsers and smaller devices.”
      PHP: 8 Years Experience, 95%
      Laravel: 7 Years Experience, 95%
      CodeIgniter: 3 Years Experience, 90%
      Zend: 1 Year Experience, 80%
      WordPress CMS: 5 Years Experience, 90%
      Joomla CMS: 1 Year Experience, 75%
      SQL (MYSQL): 7 Years Experience, 95%
      Javascript (JS): 7 Years Experience, 95%
      JQuery: 7 Years Experience, 95%
      AngularJS: 2 Years Experience, 90%
      VueJS: 3 Years Experience, 95%
      ReactJS: 1 Year Experience, 95%
      NPM (Node.js): 5 Years Experience, 90%
      Gulp / Bower / Webpack: 5 Years Experience, 90%
      LESS / SCSS / Stylus: 7 Years Experience, 95%
      CSS/CSS3: 8 Years Experience, 95%
      LESS / SCSS / Stylus: 5 Years Experience, 95%
      Twitter Bootstrap: 4 Years Experience, 90%
      TailwindCSS: 2 Years Experience, 95%
      HTML/HTML5: 8 Years Experience, 95%
      Jade/Pug Template: 6 Years Experience, 95%
      Version Control: 7 Years Experience, 95%
      Git/SVN: 8 Years Experience, 95%
      Photoshop: 5 Years Experience, 85%
      Illustrator: 2 Years Experience, 85%
      Word Office Tools: 6 Years Experience, 90%
      PROJECTS
      No Preview
      EXPERIENCES
      Ecoshift Corp. (Feb 2019 - Present): Web Developer
      ABS-CBN Corp. (Sep 2016 - Feb 2019): Frontend Developer
      Gameloft Philippines (Aug 2015 - Jul 2016): R&D PHP Developer
      ConsumerCloud Services Inc. (Mar 2015 - Aug 2015): Senior PHP Developer
      Huxxer Corp. (Dec 2014 - Mar 2015): Senior Web Developer
      Zeno Group Investments Inc. (Jul 2014 - Dec 2014): Web Admin
      Leekie Enterprises Inc. (Apr 2014 - Jul 2014): Web Developer
      Vigattin Inc. (May 2012 - Apr 2014): Web Developer
      CONTACT
    `;

    const chatHistory = messages.map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`).join('\n');
    return `${portfolioContent}\n\n${chatHistory}\nAssistant:`;
  };

  const closeModal = () => {
    if (loading) return;
    setShow(false);
    setMessages([
      { role: 'assistant', content: 'Hello, I am your Carl Louis Manuel assistant. How can I help you?' },
    ]);
    setInput('');
    logEvent({ event: 'chatai', option: { action: 'close' } });
  }

  return (
    <>
      <div className='fixed bottom-[1rem] right-[1rem] z-[999999] flex'>
        <Button className='flex items-center justify-center' variant='info' onClick={() => {
          logEvent({ event: 'chatai', option: { action: 'open' } });
          setShow(true);
        }}>
          <FontAwesomeIcon icon={faComment} size='2x' className='text-white mr-2' />
          Chat with my Assistant</Button>
      </div>
      { show && (
        <>
          {/* <div className="chat-agent">
            <div className="chat-messages">
              {messages.map((msg, index) => (
                <div key={index} className={`chat-message ${msg.role}`}>
                  {msg.content}
                </div>
              ))}
            </div>
            <div className="chat-input">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <button onClick={handleSend}>Send</button>
            </div>
          </div> */}
          <Modal backdrop='static' centered className="z-[999999]" show={show} onHide={closeModal} 
            size='md'>
            <Modal.Header closeButton>
              <Modal.Title>Hello welcome please chat with my assistant.</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form disabled={loading} onSubmit={e => {
                e.preventDefault();
                if(!loading) handleSend();
              }}>
                <Stack gap={3}>
                  {messages.map((msg, index) => (
                    <div key={index} className={`rounded-md p-2 ${msg.role === 'user' ? 'bg-blue-100 mr-[20%]' : 'bg-gray-600 ml-[20%] text-white'}`}>
                      {msg.content}
                    </div>
                  ))}
                  {/* <div className="p-2">First item</div>
                  <div className="p-2">First item</div>
                  <div className="p-2">Second item</div>
                  <div className="p-2">Third item</div>*/}
                </Stack>
                <Form.Group controlId="message">
                  <Form.Control
                    ref={inputRef}
                    disabled={loading}
                    className='mt-3'
                    autoComplete='off'
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message here"
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button disabled={loading} variant="info" className="text-white" onClick={handleSend}>
                  Send
              </Button>
              <Button disabled={loading} variant="primary" className="text-white" onClick={closeModal}>
                  Close
              </Button>
            {/* <Button variant="primary" onClick={() => {}}>
                Save Changes
            </Button> */}
            </Modal.Footer>
        </Modal>
        </>
      ) }
    </>
  );
};

export default ChatAgent;