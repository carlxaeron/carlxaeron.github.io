import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Button, Form, Modal } from "react-bootstrap";
import { logEvent } from "../config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import { mapping } from "../mapping";

const GREETING =
  "Hi — I'm Carl's AI assistant. Ask about experience, skills, or projects.";

function parseAssistantReply(response) {
  const content = response?.data?.data?.[0]?.message?.content;
  if (typeof content === "string" && content.trim()) {
    return content.trim();
  }
  return null;
}

const ChatAgent = () => {
  const [messages, setMessages] = useState([
    { role: "assistant", content: GREETING },
  ]);
  const [input, setInput] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (show) {
      inputRef.current?.focus();
    }
  }, [show]);

  useEffect(() => {
    const el = messagesEndRef.current;
    if (el && typeof el.scrollIntoView === "function") {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, show]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const newMessage = { role: "user", content: trimmed };
    const nextMessages = [...messages, newMessage];

    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    logEvent({ event: "chatai", option: { action: "send", message: trimmed } });

    try {
      const response = await axios.post(mapping.assistant, {
        messages: nextMessages,
      });

      const reply = parseAssistantReply(response);
      const botMessage = {
        role: "assistant",
        content:
          reply ||
          "Sorry, I could not read the assistant response. Please try again.",
      };

      setMessages([...nextMessages, botMessage]);
      logEvent({ event: "chatai", option: { action: "response", message: botMessage.content } });
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          content: "Sorry, I am unable to process your request at the moment.",
        },
      ]);
      logEvent({ event: "chatai", option: { action: "error", message: error.message } });
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShow(false);
    setLoading(false);
    setMessages([{ role: "assistant", content: GREETING }]);
    setInput("");
    logEvent({ event: "chatai", option: { action: "close" } });
  };

  const openModal = () => {
    logEvent({ event: "chatai", option: { action: "open" } });
    setShow(true);
  };

  return (
    <>
      <button
        type="button"
        className="v3-chat-fab"
        onClick={openModal}
        aria-label="Chat with AI assistant"
      >
        <FontAwesomeIcon icon={faComment} className="v3-chat-fab__icon" aria-hidden />
        <span className="v3-chat-fab__label">Chat / Ask AI</span>
      </button>

      <Modal
        show={show}
        onHide={closeModal}
        backdrop="static"
        centered
        fullscreen="md-down"
        size="md"
        dialogClassName="v3-chat-modal"
        contentClassName="v3-chat-modal__content"
      >
        <Modal.Header closeButton className="v3-chat-modal__header">
          <Modal.Title>AI Assistant</Modal.Title>
        </Modal.Header>
        <Modal.Body className="v3-chat-modal__body">
          <div className="v3-chat-messages" data-testid="chat-messages">
            {messages.map((msg, index) => (
              <div
                key={`${msg.role}-${index}`}
                className={`v3-chat-bubble v3-chat-bubble--${msg.role}`}
              >
                {msg.content}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <Form.Group controlId="v3-chat-message" className="mb-0">
              <Form.Control
                ref={inputRef}
                disabled={loading}
                className="v3-chat-input"
                autoComplete="off"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message here"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="v3-chat-modal__footer">
          <Button
            type="button"
            disabled={loading}
            className="v3-btn v3-btn--primary"
            onClick={handleSend}
          >
            {loading ? "Sending…" : "Send"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="v3-chat-close-btn"
            onClick={closeModal}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ChatAgent;
