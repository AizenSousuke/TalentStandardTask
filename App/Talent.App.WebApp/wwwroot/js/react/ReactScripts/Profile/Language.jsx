/* Language section */
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

export default class Language extends React.Component {
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
				text: "Conversational",
				value: "Conversational",
			},
			{
				key: "2",
				text: "Fluent",
				value: "Fluent",
			},
			{
				key: "3",
				text: "Native/Bilingual",
				value: "Native/Bilingual",
			},
		];

		this.schema = Joi.object({
			language: Joi.string().max(80),
			languageLevel: Joi.string().max(80),
		});

		this.state = {
			languagesArray: [],
			openAdd: false,
			openEdit: false,
			language: "",
			languageLevel: "",
			options: options,
			// For validation
			schema: {},
		};
	}

	componentWillMount() {
		this.getLanguage();
	}

	handleChange(event, name = null, value = null) {
		// console.log(event.target.name, event.target.value, name, value);
		const data = Object.assign({}, this.state.schema);
		let dataname = "";
		switch (event.target.name) {
			case undefined:
				dataname = name;
				this.setState({ [name]: value }, () => {
					// console.log(this.state.languageLevel);
					const validation = this.checkStateForValidation({
						languageLevel: this.state.languageLevel,
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
						// console.log(this.state.language);
						const validation = this.checkStateForValidation({
							language: this.state.language,
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
			this.setState({ language: "", languageLevel: "" });
		}
		this.setState({ openAdd: !this.state.openAdd }, () => {
			// console.log("Open Add: ", this.state.openAdd);
		});
	}

	openEdit(event = null) {
		this.setState({ openEdit: !this.state.openEdit }, () => {
			// console.log("Open Edit: ", this.state.openEdit);
		});

		// Set the values in the edit if used from the edit button
	}

	getLanguage() {
		var cookies = Cookies.get("talentAuthToken");
		$.ajax({
			url: "http://localhost:60290/profile/profile/getLanguage",
			headers: {
				Authorization: "Bearer " + cookies,
				"Content-Type": "application/json",
			},
			type: "GET",
			success: function (res) {
                console.log("getLanguage: ", res);
                // Save languages[] to the profile state
                var data = Object.assign({}, { languages: res.data });
                this.props.updateAndSaveData(data);
				this.setState({ languagesArray: res.data });
			}.bind(this),
			error: function (res, a, b) {
				console.log(res);
				console.log(a);
				console.log(b);
			},
		});
	}

	addLanguage() {
		// Validate first
		if (
			this.checkStateForValidation({
				language: this.state.language,
				languageLevel: this.state.languageLevel,
			})
		) {
			console.log("Adding language");
			// Should add on to languages
			const data = Object.assign(
				{},
				{
					name: this.state.language,
					level: this.state.languageLevel,
				}
			);
			this.props.addLanguage(data);
			this.openAdd();
		} else {
			// Set warning
			this.setState({ schema: { language: true } });
			TalentUtil.notification.show(
				"Please check and resolve the errors",
				"error",
				null,
				null
			);
		}
	}

	editLanguage() {
		console.log("Edit language");
		// Validate first
		if (
			this.checkStateForValidation({
				language: this.state.language,
				languageLevel: this.state.languageLevel,
			})
		) {
			console.log("Editing language");
			// Should add on to languages
			const data = Object.assign(
				{},
				{
					name: this.state.language,
					level: this.state.languageLevel,
				}
			);
			this.props.updateLanguage(data);
			this.openEdit();
		} else {
			// Set warning
			this.setState({ schema: { language: true } });
			TalentUtil.notification.show(
				"Please check and resolve the errors",
				"error",
				null,
				null
			);
		}
	}

	render() {
		return (
			// <div className="ui sixteen wide column">
			<Grid container columns="equal">
				{this.state.openAdd && (
					<React.Fragment>
						<Grid.Row>
							<Grid.Column>
								<Input
									name="language"
									type="text"
									fluid
									onChange={(e) => this.handleChange(e)}
									placeholder="Add language"
									value={
										this.state.language
											? this.state.language
											: ""
									}
									error={this.state.schema.language}
								/>
							</Grid.Column>
							<Grid.Column>
								<Select
									name="languageLevel"
									placeholder={"Language Level"}
									value={this.state.languageLevel}
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
										this.addLanguage();
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
									hidden={!this.state.schema.language}
								>
									Please enter both language and language
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
									Language
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
							{this.state.openEdit ? (
								<TableRow>
									<TableCell width={6}>
										<Input
											name="language"
											type="text"
											fluid
											onChange={(e) =>
												this.handleChange(e)
											}
											placeholder="Edit language"
											value={
												this.state.language
													? this.state.language
													: ""
											}
											error={this.state.schema.language}
										/>
									</TableCell>
									<TableCell width={6}>
										<Select
											name="languageLevel"
											placeholder={"Edit Language Level"}
											value={this.state.languageLevel}
											options={this.state.options}
											onChange={(e, { name, value }) => {
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
												this.editLanguage();
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
									<TableCell width={6}>Body Cell</TableCell>
									<TableCell width={6}>Body Cell</TableCell>
									<TableCell textAlign={"right"}>
										<Button
											basic
											icon="edit"
											size="mini"
											onClick={(e) => {
												e.preventDefault();
												this.openEdit(e);
											}}
										></Button>
										<Button
											basic
											icon="close"
											size="mini"
										></Button>
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</Grid.Row>
			</Grid>
			// </div>
		);
	}
}
