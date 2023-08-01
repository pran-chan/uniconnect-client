import {Link} from "react-router-dom";
import {OverlayTrigger, Tooltip} from "react-bootstrap";


export default function UniversityCard({university}){
	return(
		<div className="card">
			<div className="card-body bg-warning-subtle">
				<div className="row justify-content-between">
					<div className="col-auto">
						<span className="card-title fw-bold fs-4">{university.name}</span>
					</div>
					<div className="col-auto text-end">
						<OverlayTrigger
							placement="top"
							overlay={
							<Tooltip id={`button-tooltip-${university.id}`}>Community Page</Tooltip>
						}>
							<Link to={`community/${university.id}`}>
								<i className="bi fs-5 bi-box-arrow-up-right"></i>
							</Link>
						</OverlayTrigger>
					</div>
				</div>
			</div>
			<ul className="list-group list-group-flush text-start">
				{university.programs.map((program, index) => (
					<li key={program.id} className="list-group-item">

						<div className="row justify-content-between text-decoration-none text-black">
							<div className="col-7 fw-light justify-content-start">
								<span>{program.name}</span>
							</div>
							<div className="col-4 justify-content-end">
								{program.intakes.map((intake) => (
									<span key={intake.id} className="badge bg-warning rounded-pill my-auto me-2 fw-normal text-black">{intake.name}</span>
								))}
							</div>
						</div>

					</li>
				))}
			</ul>
		</div>
	);

}