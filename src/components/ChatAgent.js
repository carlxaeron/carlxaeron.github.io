import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Button, Form, Modal, Stack } from 'react-bootstrap';
import { logEvent } from '../config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import { mapping } from '../mapping';

const ChatAgent = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello, I am your Carl Louis Manuel an AI assistant. How can I help you?' },
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
        // model: 'gpt-3.5-turbo',
        messages: [
          // { role: 'assistant', content: JSON.stringify({
          //   ...SKILLS,
          //   'DESCRIPTION': PROJECTS_DESCRIPTION_AI({time: '12 years'}),
          //   ...COMPANIES,
          //   ...EXPERIENCES,
          // }) },
          ...messages,
          newMessage,
        ],
      };

      const response = await axios.post(mapping.assistant, data);

      const botMessage = { role: 'assistant', content: response.data.data[0].message.content.trim() };
      setMessages([...messages, newMessage, botMessage]);
      setLoading(false);
      logEvent({ event: 'chatai', option: { action: 'response', message: botMessage.content } });

      setInput('');
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages([...messages, { role: 'assistant', content: 'Sorry, I am unable to process your request at the moment.' }]);
      setLoading(false);
      logEvent({ event: 'chatai', option: { action: 'error', message: error.message } });
    }
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
          Chat/Ask with my AI Assistant!</Button>
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
              <Modal.Title>AI Assistant.</Modal.Title>
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