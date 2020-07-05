/* Experience section */
import React from "react";
import Cookies from "js-cookie";
import {
	Dropdown,
	Grid,
	Select,
	Button,
	Input,
	Message,
	Table,
	TableHeader,
	TableHeaderCell,
	TableBody,
	TableCell,
	Icon,
	TableRow,
} from "semantic-ui-react";
import { ChildSingleInput } from "../Form/SingleInput.jsx";
import Joi from "@hapi/joi";
import moment, { now } from "moment";

export default class Experience extends React.Component {
	constructor(props) {
		super(props);

		this.schema = Joi.object({
			company: Joi.string().max(80),
			position: Joi.string().max(80),
			responsibilities: Joi.string().max(80),
			startdate: Joi.date(),
			enddate: Joi.date(),
			// enddate: Joi.date().min(Joi.ref("startdate")), // Some issues here where the error is referencing incorrectly by Joi
		});

		this.state = {
			experiencesArray: [],
			openAdd: false,
			openEdit: false,
			// Only open the one that is the same as this
			openEditId: null,
			company: "",
			position: "",
			responsibilities: "",
			startdate: "",
			enddate: "",
			// For validation
			schema: {},
		};
	}

	componentWillMount() {
		this.getExperience();
	}

	handleChange(event, name = null, value = null) {
		console.log(event.target.name, event.target.value, name, value);
		const data = Object.assign({}, this.state.schema);
		let dataname = "";
		let datavalue = "";
		switch (event.target.name) {
			// case undefined:
			// 	dataname = name;
			// 	this.setState({ [name]: value }, () => {
			// 		// console.log(this.state.languageLevel);
			// 		const validation = this.checkStateForValidation({
			// 			languageLevel: this.state.languageLevel,
			// 		});
			// 		// console.log("Validation: ", !validation);
			// 		data[dataname] = !validation;
			// 		this.setState({ schema: data });
			// 	});
			// 	break;
			default:
				dataname = event.target.name;
				datavalue = event.target.value;
				this.setState(
					{ [event.target.name]: event.target.value },
					() => {
						// console.log(this.state.language);
						const validation = this.checkStateForValidation({
							[dataname]: datavalue,
						});
						// console.log("Validation: ", !validation);
						data[dataname] = !validation;
						this.setState({ schema: data });
					}
				);
				break;
		}
	}

	checkStateForValidation(state) {
		const { value, error } = this.schema.validate(state);
		console.log("Validation State Check: ", value, error);
		if (error == undefined) {
			return true;
		} else {
			return false;
		}
	}

	openAdd(event = null) {
		if (this.openAdd) {
			// Clear inputs
			this.setState({
				company: "",
				position: "",
				responsibilities: "",
				startdate: new Date().toISOString().slice(0, 10),
				enddate: new Date().toISOString().slice(0, 10),
			});
		}
		this.setState({ openAdd: !this.state.openAdd, openEdit: false }, () => {
			// console.log("Open Add: ", this.state.openAdd);
		});
	}

	openEdit(
		event = null,
		id = null,
		company = null,
		position = null,
		responsibilities = null,
		startdate = null,
		enddate = null
	) {
		// Set the values in the edit if used from the edit button
		this.setState(
			{
				openEdit: !this.state.openEdit,
				openAdd: false,
				openEditId: id,
				company: company,
				position: position,
				responsibilities: responsibilities,
				startdate: new Date(
					new Date(startdate).getFullYear(),
					new Date(startdate).getMonth(),
					new Date(startdate).getDate() + 1
				)
					.toISOString()
					.slice(0, 10),
				enddate: new Date(
					new Date(enddate).getFullYear(),
					new Date(enddate).getMonth(),
					new Date(enddate).getDate() + 1
				)
					.toISOString()
					.slice(0, 10),
			},
			() => {
				// console.log("Open Edit: ", this.state.openEdit);
			}
		);
	}

	getExperience() {
		var cookies = Cookies.get("talentAuthToken");
		$.ajax({
			url: "https://talentservicesprofilenik.azurewebsites.net/profile/profile/getExperience",
			headers: {
				Authorization: "Bearer " + cookies,
				"Content-Type": "application/json",
			},
			type: "GET",
			success: function (res) {
				console.log("getExperience: ", res);
				if (res.success == true) {
					this.setState({ experiencesArray: res.data }, () => {
						// Update the experiences data in profile
						// const obj = Object.assign({}, { experiences: this.state.experiencesArray });
						// this.props.updateAndSaveData(obj);
					});
				}
			}.bind(this),
			error: function (res, a, b) {
				console.log(res);
				console.log(a);
				console.log(b);
			},
		});
	}

