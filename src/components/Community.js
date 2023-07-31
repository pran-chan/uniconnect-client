import {Link, useParams} from "react-router-dom";
import {useAuth} from "../contexts/AuthContext";
import {useEffect, useState} from "react";
import axios from "axios";
import PostCard from "./PostCard";
import "../styles/global.css"
import Modal from "react-bootstrap/Modal";
import {Button, FloatingLabel, Form, OverlayTrigger, Tooltip} from "react-bootstrap";
import {Controller, set, useForm} from "react-hook-form";
import Select from "react-select";
import makeAnimated from 'react-select/animated';


export default function Community(){
	const {authUser, setAuthUser, isLoggedIn, setIsLoggedIn} = useAuth();
	const [favourites, setFavourites] = useState(null);
	const [programs, setPrograms] = useState(null)
	const [posts, setPosts] = useState(null);
	const [showPost, setShowPost] = useState(false);
	const {register:postRegister, control, handleSubmit: postHandleSubmit } = useForm();
	const { universityID } = useParams();


	function loadFavourites() {
		axios.get("http://localhost:8000/user/favourites/?university_id="+universityID,{
			headers:{
				'Authorization': `Token ${authUser.authToken}`
			}
		}).then(response => {
			setFavourites(response.data);
		});
	}

	function loadPosts() {
		axios.get("http://localhost:8000/community/"+universityID+"/",{
			headers:{
				'Authorization': `Token ${authUser.authToken}`
			}
		}).then(response => {
			setPosts(response.data);
		});
	}

	const handleLike = (postID) =>{
		axios.post("http://localhost:8000/community/post/"+postID+"/like/",{},{headers:{'Authorization':`Token ${authUser.authToken}`}}
		).then(res => {
			loadPosts();
		}).catch(err => {
			console.log(err);
		});
	}

	const handleComment = (postID,content) =>{
		axios.post("http://localhost:8000/community/post/"+postID+"/comment/",{
			'content':content
			},{headers:{'Authorization':`Token ${authUser.authToken}`}}
		).then(res => {
			//Do Something
		}).catch(err => {
			console.log(err);
		});
	}


	useEffect(() => {
		if(!authUser) return;
		loadFavourites();
		loadPosts();
	}, [authUser]);

	const handleClosePost = () => setShowPost(false);

	const handleShowPost = () => setShowPost(true);

	function submitPostForm(data){
		let str = "";
		if(data.tags){
			data.tags.forEach((tag)=>{
				str += tag.value+" ";
			});
		}
		const postData = {
			"content":data.content,
			"tags": str.trim()
		}
		console.log(postData);
		axios.post("http://localhost:8000/community/"+universityID+"/",postData,{headers:{'Authorization':`Token ${authUser.authToken}`}}
		).then(res => {
			handleClosePost();
			loadPosts();
		}).catch(err => {
			console.log(err);
		});
	}






	const tagsData = [
		{
			label:'housing',
			value:'housing'
		},
		{
			label:'study',
			value:'study'
		},
		{
			label:'food',
			value:'food'
		}
	]

	function PostForm() {
		return (
			<Modal show={showPost} onHide={handleClosePost} size="lg">
				<Modal.Header closeButton>
					<Modal.Title>Post to <span className="fw-bold">{posts.university}</span></Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form id="postForm" onSubmit={postHandleSubmit(submitPostForm)}>
						<FloatingLabel controlId="floatingInput" label="Post Content" className="mb-3">
							<Form.Control {...postRegister("content")} as="textarea" placeholder="Leave a comment here" style={{'height': '140px'}}  />
						</FloatingLabel>
						<Controller
							name="tags"
							control={control}
							render={({ field }) => (
								<Select {...field} className="mb-3 mx-auto" options={tagsData} placeholder="Select tags" components={makeAnimated()} isMulti/>
							)}
						/>
					</Form>

				</Modal.Body>
				<Modal.Footer>
					<Button variant="primary" form="postForm" type="submit">Create Post</Button>
				</Modal.Footer>
			</Modal>
		);
	}

	return(
		<div className="shadow container-fluid bg-white user-select-none p-3">
			<nav className="breadcrumb-div" aria-label="breadcrumb">
				<ol className="breadcrumb">
					<li className="breadcrumb-item"><a href="/">Home</a></li>
					<li className="breadcrumb-item active" aria-current="page">Community</li>
				</ol>
			</nav>
			{ posts ?
				<>
					<div className="container-fluid p-3">
						<span className="fw-bold display-3 mb-3">{posts.university}</span>
					</div>
					<div className="border-1 border-black">
						<div className="row">
							<div className="col">
								<div className="row justify-content-between">
									<div className="col-auto mt-2">
										<span className="fs-4 ms-2">Posts</span>
									</div>
									<div className="col-auto">
										<OverlayTrigger
											placement="top"
											overlay={
												<Tooltip id={`button-tooltip-chat`}>Chatroom</Tooltip>
											}><Link to={"chat"} className="btn btn-outline-warning ms-4"><i className="fs-5 bi bi-chat-text"></i></Link>
										</OverlayTrigger>
										<OverlayTrigger
											placement="right"
											overlay={
												<Tooltip id={`button-tooltip-addpost`}>Add post</Tooltip>
											}><button className="btn btn-outline-primary ms-4" onClick={handleShowPost}><i className="fs-5 bi bi-plus-lg"></i></button>
										</OverlayTrigger>
									</div>
								</div>
								{posts.posts.map((post, index) => (
									<PostCard key={"post_"+post.id} post={post} universityID={universityID} userID={authUser.id} handleLike={handleLike} handleComment={handleComment} loadPosts={loadPosts} />
								))}
							</div>
							<div className="col-4">
								<div className="position-sticky top-0">
									<div className="p-4 mb-3 bg-body-tertiary rounded">
										<h4 className="fst-italic">About</h4>
										<p className="mb-0">Customize this section to tell your visitors a little bit about your publication, writers, content, or something else entirely. Totally up to you.</p>
									</div>

									<div>
										<h4 className="fst-italic">Recent posts</h4>
										<ul className="list-unstyled">
											<li>
												<a className="d-flex flex-column flex-lg-row gap-3 align-items-start align-items-lg-center py-3 link-body-emphasis text-decoration-none border-top" href="#">
													<svg className="bd-placeholder-img" width="100%" height="96" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" preserveAspectRatio="xMidYMid slice" focusable="false"><rect width="100%" height="100%" fill="#777"></rect></svg>
													<div className="col-lg-8">
														<h6 className="mb-0">Example blog post title</h6>
														<small className="text-body-secondary">January 15, 2023</small>
													</div>
												</a>
											</li>
											<li>
												<a className="d-flex flex-column flex-lg-row gap-3 align-items-start align-items-lg-center py-3 link-body-emphasis text-decoration-none border-top" href="#">
													<svg className="bd-placeholder-img" width="100%" height="96" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" preserveAspectRatio="xMidYMid slice" focusable="false"><rect width="100%" height="100%" fill="#777"></rect></svg>
													<div className="col-lg-8">
														<h6 className="mb-0">This is another blog post title</h6>
														<small className="text-body-secondary">January 14, 2023</small>
													</div>
												</a>
											</li>
											<li>
												<a className="d-flex flex-column flex-lg-row gap-3 align-items-start align-items-lg-center py-3 link-body-emphasis text-decoration-none border-top" href="#">
													<svg className="bd-placeholder-img" width="100%" height="96" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" preserveAspectRatio="xMidYMid slice" focusable="false"><rect width="100%" height="100%" fill="#777"></rect></svg>
													<div className="col-lg-8">
														<h6 className="mb-0">Longer blog post title: This one has multiple lines!</h6>
														<small className="text-body-secondary">January 13, 2023</small>
													</div>
												</a>
											</li>
										</ul>
									</div>

									<div className="p-4">
										<h4 className="fst-italic">Archives</h4>
										<ol className="list-unstyled mb-0">
											<li><a href="#">March 2021</a></li>
											<li><a href="#">February 2021</a></li>
											<li><a href="#">January 2021</a></li>
											<li><a href="#">December 2020</a></li>
											<li><a href="#">November 2020</a></li>
											<li><a href="#">October 2020</a></li>
											<li><a href="#">September 2020</a></li>
											<li><a href="#">August 2020</a></li>
											<li><a href="#">July 2020</a></li>
											<li><a href="#">June 2020</a></li>
											<li><a href="#">May 2020</a></li>
											<li><a href="#">April 2020</a></li>
										</ol>
									</div>

									<div className="p-4">
										<h4 className="fst-italic">Elsewhere</h4>
										<ol className="list-unstyled">
											<li><a href="#">GitHub</a></li>
											<li><a href="#">Twitter</a></li>
											<li><a href="#">Facebook</a></li>
										</ol>
									</div>
								</div>
							</div>
						</div>
					</div>
					<PostForm />
				</>
				: <h3>No posts yet!</h3>}
		</div>
	);
}