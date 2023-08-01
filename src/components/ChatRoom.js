import {Link, useParams} from "react-router-dom";
import {useAuth} from "../contexts/AuthContext";
import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import chat from "./Chat";
import {Button, Col, Form, Row} from "react-bootstrap";
import {useForm} from "react-hook-form";


export default function ChatRoom(){
	const {authUser, setAuthUser, isLoggedIn, setIsLoggedIn} = useAuth();
	const { register, handleSubmit,reset } = useForm();
	const [university,setUniversity] = useState();
	const [chats, setChats] = useState(null);
	const [chatSocket, setChatSocket] = useState(null);
	const { universityID } = useParams();
	const lastChat = useRef(null);


	useEffect(() => {
		if(!authUser) return;
		loadUniversity();
		loadChats();
	}, [authUser]);


	function isOpen(ws) { return ws.readyState === ws.OPEN }

	useEffect(()=> {
		if (chatSocket) {
			chatSocket.onmessage = function (e) {
				//Handle when socket message is received
				const data = JSON.parse(e.data);
				if(chats.messages && !chats.messages.length){
					chats.messages = [data.message];
				}
				else{
					chats.messages.push(data.message);
				}
				setChats({...chats});
			};
			chatSocket.onclose = function (e) {
				//MAYBE need to retry connection
				console.error('Chat socket closed unexpectedly');
				connectSocket();
			};
		}
	},[chatSocket]);

	useEffect(()=>{
		scrollToBottom();
	},[chats])

	function sendChatMessage(data){
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

	function handleEnter(event) {
		if (event.keyCode === 13) {  // enter, return
			document.querySelector('#chat-message-submit').click();
		}
	}

	function loadUniversity() {
		console.log("****loadUniversity called****")
		axios.get("http://localhost:8000/universities/"+universityID+"/",{headers:{'Authorization':`Token ${authUser.authToken}`}}
		).then(res => {
			setUniversity(res.data);
		}).catch(err => {
			console.log(err);
		});
	}

	function loadChats() {
		console.log("****loadChats called****")
		axios.get("http://localhost:8000/chatroom/uni_" + universityID + "/messages/", {headers: {'Authorization': `Token ${authUser.authToken}`}}
		).then(res => {
			res.data.messages.reverse();
			setChats(res.data);
			connectSocket();
		}).catch(err => {
			console.log(err);
		});
	}

	function connectSocket(){
		const channelName = "uni_" + universityID;
		try {
			const chatSocket = new WebSocket(
				'ws://localhost:8000/ws/chat/'
				+ channelName
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

	const scrollToBottom = () => {
		lastChat?.current?.scrollIntoView({ behavior: 'smooth' });
	};

	const handleJoin = () =>{
		axios.post("http://localhost:8000/chatroom/join/" +chats.id+ "/",{}, {headers: {'Authorization': `Token ${authUser.authToken}`}}
		).then(res => {
			loadChats();
		}).catch(err => {
			console.log(err);
		});
	}

	function Message(chat,isLast){
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
		<div className="user-select-none bg-white">
			<div className=" blur-container p-3">
				<nav className="breadcrumb-div" aria-label="breadcrumb">
					<ol className="breadcrumb">
						<li className="breadcrumb-item"><a href="/">Home</a></li>
						<li className="breadcrumb-item" aria-current="page"><a href={`/community/${universityID}/`}>Community</a></li>
						<li className="breadcrumb-item active" aria-current="page">Chat</li>
					</ol>
				</nav>
				<div className="container-fluid p-3">
					{   chats&&university ? (
						<>
							<div className="row justify-content-between">
								<div className="col-auto">
									<span className="fw-bold display-4 mb-3">{university.name}</span>
								</div>
								{!chats.is_joined ? (
										<div className="col-auto">
											<button className="btn btn-info fs-5 fw-bold" onClick={handleJoin}>Join to Chat</button>
										</div>
									)
									:
									<></>}
							</div>
							<div className="border rounded mt-2">
								<div className="w-100 p-3 overflow-y-scroll container-fluid height-custom">
									{chats.messages.map((chat,index,chats) => {
										if (index + 1 === chats.length) {
											return <Message key={chat.id} chat={chat} isLast/>
										} else {
											return <Message key={chat.id} chat={chat}/>
										}
									})}
									{ chats.messages.length ?
										<>
										</> :
										<div className="w-100 text-center"><span className="fw-bold display-6 mb-3 my-auto text-secondary">No Messages!</span></div>
									}
								</div>
								{chats.is_joined ? (
									<Form onSubmit={handleSubmit(sendChatMessage)}>
										<Row className="mx-1 my-2">
											<Col className="w-100">
												<Form.Control autoComplete="off" { ...register("chatText")} id="chatText" type="text" placeholder="Type your message here" onKeyUp={handleEnter}/>
											</Col>
											<Col className="col-auto">
												<Button id="chat-message-submit" type="submit" variant="primary" ><i className="bi-send-fill me-1"></i>Send</Button>
											</Col>
										</Row>
									</Form>
								):<></>
								}
							</div>
						</>
					): <></>
					}
				</div>
			</div>
		</div>
	)
}