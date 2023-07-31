import "../styles/global.css"
import {useForm} from "react-hook-form";
import {Button, FloatingLabel, Form, OverlayTrigger, Tooltip} from "react-bootstrap";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import axios from "axios";

export default function Comments({postID, userID, comments, sendComment, submitCommentForm}){

	const {register:commentRegister, handleSubmit: commentHandleSubmit } = useForm();

	return(
		<div className="card mb-5 p-2" style={{'height':'250px'}} id={`comment_${postID}`}>
			<div className="overflow-y-scroll">

				{comments ?
					comments.map((comment) => (
						<div className="card">
							<div className="col-auto text-start p-2">
								<div className="row justify-content-between">
									<div className="col">
										<Link to={`/user/${comment.posted_by.id}`}>
										<span className="text-body-secondary fs-6 fw-light">
											<i className="bi bi-person-circle fs-5 me-2"> </i>
											{comment.posted_by.username}
										</span>
										</Link>
									</div>
								</div>
								<div>
									{comment.content}
								</div>
							</div>
						</div>
					)):
					<>awdawd</>
				}
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