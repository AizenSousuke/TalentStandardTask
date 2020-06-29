/* Skill section */
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

export default class Skill extends React.Component {
	constructor(props) {
        super(props);
        
		const options = [
			{
				key: "0",
				text: "Basic",
				value: "Basic",
			},
			{
				key: "1",
				text: "Intermediate",
				value: "Intermediate",
			},
			{
				key: "2",
				text: "Expert",
				value: "Expert",
			},
		];

		this.schema = Joi.object({
			skill: Joi.string().max(80),
			skillLevel: Joi.string().max(80),
		});

		this.state = {
			skillsArray: [],
			openAdd: false,
			openEdit: false,
			// Only open the one that is the same as this
			openEditId: null,
			skill: "",
			skillLevel: "",
			options: options,
			// For validation
			schema: {},
		};
	}

    
	componentWillMount() {
		this.getSkill();
	}

	handleChange(event, name = null, value = null) {
		// console.log(event.target.name, event.target.value, name, value);
		const data = Object.assign({}, this.state.schema);
		let dataname = "";
		switch (event.target.name) {
			case undefined:
				dataname = name;
				this.setState({ [name]: value }, () => {
					// console.log(this.state.skillLevel);
					const validation = this.checkStateForValidation({
						skillLevel: this.state.skillLevel,
					});
					// console.log("Validation: ", !validation);
					data[dataname] = !validation;
					this.setState({ schema: data });
				});
				break;
			default:
				dataname = event.target.name;
				this.setState(
					{ [event.target.name]: event.target.value },
					() => {
						// console.log(this.state.skill);
						const validation = this.checkStateForValidation({
							skill: this.state.skill,
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
		// console.log("Validation State Check: ", value, error);
		if (error == undefined) {
			return true;
		} else {
			return false;
		}
	}

	openAdd(event = null) {
		if (this.openAdd) {
			// Clear inputs
			this.setState({ skill: "", skillLevel: "" });
		}
		this.setState({ openAdd: !this.state.openAdd, openEdit: false }, () => {
			// console.log("Open Add: ", this.state.openAdd);
		});
	}

	openEdit(event = null, id = null, name = null, level = null) {
		// Set the values in the edit if used from the edit button
		this.setState(
			{
				openEdit: !this.state.openEdit,
				openAdd: false,
				openEditId: id,
				skill: name,
				skillLevel: level,
			},
			() => {
				// console.log("Open Edit: ", this.state.openEdit);
			}
		);
	}

	getSkill() {
		var cookies = Cookies.get("talentAuthToken");
		$.ajax({
			url: "http://localhost:60290/profile/profile/getSkill",
			headers: {
				Authorization: "Bearer " + cookies,
				"Content-Type": "application/json",
			},
			type: "GET",
			success: function (res) {
				// console.log("getSkill: ", res);
				if (res.success == true) {
					this.setState({ skillsArray: res.data }, () => {
						// Update the skills data in profile
						// const obj = Object.assign({}, { skills: this.state.skillsArray });
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

	addSkill() {
		// Validate first
		if (
			this.checkStateForValidation({
				skill: this.state.skill,
				skillLevel: this.state.skillLevel,
			})
		) {
			console.log("Adding skill");
			// Should add on to skills
			const data = Object.assign(
				{},
				{
					currentUserId: this.props.userId,
					name: this.state.skill,
					level: this.state.skillLevel,
				}
			);
			this.addingSkill(data);
			this.openAdd();
		} else {
			// Set warning
			this.setState({ schema: { skill: true } });
			TalentUtil.notification.show(
				"Please check and resolve the errors",
				"error",
				null,
				null
			);
		}
	}

	addingSkill(skill) {
		var AddSkillViewModel = Object.assign({}, skill);
		console.log("AddSkillViewModel: ", AddSkillViewModel);
		var cookies = Cookies.get("talentAuthToken");
		$.ajax({
			url: "http://localhost:60290/profile/profile/addSkill",
			headers: {
				Authorization: "Bearer " + cookies,
				"Content-Type": "application/json",
			},
			type: "POST",
			data: JSON.stringify(AddSkillViewModel),
			success: function (res) {
				console.log(res);
				if (res.success == true) {
					this.getSkill();
					TalentUtil.notification.show(
						"Skill updated sucessfully",
						"success",
						null,
						null
					);
				} else {
					TalentUtil.notification.show(
						"Skill did not update successfully",
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

	editSkill(id = null) {
		console.log("Edit skill");
		// Validate first
		if (
			this.checkStateForValidation({
				skill: this.state.skill,
				skillLevel: this.state.skillLevel,
			})
		) {
			console.log("Editing skill");
			// Should add on to skills
			const data = Object.assign(
				{},
				{
					currentUserId: this.props.userId,
					id: id,
					name: this.state.skill,
					level: this.state.skillLevel,
				}
			);
			this.updateSkill(data);
			this.openEdit();
		} else {
			// Set warning
			this.setState({ schema: { skill: true } });
			TalentUtil.notification.show(
				"Please check and resolve the errors",
				"error",
				null,
				null
			);
		}
	}

	updateSkill(skill) {
		var AddSkillViewModel = Object.assign({}, skill);
		console.log("AddSkillViewModel: ", AddSkillViewModel);
		var cookies = Cookies.get("talentAuthToken");
		$.ajax({
			url: "http://localhost:60290/profile/profile/updateSkill",
			headers: {
				Authorization: "Bearer " + cookies,
				"Content-Type": "application/json",
			},
			type: "POST",
			data: JSON.stringify(AddSkillViewModel),
			success: function (res) {
				console.log(res);
				if (res.success == true) {
					this.getSkill();
					TalentUtil.notification.show(
						"Skill updated sucessfully",
						"success",
						null,
						null
					);
				} else {
					TalentUtil.notification.show(
						"Skill did not update successfully",
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

	deleteSkill(skill) {
		console.log("Deleting ", skill);
		var DeleteSkillViewModel = Object.assign({}, skill);
		var cookies = Cookies.get("talentAuthToken");
		$.ajax({
			url: "http://localhost:60290/profile/profile/deleteSkill",
			headers: {
				Authorization: "Bearer " + cookies,
				"Content-Type": "application/json",
			},
			type: "POST",
			data: JSON.stringify(DeleteSkillViewModel),
			success: function (res) {
				console.log(res);
				if (res.success == true) {
					this.getSkill();
					TalentUtil.notification.show(
						"Skill deleted sucessfully",
						"success",
						null,
						null
					);
				} else {
					TalentUtil.notification.show(
						"Skill did not delete successfully",
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
								<Input
									name="skill"
									type="text"
									fluid
									onChange={(e) => this.handleChange(e)}
									placeholder="Add skill"
									value={
										this.state.skill
											? this.state.skill
											: ""
									}
									error={this.state.schema.skill}
								/>
							</Grid.Column>
							<Grid.Column>
								<Select
									name="skillLevel"
									placeholder={"Skill Level"}
									value={this.state.skillLevel}
									options={this.state.options}
									onChange={(e, { name, value }) => {
										e.preventDefault();
										this.handleChange(e, name, value);
									}}
									fluid
								/>
							</Grid.Column>
							<Grid.Column>
								<Button
									color={"green"}
									onClick={(e) => {
										e.preventDefault();
										this.addSkill();
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
						<Grid.Row>
							<Grid.Column>
								<Message
									negative
									hidden={!this.state.schema.skill}
								>
									Please enter both skill and skill
									level. Max string length is 80 characters.
								</Message>
							</Grid.Column>
						</Grid.Row>
					</React.Fragment>
				)}

				<Grid.Row>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHeaderCell width={6}>
									Skill
								</TableHeaderCell>
								<TableHeaderCell width={6}>
									Level
								</TableHeaderCell>
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
							{this.state.skillsArray.map((l) => {
								return (
									<React.Fragment key={l.id}>
										{this.state.openEdit &&
										this.state.openEditId == l.id ? (
											<TableRow>
												<TableCell width={6}>
													<Input
														name="skill"
														type="text"
														fluid
														onChange={(e) =>
															this.handleChange(e)
														}
														placeholder="Edit skill"
														value={
															this.state.skill
																? this.state
																		.skill
																: ""
														}
														error={
															this.state.schema
																.skill
														}
													/>
													<Message
														negative
														hidden={
															!this.state.schema
																.skill
														}
													>
														Please enter both
														skill and skill
														level. Max string length
														is 80 characters.
													</Message>
												</TableCell>
												<TableCell width={6}>
													<Select
														name="skillLevel"
														placeholder={
															"Edit Skill Level"
														}
														value={
															this.state
																.skillLevel
														}
														options={
															this.state.options
														}
														onChange={(
															e,
															{ name, value }
														) => {
															e.preventDefault();
															this.handleChange(
																e,
																name,
																value
															);
														}}
														fluid
													/>
												</TableCell>
												<TableCell textAlign={"right"}>
													<Button
														basic
														primary
														onClick={(e) => {
															e.preventDefault();
															this.editSkill(
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
															this.openEdit(e);
														}}
													>
														Cancel
													</Button>
												</TableCell>
											</TableRow>
										) : (
											<TableRow>
												<TableCell width={6}>
													{l.name}
												</TableCell>
												<TableCell width={6}>
													{l.level}
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
																l.name,
																l.level
															);
														}}
													></Button>
													<Button
														basic
														icon="close"
														size="mini"
														onClick={(e) => {
															e.preventDefault();
															this.deleteSkill(
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
