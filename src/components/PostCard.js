import {Link} from "react-router-dom";
import {Button, Collapse, Overlay, OverlayTrigger, Popover, Tooltip} from "react-bootstrap";
import "../styles/global.css"
import {useEffect, useState} from "react";
import Comments from "./Comments";
import axios from "axios";
import {useAuth} from "../contexts/AuthContext";


export default function PostCard({post, userID, handleLike, handleComment, sendComment, submitCommentForm}){

	const {authUser, setAuthUser, isLoggedIn, setIsLoggedIn} = useAuth();
	const [open,setOpen] = useState(false);
	const [comments,setComments] = useState(null);

	const colorMap = {
		'housing':'success',
		'study':'secondary',
		'food':'info'
	}

	useEffect(() => {
		if(!authUser) return;
		loadComments();
	}, [authUser]);

	const loadComments = () =>{
		axios.get("http://localhost:8000/community/post/"+post.id+"/comment/",{headers:{'Authorization':`Token ${authUser.authToken}`}}
		).then(res => {
			setComments(res.data);
		}).catch(err => {
			console.log(err);
		});
	}

	function submitCommentForm(data){
		const postData = {
			"content":data.content
		}
		console.log(postData);
		axios.post("http://localhost:8000/community/post/"+data.postID+"/comment/",postData,{headers:{'Authorization':`Token ${authUser.authToken}`}}
		).then(res => {
			//Do Something
		}).catch(err => {
			console.log(err);
		});
	}

	let deleteButton = <></>;
	if(post.posted_by.id === userID){
		deleteButton = (
			<div className="col-auto">
				<OverlayTrigger
					placement="top"
					overlay={
						<Tooltip id={`button-like-${post.id}`}>Delete Post</Tooltip>
					}>
				<button className="btn"><i className="bi-trash3 text-danger"></i></button>
				</OverlayTrigger>
			</div>
		)
	}


	return(
		<>
			<div className="card mt-5" id={`post_${post.id}`}>
				<div className="card-body bg-warning-subtle p-4">
					<div className="row justify-content-between">
						<div className="col-auto">
							{post.tags.split(" ").map((tag) => (
								<span key={`${post.id}_${tag}`} className={`badge bg-${colorMap[tag]} me-2`}><i className="bi bi-book fs-6 align-text-bottom me-1"></i>{tag}</span>
							))}
						</div>
						{deleteButton}
					</div>
					<div className="row fs-5 my-3 ms-1">
						{post.content}
					</div>
					<div className="row justify-content-between">
						<div className="col-auto text-start">
							<Link to={`/user/${post.posted_by.id}`}>
							<span className="text-body-secondary fs-6 fw-light">
								<i className="bi bi-person-circle fs-5 me-2"> </i>
								{post.posted_by.username}
							</span>
							</Link>
						</div>
						<div className="col-auto text-end">
							<span className="text-body-secondary fs-6 fw-light">
								{post.ctime.date}<i className="bi bi-dot mx-1"></i>{post.ctime.time}
							</span>
						</div>
					</div>
				</div>
				<div className="card-footer">
					<div className="row justify-content-between">
						<div className="col-auto">
							<OverlayTrigger
								placement="top"
								overlay={
									<Tooltip id={`button-like-${post.id}`}>{post.is_liked ? 'Remove like' : 'Like'}</Tooltip>
								}>
								<button id={"like"+post.id} className="btn m-0 fs-5 text-primary" onClick={()=>{handleLike(post.id)}}><i className={post.is_liked ? 'bi-hand-thumbs-up-fill' : 'bi-hand-thumbs-up'}></i></button>
							</OverlayTrigger>
							{post.likes_count}
						</div>
						<div className="col-auto">
							<OverlayTrigger
								placement="top"
								overlay={
									<Tooltip id={`button-like-${post.id}`}>Comments</Tooltip>
								}>
								<button id={"like"+post.id} className="btn m-0 fs-5 text-primary" onClick={() => setOpen(!open)}><i className="bi bi-chat"></i></button>
							</OverlayTrigger>
							{post.comments_count}
						</div>
						<div className="col-auto">
							<OverlayTrigger
								placement="top"
								overlay={
									<Tooltip id={`button-like-${post.id}`}>Copy link</Tooltip>
								}>
								<button id={"like"+post.id} className="btn m-0 fs-5" onClick={()=>{handleLike(post.id)}}><i className="bi bi-box-arrow-up"></i></button>
							</OverlayTrigger>
						</div>
					</div>
				</div>
			</div>
			<Collapse in={open}>
				<div className="w-75 mx-auto mt-2">
					{comments ?
						<Comments postID={post.id} userID={userID} comments={comments} sendComment={sendComment} submitCommentForm={submitCommentForm}/>
					: <></>}
					</div>
			</Collapse>
		</>

	);

}