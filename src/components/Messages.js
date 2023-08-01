
import React, {useEffect, useRef, useState} from "react";
import {useAuth} from "../contexts/AuthContext";
import axios from "axios";
import {Link, useSearchParams} from "react-router-dom";
import {setCookie} from "react-use-websockets/lib/lib/client/cookie";
import {Button, Col, Form, Row} from "react-bootstrap";
import ChatRoom from "./ChatRoom";
import {useForm} from "react-hook-form";



export default function Messages(userID){

	const {authUser, setAuthUser, isLoggedIn, setIsLoggedIn} = useAuth();
	const { register, handleSubmit,reset } = useForm();


	const [chats,setChats] = useState(null);
	const [searchParams, setSearchParams] = useSearchParams();
	const [currentChat,setCurrentChat] = useState(null);
	const lastChat = useRef(null);
	const [chatSocket, setChatSocket] = useState(null);


	useEffect(()=>{
		scrollToBottom();
	},[currentChat])

	useEffect(()=> {
		if (chatSocket) {
			chatSocket.onmessage = function (e) {
				//Handle when socket message is received
				const data = JSON.parse(e.data);
				currentChat.messages.push(data.message)
				setCurrentChat( {...currentChat});
			};
			chatSocket.onclose = function (e) {
				//MAYBE need to retry connection
				console.error('Chat socket closed unexpectedly');
				connectSocket();
			};
		}
	},[chatSocket]);

	function isOpen(ws) { return ws.readyState === ws.OPEN }

	const scrollToBottom = () => {
		lastChat?.current?.scrollIntoView({ behavior: 'smooth' });
	};

	useEffect(() => {
		if(!authUser) return;
		loadProfile();
	}, [authUser]);

	useEffect(() => {
		if(currentChat && !(currentChat.messages)) {
			console.log(currentChat);
			loadChat();
		}
	}, [currentChat]);


	function loadChat(){
		console.log("****loadChats called****")
		axios.get("http://localhost:8000/chatroom/"+currentChat.name+"/messages/", {headers: {'Authorization': `Token ${authUser.authToken}`}}
		).then(res => {
			currentChat.messages = res.data.messages.reverse();
			setCurrentChat( {...currentChat});
			console.log(currentChat);
			connectSocket();
		}).catch(err => {
			console.log(err);
		});
	}

	function loadProfile(){
		axios.get("http://localhost:8000/user/profile/", {
			headers: {
				'Authorization': `Token ${authUser.authToken}`
			}
		}).then(resp => {
			if (resp.data) {
				setChats(resp.data.channels);
				if(resp.data.channels.length){
					setCurrentChat(resp.data.channels[0])
				}
			}
		}).catch(err=>{
			if(err.response && err.response.data){

			}
		});
	}

	function sendChatMessage(data){
		console.log("Inside sendChatMessage");
		if(data.chatText) {
			const socketData = {
				'message': data.chatText,
				'user_id': authUser.id
			};
			if (isOpen(chatSocket)) {
				chatSocket.send(JSON.stringify(socketData));
			} else {
				console.log("Socket is Closed.");
			}
			reset();
		}
	}

	function connectSocket(){
		try {
			const chatSocket = new WebSocket(
				'ws://localhost:8000/ws/chat/'
				+ currentChat.name
				+ '/'
			);
			setChatSocket(chatSocket);
			scrollToBottom();
		}
		catch (e){
			console.log(e);
			alert("Could not connect to websockets");
		}
	}

	function handleEnter(event) {
		if (event.keyCode === 13) {  // enter, return
			document.querySelector('#chat-message-submit').click();
		}
	}

	function handleChatClick(chat){

		var element = document.getElementById("chat_"+currentChat.id);
		element.classList.remove("active");
		setCurrentChat(chat);
		var element = document.getElementById("chat_"+chat.id);
		element.classList.add("active");
	}

	function Message(chat){
		chat = chat.chat;

		let divClass = "mt-3 w-100 row";
		if(authUser.id === chat.sent_by.id){
			divClass+=" justify-content-end";
		}
		let userDivClass = "row";
		if(authUser.id === chat.sent_by.id){
			userDivClass+=" justify-content-end";
		}

		let messageClass = "card p-2";
		if(authUser.id === chat.sent_by.id){
			messageClass += " bg-secondary-subtle"
		}
		else{
			messageClass += " bg-primary-subtle"
		}

		let timeDivClass = "col-auto";
		if(authUser.id === chat.sent_by.id){
			timeDivClass+=" text-end";
		}

		return(
			<div className={divClass} ref={lastChat}>
				<div className="col-auto " style={{'maxWidth': '45%','minWidth':'25%'}}>
					<div className={userDivClass}>
						<div className="col-auto">
							<Link to={`/user/${chat.sent_by.id}`}>
							<span className="text-body-secondary half-size fw-light">
								<i className="bi bi-person-circle fs-5 me-1"> </i>
								{chat.sent_by.username}
							</span>
							</Link>
						</div>
					</div>
					<div className={messageClass}>
						{chat.content}
					</div>
					<div className={timeDivClass}>
							<span className="text-body-secondary half-size fw-light">
								{chat.ctime.date}<i className="bi bi-dot"></i>{chat.ctime.time}
							</span>
					</div>
				</div>
			</div>
		);
	}


	return (
		<div className="shadow container-fluid bg-white user-select-none p-3 h-100">
			<nav className="breadcrumb-div" aria-label="breadcrumb">
				<ol className="breadcrumb">
					<li className="breadcrumb-item"><a href="/">Home</a></li>
					<li className="breadcrumb-item active" aria-current="page">Chat</li>
				</ol>
			</nav>
			<div className="container-fluid p-3">
				{ chats ? (
					<>
						<div className="row justify-content-between">
							<div className="col-auto">
								<span className="fw-bold display-4 mb-3">Chats</span>
							</div>
						</div>
						<div className="row mt-2">
							<div className="col-3">
								<div className="w-100 p-0 overflow-y-scroll container-fluid height-custom-lg border rounded">
									{chats && currentChat ? (
											<div className="list-group">
												{chats.map((chat,index) => {
													if (chat.id === currentChat.id) {
														return(
															<a key={`chat_${chat.id}`} id={`chat_${chat.id}`} className="list-group-item list-group-item-action active" aria-current="true">
																<div className="d-flex w-100 justify-content-between">
																	{chat.university ?
																		<>
																			<h5 className="mt-1">{chat.university.name}</h5>
																			<i className="bi-people fs-4"></i>
																		</>
																		: <></>
																	}
																</div>
															</a>
														)
													}
													else{
														return(
															<a key={`chat_${chat.id}`} id={`chat_${chat.id}`} className="list-group-item list-group-item-action" onClick={() => handleChatClick(chat)}>
																<div className="d-flex w-100 justify-content-between">
																	{chat.university ?
																		<>
																			<h5 className="mt-1">{chat.university.name}</h5>
																			<i className="bi-people fs-4"></i>
																		</>
																		: <></>
																	}
																</div>
															</a>
														)
													}
												})}

											</div>
										) :
										<div className="w-100 text-center"><span className="fw-bold display-6 mb-3 my-auto text-secondary">No Chats!</span></div>

									}
								</div>
							</div>
							<div className="col-9">
								<div className="border border rounded height-custom">
									{ currentChat && currentChat.messages ? (
											<>
												<div className="w-100 p-3 overflow-y-scroll container-fluid height-custom">
													{currentChat.messages.map((chat,index,chats) => {
														if (index + 1 === chats.length) {
															return <Message key={chat.id} chat={chat}/>
														} else {
															return <Message key={chat.id} chat={chat}/>
														}
													})}
													{currentChat.messages.length ?
														<>
														</>:
														<div className="w-100 text-center"><span className="fw-bold display-6 mb-3 my-auto text-secondary">No Messages!</span></div>
													}
												</div>

												<Form onSubmit={handleSubmit(sendChatMessage)}>
													<Row className="my-2">
														<Col className="w-100">
															<Form.Control autoComplete="off" { ...register("chatText")} id="chatText" type="text" placeholder="Type your message here" onKeyUp={handleEnter}/>
														</Col>
														<Col className="col-auto">
															<Button id="chat-message-submit" type="submit" variant="primary" ><i className="bi-send-fill me-1"></i>Send</Button>
														</Col>
													</Row>
												</Form>
											</>
										) :
										<div className="w-100 mt-5 text-center"><span className="fw-bold display-6 text-secondary">Select a chat</span></div>
									}
								</div>
							</div>
						</div>

					</>
				) : <></>
				}
			</div>
		</div>
	)
}