	addExperience() {
		// Validate first
		if (
			this.checkStateForValidation({
				company: this.state.company,
				position: this.state.position,
				responsibilities: this.state.responsibilities,
				startdate: this.state.startdate,
				enddate: this.state.enddate,
			})
		) {
			console.log("Adding experience");
			// Should add on to experience
			const data = Object.assign(
				{},
				{
					company: this.state.company,
					position: this.state.position,
					responsibilities: this.state.responsibilities,
					start: new Date(this.state.startdate)
						.toLocaleString()
						.slice(0, 10),
					end: new Date(this.state.enddate)
						.toLocaleString()
						.slice(0, 10),
				}
			);
			this.addingExperience(data);
			this.openAdd();
		} else {
			// Set warning
			this.setState({ schema: { company: true } });
			TalentUtil.notification.show(
				"Please check and resolve the errors",
				"error",
				null,
				null
			);
		}
	}

	addingExperience(experience) {
		var AddExperienceViewModel = Object.assign({}, experience);
		console.log("AddExperienceViewModel: ", AddExperienceViewModel);
		var cookies = Cookies.get("talentAuthToken");
		$.ajax({
			url: "https://talentservicesprofilenik.azurewebsites.net/profile/profile/addExperience",
			headers: {
				Authorization: "Bearer " + cookies,
				"Content-Type": "application/json",
			},
			type: "POST",
			data: JSON.stringify(AddExperienceViewModel),
			success: function (res) {
				console.log(res);
				if (res.success == true) {
					this.getExperience();
					TalentUtil.notification.show(
						"Experience updated successfully",
						"success",
						null,
						null
					);
				} else {
					TalentUtil.notification.show(
						"Experience did not update successfully",
						"error",
						null,
						null
					);
				}
			}.bind(this),
			error: function (res, a, b) {
				console.log(res);
				console.log(a);
				console.log(b);
			},
		});
	}

	editExperience(id = null) {
		console.log("Edit experience");
		// Validate first
		if (
			this.checkStateForValidation({
				company: this.state.company,
				position: this.state.position,
				responsibilities: this.state.responsibilities,
				startdate: this.state.startdate,
				enddate: this.state.enddate,
			})
		) {
			console.log("Editing experience");
			// Should add on to experience
			const data = Object.assign(
				{},
				{
					currentUserId: this.props.userId,
					id: id,
					company: this.state.company,
					position: this.state.position,
					responsibilities: this.state.responsibilities,
					start: new Date(this.state.startdate)
						.toLocaleString()
						.slice(0, 10),
					end: new Date(this.state.enddate)
						.toLocaleString()
						.slice(0, 10),
				}
			);
			this.updateExperience(data);
			this.openEdit();
		} else {
			// Set warning
			this.setState({ schema: { company: true } });
			TalentUtil.notification.show(
				"Please check and resolve the errors",
				"error",
				null,
				null
			);
		}
	}

	updateExperience(experience) {
		var AddExperienceViewModel = Object.assign({}, experience);
		console.log("AddExperienceViewModel: ", AddExperienceViewModel);
		var cookies = Cookies.get("talentAuthToken");
		$.ajax({
			url: "https://talentservicesprofilenik.azurewebsites.net/profile/profile/updateExperience",
			headers: {
				Authorization: "Bearer " + cookies,
				"Content-Type": "application/json",
			},
			type: "POST",
			data: JSON.stringify(AddExperienceViewModel),
			success: function (res) {
				console.log(res);
				if (res.success == true) {
					this.getExperience();
					TalentUtil.notification.show(
						"Experience updated successfully",
						"success",
						null,
						null
					);
				} else {
					TalentUtil.notification.show(
						"Experience did not update successfully",
						"error",
						null,
						null
					);
				}
			}.bind(this),
			error: function (res, a, b) {
				console.log(res);
				console.log(a);
				console.log(b);
			},
		});
	}

