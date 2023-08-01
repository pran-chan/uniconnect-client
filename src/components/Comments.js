import "../styles/global.css"
import {useForm} from "react-hook-form";
import {Button, FloatingLabel, Form, OverlayTrigger, Tooltip} from "react-bootstrap";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import axios from "axios";

export default function Comments({postID, userID, comments, sendComment, submitCommentForm}){

	const {register:commentRegister, handleSubmit: commentHandleSubmit } = useForm();

	return(
		<div className="card p-2" style={{'maxHeight':'350px'}} id={`comment_${postID}`}>
			<div className="overflow-y-scroll">
				{comments.map((comment) => (
					<div className="card my-1">
						<div className="col-auto text-start p-2">
							<div className="row justify-content-between">
								<div className="col-auto">
									<Link to={`/user/${comment.posted_by.id}`}>
										<span className="text-body-secondary half-size fw-light">
											<i className="bi bi-person-circle half-size me-1"> </i>
											{comment.posted_by.username}
										</span>
									</Link>
								</div>
								<div className="col-auto">
										<span className="text-body-secondary half-size fw-light">
											{comment.ctime.date}<i className="bi bi-dot"></i>{comment.ctime.time}
										</span>
								</div>
							</div>
							<div className="fs-5 p-1">
								{comment.content}
							</div>
						</div>
					</div>
				))}
			</div>
			<Form id="commentForm" onSubmit={commentHandleSubmit(submitCommentForm)}>
				<FloatingLabel controlId="floatingInput" label="Comment" className="my-2">
					<Form.Control {...commentRegister("content")} as="textarea" placeholder="Leave a comment here" style={{'height': '60px'}}  />
				</FloatingLabel>
				<input type="hidden" value={postID} {...commentRegister(`postID`)} />
				<OverlayTrigger
					placement="right"
					overlay={
						<Tooltip id={`button-comment-${postID}`}>Add Comment</Tooltip>
					}>
					<Button className="float-end" size="sm" variant="outline-primary" type="submit">
						<i className="bi bi-send-fill"></i>
					</Button>
				</OverlayTrigger>
			</Form>

		</div>
	);

}