	deleteExperience(experience) {
		console.log("Deleting ", experience);
		var DeleteExperienceViewModel = Object.assign({}, experience);
		var cookies = Cookies.get("talentAuthToken");
		$.ajax({
			url: "https://talentservicesprofilenik.azurewebsites.net/profile/profile/deleteExperience",
			headers: {
				Authorization: "Bearer " + cookies,
				"Content-Type": "application/json",
			},
			type: "POST",
			data: JSON.stringify(DeleteExperienceViewModel),
			success: function (res) {
				console.log(res);
				if (res.success == true) {
					this.getExperience();
					TalentUtil.notification.show(
						"Experience deleted successfully",
						"success",
						null,
						null
					);
				} else {
					TalentUtil.notification.show(
						"Experience did not delete successfully",
						"error",
						null,
						null
					);
				}
			}.bind(this),
			error: function (res, a, b) {
				console.log(res);
				console.log(a);
				console.log(b);
			},
		});
	}

	render() {
		return (
			<Grid container columns="equal">
				{this.state.openAdd && (
					<React.Fragment>
						<Grid.Row>
							<Grid.Column>
								Company:
								<Input
									name="company"
									type="text"
									fluid
									onChange={(e) => this.handleChange(e)}
									placeholder="Add company"
									value={
										this.state.company
											? this.state.company
											: ""
									}
									error={this.state.schema.company}
								/>
							</Grid.Column>
							<Grid.Column>
								Position:
								<Input
									name="position"
									type="text"
									fluid
									onChange={(e) => this.handleChange(e)}
									placeholder="Add position"
									value={
										this.state.position
											? this.state.position
											: ""
									}
									error={this.state.schema.position}
								/>
							</Grid.Column>
						</Grid.Row>
						<Grid.Row>
							<Grid.Column>
								Start Date:
								<Input
									name="startdate"
									type="date"
									fluid
									value={
										this.state.startdate
											? this.state.startdate
											: ""
									}
									error={this.state.schema.startdate}
									onChange={(e) => this.handleChange(e)}
								/>
							</Grid.Column>
							<Grid.Column>
								End Date:
								<Input
									name="enddate"
									type="date"
									fluid
									value={
										this.state.enddate
											? this.state.enddate
											: ""
									}
									onChange={(e) => this.handleChange(e)}
								/>
							</Grid.Column>
						</Grid.Row>
						<Grid.Row>
							<Grid.Column>
								Responsibilities:
								<Input
									name="responsibilities"
									type="text"
									fluid
									onChange={(e) => this.handleChange(e)}
									placeholder="Add responsibilities"
									value={
										this.state.responsibilities
											? this.state.responsibilities
											: ""
									}
									error={this.state.schema.responsibilities}
								/>
							</Grid.Column>
						</Grid.Row>
						<Grid.Row>
							<Grid.Column>
								<Message
									negative
									hidden={!this.state.schema.company}
								>
									Please fill up all the fields. Max string
									length is 80 characters.
								</Message>
							</Grid.Column>
						</Grid.Row>
						<Grid.Row>
							<Grid.Column>
								<Button
									color={"green"}
									onClick={(e) => {
										e.preventDefault();
										this.addExperience();
									}}
									fluid
								>
									Add
								</Button>
							</Grid.Column>
							<Grid.Column>
								<Button
									color={"grey"}
									fluid
									onClick={(e) => {
										e.preventDefault();
										this.openAdd();
									}}
								>
									Cancel
								</Button>
							</Grid.Column>
						</Grid.Row>
					</React.Fragment>
				)}

				<Grid.Row>
					<Table structured>
						<TableHeader>
							<TableRow>
								<TableHeaderCell>Company</TableHeaderCell>
								<TableHeaderCell>Position</TableHeaderCell>
								<TableHeaderCell>
									Responsibilities
								</TableHeaderCell>
								<TableHeaderCell>Start</TableHeaderCell>
								<TableHeaderCell>End</TableHeaderCell>
								<TableHeaderCell>
									<Button
										color={"black"}
										fluid
										onClick={(e) => {
											e.preventDefault();
											this.openAdd();
										}}
									>
										Add New
									</Button>
								</TableHeaderCell>
							</TableRow>
						</TableHeader>
						<TableBody>
							{this.state.experiencesArray.map((l) => {
								return (
									<React.Fragment key={l.id}>
										{this.state.openEdit &&
										this.state.openEditId == l.id ? (
											<React.Fragment>
												<TableRow>
													<TableCell colSpan={"3"}>
														Company:
														<Input
															name="company"
															type="text"
															fluid
															onChange={(e) =>
																this.handleChange(
																	e
																)
															}
															placeholder="Edit company"
															value={
																this.state
																	.company
																	? this.state
																			.company
																	: ""
															}
															error={
																this.state
																	.schema
																	.company
															}
														/>
														<Message
															negative
															hidden={
																!this.state
																	.schema
																	.company
															}
														>
															Please fill up all
															the fields. Max
															string length is 80
															characters.
														</Message>
													</TableCell>
													<TableCell colSpan={"3"}>
														Position:
														<Input
															name="position"
															type="text"
															fluid
															onChange={(e) =>
																this.handleChange(
																	e
																)
															}
															placeholder="Edit position"
															value={
																this.state
																	.position
																	? this.state
																			.position
																	: ""
															}
															error={
																this.state
																	.schema
																	.position
															}
														/>
														<Message
															negative
															hidden={
																!this.state
																	.schema
																	.position
															}
														>
															Please fill up all
															the fields. Max
															string length is 80
															characters.
														</Message>
													</TableCell>
												</TableRow>
												<TableRow>
													<TableCell colSpan={"3"}>
														Start Date:
														<Input
															name="startdate"
															type="date"
															fluid
															onChange={(e) =>
																this.handleChange(
																	e
																)
															}
															placeholder="Edit startdate"
															value={
																this.state
																	.startdate
																	? this.state
																			.startdate
																	: ""
															}
															error={
																this.state
																	.schema
																	.startdate
															}
														/>
														<Message
															negative
															hidden={
																!this.state
																	.schema
																	.startdate
															}
														>
															Please fill up all
															the fields. Max
															string length is 80
															characters.
														</Message>
													</TableCell>
													<TableCell colSpan={"3"}>
														End Date:
														<Input
															name="enddate"
															type="date"
															fluid
															onChange={(e) =>
																this.handleChange(
																	e
																)
															}
															placeholder="Edit enddate"
															value={
																this.state
																	.enddate
																	? this.state
																			.enddate
																	: ""
															}
															error={
																this.state
																	.schema
																	.enddate
															}
														/>
														<Message
															negative
															hidden={
																!this.state
																	.schema
																	.enddate
															}
														>
															Please fill up all
															the fields. Max
															string length is 80
															characters.
														</Message>
													</TableCell>
												</TableRow>
												<TableRow>
													<TableCell colSpan={"6"}>
														Responsibilities:
														<Input
															name="responsibilities"
															type="text"
															fluid
															onChange={(e) =>
																this.handleChange(
																	e
																)
															}
															placeholder="Edit responsibilities"
															value={
																this.state
																	.responsibilities
																	? this.state
																			.responsibilities
																	: ""
															}
															error={
																this.state
																	.schema
																	.responsibilities
															}
														/>
														<Message
															negative
															hidden={
																!this.state
																	.schema
																	.responsibilities
															}
														>
															Please fill up all
															the fields. Max
															string length is 80
															characters.
														</Message>
													</TableCell>
												</TableRow>
												<TableRow>
													<TableCell colSpan={"6"}>
														<Button
															basic
															primary
															onClick={(e) => {
																e.preventDefault();
																this.editExperience(
																	l.id
																);
															}}
														>
															Update
														</Button>
														<Button
															basic
															negative
															onClick={(e) => {
																e.preventDefault();
																this.openEdit(
																	e
																);
															}}
														>
															Cancel
														</Button>
													</TableCell>
												</TableRow>
											</React.Fragment>
										) : (
											<TableRow>
												<TableCell>
													{l.company}
												</TableCell>
												<TableCell>
													{l.position}
												</TableCell>
												<TableCell>
													{l.responsibilities}
												</TableCell>
												<TableCell>
													{moment(l.start)
														.format("Do MMM, YYYY")
														.toString()}
												</TableCell>
												<TableCell>
													{moment(l.end)
														.format("Do MMM, YYYY")
														.toString()}
												</TableCell>
												<TableCell textAlign={"right"}>
													<Button
														basic
														icon="edit"
														size="mini"
														onClick={(e) => {
															e.preventDefault();
															this.openEdit(
																e,
																l.id,
																l.company,
																l.position,
																l.responsibilities,
																l.start,
																l.end
															);
														}}
													></Button>
													<Button
														basic
														icon="close"
														size="mini"
														onClick={(e) => {
															e.preventDefault();
															this.deleteExperience(
																l
															);
														}}
													></Button>
												</TableCell>
											</TableRow>
										)}
									</React.Fragment>
								);
							})}
						</TableBody>
					</Table>
				</Grid.Row>
			</Grid>
		);
	}
}
